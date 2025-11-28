<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Alle Routen, die unter "Events" hängen:
const eventRouteNames = ['housings', 'medications', 'salmonellaProbes', 'harvests', 'slaughters', 'foodDeliveries', 'foodRemains']

const isEventsActive = computed(() => eventRouteNames.includes(route.name))
</script>

<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" noref>
      <img src="@/assets/logo.png" alt="Logo" height="32" class="d-inline-block align-top"/>
    </a>
    <button class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="`$t('navigation.toggle_navigation')`">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{name:'journal'}" active-class="active">{{$t('journal.title')}}</RouterLink>
        </li>
        <li class="nav-item">
          <a class="nav-link dropdown-toggle"
             :class="{active: isEventsActive}"
             noref
             id="navEreignis"
             role="button"
             data-bs-toggle="dropdown">
            {{ $t('events.title') }}
          </a>
            <ul class="dropdown-menu" aria-labelledby="navEreignis" data-bs-popper="static">
              <li>
                <RouterLink class="dropdown-item" id="navEinstallung" :to="{name: 'housings'}" data-bs-dismiss="dropdown">🥚 {{ $t('events.housings.title') }}</RouterLink>
              </li>
            </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<style scoped>

</style>