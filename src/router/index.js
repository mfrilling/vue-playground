import {createRouter, createWebHistory} from 'vue-router'

import LoginLayout from "@/layouts/LoginLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";

import LoginView from "@/views/LoginView.vue";
import JournalView from "@/views/JournalView.vue";

import {authService} from '@/services/authService';
import {userConfigService} from "@/services/userConfigService";
import HousingView from "@/views/HousingView.vue";
import HousingDetailsView from "@/views/HousingDetailsView.vue";
import MedicationsView from "@/views/MedicationsView.vue";
import MedicationsDetailsView from "@/views/MedicationsDetailsView.vue";

const routes = [
    {
        path: '/',
        component: LoginLayout,
        children: [
            {
                path: '',
                name: 'login',
                component: LoginView
            },
        ]
    },
    {
        path: '/app',
        component: AppLayout,
        meta: { requiresAuth: true, requiresUserConfig: true },
        children: [
            {
                path: '',
                name: 'journal',
                component: JournalView,
                meta: {isNarrow: true}
            },
            {
                path: 'housings',
                name: 'housings',
                component: HousingView
            },
            {
                // path: 'housings/details/:id?', // ggf für später, wenn zugriff über ID API-Seitig möglich ist
                path: 'housings/details/:house?/:date?',
                name: 'housingDetails',
                component: HousingDetailsView,
                meta: {isNarrow: true},
                props: true, // damit House und Date als prop an die Komponente übergeben wird
            },
            {
                path: 'medications',
                name: 'medications',
                component: MedicationsView
            },
            {
                path: 'medications/details/:id?',
                name: 'medicationDetails',
                component: MedicationsDetailsView,
                meta: {isNarrow: true},
                props: true,
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const loggedIn = authService.isAuthenticated()
    const needsAuth = to.matched.some(record => record.meta.requiresAuth)
    const needsUserConfig = to.matched.some(record => record.meta.requiresUserConfig)

    if (needsAuth && !loggedIn) {
        next('/')
    } else if (to.path === '/' && loggedIn) {
        next('/app')
    }

    try {
        // wenn eingeloggt, Route geschützt & Config noch nicht geladen → nachladen
        if (loggedIn && needsAuth && needsUserConfig && !userConfigService.isLoaded) {
            const result = await userConfigService.fetchUserConfig()

            if (!result.success) {
                // falls Config-Load schiefgeht → z. B. Logout + Login-Seite
                authService.logout()
                return next('/')
            }
        }

        next()
    } catch (e) {
        console.error('Fehler beim Laden der UserConfig:', e)
        authService.logout()
        next('/')
    }
})

export default router