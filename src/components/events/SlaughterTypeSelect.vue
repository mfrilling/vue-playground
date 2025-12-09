<script setup>
import { computed, onMounted } from "vue";
import BaseSelect from "@/components/utils/BaseSelect.vue";
import { MEDICATION_TYPE_OPTIONS } from "@/constants/medicationTypes.js";
import { SLAUGHTER_SCOPE_TYPE_OPTIONS } from "@/constants/slaughterScopeTypes.js";

// Props: ganz klassisch v-model="foo"
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "events.slaugter.scope",
  },
});

// Emits: update:modelValue für v-model
const emit = defineEmits(["update:modelValue"]);

// Proxy für v-model
const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Optionen kommen aus der Konstanten
const options = SLAUGHTER_SCOPE_TYPE_OPTIONS;

onMounted(() => {
  if (!props.modelValue) {
    emit("update:modelValue", options[0].value);
  }
})
</script>

<template>
  <BaseSelect
    v-model="innerValue"
    :options="options"
    :label="label"
  />
</template>

