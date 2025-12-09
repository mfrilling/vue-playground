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
  labelEnd: {
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
  },
  groupUnit: {
    type: String,
    default: ''
  },
  formGroupClasses: {
    type: String,
    default: 'mb-3'
  },
  disabled: {
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
  <div
    :class="props.formGroupClasses"
  >
    <label
      v-if="label || labelEnd"
      class="form-label pb-0 ps-0 mb-0 w-100 col-12 d-flex justify-content-between"
      :for="inputId"
    >
      <span
        v-if="label"
        class=""
      >{{ $t(label) }}</span>
      <span
        v-if="required && label"
        class="text-danger"
      >*</span>
      <span
        v-if="labelEnd"
        class="text-muted text-end"
      >{{ $t(labelEnd) }}</span>
    </label>

    <div
      v-if="groupUnit"
      class="input-group"
    >
      <input
        :id="inputId"
        :type="type"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :placeholder="$t(placeholder) || '...'"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        @input="onInput"
      >
      <span class="input-group-text col-2 justify-content-center">{{ $t(groupUnit) }}</span>
    </div>
    <input
      v-else
      :id="inputId"
      :type="type"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :placeholder="$t(placeholder) || '...'"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @input="onInput"
    >

    <div
      v-if="error"
      class="invalid-feedback"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>

</style>