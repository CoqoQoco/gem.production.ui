/**
 * Reports Routes Module
 * Routes for reporting features
 */

const reportsRoutes = [
  {
    path: '/reports',
    name: 'Reports',
    redirect: '/reports/daily',
    meta: {
      requiresAuth: true,
      title: 'Reports'
    }
  },
  {
    path: '/reports/daily',
    name: 'DailyReport',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Daily Report'
    }
  },
  {
    path: '/reports/monthly',
    name: 'MonthlyReport',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Monthly Report'
    }
  },
  {
    path: '/reports/sales',
    name: 'SalesReport',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Sales Report'
    }
  },
  {
    path: '/reports/inventory',
    name: 'InventoryReport',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Inventory Report'
    }
  }
]

export default reportsRoutes
