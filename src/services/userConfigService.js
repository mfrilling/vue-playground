// src/services/userConfigService.js
import { ref, computed } from 'vue'
import { httpClient } from './httpClient'

const userConfigState = ref(null)
const loadingState = ref(false)
const errorState = ref(null)
const isLoadedState = ref(false)

// Endpunkt: passe den Pfad an deine API an
const USER_CONFIG_PATH = '/userConfig'

let loadPromise = null

async function fetchUserConfig(force = false) {
    if (isLoadedState.value && !force) {
        return {success: true, data: userConfigState.value}
    }

    if (loadingState.value && loadPromise) {
        return loadPromise
    }
    loadingState.value = true
    errorState.value = null

    loadPromise = (async () => {
        try {
            const data = await httpClient.get(USER_CONFIG_PATH)
            userConfigState.value = data
            isLoadedState.value = true
            return { success: true, data }
        } catch (error) {
            errorState.value = error
            isLoadedState.value = false
            userConfigState.value = null
            return { success: false, error }
        } finally {
            loadingState.value = false
            loadPromise = null
        }
    })()

    return loadPromise
}

// Optional: z. B. wenn du ein Update-Endpoint hast
async function updateUserConfig(partialConfig) {
    loadingState.value = true
    errorState.value = null

    try {
        const updated = await httpClient.patch(USER_CONFIG_PATH, partialConfig)

        userConfigState.value = {
            ...(userConfigState.value || {}),
            ...updated,
        }
        isLoadedState.value = true

        return { success: true, data: updated }
    } catch (error) {
        errorState.value = error
        return { success: false, error }
    } finally {
        loadingState.value = false
    }
}


function clearUserConfig() {
    userConfigState.value = null
    errorState.value = null
    isLoadedState.value = false
}

// Composable – wie ein „Observable + getValue“ in Angular
export function useUserConfig() {
    return {
        userConfig: computed(() => userConfigState.value),
        isUserConfigLoading: computed(() => loadingState.value),
        userConfigError: computed(() => errorState.value),
        isUserConfigLoaded: computed(() => isLoadedState.value),
        refreshUserConfig: fetchUserConfig,
        updateUserConfig,
    }
}

// Optional: für Stellen ohne Composition API (z. B. Router)
export const userConfigService = {
    fetchUserConfig,
    updateUserConfig,
    clearUserConfig,
    getUserConfig: () => userConfigState.value,
    get isLoaded() {
        return isLoadedState.value
    },
}
