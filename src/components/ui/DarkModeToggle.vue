<!--

<script setup>
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // User-Preference aus localStorage oder OS-Preference verwenden
  const stored = localStorage.getItem('prefers-dark')
  if (stored !== null) {
    isDark.value = stored === 'true'
  } else if (window.matchMedia) {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  document.documentElement.classList.toggle('dark-mode', isDark.value)
})

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark-mode', val)
  localStorage.setItem('prefers-dark', val ? 'true' : 'false')
})

function toggleDark() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    class="btn btn-outline-secondary"
    @click="toggleDark"
  >
    {{ isDark ? '🌙 Dark Mode' : '☀️ Light Mode' }}
  </button>
</template>
-->
<script setup>
import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'prefers-dark'
const isDark = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) {
    isDark.value = stored === 'true'
  } else if (globalThis.matchMedia) {
    isDark.value = globalThis.matchMedia('(prefers-color-scheme: dark)').matches
  }

  document.documentElement.classList.toggle('dark-mode', isDark.value)
})

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark-mode', val)
  localStorage.setItem(STORAGE_KEY, val ? 'true' : 'false')
})

function toggleDark() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    class="theme-switch"
    :class="{ 'theme-switch--dark': isDark }"
    type="button"
    role="switch"
    :aria-checked="isDark ? 'true' : 'false'"
    :aria-label="$t('general.dark_mode_switch')"
    @click="toggleDark"
    @keydown.space.prevent="toggleDark"
    @keydown.enter.prevent="toggleDark"
  >
    <span class="theme-switch__track" />

    <span class="theme-switch__thumb">
      <span class="theme-switch__icon">
        {{ isDark ? '🌙' : '☀️' }}
      </span>
    </span>
  </button>
</template>

<style scoped>
:root {
  /* nur zur Lesbarkeit; wirkt hier durch scoped nicht global */
}

/* Basisgrößen – kannst du bei Bedarf anpassen */
.theme-switch {
  --switch-width: 54px;
  --switch-height: 30px;
  --thumb-size: 24px;
  --padding: 3px;
  --translate-x: var(--thumb-translate-light, 3px);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--switch-width);
  height: var(--switch-height);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
}

/* Fokus-Styling für Keyboard-User */
.theme-switch:focus-visible {
  outline: 2px solid #0d6efd;
  outline-offset: 4px;
  border-radius: 999px;
}

/* Schiene / Track */
.theme-switch__track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #87cefa, #ffd27f);
  opacity: 1;
  transition: background 0.25s ease, opacity 0.25s ease;
}

/* Kreis / Thumb */
.theme-switch__thumb {
  position: relative;
  z-index: 1;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateX(var(--translate-x, 0));
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

/* Icon im Kreis (Sun/Moon) */
.theme-switch__icon {
  font-size: 14px;
  line-height: 1;
}

/* Position im Dark-Mode: nach rechts */
.theme-switch--dark {
  --translate-x: calc(
    var(--switch-width) - var(--thumb-size) - var(--padding) * 2
  );
}

/* Dark-Mode-Farben des Switches */
.theme-switch--dark .theme-switch__track {
  background: linear-gradient(135deg, #1c1c2b, #4a4a67);
}

.theme-switch--dark .theme-switch__thumb {
  background: #424242;
}

/* Optional: Hover-Effekt */
.theme-switch:hover .theme-switch__thumb {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45);
}

@media (prefers-reduced-motion: reduce) {
  .theme-switch__thumb,
  .theme-switch__track {
    transition: none;
  }
}
</style>
