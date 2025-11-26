<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String, // yyyy-mm-dd
    default: ''
  },
  label: {
    type: String,
    default: 'journal.form.date'
  },
  id: {
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
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// Computed für ID
const inputId = computed(() => props.id || `date-${Math.random().toString(36).substring(2, 9)}`)

// internes Date-Ref
const internalValue = ref('')

// Beim Mount: heute setzen, falls nichts übergeben wurde
onMounted(() => {
  if (!props.modelValue) {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    internalValue.value = `${y}-${m}-${d}`
    emit('update:modelValue', internalValue.value)
  } else {
    internalValue.value = props.modelValue
  }
})

// Wenn Parent den Wert ändert → intern synchronisieren
watch(
    () => props.modelValue,
    (val) => {
      if (val !== internalValue.value) {
        internalValue.value = val
      }
    }
)

// Datum +/- 1 Tag ändern
function changeByDays(delta) {
  if (!internalValue.value) return
  const date = new Date(internalValue.value)
  date.setDate(date.getDate() + delta)

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')

  internalValue.value = `${y}-${m}-${d}`
  emit('update:modelValue', internalValue.value)
}

</script>

<template>
  <div class="mb-3">
    <label
        v-if="label"
        class="form-label pb-0 ps-0 mb-1"
        :for="inputId">
      {{ $t(label) }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="input-group">
      <button
          class="btn btn-primary"
          type="button"
          @click="changeByDays(-1)"
          :disabled="disabled"
      >
        <i class="bi bi-arrow-left-square"></i>
      </button>

      <input
          :id="inputId"
          type="date"
          class="form-control"
          :value="internalValue"
          @input="event => { internalValue = event.target.value; emit('update:modelValue', internalValue) }"
      />

      <button
          class="btn btn-primary"
          type="button"
          @click="changeByDays(1)"
          :disabled="disabled"
      >
        <i class="bi bi-arrow-right-square"></i>
      </button>

      <div v-if="error" class="invalid-feedback">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>