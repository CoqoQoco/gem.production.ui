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
      }
      // Add more setting routes here in the future
      // {
      //   path: 'system',
      //   name: 'SystemSettings',
      //   component: () => import('@/views/setting/system/system-index.vue'),
      //   meta: {
      //     requiresAuth: true,
      //     title: 'System Settings'
      //   }
      // }
    ]
  }
]

export default settingRoutes
