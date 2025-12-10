<script setup>
import { ref } from 'vue';

const { label } = defineProps({
  label: {
    type: String,
    default: ''
  }
});

const isOpen = ref(false);
const toggle = () => (isOpen.value = !isOpen.value);
const open = () => (isOpen.value = true);
const close = () => (isOpen.value = false);
</script>

<template>
  <div
    class="dropdown"
    @keyup.esc="close"
  >
    <button
      class="btn dropdown-toggle"
      :class="{ show: isOpen }"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
      @keydown.down.prevent="open"
    >
      {{ $t(label) }}
    </button>

    <ul
      class="dropdown-menu"
      :class="{ show: isOpen }"
    >
      <li @click="close">
        <slot />
      </li>
    </ul>
  </div>
</template>