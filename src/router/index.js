// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// Komponentlarni import qilamiz
import Dashboard from '../views/Dashboard.vue'

import Login from "../views/Login.vue";

import MainLayout from "../layouts/MainLayout.vue"
import {ref} from "vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children:[
            { path: 'dashboard', component: Dashboard },
        ]
    },
    { path: '/login', component: Login }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const user = ref(JSON.parse(localStorage.getItem('user')))
    if (to.meta.requiresAuth && !token) {
        return next('/login')
    }

    next()
})

export default router
