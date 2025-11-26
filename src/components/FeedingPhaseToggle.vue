<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  })
  const emit = defineEmits(['update:modelValue'])

  const phases = [
    { key: 'FutterphaseStart', label: 'Start' },
    { key: 'Futterphase1',     label: 'I'     },
    { key: 'Futterphase2',     label: 'II'    },
    { key: 'Futterphase3',     label: 'III'   },
    { key: 'FutterphaseEnde',  label: 'Ende'  },
  ]

  const activeSet = computed(() => new Set(props.modelValue ?? []))

  function isActive(key) {
    return activeSet.value.has(key)
  }

  function togglePhase(key) {
    // falls später disable möglich sein soll
    // if (props.diasbled) return

    const current = props.modelValue ?? []
    let next

    if (current.includes(key)) {
      // wenn schon aktiv, dann deaktivieren
      next = current.filter(k => k !== key)
    } else {
      // wenn noch nicht aktiv, dann aktivieren
      next = [...current, key]
    }

    emit('update:modelValue', next)
  }
</script>

<template>
  <div class="feeding-phase-toggle">
    <div class="d-flex justify-content-between mb-1">
      <span class="">{{ $t(label) }}</span>
    </div>

    <div class="btn-group w-100" role="group" aria-label="Futterphasen">
      <button
          v-for="phase in phases"
          :key="phase.key"
          type="button"
          class="btn flex-fill"
          :class="isActive(phase.key) ? 'btn-primary' : 'btn-outline-primary'"
          @click="togglePhase(phase.key)">
        {{ phase.label }}
      </button>
    </div>
  </div>
</template>
