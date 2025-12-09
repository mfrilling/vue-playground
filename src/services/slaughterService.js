// src/services/authService.js
import { ref } from 'vue'
import { httpClient } from './httpClient'


// Optional: User-Infos speichern
const currentUser = ref(null)


// Bei App-Start evtl. gespeicherten User laden
const storedUser = localStorage.getItem('user')
if (storedUser) {
    try {
        currentUser.value = JSON.parse(storedUser)
    } catch {
        currentUser.value = null
    }
}

// --- Public API ---

async function getSlaughterData(house, housing, scope, page = 0,) {

    try {
        const params = {
            page,
        }
        if (house) {
            params.house = house
        }
        if (house && housing) {
            params.housingDate = housing
        } else if (!house && housing) {
            return
        }
        if (scope) {
            params.coverage = scope
        }

        let response = await httpClient.get('/slaughter', {
            params: params
        })

        return { success: true, data: response }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        console.log('error-case', error)
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Schlachtungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function postSlaughterData(payload) {
    try {
        let response = await httpClient.post('/slaughter', payload)
        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Schlachtungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function deleteSlaughterData(salmonellaData) {
    try {
        let id = salmonellaData?.ID
        let response = await httpClient.delete(`/slaughter/${id}`)

        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Löschen der Schlachtungsdaten.',
            status: error.status,
            raw: error.data
        }
    }
}

async function uploadSlaughterData(file) {
    try {
        const response = await httpClient.postFile('/slaughter', file)
        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Hochladen der Schlachtungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function getSlaughterDetailsData(id) {
    try {
        let response
        if (id) {
            response = await httpClient.get(`/slaughter/${id}`)
        }

        return { success: true, data: response }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Schlachtungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function putSlaughterDetailsData(id, data) {
    try {
        let response = await httpClient.put(`/slaughter/${id}`, data)
        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Schlachtungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}


// Für Komponenten (setup)
export function useSlaughterService() {
    return {
        getSlaughterData,
        postSlaughterData,
        deleteSlaughterData,
        uploadSlaughterData,
        getSlaughterDetailsData,
        putSlaughterDetailsData
    }
}

// Für Router usw.
export const slaugterService = {
    getSlaughterData,
    postSlaughterData,
    deleteSlaughterData,
    uploadSlaughterData,
    getSlaughterDetailsData,
    putSlaughterDetailsData
}
