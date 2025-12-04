<script setup>

import Alert from "@/components/utils/Alert.vue";
import HouseSelect from "@/components/HouseSelect.vue";
import Pagination from "@/components/utils/Pagination.vue";
import Card from "@/components/ui/Card.vue";
import BaseModal from "@/components/utils/BaseModal.vue";
import HouseSelectionCheckboxes from "@/components/events/HouseSelectionCheckboxes.vue";

import {useSalmonellaService} from "@/services/salmonellaService";
import {useNotifications} from "@/services/notificationService";
import {ref, watch} from "vue";
import router from "@/router/index.js";
import {useDateService} from "@/services/dateService.js";
import SalmonellaProbeOverviewCard from "@/components/events/SalmonellaProbeOverviewCard.vue";

const { getSalmonellaData, duplicateSalmonellaData, deleteSalmonellaData } = useSalmonellaService();
const { notifySuccess, notifyError } = useNotifications();
const { formatReadable } = useDateService()

const selectedHouse = ref("")
const currentPage = ref(0)

const salmonellaProbes = ref([]);

// Duplicate-Modal
const showDuplicateModal = ref(false);
const duplicateTarget = ref(null); // Ausgewählte Medikation für Duplizierung
const duplicateHouses = ref([]); // Bezeichnung der ausgewählten Ziel-Ställe

// Deletion-Modal
const showDeletionModal = ref(false);
const deletionTarget = ref(null);

// Daten laden
async function loadSalmonellaData() {
  const house = selectedHouse.value !== "all" ? selectedHouse.value : null;

  try {
    const result = await getSalmonellaData(house, currentPage.value);

    if (result.success) {
      salmonellaProbes.value = result.data;
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
    [selectedHouse],
    () => {
      if (currentPage.value !== 0) {
        currentPage.value = 0;
      } else {
        loadSalmonellaData();
      }
    }
);

// Seitenwechsel → neu laden
watch(currentPage, () => {
  loadSalmonellaData();
});

// Duplicate-Modal
function openDuplicateModal(medication) {
  duplicateTarget.value = medication;
  duplicateHouses.value = [medication.Stall]; // Start: aktueller Stall vorausgewählt (optional)
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

  const targetHouses = [...duplicateHouses.value].filter(house => house !== duplicateTarget.value.Stall);

  if (targetHouses.length === 0) {
    // TODO: gute Lösung für Modal-Errors finden / onClose ModalErrors leeren
    // notifyError("Bitte mindestens einen Ziel-Stall auswählen.");
    closeDuplicateModal();
    return;
  }

  const result = await duplicateSalmonellaData(duplicateTarget.value, { targetHouses });

  if (result.success) {
    await loadSalmonellaData();
    notifySuccess("events.salmonellaProbes.duplication_success");
    closeDuplicateModal();
  } else {
    notifyError(result.message || "Fehler beim Duplizieren der Einstallung.");
  }
}

// Edit-Form
function openDetailsForm(salmonellaProbe) {
  router.push({ name: "salmonellaProbesDetails", params: { id: salmonellaProbe.ID } });
}


// Deletion-Modal
function openDeletionModal(salmonellaProbe) {
  deletionTarget.value = salmonellaProbe;
  showDeletionModal.value = true;
}

function closeDeletionModal() {
  showDeletionModal.value = false;
  deletionTarget.value = null;
}

async function confirmDeletion() {
  if (!deletionTarget.value) return;

  const result = await deleteSalmonellaData(deletionTarget.value);

  if (result.success) {
    await loadSalmonellaData()
    notifySuccess("events.housings.deletion_success");
    closeDeletionModal();
  } else {
    notifyError(result.message || "Fehler beim Löschen der Einstallung.");
  }
}

</script>

<template>
  <h1 class="title">
    {{ $t("events.salmonellaProbes.pagetitle") }}
  </h1>

  <RouterLink
      class="btn btn-primary"
      type="button"
      :to="{ name: 'salmonellaProbesDetails' }"
  >
    {{ $t("events.salmonellaProbes.add") }}
  </RouterLink>

  <Alert
      type="info"
      class="my-4"
  >
    {{ $t("events.salmonellaProbes.info") }}
  </Alert>

  <div class="row">
    <HouseSelect
        v-model="selectedHouse"
        :show-all-option="true"
    />
  </div>

  <template v-if="salmonellaProbes.length > 0">
    <SalmonellaProbeOverviewCard
        v-for="probe in salmonellaProbes"
        :key="probe.ID"
        :salmonella-probe="probe"
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
      :title="$t('events.salmonellaProbes.duplicate_modal_title')"
  >
    <template #default>
      <p v-if="duplicateTarget">
        {{
          $t("events.salmonellaProbes.duplicate_modal_description", {
            date: formatReadable(duplicateTarget.SockenprobeDatum),
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
      :title="$t('events.salmonellaProbes.deletion_modal_title')"
  >
    <template #default>
      <p v-if="deletionTarget">
        {{
          $t("events.salmonellaProbes.deletion_modal_content", {
            date: formatReadable(deletionTarget.SockenprobeDatum),
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