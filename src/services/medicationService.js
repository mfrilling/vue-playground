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

async function getMedicationData(house, page = 0, housing = '', type = '') {

    try {
        const params = {
            page,
        }
        if (housing) {
            params.housing = housing
        }
        if (type) {
            params.type = type
        }
        if (house) {
            params.house = house
        }

        let response = await httpClient.get('/medication', {
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

async function postMedicationData(payload) {
    try {
        let response = await httpClient.post('/medication', payload)
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

async function duplicateMedicationData(medicationdata, targets) {
    try {
        let id = medicationdata?.ID
        let response = await httpClient.post(`/medication?sourceId=${id}`, targets)

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

async function deleteMedicationData(medicationdata) {
    try {
        let id = medicationdata?.ID
        let response = await httpClient.delete(`/medication/${id}`)

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

async function getMedicationDetailsData(id) {
    try {
        let response
        if (id) {
            response = await httpClient.get(`/medication/${id}`)
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

async function putMedicationDetailsData(house, date, data) {
    try {
        let response = await httpClient.put(`/medication/${house}/${date}`, data)
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
export function useMedicationService() {
    return {
        getMedicationData,
        postMedicationData,
        duplicateMedicationData,
        deleteMedicationData,
        getMedicationDetailsData,
        putMedicationDetailsData
    }
}

// Für Router usw.
export const medicationService = {
    getMedicationData,
    postMedicationData,
    duplicateMedicationData,
    deleteMedicationData,
    getMedicationDetailsData,
    putMedicationDetailsData
}
