<script setup>

import Alert from "@/components/utils/Alert.vue";
import { ref, watch } from "vue";
import { useFoodDeliveryService } from "@/services/foodDeliveryService.js";
import { useNotifications } from "@/services/notificationService.js";
import SiloSelect from "@/components/SiloSelect.vue";
import FacilitySelect from "@/components/FacilitySelect.vue";
import BaseModal from "@/components/utils/BaseModal.vue";
import Card from "@/components/ui/Card.vue";
import FoodDeliveryOverviewCard from "@/components/events/FoodDeliveryOverviewCard.vue";
import router from "@/router/index.js";

const { notifyError, notifySuccess } = useNotifications()
const { getFoodDeliveryData, deleteFoodDeliveryData } = useFoodDeliveryService()

const selectedFacility = ref("")
const selectedSilo = ref("")
const currentPage = ref(0)

const deliveries = ref([])

// Deletion-Modal
const showDeletionModal = ref(false)
const deletionTarget = ref(null)

async function loadDeliveryData() {
  const facility = selectedFacility.value === "all" ? null : selectedFacility.value;
  const silo = selectedSilo.value === "all" ? null : selectedSilo.value;

  try {
    const result = await getFoodDeliveryData(facility, silo, currentPage.value)

    if (result.success) {
      deliveries.value = result.data
    } else {
      notifyError(result.message)
    }
  } catch (e) {
    console.error(e)
    notifyError("events.food_deliveries.loadError")
  }
}

// Deletion-Modal
function openDeletionModal(harvest) {
  deletionTarget.value = harvest;
  showDeletionModal.value = true;
}

function closeDeletionModal() {
  showDeletionModal.value = false;
  deletionTarget.value = null;
}

async function confirmDeletion() {
  if (!deletionTarget.value) return;

  const result = await deleteFoodDeliveryData(deletionTarget.value);

  if (result.success) {
    await loadDeliveryData()
    notifySuccess("events.food_deliveries.deletion_success");
    closeDeletionModal();
  } else {
    notifyError(result.message || "Fehler beim Löschen der Einstallung.");
  }
}

function onEdit(delivery) {
  router.push({ name: 'foodDeliveryDetails', id: delivery.ID })
}

watch(
  [selectedFacility, selectedSilo],
  () => {
    if (currentPage.value === 0) {
      loadDeliveryData()
    } else {
      currentPage.value = 0
    }
  }
)

watch(currentPage, () => {
  loadDeliveryData()
})
</script>

<template>
  <h1 class="title">
    {{ $t("events.food_deliveries.pagetitle") }}
  </h1>

  <RouterLink
    class="btn btn-primary"
    type="button"
    :to="{ name: 'foodDeliveryDetails' }"
  >
    {{ $t("events.food_deliveries.add") }}
  </RouterLink>

  <Alert
    type="info"
    class="my-4"
  >
    {{ $t("events.food_deliveries.info") }}
  </Alert>

  <div class="row">
    <FacilitySelect
      v-model="selectedFacility"
      label="general.facility"
      :show-all-option="true"
      class="col-6"
    />

    <SiloSelect
      v-model="selectedSilo"
      :show-all-option="true"
      class="col-6"
    />
  </div>

  <template v-if="deliveries.length > 0">
    <FoodDeliveryOverviewCard
      v-for="delivery in deliveries"
      :key="delivery.ID"
      :delivery="delivery"
      @edit="onEdit"
      @delete="openDeletionModal"
    />
  </template>
  <template v-else>
    <Card class="text-center">
      {{ $t("general.no_data") }}
    </Card>
  </template>

  <!-- DELETION MODAL -->
  <BaseModal
    v-model="showDeletionModal"
    :title="$t('events.food_deliveries.deletion_modal_title')"
  >
    <template #default>
      <p v-if="deletionTarget">
        {{
          $t("events.food_deliveries.deletion_modal_content", {
            date: formatReadable(deletionTarget.Datum),
            housing: deletionTarget.Silo,
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