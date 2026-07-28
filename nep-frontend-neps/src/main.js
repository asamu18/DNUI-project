import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './style.css'
/* 主题放最后，确保覆盖 Vant 默认按钮/导航样式 */
import './theme.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
