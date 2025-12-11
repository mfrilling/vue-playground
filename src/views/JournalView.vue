<script setup>

import Alert from "@/components/utils/Alert.vue";
import { reactive, ref, watch } from "vue";
import { useJournalService } from "@/services/journalService.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseDateStepper from "@/components/utils/BaseDateStepper.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import FeedingPhaseToggle from "@/components/FeedingPhaseToggle.vue";
import MixFoodPercentageCalc from "@/components/journal/MixFoodPercentageCalc.vue";
import LossForm from "@/components/journal/LossForm.vue";
import BaseTextarea from "@/components/utils/BaseTextarea.vue";
import BadgeCheckbox from "@/components/utils/BadgeCheckbox.vue";
import Card from "@/components/ui/Card.vue";


const { getJournalData, putJournalData } = useJournalService()

const selectedHouse = ref(localStorage.getItem('selectedHouse') || '')
const selectedDate = ref(localStorage.getItem('selectedDate') || '')
const journalData = ref(null)

const apiV1Map = {
  animalWeight: "Tiergewicht",
  water: "Wasser",
  mixfood: "Mischfutter",
  wheat: "Getreide",
  tempMin: "TemperaturMin",
  tempMax: "TemperaturMax",
  humidityMin: "FeuchtigkeitMin",
  humidityMax: "FeuchtigkeitMax",
  VerlusteMorgensKleine: "VerlusteMorgensKleine",
  VerlusteMorgensSelektierte: "VerlusteMorgensSelektierte",
  VerlusteMorgensTote: "VerlusteMorgensTote",
  VerlusteAbendsKleine: "VerlusteAbendsKleine",
  VerlusteAbendsSelektierte: "VerlusteAbendsSelektierte",
  VerlusteAbendsTote: "VerlusteAbendsTote",
  notes: "Bemerkungen",
  alarm: "Alarm",
  emergencyPower: "Notstrom",
  technology: "Stalltechnik"
}

// TODO: mapper schreiben

const form = reactive({
  animalWeight: '',
  water: '',
  mixfood: '',
  wheat: '',
  feedingPhases: [],
  VerlusteMorgensKleine: '',
  VerlusteMorgensSelektierte: '',
  VerlusteMorgensTote: '',
  VerlusteAbendsKleine: '',
  VerlusteAbendsSelektierte: '',
  VerlusteAbendsTote: '',
  tempMin: '',
  tempMax: '',
  humidityMin: '',
  humidityMax: '',
  notes: '',
  alarm: '',
  emergencyPower: '',
  technology: ''
})

watch([selectedHouse, selectedDate],
    async ([newHouse, newDate]) => {
      if (!newHouse || !newDate) {
        journalData.value = null
        return
      }
      localStorage.setItem('selectedHouse', newHouse)
      localStorage.setItem('selectedDate', newDate)

      try {
        const data = await getJournalData(newHouse, newDate)
        mapDataToForm(data.data)
      } catch (error) {
        console.error('Fehler beim Laden der Journal-Daten:', error)
        journalData.value = null
      }
    }, { immediate: true })

watch(
    journalData,
    (data) => {
      mapDataToForm(data)
    },
    { immediate: true }
)

function mapDataToForm(data) {
  if (!data) {
    form.animalWeight = ''
    form.water = ''
    form.mixfood = ''
    form.wheat = ''
    form.feedingPhases = []
    form.VerlusteMorgensKleine = ''
    form.VerlusteMorgensSelektierte = ''
    form.VerlusteMorgensTote = ''
    form.VerlusteAbendsKleine = ''
    form.VerlusteAbendsSelektierte = ''
    form.VerlusteAbendsTote = ''
    form.tempMin = ''
    form.tempMax = ''
    form.humidityMin = ''
    form.humidityMax = ''
    form.notes = ''
    form.alarm = ''
    return
  }

  form.animalWeight = data.Tiergewicht ?? ''
  form.water = data.Wasser ?? ''
  form.mixfood = data.Mischfutter ?? ''
  form.wheat = data.Getreide ?? ''
  form.feedingPhases = [
    data.FutterphaseStart && 'FutterphaseStart',
    data.Futterphase1 && 'Futterphase1',
    data.Futterphase2 && 'Futterphase2',
    data.Futterphase3 && 'Futterphase3',
    data.FutterphaseEnde && 'FutterphaseEnde',
  ].filter(Boolean)
  form.tempMin = data.TemperaturMin
  form.tempMax = data.TemperaturMax
  form.humidityMin = data.FeuchtigkeitMin
  form.humidityMax = data.FeuchtigkeitMax
  form.VerlusteMorgensKleine = data.VerlusteMorgensKleine ?? ''
  form.VerlusteMorgensSelektierte = data.VerlusteMorgensSelektierte ?? ''
  form.VerlusteMorgensTote = data.VerlusteMorgensTote ?? ''
  form.VerlusteAbendsKleine = data.VerlusteAbendsKleine ?? ''
  form.VerlusteAbendsSelektierte = data.VerlusteAbendsSelektierte ?? ''
  form.VerlusteAbendsTote = data.VerlusteAbendsTote ?? ''
  form.notes = data.Bemerkungen ?? ''
  form.alarm = data.Alarm ?? ''
  form.technology = data.Stalltechnik ?? ''
  form.emergencyPower = data.Notstrom ?? ''
}

function mapToV1Api(key) {
  return apiV1Map[key] || key;
}

function submit() {
  let payload = {};
  Object.keys(form).forEach(key => {
    if (key === 'feedingPhases') {
      form[key].forEach(phase => payload[phase] = 1);
      return;
    }
    if (form[key] !== '') {
      payload[mapToV1Api(key)] = form[key];
    }
  })
  putJournalData(selectedHouse.value, selectedDate.value, payload)
}
</script>

<template>
  <form
    class=""
    @submit.prevent="submit"
  >
    <Card classes="mb-4">
      <Alert type="info">
        {{ $t('journal.info') }}
      </Alert>
      <HouseSelect
        v-model="selectedHouse"
        :save-value="true"
      />
      <BaseDateStepper
        id="txtDatumTB"
        v-model="selectedDate"
      />
    </Card>

    <Card>
      <BaseInput
        v-model="form.animalWeight"
        type="number"
        label="journal.form.animal_weight"
        label-end="general.yesterday"
        group-unit="g"
      />

      <!-- Wasser -->
      <BaseInput
        v-model="form.water"
        type="number"
        label="journal.form.water"
        label-end="general.yesterday"
        group-unit="l"
      />
    </Card>

    <Card classes="mb-4">
      <MixFoodPercentageCalc :form="form" />

      <alert type="info">
        {{ $t('journal.form.phase_question') }}
      </alert>

      <FeedingPhaseToggle
        v-model="form.feedingPhases"
        label="journal.form.feeding_phase"
      />
    </Card>

    <Card classes="mb-4">
      <div class="row">
        <BaseInput
          v-model="form.tempMin"
          type="text"
          label="journal.form.temperature"
          group-unit="°C"
          form-group-classes="col-6"
          placeholder="journal.form.temperature_min"
        />
        <BaseInput
          v-model="form.tempMax"
          type="text"
          group-unit="°C"
          label="&nbsp;"
          label-end="Gestern"
          form-group-classes="col-6"
          placeholder="journal.form.temperature_max"
        />
      </div>

      <div class="row">
        <BaseInput
          v-model="form.humidityMin"
          type="text"
          label="journal.form.humidity"
          group-unit="%"
          form-group-classes="col-6"
          placeholder="journal.form.humidity_min"
        />
        <BaseInput
          v-model="form.humidityMax"
          type="text"
          group-unit="°C"
          form-group-classes="col-6"
          label="&nbsp;"
          label-end="Gestern"
          placeholder="journal.form.humidity_max"
        />
      </div>
    </Card>


    <Card classes="mb-4">
      <LossForm v-model:form="form" />
    </Card>

    <Card classes="mb-4">
      <BaseTextarea
        v-model="form.notes"
        label="journal.form.notes"
        label-end="general.today"
      />
    </Card>

    <Card classes="mb-4">
      <span class="form-label pb-0 ps-0 d-flex justify-content-between">
        <span>{{ $t('journal.form.technology_checklist') }}</span>
        <span class="text-muted text-end">{{ $t('general.today') }}</span>
      </span>
      <BadgeCheckbox
        v-model="form.alarm"
        label="journal.form.alarm"
      />
      <BadgeCheckbox
        v-model="form.technology"
        label="journal.form.stalltechnik"
      />
      <BadgeCheckbox
        v-model="form.emergencyPower"
        label="journal.form.notstrom"
      />
    </Card>



    <button
      class="btn btn-primary col-12"
      type="submit"
    >
      {{ $t('general.submit') }}
    </button>
  </form>
</template>
