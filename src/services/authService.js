// src/services/authService.js
import { ref, computed } from 'vue'
import { httpClient } from './httpClient'
import {userConfigService} from "@/services/userConfigService.js";

// Reaktiver Auth-Status
const isAuthenticatedState = ref(
    !!(localStorage.getItem('token')) || !!(sessionStorage.getItem('token'))
)

// Optional: User-Infos speichern
const currentUser = ref(null)

// HILFSFUNKTION: Daten nach erfolgreichem Login setzen
function setSession(data, stayLoggedIn = false) {
    // TODO: an dein Backend anpassen
    // Ich gehe davon aus: data = { token, user }
    const token = data?.token

    if (!token) {
        throw new Error('Kein Token in der Login-Antwort gefunden.')
    }

    if(!stayLoggedIn) {
        sessionStorage.setItem('token', token)
    } else {
        localStorage.setItem('token', token)
    }
    isAuthenticatedState.value = true

    if (data.user) {
        currentUser.value = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
    }
}

// Bei App-Start evtl. gespeicherten User laden
const storedUser = localStorage.getItem('user')
if (storedUser) {
    try {
        currentUser.value = JSON.parse(storedUser)
    } catch (e) {
        currentUser.value = null
    }
}

// --- Public API ---

async function login(username, password, stayLoggedIn = false) {
    if (!username || !password) {
        return { success: false, message: 'Bitte Benutzername und Passwort eingeben.' }
    }

    try {
        const data = await httpClient.post('/auth/login', {
            name: username,
            password,
        })

        setSession(data, stayLoggedIn)
        await userConfigService.fetchUserConfig()

        return { success: true, data }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Login fehlgeschlagen.',
            status: error.status,
            raw: error.data,
        }
    }
}

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    isAuthenticatedState.value = false
    currentUser.value = null
}

function isAuthenticated() {
    const hasToken = !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
    isAuthenticatedState.value = hasToken
    return hasToken
}

// Für Komponenten (setup)
export function useAuth() {
    return {
        isAuthenticated: computed(() => isAuthenticatedState.value),
        currentUser: computed(() => currentUser.value),
        login,
        logout,
    }
}

// Für Router usw.
export const authService = {
    login,
    logout,
    isAuthenticated,
    getUser: () => currentUser.value,
}
