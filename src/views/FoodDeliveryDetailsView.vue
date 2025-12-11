<script setup>

import Card from "@/components/ui/Card.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import ToggleButtonGroup from "@/components/utils/ToggleButtonGroup.vue";
import SiloSelect from "@/components/SiloSelect.vue";
import AutoSuggestInput from "@/components/utils/AutoSuggestInput.vue";
import { useDateService } from "@/services/dateService.js";
import { onMounted, ref, watch } from "vue";
import { FEEDING_PHASE_OPTIONS } from "@/constants/feedingPhaseOptions.js";
import { useCatalogService } from "@/services/catalogService.js";
import { useFoodDeliveryService } from "@/services/foodDeliveryService.js";
import router from "@/router/index.js";
import { useNotifications } from "@/services/notificationService.js";

const { today } = useDateService()
const { getCatalogData } = useCatalogService()
const { notifySuccess } = useNotifications()
const { getFoodDeliveryData, postFoodDeliveryData } = useFoodDeliveryService()

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})

const form = ref(createEmptyForm())
const supplierOptions = ref([])
const foodNameOptions = ref([])
const feedingPhaseOptions = FEEDING_PHASE_OPTIONS
const coccidiostatOptions = ref([])
const showCox = ref(false)

function createEmptyForm() {
  const thisDay = today()

  return {
    id: "",
    silo: "",
    date: thisDay,
    supllier:  "",
    foodName: "",
    feedingPhase: "",
    amountDelivered: "",
    coccidiostats: "",
  }
}


const apiV1Map = {
  id: "ID",
  silo: "Silo",
  date: "Datum",
  supplier: "Lieferant",
  foodName: "Produkt",
  feedingPhase: "Futterphase",
  amountDelivered: "Menge",
  coccidiostats: "Kokzidiostatika"
}

const apiV1ReverseMap = Object.fromEntries(
  Object.entries(apiV1Map).map(([front, back]) => [back, front])
)

function mapFormToApi(key) {
  return apiV1Map[key] || key;
}

function mapApiToForm(key) {
  return apiV1ReverseMap[key] || key;
}

async function loadCatalogData() {
  const suppliers = await getCatalogData('futterlieferanten')
  supplierOptions.value = suppliers.map(supplier => supplier.Name)
  foodNameOptions.value = await getCatalogData('futtermittel')
  const cox = await getCatalogData('kokzidiostatika')
  coccidiostatOptions.value = cox.map(cox => cox.Name)
}

async function loadFoodDeliveryData() {
  await loadCatalogData()
  if (!props.id) {
    form.value = createEmptyForm()
    return
  }
  const result = await getFoodDeliveryData(props.id)
  if (result.success) {
    Object.keys(result.data).forEach(key => {
      form.value[mapApiToForm(key)] = result.data[key]
    })
  }
}

async function submit() {
  let payload = {}
  Object.keys(form.value).forEach(key => {
    if (form.value[key] !== '') {
      payload[mapFormToApi(key)] = form.value[key]
    }
  })
  const result = await postFoodDeliveryData(payload)
  if (result.success) {
    notifySuccess('events.food_deliveries.details.success', 10000)
    router.push({ name: 'foodDeliveries' })
  }
}

onMounted( () => {
  loadFoodDeliveryData()
})

// Watch feedingPhase to conditionally show coccidiostats input
watch(
  () => form.value.feedingPhase,
  (phase) => {
    if (phase === 'Ende' || phase === 'Weizen' || phase === '') {
      form.value.coccidiostats = ''
      showCox.value = false
      // Load existing data for editing (not implemented here)
    } else {
      showCox.value = true
    }
  },
  { immediate: true }
)


</script>

<template>
  <h1 class="title">
    <button
      class="btn btn-outline-primary"
      @click="oncancel"
    >
      <i class="bi bi-arrow-left-square" /> (cancel)
    </button>
    {{ $t('events.food_deliveries.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <silo-select v-model="form.silo" />

      <BaseInput
        v-model="form.date"
        type="date"
        label="events.food_deliveries.details.date"
      />

      <AutoSuggestInput
        v-model="form.supllier"
        display-key="Name"
        :options="supplierOptions"
        label="events.food_deliveries.details.supplier"
      />

      <AutoSuggestInput
        v-model="form.foodName"
        label="events.food_deliveries.details.food_name"
        :options="foodNameOptions"
      />

      <ToggleButtonGroup
        v-model="form.feedingPhase"
        :options="feedingPhaseOptions"
      />

      <BaseInput
        v-model="form.amountDelivered"
        group-unit="general.kilograms_short"
        label="events.food_deliveries.details.amount_delivered"
      />

      <AutoSuggestInput
        v-show="showCox"
        v-model="form.coccidiostats"
        :options="coccidiostatOptions"
        label="events.food_deliveries.details.coccidiostats"
      />



      <button
        type="submit"
        class="btn btn-primary w-100"
      >
        {{ $t('general.submit') }}
      </button>
    </card>
  </form>
</template>