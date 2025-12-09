<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/services/authService'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

// Alle Routen, die unter "Events" hängen:
const eventRouteNames = ['housings', 'medications', 'salmonellaProbes', 'harvests', 'slaughters', 'foodDeliveries', 'foodRemains']

const isEventsActive = computed(() => eventRouteNames.includes(route.name))

async function handleLogout() {
  await logout()
  await router.replace({ name: 'login' })
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a
        class="navbar-brand"
        noref
      >
        <img
          src="@/assets/logo.png"
          alt="Logo"
          height="32"
          class="d-inline-block align-top"
        >
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="`$t('navigation.toggle_navigation')`"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="navbarSupportedContent"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              :to="{ name:'journal' }"
              active-class="active"
            >
              {{ $t('journal.title') }}
            </RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a
              id="navEreignis"
              class="nav-link dropdown-toggle"
              :class="{ active: isEventsActive }"
              noref
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ $t('events.title') }}
            </a>
            <ul
              class="dropdown-menu"
              aria-labelledby="navEreignis"
              data-bs-popper="static"
            >
              <li>
                <RouterLink
                  id="navEinstallung"
                  class="dropdown-item"
                  :to="{ name: 'housings' }"
                  data-bs-dismiss="dropdown"
                >
                  🥚 {{ $t('events.housings.title') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  id="navMedication"
                  class="dropdown-item"
                  :to="{ name: 'medications' }"
                  data-bs-dismiss="dropdown"
                >
                  🦠 {{ $t('events.medications.title') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  id="navSalmonellaProbe"
                  class="dropdown-item"
                  :to="{ name: 'salmonellaProbes' }"
                >
                  🧪 {{ $t('events.salmonellaProbes.title') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  id="navHarvest"
                  class="dropdown-item"
                  :to="{ name: 'harvests' }"
                >
                  ➡️ {{ $t('events.harvests.title') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  id="navSlaughter"
                  class="dropdown-item"
                  :to="{ name: 'slaughters' }"
                >
                  💀 {{ $t('events.slaughters.title') }}
                </RouterLink>
              </li>
            </ul>
          </li>
          <li>
            Stallkarte
          </li>
          <li>
            Analyse
          </li>
          <li class="nav-item dropdown">
            <a
              id="navBenutzer"
              class="nav-link dropdown-toggle"
              noref
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ $t('user.title') }}
            </a>
            <ul
              class="dropdown-menu"
              aria-labelledby="navBenutzer"
              data-bs-popper="static"
            >
              <li>
                <a
                  class="dropdown-item"
                  noref
                  @click="handleLogout"
                >
                  🚪 {{ $t('general.logout') }}
                </a>
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