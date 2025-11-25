<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, null],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '' // i18n-Key, z. B. 'form.select.placeholder'
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Optionen:
   * - Entweder Array von Strings: ['a', 'b']
   * - Oder Array von Objekten: [{ value: 'a', label: 'form.option.a' }]
   */
  options: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue'])

const selectId = computed(() => {
  return props.id || `select-${Math.random().toString(36).substring(2, 9)}`
})

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        value: option,
        label: option // kann bei Bedarf auch über $t(option) laufen
      }
    }
    return option
  })
})

const onChange = (event) => {
  if (props.multiple) {
    const values = Array.from(event.target.selectedOptions).map(
        (opt) => opt.value
    )
    emits('update:modelValue', values)
  } else {
    emits('update:modelValue', event.target.value)
  }
}
</script>

<template>
  <div class="mb-3">
    <label
        v-if="label"
        class="form-label pb-0 ps-0 mb-0"
        :for="selectId"
    >
      {{ $t(label) }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <select
        :id="selectId"
        class="form-select"
        :class="{ 'is-invalid': error }"
        :multiple="multiple"
        :required="required"
        :disabled="disabled"
        :value="modelValue"
        @change="onChange"
    >
      <!-- Placeholder nur bei Single-Select sinnvoll -->
      <option
          v-if="!multiple && placeholder"
          disabled
          value=""
          :selected="modelValue === '' || modelValue === null"
      >
        {{ $t(placeholder) }}
      </option>

      <option
          v-for="opt in normalizedOptions"
          :key="opt.value"
          :value="opt.value">
        <!-- wenn label wie ein i18n-Key aussieht, mit $t behandeln -->
        {{ opt.label && typeof opt.label === 'string' ? $t(opt.label) : opt.label }}
      </option>
    </select>

    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
</style>
