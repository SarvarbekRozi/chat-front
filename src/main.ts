import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { VMoney } from 'v-money3'
import 'vue3-toastify/dist/index.css'
import Vue3Toastify from 'vue3-toastify'
import { MaskInput } from 'vue-3-mask';


const app = createApp(App)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    transition: "slide",
    theme: "light"
})
app.directive('money', VMoney)
app.component('MaskInput', MaskInput)
app.mount('#app')
