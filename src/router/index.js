import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { hasRouterPermission, isAuthenticated as checkAuth } from '@/utils/permissionHelper'

// Import route modules
import authRoutes from './modules/auth-router'
import dashboardRoutes from './modules/dashboard-router'
import workerDataRoutes from './modules/worker-data-router'
import settingRoutes from './modules/setting-router'
import salesRoutes from './modules/sales-router'
import inventoryRoutes from './modules/inventory-router'
import reportsRoutes from './modules/reports-router'
import customerRoutes from './modules/customer-router'
import productRoutes from './modules/product-router'
import profileRoutes from './modules/profile-router'

const routes = [
  {
    path: '/',
    redirect: () => {
      // Redirect to dashboard if authenticated, otherwise to login
      const user = localStorage.getItem('user') || sessionStorage.getItem('user')
      const token = localStorage.getItem('token-gem')
      const isAuthenticated = user && token
      return isAuthenticated ? '/dashboard' : '/login'
    }
  },

  // ========================================
  // Auth Routes (Guest Only)
  // ========================================
  ...authRoutes,

  // ========================================
  // Protected Routes (Require Authentication)
  // All routes wrapped in AppLayout
  // ========================================
  {
    path: '/',
    component: () => import('@/components/common/app-layout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      // Dashboard Module
      ...dashboardRoutes,

      // Worker Data Module
      ...workerDataRoutes,

      // Setting Module
      ...settingRoutes,

      // Sales Module
      ...salesRoutes,

      // Inventory Module
      ...inventoryRoutes,

      // Reports Module
      ...reportsRoutes,

      // Customer Module
      ...customerRoutes,

      // Product Module
      ...productRoutes,

      // Profile Module
      ...profileRoutes
    ]
  },

  // Example: Sales Module Routes
  // {
  //   path: '/sales',
  //   name: 'Sales',
  //   component: () => import('@/views/sales/SalesView.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Sales'
  //   }
  // },

  // Example: Inventory Module Routes
  // {
  //   path: '/inventory',
  //   name: 'Inventory',
  //   component: () => import('@/views/inventory/InventoryView.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Inventory',
  //     // Optional: Add role-based permissions
  //     // roles: ['admin', 'manager']
  //   }
  // },

  // Example: Reports Module Routes
  // {
  //   path: '/reports',
  //   name: 'Reports',
  //   component: () => import('@/views/reports/ReportsView.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Reports'
  //   },
  //   children: [
  //     {
  //       path: 'daily',
  //       name: 'DailyReport',
  //       component: () => import('@/views/reports/DailyReportView.vue'),
  //       meta: {
  //         requiresAuth: true,
  //         title: 'Daily Report'
  //       }
  //     }
  //   ]
  // },

  // ========================================
  // Public Routes (No Authentication Required)
  // ========================================
  // Example: About Page
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/public/AboutView.vue'),
  //   meta: {
  //     public: true,
  //     title: 'About Us'
  //   }
  // },

  // ========================================
  // 404 Not Found
  // ========================================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: () => {
      // Redirect 404 based on auth status
      const isAuthenticated = localStorage.getItem('user')
      return isAuthenticated ? '/dashboard' : '/login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper function to check authentication
const isAuthenticated = () => {
  // Check both localStorage and sessionStorage
  const userFromLocalStorage = localStorage.getItem('user')
  const userFromSessionStorage = sessionStorage.getItem('user')
  const token = localStorage.getItem('token-gem')

  const user = userFromLocalStorage || userFromSessionStorage

  // Must have both user data and token
  if (!user || !token) return false

  try {
    // Validate that stored data is valid JSON
    JSON.parse(user)
    return true
  } catch (error) {
    // If invalid JSON, clear storage
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    localStorage.removeItem('token-gem')
    return false
  }
}

// Helper function to get user data
const getUserData = () => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

// Helper function to check if user has required role
const hasRequiredRole = (userRole, requiredRoles) => {

  //bypass
  //return false
  // If no roles specified, allow access
  if (!requiredRoles || requiredRoles.length === 0) return true

  // Check if user role is in the required roles
  return requiredRoles.includes(userRole)
}

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated()
  const userData = getUserData()
  const userRole = userData?.role || null

  console.log(`[Router Guard] Navigating from ${from.path} to ${to.path}`)
  console.log(`[Router Guard] Authenticated:`, authenticated)
  console.log(`[Router Guard] User Role:`, userRole)
  console.log(`[Router Guard] Route meta:`, to.meta)

  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Jewelry POS System`
  } else {
    document.title = 'Jewelry POS System'
  }

  // Check if route is public (doesn't require authentication)
  const isPublicRoute = to.meta.public === true

  // Check if route is for guests only (login, register)
  if (to.meta.requiresGuest) {
    if (authenticated) {
      // Already authenticated, redirect to dashboard
      console.log(`[Router Guard] Guest route but authenticated, redirecting to dashboard`)
      next('/dashboard')
    } else {
      console.log(`[Router Guard] Guest route, allowing access`)
      next()
    }
  }
  // Check if route explicitly requires authentication
  else if (to.meta.requiresAuth === true) {
    if (!authenticated) {
      // Not authenticated, redirect to login
      console.log(`[Router Guard] Protected route but not authenticated, redirecting to login`)
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Save intended destination
      })
    } else {
      // Check if route should skip permission check
      if (to.meta.skipPermissionCheck === true) {
        console.log(`[Router Guard] Route skips permission check, allowing access`)
        next()
        return
      }

      // Check router permission if route has a name
      if (to.name) {
        const hasPermission = hasRouterPermission(to.name, to.meta)

        if (!hasPermission) {
          // User doesn't have permission to access this route
          console.log(`[Router Guard] Access denied: no permission for route "${to.name}"`)
          console.log(`[Router Guard] Redirecting to dashboard`)

          next({
            path: '/dashboard',
            replace: true
          })
          return
        }
      }

      console.log(`[Router Guard] Protected route and authenticated with valid permission, allowing access`)
      next()
    }
  }
  // Public routes (explicitly marked as public)
  else if (isPublicRoute) {
    console.log(`[Router Guard] Public route, allowing access`)
    next()
  }
  // Default behavior: all other routes require authentication
  else {
    if (!authenticated) {
      // Not authenticated, redirect to login
      console.log(`[Router Guard] Default: not authenticated, redirecting to login`)
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      console.log(`[Router Guard] Default: authenticated, allowing access`)
      next()
    }
  }
})

// After navigation hook (optional - for scroll behavior)
router.afterEach(() => {
  // Scroll to top after navigation
  window.scrollTo(0, 0)
})

export default router
