<script setup>
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import { ref, watch } from "vue";

const props = defineProps({
  form: { type: Object, required: true },
})

const showPercentages = ref(false)
const sum = ref(0)
const percentage = ref(0)

// auf den boolschen Wert reagieren
watch(
    () => props.form.eingabeInProzent,
    (newVal) => {
      showPercentages.value = newVal
      if (newVal) {
        sum.value= ( parseInt(props.form.mixfood) + parseInt(props.form.wheat) )
        percentage.value = (parseInt(props.form.wheat) / (parseInt(sum.value))) * 100
      } else {
        props.form.mixfood = (parseInt(sum.value) - (parseInt(sum.value) * parseInt(percentage.value) / 100))
        props.form.wheat = (parseInt(sum.value) * parseInt(percentage.value) / 100)
      }
    },
    { immediate: true } // optional, dann wird der initiale Wert direkt übernommen
)
</script>

<template>

  <!-- Eingabe in % (Toggle) -->
  <BaseCheckbox
      v-model="form.eingabeInProzent"
      label="journal.form.eingabeInProzent"
      variant="switch"
  />

  <!-- Misch -->
  <BaseInput
      v-model="form.mixfood"
      type="number"
      label="journal.form.mischfutter"
      label-end="general.yesterday"
      groupUnit="kg"
      :class="{ 'd-none': showPercentages }"
  />

  <!-- Weizen -->
  <BaseInput
      v-model="form.wheat"
      type="number"
      label="journal.form.weizen"
      label-end="general.yesterday"
      groupUnit="kg"
      :class="{ 'd-none': showPercentages }"
  />

  <BaseInput
    v-model="sum"
    type="number"
    label="journal.form.sum"
    label-end="general.yesterday"
    :class="{ 'd-none': !showPercentages }"
    groupUnit="kg"/>

  <BaseInput
    v-model="percentage"
    type="number"
    label="journal.form.percentage"
    label-end="general.yesterday"
    :class="{ 'd-none': !showPercentages }"
    groupUnit="%"/>

</template>

<style scoped>

</style>