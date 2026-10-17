import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
import router from './router'
import './style.css'
import { getAnalytics } from './analytics'

getAnalytics()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createHead())
app.mount('#app')
