// src/services/httpClient.js
import { ref, computed } from 'vue'

const API_PREFIX = '/api/v1'

// 🔥 globaler Request-Zähler
const activeRequests = ref(0)

let httpRouter = null

export function registerHttpRouter(router) {
    httpRouter = router
}

function startRequest() {
    activeRequests.value++
}

function endRequest() {
    // falls mal was schief läuft, nicht unter 0 gehen
    activeRequests.value = Math.max(0, activeRequests.value - 1)
}

// Composable, um den Status in Komponenten zu nutzen
export function useHttpLoading() {
    return {
        isHttpLoading: computed(() => activeRequests.value > 0),
        activeRequests: computed(() => activeRequests.value),
    }
}

function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function buildUrl(path, params) {
    let url = API_PREFIX
    console.log(path);

    if (path.startsWith('/')) {
        url += path
    } else {
        url += '/' + path
    }

    if (params && typeof params === 'object') {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value))
            }
        })
        const query = searchParams.toString()
        if (query) {
            url += `?${query}`
        }
    }

    return url
}

async function request(method, path, { body, params, headers } = {}) {
    const url = buildUrl(path, params)

    const token = getAuthToken()

    const finalHeaders = {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(headers || {}),
    }

    if (token) {
        finalHeaders['Authorization'] = `Bearer ${token}`
    }

    const options = {
        method,
        headers: finalHeaders,
        ...(body ? { body: JSON.stringify(body) } : {}),
        // credentials: 'include', // falls du Sessions nutzt
    }

    // ▶️ Request startet
    startRequest()

    try {
        const response = await fetch(url, options)

        if (response.status === 204) {
            return null
        }

        let data
        try {
            data = await response.json()
        } catch {
            throw new Error(`Ungültige Antwort vom Server (Status ${response.status})`)
        }

        if (!response.ok) {
            const message =
                data?.message ||
                data?.error ||
                `Request fehlgeschlagen (Status ${response.status})`
            const error = new Error(message)
            error.status = response.status
            error.data = data

            if (error.status === 401) {
                localStorage.removeItem('token')
                httpRouter.push('/')
            }

            throw error
        }

        return data
    } finally {
        // egal ob Erfolg oder Fehler – Request ist fertig
        endRequest()
    }
}

export const httpClient = {
    get(path, options = {}) {
        return request('GET', path, options)
    },
    post(path, body, options = {}) {
        return request('POST', path, { ...options, body })
    },
    put(path, body, options = {}) {
        return request('PUT', path, { ...options, body })
    },
    patch(path, body, options = {}) {
        return request('PATCH', path, { ...options, body })
    },
    delete(path, options = {}) {
        return request('DELETE', path, options)
    },
}
