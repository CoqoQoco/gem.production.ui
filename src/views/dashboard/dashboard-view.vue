<template>
  <div class="dashboard-view">
    <!-- Welcome Section -->
    <WelcomeSection
      :user="currentUser"
      :branch="currentBranch"
    />

    <!-- Quick Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <StatsCard
          v-for="stat in quickStats"
          :key="stat.id"
          :stat="stat"
        />
      </div>
    </section>

    <!-- Modules Section -->
    <section class="modules-section">
      <h2 class="section-title">ระบบงานทั้งหมด / All Modules</h2>
      <div class="modules-grid">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
          @click="navigateToModule(module.route)"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'
import WelcomeSection from '@/components/common/WelcomeSection.vue'
import StatsCard from '@/components/common/StatsCard.vue'
import ModuleCard from '@/components/common/ModuleCard.vue'
import { quickStats, modules, branches } from '@/utils/mockData.js'

export default {
  name: 'DashboardView',

  components: {
    WelcomeSection,
    StatsCard,
    ModuleCard
  },

  data() {
    return {
      router: useRouter(),
      toast: useToast(),
      authStore: useAuthStore(),
      quickStats,
      modules
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
    navigateToModule(route) {
      if (route) {
        this.toast.add({
          severity: 'info',
          summary: 'กำลังพัฒนา',
          detail: 'ระบบนี้อยู่ระหว่างการพัฒนา',
          life: 3000
        })
        // TODO: Uncomment when routes are ready
        // this.router.push(route)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-view {
  // Layout is now handled by app-layout.vue
}

// Stats Section
.stats-section {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

// Modules Section
.modules-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
