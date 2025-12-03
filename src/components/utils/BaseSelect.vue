<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => [] // z.B. [{ value: 'stall1', label: 'Stall 1' }]
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// Proxy für v-model
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="mb-3">
    <label
      v-if="label"
      class="form-label"
    >
      {{ $t ? $t(label) : label }}
    </label>

    <select
      v-model="innerValue"
      class="form-select"
      :disabled="disabled"
      :required="required"
    >
      <option
        v-for="opt in options"
        :key="opt.value ?? opt"
        :value="opt.value ?? opt"
      >
        <!-- falls du i18n-Keys als Label nutzt -->
        {{ $t && opt.label ? $t(opt.label) : (opt.label ?? opt) }}
      </option>
    </select>
  </div>
</template>
