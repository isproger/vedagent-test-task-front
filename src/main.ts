import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import './assets/css/main.css'
import App from './App.vue'

const app = createApp(App)
app.use(Antd)
app.mount('#app')

