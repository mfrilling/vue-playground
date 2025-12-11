<script setup>

import { useUserConfig } from "@/services/userConfigService.js";
import { computed, watch } from "vue";
import BaseSelect from "@/components/utils/BaseSelect.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'general.facility',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showAllOption: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const { userConfig } = useUserConfig()

const selectedFacility = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const facilityOptions = computed(() => {
  const cfg = userConfig.value
  if (!cfg || !cfg.silos) {
    return []
  }

  const silosFromConfig = Object.entries(cfg.facilities).map(([key, silo]) => ({
    value: key,
    label: silo['Bezeichnung'] || key
  }))

  return [
    ...(props.showAllOption ? [{ value: 'all', label: 'general.all' }] : []),
    ...silosFromConfig
  ]
})

watch(
  () => facilityOptions.value,
  (options) => {
    if (!options || options.length === 0) return

    if (!props.modelValue) {
      selectedFacility.value = options[0].value
    }
  },
  { immediate: true }
)

</script>

<template>
  <div class="mb-3">
    <BaseSelect
      v-model="selectedFacility"
      :label="label"
      :options="facilityOptions || facilityOptions.length === 0"
      :disabled="disabled"
    />
  </div>
</template>