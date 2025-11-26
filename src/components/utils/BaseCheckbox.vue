<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: '' // i18n Key
  },
  id: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },

  /**
   * checkbox → normale Checkbox
   * switch → Bootstrap Switch
   */
  variant: {
    type: String,
    default: 'checkbox', // 'checkbox' | 'switch'
    validator: (v) => ['checkbox', 'switch'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => {
  return props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`
})

function onChange(e) {
  emit('update:modelValue', e.target.checked)
}
</script>

<template>
  <div class="mb-3">

    <div
        class="form-check"
        :class="{ 'form-switch': variant === 'switch' }"
    >
      <input
          class="form-check-input"
          :id="inputId"
          type="checkbox"
          :checked="modelValue"
          @change="onChange"
          :required="required"
          :disabled="disabled"
          :role="variant === 'switch' ? 'switch' : null"
          :class="{ 'is-invalid': error }"
      />

      <label class="form-check-label" :for="inputId">
        <!-- i18n-Label -->
        {{ $t(label) }}
        <span v-if="required" class="text-danger">*</span>
      </label>
    </div>

    <div v-if="error" class="invalid-feedback d-block">
      {{ error }}
    </div>
  </div>
</template>