<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <app-sidebar
      :isOpen="sidebarOpen"
      @close="closeSidebar"
    />

    <!-- Main Container -->
    <div class="main-container">
      <!-- Header -->
      <app-header
        :user="currentUser"
        :notificationCount="notificationCount"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Content Area -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/common/app-header.vue'
import AppSidebar from '@/components/common/app-sidebar.vue'
import { branches } from '@/utils/mockData.js'

export default {
  name: 'AppLayout',

  components: {
    AppHeader,
    AppSidebar
  },

  data() {
    return {
      sidebarOpen: false,
      notificationCount: 5, // TODO: Get from API
      authStore: useAuthStore()
    }
  },

  computed: {
    currentUser() {
      // Get user from auth store first
      if (this.authStore.user) {
        const user = this.authStore.user
        return {
          name: user.username || 'User',
          fullName: user.fullName || user.username || 'User',
          role: user.role || 'user',
          avatar: user.avatar || (user.username ? user.username.charAt(0).toUpperCase() : 'U'),
          branchId: user.branchId || 1
        }
      }

      // Fallback to localStorage if store is not populated
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          return {
            name: user.username || 'User',
            fullName: user.fullName || user.username || 'User',
            role: user.role || 'user',
            avatar: user.avatar || (user.username ? user.username.charAt(0).toUpperCase() : 'U'),
            branchId: user.branchId || 1
          }
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }

      // Default user
      return {
        name: 'Guest',
        fullName: 'Guest User',
        role: 'user',
        avatar: 'G',
        branchId: 1
      }
    },

    currentBranch() {
      const branch = branches.find(b => b.value === this.currentUser.branchId)
      return branch ? branch.label : 'สาขาสำนักงานใหญ่'
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    closeSidebar() {
      this.sidebarOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(255, 235, 240, 0.3) 0%,
    rgba(255, 218, 224, 0.3) 50%,
    rgba(255, 240, 245, 0.3) 100%
  );
  background-attachment: fixed;
}

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
}
</style>
