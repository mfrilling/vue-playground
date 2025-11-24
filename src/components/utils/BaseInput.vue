<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:modelValue'])

const inputId = computed(() => {
  // Falls kein id übergeben wird, automatisch generieren
  return props.id || `input-${Math.random().toString(36).substring(2, 9)}`
})

const onInput = (event) => {
  emits('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="mb-3">
    <label
        v-if="label"
        class="form-label pb-0 ps-0 mb-0"
        :for="inputId"
    >
      {{ $t(label) }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <input
        :id="inputId"
        :type="type"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :placeholder="$t(placeholder)"
        :value="modelValue"
        @input="onInput"
        :required="required"
    />

    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>

</style>