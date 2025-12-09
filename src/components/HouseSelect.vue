<script setup>
import { computed, watch } from 'vue'
import { useUserConfig } from '@/services/userConfigService.js'
import BaseSelect from '@/components/utils/BaseSelect.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'journal.form.house' // i18n-Key
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showAllOption: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const { userConfig } = useUserConfig()

// v-model-Proxy: KEIN extra ref, sondern direkt auf modelValue
const selectedHouse = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Options aus userConfig.houses bauen
const houseOptions = computed(() => {
  const cfg = userConfig.value
  if (!cfg || !cfg.houses) {
    return []
  }

  const housesFromConfig = Object.entries(cfg.houses).map(([key, house]) => ({
    value: key,
    label: house['Bezeichnung'] || key
  }))

  return [
    ...(props.showAllOption ? [{ value: 'all', label: 'general.all' }] : []),
    ...housesFromConfig
  ]
})

// erste Option automatisch auswählen, wenn noch nichts gesetzt ist
watch(
  () => houseOptions.value,
  (options) => {
    if (!options || options.length === 0) return

    const stored = localStorage.getItem('defaultHouse')
    const validatedStored = options.find(o => o.value === stored)
    if (!props.modelValue) {
      if (props.showAllOption) {
        selectedHouse.value = options[0].value
        return
      }
      if (validatedStored.value) {
        selectedHouse.value = validatedStored.value;
      }
    } else {
      // Nur setzen, wenn von außen nichts vorgegeben wurde
      selectedHouse.value = options[0].value // triggert emit
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="mb-3">
    <BaseSelect
      v-model="selectedHouse"
      :label="label"
      :options="houseOptions"
      :disabled="disabled || houseOptions.length === 0"
      :required="required"
    />
  </div>
</template>
