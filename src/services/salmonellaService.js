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

async function getSalmonellaData(house, page = 0,) {

    try {
        const params = {
            page,
        }
        if (house) {
            params.house = house
        }

        let response = await httpClient.get('/salmonellaSample', {
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

async function postSalmonellaData(payload) {
    try {
        let response = await httpClient.post('/salmonellaSample', payload)
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

async function duplicateSalmonellaData(medicationdata, targets) {
    try {
        let id = medicationdata?.ID
        let response = await httpClient.post(`/salmonellaSample?sourceId=${id}`, targets)

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

async function deleteSalmonellaData(salmonellaData) {
    try {
        let id = salmonellaData?.ID
        let response = await httpClient.delete(`/salmonellaSample/${id}`)

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

async function getSalmonellaDetailsData(id) {
    try {
        let response
        if (id) {
            response = await httpClient.get(`/salmonellaSample/${id}`)
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

async function putSalmonellaDetailsData(id, data) {
    try {
        let response = await httpClient.put(`/salmonellaSample/${id}`, data)
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
export function useSalmonellaService() {
    return {
        getSalmonellaData,
        postSalmonellaData,
        duplicateSalmonellaData,
        deleteSalmonellaData,
        getSalmonellaDetailsData,
        putSalmonellaDetailsData
    }
}

// Für Router usw.
export const salmonellaService = {
    getSalmonellaData,
    postSalmonellaData,
    duplicateSalmonellaData,
    deleteSalmonellaData,
    getSalmonellaDetailsData,
    putSalmonellaDetailsData
}
