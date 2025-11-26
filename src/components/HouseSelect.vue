<script setup>
import {computed, ref, watch} from 'vue'
import {useUserConfig} from '@/services/userConfigService.js'
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
  }
})

const emit = defineEmits(['update:modelValue'])

const { userConfig, isUserConfigLoading, userConfigError } = useUserConfig()

// internes Ref, das mit v-model synchronisiert wird
const selectedHouse = ref(props.modelValue)

// wenn sich modelValue von außen ändert → internes Ref updaten
watch(
    () => props.modelValue,
    (val) => {
      selectedHouse.value = val
    }
)

// Options für das Select aus userConfig.houses bauen
const houseOptions = computed(() => {
  const cfg = userConfig.value
  if (!cfg || !cfg.houses) {
    return []
  }

  return Object.entries(cfg.houses).map(([key, house]) => ({
    value: key,
    label: house['Bezeichnung'] || key
  }))
})

// erste Option automatisch auswählen, sobald vorhanden
watch(
    houseOptions,
    (options) => {
      if (!options || options.length === 0) return

      // Nur setzen, wenn noch nichts gewählt wurde
      if (!selectedHouse.value) {
        selectedHouse.value = options[0].value
        emit('update:modelValue', options[0].value)
      }
    },
    { immediate: true }
)

// wenn der User etwas auswählt → nach außen emitten
watch(selectedHouse, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <div class="mb-3">
    <BaseSelect
        v-model="selectedHouse"
        :label="label"
        :options="houseOptions"
    />
  </div>
</template>