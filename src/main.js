import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {i18nService} from "@/services/i18nService.js";
import {registerHttpRouter} from "./services/httpClient.js";

async function bootstrap() {
    registerHttpRouter(router)
    const app = createApp(App)
    app.use(router)

    app.config.globalProperties.$t = (key, params) => i18nService.t(key, params)

    // initial loading of translations
    i18nService.loadMessages('de') // initialize with german, no await because app can already render

    app.mount('#app')
}

bootstrap()
