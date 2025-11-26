<script setup>

import Alert from "@/components/utils/Alert.vue";
import {useUserConfig} from "@/services/userConfigService.js";
import {reactive, ref, watch} from "vue";
import {useJournalService} from "@/services/journalService.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseDateStepper from "@/components/utils/BaseDateStepper.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import FeedingPhaseToggle from "@/components/FeedingPhaseToggle.vue";


const {getJournalData} = useJournalService()
const { userConfig, isUserConfigLoading, userConfigError } = useUserConfig()

const selectedHouse = ref('')
const selectedDate = ref('')
const journalData = ref(null)

const form = reactive({
  tiergewicht: '',
  wasser: '',
  eingabeInProzent: false,
  mischfutter: '',
  weizen: '',
  feedingPhases: []
})

watch([selectedHouse, selectedDate],
async ([newHouse, newDate]) => {
  if (!newHouse || !newDate) {
    journalData.value = null
    return
  }
  try {
    const data = await getJournalData(newHouse, newDate)
    journalData.value = data
  } catch (error) {
    console.error('Fehler beim Laden der Journal-Daten:', error)
    journalData.value = null
  }
},{ immediate: true })

watch(
    journalData,
    (data) => {
      if (!data) {
        form.tiergewicht = ''
        form.wasser = ''
        form.eingabeInProzent = false
        form.mischfutter = ''
        form.weizen = ''
        form.feedingPhases = []
        return
      }

      form.tiergewicht = data.Tiergewicht
      form.wasser = data.Wasser
      form.mischfutter = data.Mischfutter
      form.weizen = data.Weizen
      form.feedingPhases = [
          data.FutterphaseStart && 'FutterphaseStart',
          data.Futterphase1 && 'Futterphase1',
          data.Futterphase2 && 'Futterphase2',
          data.Futterphase3 && 'Futterphase3',
          data.FutterphaseEnde && 'FutterphaseEnde',
      ].filter(Boolean)
    },
    { immediate: true }
)

function calculatePercentage() {
  return (parseInt(form.weizen) / (parseInt(form.mischfutter) + parseInt(form.weizen))) * 100
}

watch(() => form.eingabeInProzent, (newVal) => {
  // hier umrechnung
  console.log('### eingabeInProzent',
      newVal,
      form.mischfutter,
      form.weizen,
      'gesamt: ',
      parseInt(form.mischfutter) + parseInt(form.weizen),
      'in %: ',
      calculatePercentage()
  )
}, { immediate: true })

function submit() {
  console.log('### foobar', {house: selectedHouse.value, date: selectedDate.value, ...form})
}
</script>

<template>
  <Alert type="info">{{$t('journal.info')}}</Alert>

  <form @submit.prevent="submit" class="">
    <HouseSelect v-model="selectedHouse"/>
    <BaseDateStepper v-model="selectedDate"
                     id="txtDatumTB"/>
    <hr>

    <!-- Tiergewicht -->
    <BaseInput
        v-model="form.tiergewicht"
        type="number"
        label="journal.form.tiergewicht"
        groupUnit="g"
    />

    <!-- Wasser -->
    <BaseInput
        v-model="form.wasser"
        type="number"
        label="journal.form.wasser"
        groupUnit="l"
    />

    <!-- Eingabe in % (Toggle) -->
    <BaseCheckbox
        v-model="form.eingabeInProzent"
        label="journal.form.eingabeInProzent"
        variant="switch"
    />

    <!-- Misch -->
    <BaseInput
        v-model="form.mischfutter"
        type="number"
        label="journal.form.mischfutter"
        groupUnit="kg"
    />

    <!-- Weiz -->
    <BaseInput
        v-model="form.weizen"
        type="number"
        label="journal.form.weizen"
        groupUnit="kg"
    />

    <alert type="info">
      {{$t('journal.form.phase_question')}}
    </alert>

    <FeedingPhaseToggle v-model="form.feedingPhases" label="journal.form.feedingphase"></FeedingPhaseToggle>

    <hr>

    <div class="row">
      <BaseInput v-model="form.tempMin"
                 type="text"
                 label="journal.form.temperature"
                 groupUnit="°C"
                 formGroupClasses="col-6"
                 placeholder="journal.form.temperature_min"></BaseInput>
      <BaseInput v-model="form.tempMax"
                 type="text"
                 groupUnit="°C"
                 labelEnd="Gestern"
                 formGroupClasses="col-6"
                 placeholder="journal.form.temperature_max"></BaseInput>
    </div>

    <div class="row">
      <BaseInput v-model="form.humidityMin"
                 type="text"
                 label="journal.form.humidity"
                 groupUnit="%"
                 formGroupClasses="col-6"
                 placeholder="journal.form.humidity_min"></BaseInput>
      <BaseInput v-model="form.humidityMax"
                 type="text"
                 groupUnit="°C"
                 formGroupClasses="col-6"
                 labelEnd="Gestern"
                 placeholder="journal.form.humidity_max"></BaseInput>
    </div>

  </form>
</template>
