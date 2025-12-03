<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  // optional: für Fehlermeldungen etc.
  error: {
    type: String,
    default: "",
  },
  displayKey: {
    type: String,
    default: "label",
  }
});

const emit = defineEmits(["update:modelValue", "select"]);

// interner Input-Text
const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit("update:modelValue", val);
  },
})
const isOpen = ref(false);
const highlightedIndex = ref(-1);

watch(
    () => props.modelValue,
    (val) => {
      if (val !== inputValue.value) {
        inputValue.value = val ?? "";
      }
    }
);

const filteredOptions = computed(() => {
  const term = inputValue.value.toLowerCase().trim();
  if (!term) return props.options;
  return props.options.filter((opt) =>
      String(opt[props.displayKey]).toLowerCase().includes(term)
  );
});

function onFocus() {
  if (filteredOptions.value.length > 0) {
    isOpen.value = true;
  }
}

function onInput(event) {
  inputValue.value = event.target.value;
  emit("update:modelValue", inputValue.value);
  highlightedIndex.value = -1;
  isOpen.value = filteredOptions.value.length > 0;
}

function selectOption(option) {
  inputValue.value = option[props.displayKey];
  emit("update:modelValue", option[props.displayKey]);
  emit("select", option);
  isOpen.value = false;
  highlightedIndex.value = -1;
}

function onKeydown(e) {
  if (!isOpen.value && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
    isOpen.value = filteredOptions.value.length > 0;
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (filteredOptions.value.length === 0) return;
    highlightedIndex.value =
        (highlightedIndex.value + 1) % filteredOptions.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (filteredOptions.value.length === 0) return;
    highlightedIndex.value =
        (highlightedIndex.value - 1 + filteredOptions.value.length) %
        filteredOptions.value.length;
  } else if (e.key === "Enter") {
    if (isOpen.value && highlightedIndex.value >= 0) {
      e.preventDefault();
      const opt = filteredOptions.value[highlightedIndex.value];
      if (opt) selectOption(opt);
    }
  } else if (e.key === "Escape") {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }
}

// kleine Delay, damit Klicks auf die Liste noch durchkommen
function onBlur() {
  setTimeout(() => {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }, 150);
}
</script>

<template>
  <div class="position-relative mb-3">
    <label
      v-if="label"
      class="form-label"
    >
      {{ $t ? $t(label) : label }}
    </label>

    <input
      class="form-control"
      type="text"
      :value="inputValue"
      :placeholder="$t ? $t(placeholder) : placeholder"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeydown"
      @blur="onBlur"
    >

    <div
      v-if="isOpen && filteredOptions.length > 0"
      class="list-group position-absolute w-100 shadow-sm"
      style="z-index: 1000; max-height: 200px; overflow-y: auto;"
    >
      <button
        v-for="(option, index) in filteredOptions"
        :key="option"
        type="button"
        class="list-group-item list-group-item-action"
        :class="{ active: index === highlightedIndex }"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option[displayKey] }}
      </button>
    </div>

    <div
      v-if="error"
      class="invalid-feedback d-block"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.list-group-item.active {
  /* optional: Styling vom Theme übernimmt normalerweise Bootstrap */
}
</style>
