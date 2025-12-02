<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * v-model: aktuell ausgewählter Wert
   * Kann ein String, Number, etc. sein – abhängig von deinen Optionen
   */
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  classes: {
    type: String,
    default: "mb-3",
  },

  /**
   * Liste der Buttons
   * z.B.:
   * [
   *   { value: 'phase1', label: 'Phase 1' },
   *   { value: 'phase2', label: 'Phase 2' },
   * ]
   */
  options: {
    type: Array,
    required: true,
  },

  /**
   * Keys für Value & Label in options
   */
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: "label",
  },

  /**
   * Optional: Größe/Style, falls du später varianten magst
   */
  size: {
    type: String,
    default: "md", // z.B. 'sm', 'md', 'lg'
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const selected = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
    emit("change", val);
  },
});

function onSelect(option) {
  const value = option[props.valueKey];

  // Wenn derselbe Button nochmal geklickt wird:
  // → entweder ignorieren oder abwählen (hier: ignorieren)
  if (value === selected.value) return;

  selected.value = value;
}
</script>

<template>
  <label
    v-if="props.label"
    class="form-label pb-0 ps-0 mb-0 w-100 col-12 d-flex justify-content-between"
  >
    {{ $t(props.label) }}
  </label>
  <div
    class="btn-group w-100"
    :class="classes"
    role="group"
  >
    <button
      v-for="option in options"
      :key="option[valueKey]"
      type="button"
      class="btn"
      :class="[
        selected === option[valueKey] ? 'btn-primary' : 'btn-outline-primary',
        size === 'sm' ? 'btn-sm' : '',
        size === 'lg' ? 'btn-lg' : '',
      ]"
      @click="onSelect(option)"
    >
      {{ $t(option[labelKey]) }}
    </button>
  </div>
</template>

<style scoped>
.btn-group-toggle {
  display: inline-flex;
}

</style>
