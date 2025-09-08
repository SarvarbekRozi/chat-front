<template>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <img src="../assets/marvarid-logo.png" alt="" width="70" height="70" style="margin-right: 10px;">
          <h2>Chat</h2>
        </div>
        <button @click="toggleSidebar" class="sidebar-toggle">
          <span class="toggle-icon">☰</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/dashboard" active-class="active">
              <Home class="nav-icon" />
              <span class="nav-text">Chat</span>
            </router-link>
          </li>

          <li>
            <a href="javascript:void(0)" @click="logout">
              <LogOut class="nav-icon" style="color: red"/>
              <span class="nav-text" style="color: red">Chiqish</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'content-expanded': sidebarCollapsed }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, Package, Wallet, ShoppingCart, BadgeDollarSign, Boxes, BarChart2, Settings, Truck, LogOut,PackageOpen,Users
} from 'lucide-vue-next'
import { toast } from "vue3-toastify"
import api from '../plugins/axios'

const sidebarCollapsed = ref(false)
const router = useRouter()

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
const user = ref(JSON.parse(localStorage.getItem('user')))

const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch (err:any) {
    console.error('Logoutda xatolik:', err)
    toast.error(err.response?.data?.message || "Chiqishda xatolik")
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.sidebar {
  width: 260px;

  background:#f0f4f8;
  color: black;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.logo{
  display: flex;
  align-items: center;
}
.logo h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.sidebar-collapsed .logo h2 {
  display: none;
}
.sidebar-collapsed .logo {
  width: 30px;
  height: 30px;
}
.sidebar-toggle {
  background: none;
  border: none;
  color: black;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.sidebar-nav li {
  margin: 0;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.sidebar-nav a:hover {
  background-color:  #e0e7ff;
  color: #1e3a8a;
}

.sidebar-nav a.active {
  background:  linear-gradient(135deg, #3b82f6, #1e40af);;
  color: white;
}

.sidebar-nav a.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #fbbf24;
}

.nav-icon {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

.content-expanded {
  margin-left: 70px;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-collapsed {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}
</style>