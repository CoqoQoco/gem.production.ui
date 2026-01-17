<template>
  <div class="app-header">
    <div class="app-header-content">
      <!-- Left Section -->
      <div class="header-left">
        <!-- Menu Toggle Button -->
        <button
          class="menu-toggle-btn"
          @click="toggleSidebar"
          :aria-label="$t('dashboard.toggleMenu')"
        >
          <i class="pi pi-bars"></i>
        </button>

        <!-- Logo & Brand -->
        <div class="brand-section">
          <img src="@/assets/images/logo.png" alt="Logo" class="brand-logo" />
          <h1 class="brand-title">{{ $t('dashboard.brandName') }}</h1>
        </div>
      </div>

      <!-- Right Section -->
      <div class="header-actions">
        <!-- Notification Bell -->
        <button
          class="notification-btn"
          @click="toggleNotifications"
          :aria-label="$t('dashboard.notifications')"
        >
          <i class="pi pi-bell"></i>
          <span v-if="notificationCount > 0" class="notification-badge">
            {{ notificationCount }}
          </span>
        </button>

        <!-- User Menu -->
        <div class="user-menu">
          <button class="user-avatar" @click="toggleUserMenu" ref="userMenuBtn">
            <span class="avatar-text">{{ user.avatar }}</span>
            <span class="user-name">{{ user.name }}</span>
            <i class="pi pi-chevron-down" :class="{ 'rotate': showUserMenu }"></i>
          </button>

          <!-- User Dropdown Menu -->
          <transition name="fade-slide">
            <div v-if="showUserMenu" class="user-dropdown" ref="userDropdown">
              <div class="user-info">
                <div class="user-info-avatar">{{ user.avatar }}</div>
                <div class="user-info-details">
                  <p class="user-info-name">{{ user.fullName }}</p>
                  <p class="user-info-role">{{ $t(`dashboard.roles.${user.role}`) }}</p>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="goToProfile">
                <i class="pi pi-user"></i>
                <span>{{ $t('dashboard.profile') }}</span>
              </button>
              <button class="dropdown-item" @click="goToResetPassword">
                <i class="pi pi-lock"></i>
                <span>{{ $t('auth.resetPassword.title') }}</span>
              </button>
              <button class="dropdown-item" @click="goToSettings">
                <i class="pi pi-cog"></i>
                <span>{{ $t('dashboard.settings') }}</span>
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="handleLogout">
                <i class="pi pi-sign-out"></i>
                <span>{{ $t('dashboard.logout') }}</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'AppHeader',

  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        name: 'User',
        fullName: 'User Name',
        role: 'user',
        avatar: 'U'
      })
    },
    notificationCount: {
      type: Number,
      default: 0
    }
  },

  emits: ['toggle-sidebar'],

  data() {
    return {
      showUserMenu: false,
      authStore: useAuthStore(),
      router: useRouter(),
      toast: useToast()
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar')
    },

    toggleNotifications() {
      // TODO: Implement notification panel
      console.log('Toggle notifications')
    },

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },

    goToProfile() {
      this.showUserMenu = false
      this.router.push('/profile')
    },

    goToResetPassword() {
      this.showUserMenu = false
      this.router.push('/reset-password')
    },

    goToSettings() {
      this.showUserMenu = false
      this.router.push('/settings')
    },

    async handleLogout() {
      this.showUserMenu = false

      try {
        // Call logout from auth store
        await this.authStore.logout()

        this.toast.add({
          severity: 'success',
          summary: this.$t('common.success'),
          detail: this.$t('auth.login.logoutSuccess'),
          life: 2000
        })

        setTimeout(() => {
          this.router.push('/login')
        }, 1000)
      } catch (error) {
        console.error('Logout error:', error)
        this.toast.add({
          severity: 'error',
          summary: this.$t('common.error'),
          detail: this.$t('auth.login.logoutError'),
          life: 3000
        })
      }
    },

    // Close dropdown when clicking outside
    handleClickOutside(event) {
      const userMenuBtn = this.$refs.userMenuBtn
      const userDropdown = this.$refs.userDropdown

      if (
        userMenuBtn &&
        userDropdown &&
        !userMenuBtn.contains(event.target) &&
        !userDropdown.contains(event.target)
      ) {
        this.showUserMenu = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.app-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  max-width: 1920px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  i {
    font-size: 20px;
    color: #374151;
  }

  &:hover {
    background-color: #f3f4f6;
  }

  &:active {
    background-color: #e5e7eb;
  }
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  color: #e7de99;
  margin: 0;

  @media (max-width: 768px) {
    display: none;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  i {
    font-size: 20px;
    color: #6b7280;
  }

  .notification-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    background-color: #ef4444;
    border-radius: 9px;
    border: 2px solid white;
  }
}

.user-menu {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 6px;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  .avatar-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
    border-radius: 50%;
  }

  .user-name {
    font-weight: 600;
    color: #374151;

    @media (max-width: 768px) {
      display: none;
    }
  }

  i {
    font-size: 12px;
    color: #6b7280;
    transition: transform 0.2s;

    &.rotate {
      transform: rotate(180deg);
    }
  }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(239, 233, 201, 0.15) 0%, rgba(239, 233, 201, 0.15) 100%);
}

.user-info-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 20px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #efe9c9 0%, #efe9c9 100%);
  border-radius: 50%;
}

.user-info-details {
  flex: 1;
}

.user-info-name {
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.user-info-role {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  color: #374151;

  i {
    font-size: 16px;
    color: #6b7280;
  }

  &:hover {
    background-color: #f3f4f6;
  }

  &.logout {
    color: #ef4444;

    i {
      color: #ef4444;
    }

    &:hover {
      background-color: #fef2f2;
    }
  }
}

// Transition
.fade-slide-enter-active {
  transition: all 0.2s ease;
}

.fade-slide-leave-active {
  transition: all 0.15s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
