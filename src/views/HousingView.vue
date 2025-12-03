<script setup>
import {ref, watch} from "vue";

import Alert from "@/components/utils/Alert.vue";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import HousingOverviewCard from "@/components/events/HousingOverviewCard.vue";
import Pagination from "@/components/utils/Pagination.vue";
import Card from "@/components/ui/Card.vue";
import BaseModal from "@/components/utils/BaseModal.vue";
import HouseSelectionCheckboxes from "@/components/events/HouseSelectionCheckboxes.vue";

import {useHousingService} from "@/services/housingService";
import {useNotifications} from "@/services/notificationService";
import {useDateService} from "@/services/dateService.js";
import router from "@/router/index.js";

const { getHousingData, duplicateHousingData, deleteHousingData } = useHousingService();
const { notifySuccess, notifyError } = useNotifications();
const { formatReadable } = useDateService();

// Filter / Pagination
const selectedHouse = ref("");
const flockNumber = ref("");
const currentPage = ref(0);

// Daten
const housings = ref([]);

// Duplicate-Modal
const showDuplicateModal = ref(false);
const duplicateTarget = ref(null); // Ausgewählte Einstallung für Duplizierung
const duplicateHouses = ref([]); // Bezeichnung der ausgewählten Ziel-Ställe

// Deletion-Modal
const showDeletionModal = ref(false);
const deletionTarget = ref(null);

// Daten laden
async function loadHousingData() {
  const house = selectedHouse.value !== "all" ? selectedHouse.value : null;

  try {
    const result = await getHousingData(house, currentPage.value, flockNumber.value);

    if (result.success) {
      housings.value = result.data;
    } else {
      notifyError(result.message);
    }
  } catch (e) {
    console.error(e);
    notifyError("Fehler beim Laden der Einstallungsdaten.");
  }
}

// Filteränderungen → Seite auf 0 + neu laden
watch(
    [selectedHouse, flockNumber],
    () => {
      currentPage.value = 0;
      loadHousingData();
    },
    { immediate: true }
);

// Seitenwechsel → neu laden
watch(currentPage, () => {
  loadHousingData();
});

// Duplicate-Modal
function openDuplicateModal(housing) {
  duplicateTarget.value = housing;
  duplicateHouses.value = [housing.Stall]; // Start: aktueller Stall vorausgewählt (optional)
  showDuplicateModal.value = true;
}

function closeDuplicateModal() {
  showDuplicateModal.value = false;
  duplicateTarget.value = null;
  duplicateHouses.value = [];
}

function onDuplicateSelect(houseName, checked) {
  if (checked) {
    if (!duplicateHouses.value.includes(houseName)) {
      duplicateHouses.value.push(houseName);
    }
  } else {
    duplicateHouses.value = duplicateHouses.value.filter(
        (name) => name !== houseName
    );
  }
}

async function confirmDuplication() {
  if (!duplicateTarget.value) return;

  const targetHouses = [...duplicateHouses.value].filter(house => house !== duplicateTarget.value.Stall)

  if (targetHouses.length === 0) {
    // TODO: gute Lösung für Modal-Errors finden / onClose ModalErrors leeren
    // notifyError("Bitte mindestens einen Ziel-Stall auswählen.");
    return;
  }

  const result = await duplicateHousingData(duplicateTarget.value, { targetHouses });

  if (result.success) {
    await loadHousingData();
    notifySuccess("events.housings.duplication_success");
    closeDuplicateModal();
  } else {
    notifyError(result.message || "Fehler beim Duplizieren der Einstallung.");
  }
}

// Edit-Form
function openDetailsForm(housing) {
  router.push({ name: "housingDetails", params: { house: housing.Stall, date: housing.Datum } });
}

// Deletion-Modal
function openDeletionModal(housing) {
  deletionTarget.value = housing;
  showDeletionModal.value = true;
}

function closeDeletionModal() {
  showDeletionModal.value = false;
  deletionTarget.value = null;
}

async function confirmDeletion() {
  if (!deletionTarget.value) return;

  const result = await deleteHousingData(deletionTarget.value);

  if (result.success) {
    await loadHousingData()
    notifySuccess("events.housings.deletion_success");
    closeDeletionModal();
  } else {
    notifyError(result.message || "Fehler beim Löschen der Einstallung.");
  }
}
</script>

<template>
  <h1 class="title">
    {{ $t("events.housings.pagetitle") }}
  </h1>

  <RouterLink
    class="btn btn-primary"
    type="button"
    :to="{ name: 'housingDetails' }"
  >
    {{ $t("events.housings.add") }}
  </RouterLink>

  <Alert
    type="info"
    class="my-4"
  >
    {{ $t("events.housings.info") }}
  </Alert>

  <div class="row">
    <HouseSelect
      v-model="selectedHouse"
      class="col-6"
      :show-all-option="true"
    />
    <BaseInput
      v-model="flockNumber"
      label="events.housings.herd"
      class="col-6"
    />
  </div>

  <template v-if="housings.length > 0">
    <HousingOverviewCard
      v-for="housing in housings"
      :key="housing.ID"
      :housing="housing"
      @duplicate="openDuplicateModal"
      @edit="openDetailsForm"
      @delete="openDeletionModal"
    />
  </template>
  <template v-else>
    <Card class="text-center">
      {{ $t("general.no_data") }}
    </Card>
  </template>

  <Pagination
    v-model:current-page="currentPage"
    :last-page="15"
    :items-per-page="15"
  />

  <!-- DUPLICATE MODAL -->
  <BaseModal
    v-model="showDuplicateModal"
    :title="$t('events.housings.duplicate_modal_title')"
  >
    <template #default>
      <p v-if="duplicateTarget">
        {{
          $t("events.housings.duplicate_modal_description", {
            date: formatReadable(duplicateTarget.Datum),
            housing: duplicateTarget.Stall,
          })
        }}
      </p>

      <HouseSelectionCheckboxes
        v-if="duplicateTarget"
        :duplication-target-name="duplicateTarget.Stall"
        @house-selected="(val) => onDuplicateSelect(val, true)"
        @house-deselected="(val) => onDuplicateSelect(val, false)"
      />
    </template>

    <template #footer>
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="closeDuplicateModal"
      >
        {{ $t("general.cancel") }}
      </button>
      <button
        class="btn btn-primary"
        type="button"
        @click="confirmDuplication"
      >
        {{ $t("general.submit") }}
      </button>
    </template>
  </BaseModal>

  <!-- DELETION MODAL -->
  <BaseModal
    v-model="showDeletionModal"
    :title="$t('events.housings.deletion_modal_title')"
  >
    <template #default>
      <p v-if="deletionTarget">
        {{
          $t("events.housings.deletion_modal_content", {
            date: formatReadable(deletionTarget.Datum),
            housing: deletionTarget.Stall,
          })
        }}
      </p>
    </template>

    <template #footer>
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="closeDeletionModal"
      >
        {{ $t("general.cancel") }}
      </button>
      <button
        class="btn btn-danger"
        type="button"
        @click="confirmDeletion"
      >
        {{ $t("general.delete") }}
      </button>
    </template>
  </BaseModal>
</template>
