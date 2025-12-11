<script setup>
import HouseSelect from "@/components/HouseSelect.vue";
import Card from "@/components/ui/Card.vue";
import { onMounted, ref } from "vue";
import router from "@/router/index.js";
import { useNotifications } from "@/services/notificationService.js";
import { useHarvestService } from "@/services/harvestService.js";
import { useDateService } from "@/services/dateService.js";
import { useCatalogService } from "@/services/catalogService.js";
import AutoSuggestInput from "@/components/utils/AutoSuggestInput.vue";
import BaseInput from "@/components/utils/BaseInput.vue";

const { notifySuccess } = useNotifications();
const { getHarvestDetailsData, postHarvestData } = useHarvestService();
const { today } = useDateService();
const { getCatalogData } = useCatalogService();

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  }
})

const form = ref(createEmptyForm())
const butcherOptions = ref([])

function createEmptyForm() {
  const thisDay = today()

  return {
    id: props.id || '',
    housing: "",
    date: thisDay,
    butcher: "",
    animalCount: "",
    foodStopDate: "",
  };
}

const apiV1Map = {
  id: "ID",
  housing: "Stall",
  date: "Datum",
  butcher: "Schlachthof",
  animalCount: "Tierzahl",
  foodStopDate: "FuttersystemLeer",
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

async function submit() {
  // foobar
  let payload = {};
  Object.keys(form.value).forEach(key => {
    if (form.value[key] !== '') {
      payload[mapFormToApi(key)] = form.value[key];
    }
  })
  const result = await postHarvestData(payload)
  if (result.success) {
    notifySuccess('events.harvests65.details.success', 10000)
    router.push({ name: 'harvests' })
  }
}

async function loadButcherSuggestions() {
  butcherOptions.value = await getCatalogData('schlachthoefe')
}

async function loadProbeData() {
  await loadButcherSuggestions()
  if (!props.id) {
    form.value = createEmptyForm();
    return
  }
  const result = await getHarvestDetailsData(props.id)
  if (result.success) {
    Object.keys(result.data).forEach(key => {
      form.value[mapApiToForm(key)] = result.data[key];
    })
  }

}

onMounted(() => {
  loadProbeData()
})
</script>

<template>
  <h1 class="title">
    <button
      class="btn btn-outline-primary"
      @click="oncancel"
    >
      <i class="bi bi-arrow-left-square" /> (cancel)
    </button>
    {{ $t('events.harvests.details.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <house-select v-model="form.housing" />
      <BaseInput
        v-model="form.date"
        label="events.harvests.details.date"
        type="date"
      />

      <AutoSuggestInput
        v-model="form.butcher"
        :options="butcherOptions"
        display-key="Name"
        label="events.harvests.details.butcher"
      />

      <BaseInput
        v-model="form.animalCount"
        label="events.harvests.details.animal_count"
        :group-unit="$t('general.pieces')"
      />

      <BaseInput
        v-model="form.foodStopDate"
        label="events.harvests.details.foodStopDate"
        type="datetime-local"
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