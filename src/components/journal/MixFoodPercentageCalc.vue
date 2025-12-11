<script setup>
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import { computed, ref, watch } from "vue";

const props = defineProps({
  form: { type: Object, required: true },
})
const emit = defineEmits(['update:form'])
const showPercentages = ref(false)
const sum = ref(0)
const percentage = ref(0)

const form = computed({
  get: () => props.form,
  set: (value) => emit("update:form", value)
})

function updateForm(patch) {
  form.value = {
    ...form.value,
    ...patch,
  }
}
// auf den boolschen Wert reagieren
watch(
    () => showPercentages.value,
    (newVal) => {
      showPercentages.value = newVal;

      const mixfood = Number.parseInt(form.value.mixfood || 0, 10);
      const wheat = Number.parseInt(form.value.wheat || 0, 10);

      if (newVal) {
        // Prozente anzeigen → Summe & Prozent aus aktuellen Werten berechnen
        const s = mixfood + wheat;
        sum.value = s;

        percentage.value = s > 0 ? (wheat / s) * 100 : 0;
      } else {
        // Prozente ausgeschaltet → aus gespeicherter sum/percentage wieder konkrete Werte berechnen
        const newMixfood =
            sum.value - (sum.value * percentage.value) / 100;
        const newWheat =
            (sum.value * percentage.value) / 100;

        updateForm({
          mixfood: Math.round(newMixfood),
          wheat: Math.round(newWheat),
        });
      }
    },
    { immediate: true }
);
</script>

<template>
  <!-- Eingabe in % (Toggle) -->
  <BaseCheckbox
    v-model="showPercentages"
    label="journal.form.input_in_percentage"
    variant="switch"
  />

  <!-- Misch -->
  <BaseInput
    v-model="form.mixfood"
    type="number"
    label="journal.form.mischfutter"
    label-end="general.yesterday"
    group-unit="kg"
    :class="{ 'd-none': showPercentages }"
  />

  <!-- Weizen -->
  <BaseInput
    v-model="form.wheat"
    type="number"
    label="journal.form.wheat"
    label-end="general.yesterday"
    group-unit="kg"
    :class="{ 'd-none': showPercentages }"
  />

  <BaseInput
    v-model="sum"
    type="number"
    label="journal.form.sum"
    label-end="general.yesterday"
    :class="{ 'd-none': !showPercentages }"
    group-unit="kg"
  />

  <BaseInput
    v-model="percentage"
    type="number"
    label="journal.form.percentage"
    label-end="general.yesterday"
    :class="{ 'd-none': !showPercentages }"
    group-unit="%"
  />
</template>