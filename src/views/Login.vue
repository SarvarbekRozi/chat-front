<template>
  <div class="login-container">

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label>Login</label>
        <input
            type="text"
            v-model="login"
            placeholder="Loginni kiriting"
            required
        />
      </div>

      <div class="form-group">
        <label>Parol</label>
        <input
            type="password"
            v-model="password"
            placeholder="Parolni kiriting"
            required
        />
      </div>

      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="rememberMe" />
          Meni eslab qol
        </label>
        <a href="#" class="forgot-password">Parolni unutdingizmi?</a>
      </div>

      <div v-if="errorMessage" style="color: red; margin-bottom: 1rem;">
        {{ errorMessage }}
      </div>

      <button type="submit" class="login-button" :disabled="loading">
        <span v-if="loading">⏳ Kirilmoqda...</span>
        <span v-else>Kirish</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../plugins/axios'

const router = useRouter()

const login = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await api.post('/auth/login', {
      login: login.value,
      password: password.value
    })
    const user = response.data.data.user
    localStorage.setItem('token', response.data.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
      router.push('/dashboard')

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login yoki parol noto‘g‘ri!'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  margin-top: 165px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #444;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
}

.forgot-password {
  color: #0066cc;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  background-color: #0066cc;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #0052a3;
}
</style>
