<script setup>

import Alert from "@/components/utils/Alert.vue";
import {useUserConfig} from "@/services/userConfigService.js";
import {computed, ref, watch} from "vue";
import {useJournalService} from "@/services/journalService.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseDateStepper from "@/components/utils/BaseDateStepper.vue";


const {getJournalData} = useJournalService()
const { userConfig, isUserConfigLoading, userConfigError } = useUserConfig()

const selectedHouse = ref('')
const selectedDate = ref('')
const journalData = ref(null)

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

function submit() {
  console.log('### foobar')
}
</script>

<template>
  <Alert type="info">{{$t('journal.info')}}</Alert>

  <form @submit.prevent="submit" class="">
    <HouseSelect v-model="selectedHouse"/>
    <BaseDateStepper v-model="selectedDate"
                     id="txtDatumTB"
                     label="journal.date.label"/>
  </form>
</template>
