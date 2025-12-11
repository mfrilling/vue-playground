<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/services/authService'
import BaseDropdown from "@/components/utils/BaseDropdown.vue";
import DarkModeToggle from "@/components/ui/DarkModeToggle.vue";

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

// Alle Routen, die unter "Events" hängen:
const eventRouteNames = new Set([
  'housings',
  'medications',
  'salmonellaProbes',
  'harvests',
  'slaughters',
  'foodDeliveries',
  'foodRemains'
])

const isEventsActive = computed(() => eventRouteNames.has(route.name))

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
            <BaseDropdown
              label="events.title"
              :class="{ active: isEventsActive }"
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
                  🧪 {{ $t('events.salmonella_probes.title') }}
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
                  💀 {{ $t('events.slaughter.title') }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  id="navFoodDeliveries"
                  class="dropdown-item"
                  :to="{ name: 'foodDeliveries' }"
                >
                  🚚 {{ $t('events.food_deliveries.title') }}
                </RouterLink>
              </li>
            </BaseDropdown>
          </li>
          <li>
            Stallkarte
          </li>
          <li>
            Analyse
          </li>
          <li class="nav-item dropdown">
            <BaseDropdown
              label="user.title"
            >
              <a
                class="dropdown-item"
                @click="handleLogout"
              >
                🚪 {{ $t('general.logout') }}
              </a>
            </BaseDropdown>
          </li>
        </ul>
        <div class="float-end">
          <DarkModeToggle />
        </div>
      </div>
    </div>
  </nav>
</template>