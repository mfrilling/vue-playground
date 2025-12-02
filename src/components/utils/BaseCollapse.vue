<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * Steuert, ob der Collapse geöffnet ist (für v-model)
   */
  modelValue: {
    type: Boolean,
    default: false,
  },
  /**
   * Einfacher Titel-String (optional –
   * alternativ kannst du den title-Slot verwenden)
   */
  title: {
    type: String,
    default: "",
  },
  /**
   * Deaktiviert das Auf-/Zuklappen
   */
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "toggle"]);

// "virtuelles" v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  emit("toggle", isOpen.value);
}
</script>

<template>
  <div class="collapse-wrapper">
    <!-- Header -->
    <button
      type="button"
      class="collapse-header w-100 text-start"
      :class="{ 'is-open': isOpen, disabled }"
      @click="toggle"
    >
      <div class="collapse-header-inner">
        <span class="collapse-title">
          <slot name="title">
            {{ $t(title) }}
          </slot>
        </span>

        <span
          class="collapse-icon"
          aria-hidden="true"
        >
          <!-- kleines Caret, das sich dreht -->
          <span
            class="collapse-caret"
            :class="{ 'collapse-caret-open': isOpen }"
          >
            ▾
          </span>
        </span>
      </div>
    </button>

    <!-- Body -->
    <Transition name="collapse-fade">
      <!-- v-show → Inhalt bleibt im DOM (State bleibt erhalten) -->
      <div
        v-show="isOpen"
        class="collapse-body"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.collapse-wrapper {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background-color: #fff;
  margin-bottom: 0.5rem;
}

/* Header */

.collapse-header {
  border: none;
  background: transparent;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.collapse-header.disabled {
  cursor: default;
  opacity: 0.6;
}

.collapse-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.collapse-header:hover:not(.disabled) {
  background-color: #f8f9fa;
}

.collapse-title {
  font-weight: 500;
}

/* Icon / Caret */

.collapse-caret {
  display: inline-block;
  transition: transform 0.15s ease-out;
}

.collapse-caret-open {
  transform: rotate(180deg);
}

/* Body */

.collapse-body {
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid #dee2e6;
}

/* Transition */

.collapse-fade-enter-active,
.collapse-fade-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.collapse-fade-enter-from,
.collapse-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.collapse-fade-enter-to,
.collapse-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
