import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/style/index.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { Icon } from '@iconify/vue'
import '@/style/variable.scss'
import '@/style/global.scss'
import '@/mocks/data.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('Icon',Icon)

app.mount('#app')
