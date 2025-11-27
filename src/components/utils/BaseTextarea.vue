<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
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
  rows: {
    type: Number,
    default: 3
  },
  formGroupClasses: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const textareaId = computed(() => {
  return props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`
})

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="mb-3" :class="formGroupClasses">

    <!-- Label -->
    <label
        v-if="label"
        class="form-label pb-0 ps-0 mb-0 d-flex justify-content-between"
        :for="textareaId"
    >
      <span>{{ $t(label) }}</span>
      <span v-if="labelEnd" class="text-muted">{{ $t(labelEnd) }}</span>
    </label>

    <textarea
        :id="textareaId"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :placeholder="$t(placeholder)"
        :value="modelValue"
        :rows="rows"
        @input="onInput"
    ></textarea>

    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>