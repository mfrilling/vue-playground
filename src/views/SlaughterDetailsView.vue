<script setup>

import HouseSelect from "@/components/HouseSelect.vue";
import Card from "@/components/ui/Card.vue";
import { onMounted, ref } from "vue";
import router from "@/router/index.js";
import { useNotifications } from "@/services/notificationService.js";
import { useDateService } from "@/services/dateService.js";
import { useCatalogService } from "@/services/catalogService.js";
import { useSlaughterService } from "@/services/slaughterService.js";
import BaseInput from "@/components/utils/BaseInput.vue";
import BaseSelect from "@/components/utils/BaseSelect.vue";
import ToggleButtonGroup from "@/components/utils/ToggleButtonGroup.vue";
import { SLAUGHTER_SCOPE_TYPES } from "@/constants/slaughterScopeTypes.js";

const { notifySuccess } = useNotifications();
const { getSlaughterDetailsData, postSlaughterData } = useSlaughterService();
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
const slaughterHouses = ref([])
const scopeValues = SLAUGHTER_SCOPE_TYPES

function createEmptyForm() {
  const thisDay = today()

  return {
    id: "",
    housing: "",
    date: thisDay,
    slaughterHouse: "",
    scope: "",
    amountDelivered: "",
    featherDead: "",
    featherDeadWeight: "",
    discard: "",
    discardWeight: "",
    weightBrutto: "",
    weightNetto: "",
    fbd0: "",
    fbd1: "",
    fbd2a: "",
    fbd2b: "",
  };
}

const apiV1Map = {
  id: "ID",
  housing: "Stall",
  date: "Datum",
  slaughterHouse: "Schlachthof",
  scope: "Umfang",
  amountDelivered: "Tierzahl",
  featherDead: "FedertoteAnzahl",
  featherDeadWeight: "FedertoteGewicht",
  discard: "VerwurfAnzahl",
  discardWeight: "VerwurfGewicht",
  weightBrutto: "GewichtBrutto",
  weightNetto: "GewichtNetto",
  fbd0: "FBD0",
  fbd1: "FBD1",
  fbd2a: "FBD2a",
  fbd2b: "FBD2b",
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

function oncancel() {
  router.push({ name: 'slaughters' })
}

async function submit() {
  // foobar
  let payload = {};
  Object.keys(form.value).forEach(key => {
    if (form.value[key] !== '') {
      payload[mapFormToApi(key)] = form.value[key];
    }
  })
  const result = await postSlaughterData(payload)
  if (result.success) {
    notifySuccess('events.slaughter.details.success', 10000)
    router.push({ name: 'slaughters' })
  }
}

async function loadSlaughterHouses() {
  const result = await getCatalogData('schlachthoefe')
  slaughterHouses.value = result.map(house => house.Name)
}

async function loadSlaughterData() {
  await loadSlaughterHouses()
  if (!props.id) {
    form.value = createEmptyForm();
    return
  }
  const result = await getSlaughterDetailsData(props.id)
  if (result.success) {
    Object.keys(result.data).forEach(key => {
      form.value[mapApiToForm(key)] = result.data[key];
    })
  }

}

onMounted(() => {
  loadSlaughterData()
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
    {{ $t('events.slaughter.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <house-select v-model="form.housing" />

      <BaseInput
        v-model="form.date"
        type="date"
        label="events.slaughter.details.date"
      />

      <BaseSelect
        v-model="form.slaughterHouse"
        :options="slaughterHouses"
        label="events.slaughter.details.slaughterHouse"
      />

      <ToggleButtonGroup
        v-model="form.scope"
        :options="scopeValues"
        label="events.slaughter.details.scope"
      />

      <BaseInput
        v-model="form.amountDelivered"
        label="events.slaughter.details.amountDelivered"
        group-unit="general.pieces"
      />

      <div class="row mb-3">
        <BaseInput
          v-model="form.featherDead"
          label="events.slaughter.details.featherDead"
          group-unit="general.pieces_short"
          class="col-6"
        />

        <BaseInput
          v-model="form.featherDeadWeight"
          label="events.slaughter.details.featherDeadWeight"
          group-unit="general.kilograms_short"
          class="col-6"
        />
      </div>

      <div class="row mb-3">
        <BaseInput
          v-model="form.discard"
          label="events.slaughter.details.discard"
          group-unit="general.pieces_short"
          class="col-6"
        />

        <BaseInput
          v-model="form.discardWeight"
          label="events.slaughter.details.discardWeight"
          group-unit="general.kilograms_short"
          class="col-6"
        />
      </div>

      <div class="row mb-3">
        <BaseInput
          v-model="form.weightBrutto"
          label="events.slaughter.details.weightBrutto"
          group-unit="general.kilograms_short"
          class="col-6"
        />

        <BaseInput
          v-model="form.weightNetto"
          label="events.slaughter.details.weightNetto"
          group-unit="general.kilograms_short"
          class="col-6"
        />
      </div>

      <div class="row mb-3">
        <span>{{ $t('events.slaughter.details.fbd_label') }}</span>
        <BaseInput
          v-model="form.fbd0"
          label="events.slaughter.details.fbd0"
          group-unit="general.percent"
          class="col-3"
        />

        <BaseInput
          v-model="form.fbd1"
          label="events.slaughter.details.fbd1"
          group-unit="general.percent"
          class="col-3"
        />

        <BaseInput
          v-model="form.fbd2a"
          label="events.slaughter.details.fbd2a"
          group-unit="general.percent"
          class="col-3"
        />

        <BaseInput
          v-model="form.fbd2b"
          label="events.slaughter.details.fbd2b"
          group-unit="general.percent"
          class="col-3"
        />
      </div>


      <button
        type="submit"
        class="btn btn-primary w-100"
      >
        {{ $t('general.submit') }}
      </button>
    </card>
  </form>
</template>