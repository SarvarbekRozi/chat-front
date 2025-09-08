import axios from 'axios'
import router from '../router'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Accept': 'application/json'
    }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

let isRedirecting = false

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && !isRedirecting) {
            isRedirecting = true
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push({ path: '/login' })
        }
        return Promise.reject(error)
    }
)

export default api
