import {createRouter, createWebHistory} from 'vue-router'

import LoginLayout from "@/layouts/LoginLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";

import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import {authService} from '../services/authService';
import UserSettingsView from "@/views/UserSettingsView.vue";
import JournalView from "@/views/JournalView.vue";

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
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'journal',
                component: JournalView
            },
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

router.beforeEach((to, from, next) => {
    const loggedIn = authService.isAuthenticated()
    const needsAuth = to.matched.some(record => record.meta.requiresAuth)

    if (needsAuth && !loggedIn) {
        next('/')
    } else if (to.path === '/' && loggedIn) {
        next('/app')
    } else {
        next()
    }
})

export default router