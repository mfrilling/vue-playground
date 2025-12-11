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
const BASE_PATH = '/feedDelivery'

// --- Public API ---

async function getFoodDeliveryData(facility, silo, page = 0,) {

    try {
        const params = {
            page,
        }
        if (facility) {
            params.facility = facility
        }
        if (silo) {
            params.silo = silo
        }

        let response = await httpClient.get(BASE_PATH, {
            params: params
        })

        return { success: true, data: response }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Futterlieferungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function postFoodDeliveryData(payload) {
    try {
        let response = await httpClient.post(BASE_PATH, payload)
        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Futterlieferungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function deleteFoodDeliveryData(delivery) {
    try {
        let response = await httpClient.delete(`/${BASE_PATH}/${(delivery?.ID)}`)

        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Löschen der Futterlieferungsdaten.',
            status: error.status,
            raw: error.data
        }
    }
}

async function getFoodDeliveryDetailsData(id) {
    try {
        let response
        if (id) {
            response = await httpClient.get(`/${BASE_PATH}/${id}`)
        }

        return { success: true, data: response }
    } catch (error) {
        // Fehlertext vom Backend oder Fallback
        return {
            success: false,
            message: error.message || 'Fehler beim Abruf der Futterlieferungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}

async function putFoodDeliveryDetailsData(id, data) {
    try {
        let response = await httpClient.put(`/${BASE_PATH}/${id}`, data)
        return { success: true, data: response }
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Fehler beim Speichern der Futterlieferungsdaten.',
            status: error.status,
            raw: error.data,
        }
    }
}


// Für Komponenten (setup)
export function useFoodDeliveryService() {
    return {
        getFoodDeliveryData,
        postFoodDeliveryData,
        deleteFoodDeliveryData,
        getFoodDeliveryDetailsData,
        putFoodDeliveryDetailsData
    }
}

// Für Router usw.
export const foodDeliveryService = {
    getFoodDeliveryData,
    postFoodDeliveryData,
    deleteFoodDeliveryData,
    getFoodDeliveryDetailsData,
    putFoodDeliveryDetailsData
}
