<script setup>

import Card from "@/components/ui/Card.vue";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import router from "@/router/index.js";
import {ref} from "vue";
import {useDateService} from "@/services/dateService.js";
import ToggleButtonGroup from "@/components/utils/ToggleButtonGroup.vue";

const props = defineProps({
  id: {
    type: String,
    required: false,
  }
})

const {today} = useDateService();

const form = ref(createEmptyForm())

function createEmptyForm() {
  // const threeDaysAgo = subtractDays(new Date(Date.now()), 3)
  const thisDay = today()
  // const selectedHouse = ref(props.house || '')

  return {
    type: "",
    beleg: "",
    date: thisDay,
    duration: "",
    diagnosis: "",
    unit: "",
    manufacturer: "",
    id: props.id || '',
    amount: "",
    person: "",
    product: "",
    housing: "",
    waitingTime: "",
    permit: "",
  };
}

const apiV1Map = {
  type: "Art",
  beleg: "Beleg",
  date: "Datum",
  duration: "Dauer",
  diagnosis: "Diagnose",
  unit: "Einheit",
  manufacturer: "Hersteller",
  id: "ID",
  amount: "Menge",
  person: "Person",
  product: "Produkt",
  housing: "Stall",
  waitingTime: "Wartezeit",
  permit: "Zulassung",
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
  router.push({name: 'medications'})
}

function submit() {
  // foobar
}
</script>

<template>
  <h1 class="title">
    <button
      class="btn btn-outline-primary"
      @click="oncancel"
    >
      <i class="bi bi-arrow-left-square" /> (cancel)
    </button>
    {{ $t('events.medications.details.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <house-select v-model="form.housing" />
      <base-input
        v-model="form.date"
        label="events.medications.date"
        type="date"
      />

      <ToggleButtonGroup
        v-model="form.type"
        label="events.medications.details.type"
        options=""
      />
    </card>
  </form>
</template>

<style scoped>

</style>