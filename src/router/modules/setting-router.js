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
      }
    ]
  }
]

export default settingRoutes
