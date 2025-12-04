// src/services/authService.js
import {ref} from 'vue'
import {httpClient} from './httpClient'


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

async function getHarvestData(house, page = 0,) {

    try {
        const params = {
            page,
        }
        if (house) {
            params.house = house
        }

        let response = await httpClient.get('/harvest', {
            params: params
        })

        return {success: true, data: response}
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function postHarvestData(payload) {
    try {
        let response = await httpClient.post('/harvest', payload)
        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function duplicateHarvestData(medicationdata, targets) {
    try {
        let id = medicationdata?.ID
        let response = await httpClient.post(`/harvest?sourceId=${id}`, targets)

        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Löschen der Einstallungsdaten',
            status: error.status,
            raw: error.data
        }
    }
}

async function deleteHarvestData(salmonellaData) {
    try {
        let id = salmonellaData?.ID
        let response = await httpClient.delete(`/harvest/${id}`)

        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Löschen der Einstallungsdaten',
            status: error.status,
            raw: error.data
        }
    }
}

async function getHarvestDetailsData(id) {
    try {
        let response
        if (id) {
            response = await httpClient.get(`/harvest/${id}`)
        }

        return {success: true, data: response}
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function putHarvestDetailsData(id, data) {
    try {
        let response = await httpClient.put(`/harvest/${id}`, data)
        return {success: true, data: response}
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Einstallungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}


// Für Komponenten (setup)
export function useHarvestService() {
    return {
        getHarvestData,
        postHarvestData,
        duplicateHarvestData,
        deleteHarvestData,
        getHarvestDetailsData,
        putHarvestDetailsData
    }
}

// Für Router usw.
export const salmonellaService = {
    getHarvestData,
    postHarvestData,
    duplicateHarvestData,
    deleteHarvestData,
    getHarvestDetailsData,
    putHarvestDetailsData
}
