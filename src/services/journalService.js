// src/services/authService.js
import { ref, computed } from 'vue'
import { httpClient } from './httpClient'
import {userConfigService} from "@/services/userConfigService.js";



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

async function getJournalData(house, date) {
    if (!house || !date) {
        return {success: false, message: 'Es wurde kein Haus oder kein Datum angegeben.'}
    }

    try {
        const data = await httpClient.get(`/journal/${house}/${date}/`)

        return {success: true, data}
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Journaldaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

// Für Komponenten (setup)
export function useJournalService() {
    return {
        getJournalData,
    }
}

// Für Router usw.
export const journalService = {
    getJournalData,
}
