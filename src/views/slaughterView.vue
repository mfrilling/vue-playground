<script setup>

import Alert from "@/components/utils/Alert.vue";
import HouseSelect from "@/components/HouseSelect.vue";
import Pagination from "@/components/utils/Pagination.vue";
import Card from "@/components/ui/Card.vue";
import BaseModal from "@/components/utils/BaseModal.vue";

import { useSlaughterService } from "@/services/slaughterService";
import { useNotifications } from "@/services/notificationService";
import { ref, watch } from "vue";
import router from "@/router/index.js";
import { useDateService } from "@/services/dateService.js";
import SlaughterOverviewCard from "@/components/events/SlaughterOverviewCard.vue";
import HousingSelect from "@/components/events/HousingSelect.vue";
import SlaughterTypeSelect from "@/components/events/SlaughterTypeSelect.vue";
import PdfUploadButton from "@/components/utils/PdfUploadButton.vue";

const { getSlaughterData, uploadSlaughterData, deleteSlaughterData } = useSlaughterService();
const { notifySuccess, notifyError } = useNotifications();
const { formatReadable } = useDateService()

const selectedHouse = ref("")
const selectedHousing = ref("")
const selectedScope = ref("")
const currentPage = ref(0)

const slaughters = ref([]);

// Deletion-Modal
const showDeletionModal = ref(false);
const deletionTarget = ref(null);

// Daten laden
async function loadSlaughterData() {
  const house = selectedHouse.value !== "all" ? selectedHouse.value : null;
  const housing = selectedHousing.value !== "all" ? selectedHousing.value : null;
  const scope = selectedScope.value !== "all" ? selectedScope.value : null;

  try {
    const result = await getSlaughterData(house, housing, scope, currentPage.value);

    if (result && result.success) {
      slaughters.value = result.data;
    } else if (result && !result.success) {
      notifyError(result.message);
    }
  } catch (e) {
    console.error(e);
    notifyError("Fehler beim Laden der Einstallungsdaten.");
  }
}

// Filteränderungen → Seite auf 0 + neu laden
watch(
    [selectedHouse, selectedHousing, selectedScope],
    () => {
      if (currentPage.value !== 0) {
        currentPage.value = 0;
      } else {
        loadSlaughterData();
      }
    }
);

// Seitenwechsel → neu laden
watch(currentPage, () => {
  loadSlaughterData();
});


// Edit-Form
function openDetailsForm(slaughter) {
  router.push({ name: "slaughterDetails", params: { id: slaughter.ID } });
}


// Deletion-Modal
function openDeletionModal(slaughter) {
  deletionTarget.value = slaughter;
  showDeletionModal.value = true;
}

function closeDeletionModal() {
  showDeletionModal.value = false;
  deletionTarget.value = null;
}

async function confirmDeletion() {
  if (!deletionTarget.value) return;

  const result = await deleteSlaughterData(deletionTarget.value);

  if (result.success) {
    await loadSlaughterData()
    notifySuccess("events.slaughter.deletion_success");
    closeDeletionModal();
  } else {
    notifyError(result.message || "Fehler beim Löschen der Einstallung.");
  }
}

async function uploadFile(file) {
  const response = await uploadSlaughterData(file);
  if (response.success) {
    let data = response.data;
    if (data.ID) {
      router.push({ name: 'slaughterDetails', params: { id: data.ID } })
    } else {
      loadSlaughterData()
    }
  } else {
    notifyError(response.message);
  }
}

</script>

<template>
  <h1 class="title">
    {{ $t("events.slaughter.pagetitle") }}
  </h1>

  <RouterLink
    class="btn btn-primary"
    type="button"
    :to="{ name: 'slaughterDetails' }"
  >
    {{ $t("events.slaughter.add") }}
  </RouterLink>
  
  <PdfUploadButton @file-selected="uploadFile">
    ☁️ {{ $t('events.slaughter.upload_pdf') }}
  </PdfUploadButton>

  <Alert
    type="info"
    class="my-4"
  >
    {{ $t("events.slaughter.info") }}
  </Alert>

  <div class="row">
    <!-- TODO: Filter anpassen (Einstallung, Umfang) -->
    <HouseSelect
      v-model="selectedHouse"
      :show-all-option="true"
      class="col-4"
    />

    <HousingSelect
      v-model="selectedHousing"
      :selected-house="selectedHouse"
      class="col-4"
    />

    <SlaughterTypeSelect
      v-model="selectedScope"
      class="col-4"
    />
  </div>

  <template v-if="slaughters.length > 0">
    <SlaughterOverviewCard
      v-for="slaughter in slaughters"
      :key="slaughter.ID"
      :slaughter="slaughter"
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

  <!-- DELETION MODAL -->
  <BaseModal
    v-model="showDeletionModal"
    :title="$t('events.slaughter.deletion_modal_title')"
  >
    <template #default>
      <p v-if="deletionTarget">
        {{
          $t("events.slaughter.deletion_modal_content", {
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