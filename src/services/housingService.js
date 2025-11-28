// src/services/authService.js
import {ref, computed} from 'vue'
import {httpClient} from './httpClient'
import {userConfigService} from "@/services/userConfigService.js";
import {notificationService} from '@/services/notificationService.js'


// Optional: User-Infos speichern
const currentUser = ref(null)


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

async function getHousingData(house, page = 0, flockNumber = '') {

    try {
        const params = {
            page: page,
        }
        if (flockNumber) {
            params.flockNumber = flockNumber
        }
        if (house) {
            params.house = house
        }

        let response = await httpClient.get('/housing', {
            params: params
        })

        console.log('### response in service', response)

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

async function getHousingDetailsData(house, date) {
    try {
        let response
        if (house && date) {
            response = await httpClient.get(`/housing/${house}/${date}`)
        } else if (date) {
            response = await httpClient.get(`/housing/${date}`)
        } else {
            response = await httpClient.get('/housing', {page: page})
        }
        console.log('### response in service', response)

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


// Für Komponenten (setup)
export function useHousingService() {
    return {
        getHousingData,

    }
}

// Für Router usw.
export const housingService = {
    getHousingData,
}
