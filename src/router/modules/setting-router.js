/**
 * Setting Routes Module
 * Routes for system settings including account management
 */

const settingRoutes = [
  {
    path: '/setting',
    name: 'Setting',
    redirect: '/setting/account',
    meta: {
      requiresAuth: true,
      title: 'Settings'
    },
    children: [
      // Account Management
      {
        path: 'account',
        name: 'AccountManagement',
        component: () => import('@/views/setting/account/account-index.vue'),
        meta: {
          requiresAuth: true,
          title: 'Account Management'
        }
      },

      // Adjust Role Router Permissions
      {
        path: 'adjust-role-router',
        name: 'AdjustRoleRouter',
        component: () => import('@/views/setting/adjust-role-router/adjust-role-router-view.vue'),
        meta: {
          requiresAuth: true,
          title: 'Adjust Role Router'
        }
      },

      // System Settings
      {
        path: 'system',
        name: 'SystemSettings',
        component: () => import('@/views/common/coming-soon-view.vue'),
        meta: {
          requiresAuth: true,
          title: 'System Settings'
        }
      },

      // Master Data - Branch Management
      {
        path: 'master-data/branch',
        name: 'BranchManagement',
        component: () => import('@/views/setting/master-data/branch/branch-index.vue'),
        meta: {
          requiresAuth: true,
          title: 'Branch Management'
        }
      },

      // Master Data - Gem Management
      {
        path: 'master-data/gem',
        name: 'GemManagement',
        component: () => import('@/views/setting/master-data/gem/gem-index.vue'),
        meta: {
          requiresAuth: true,
          title: 'Gem Management'
        }
      },

      // Master Data - Gem Shape Management
      {
        path: 'master-data/gem-shape',
        name: 'GemShapeManagement',
        component: () => import('@/views/setting/master-data/gemShape/gem-shape-index.vue'),
        meta: {
          requiresAuth: true,
          title: 'Gem Shape Management'
        }
      }
    ]
  }
]

export default settingRoutes
