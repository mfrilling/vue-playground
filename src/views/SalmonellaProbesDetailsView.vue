<script setup>

import HouseSelect from "@/components/HouseSelect.vue";
import Card from "@/components/ui/Card.vue";
import {onMounted, ref} from "vue";
import router from "@/router/index.js";
import {useNotifications} from "@/services/notificationService.js";
import {useSalmonellaService} from "@/services/salmonellaService.js";
import {useDateService} from "@/services/dateService.js";
import {useCatalogService} from "@/services/catalogService.js";
import AutoSuggestInput from "@/components/utils/AutoSuggestInput.vue";
import ToggleButtonGroup from "@/components/utils/ToggleButtonGroup.vue";
import BaseInput from "@/components/utils/BaseInput.vue";

const {notifySuccess} = useNotifications();
const {getSalmonellaDetailsData, postSalmonellaData} = useSalmonellaService();
const {today} = useDateService();
const {getCatalogData} = useCatalogService();

const props = defineProps({
  id: {
    type: String,
    required: false,
  }
})

const form = ref(createEmptyForm())
const personSuggestions = ref([])

const resultValues = [{value: 'positiv', label: 'general.positive'}, {value: 'negativ', label: 'general.negative'}]

function createEmptyForm() {
  // const threeDaysAgo = subtractDays(new Date(Date.now()), 3)
  const thisDay = today()
  // const selectedHouse = ref(props.house || '')

  return {
    id: props.id || '',
    housing: "",
    chickPaperPropeTaker: "",
    chickPaperProbeResult: "",
    sockProbeTaker: "",
    sockProbeDate: thisDay,
    sockProbeResult: "",
  };
}

const apiV1Map = {
  id: "ID",
  housing: "Stall",
  chickPaperPropeTaker: "KuekenpapierProbennehmer",
  chickPaperProbeResult: "KuekenpapierErgebnis",
  sockProbeTaker: "SockenprobeProbennehmer",
  sockProbeResult: "SockenprobeErgebnis",
  sockProbeDate: "SockenprobeDatum",
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
  const result = await postSalmonellaData(payload)
  if (result.success) {
    notifySuccess('events.salmonellaProbes.details.success', 10000)
    router.push({name: 'salmonellaProbes'})
  }
}

async function loadPersonSuggestions() {
  const result = await getCatalogData('personen')
  personSuggestions.value = result
}

async function loadProbeData() {
  await loadPersonSuggestions()
  if (!props.id) {
    form.value = createEmptyForm();
    return
  }
  const result = await getSalmonellaDetailsData(props.id)
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
    {{ $t('events.salmonellaProbes.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <house-select v-model="form.housing" />

      <h5 class="mt-4">
        {{ $t('events.salmonellaProbes.chickPaperProbe.title') }}
      </h5>
      <AutoSuggestInput
        v-model="form.chickPaperPropeTaker"
        :options="personSuggestions"
        label="events.salmonellaProbes.chickPaperProbe.taker"
      />

      <ToggleButtonGroup
        v-model="form.chickPaperProbeResult"
        label="events.salmonellaProbes.chickPaperProbe.result"
        :options="resultValues"
      />

      <h5 class="mt-4">
        {{ $t('events.salmonellaProbes.sockProbe.title') }}
      </h5>
      <AutoSuggestInput
        v-model="form.sockProbeTaker"
        :options="personSuggestions"
        label="events.salmonellaProbes.chickPaperProbe.taker"
      />
      <BaseInput
        v-model="form.sockProbeDate"
        label="events.salmonellaProbes.sockProbe.date"
        type="date"
      />

      <ToggleButtonGroup
        v-model="form.sockProbeResult"
        label="events.salmonellaProbes.sockProbe.result"
        :options="resultValues"
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