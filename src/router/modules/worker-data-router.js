/**
 * Worker Data Module Routes
 * Routes for managing worker data (guides, sales staff, drivers)
 *
 * Access Control:
 * - Requires authentication
 * - Accessible by: admin, manager roles
 */

export default [
  {
    path: 'worker-data/guides',
    name: 'GuideList',
    component: () => import('@/views/worker-data/guides/GuideList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Guide List',
      roles: ['admin', 'manager'], // Only admin and manager can access
      module: 'worker-data'
    }
  },
  {
    path: 'worker-data/sales',
    name: 'SalesList',
    component: () => import('@/views/worker-data/sales/SalesList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Sales Staff List',
      roles: ['admin', 'manager'],
      module: 'worker-data'
    }
  },
  {
    path: 'worker-data/drivers',
    name: 'DriverList',
    component: () => import('@/views/worker-data/drivers/DriverList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Driver List',
      roles: ['admin', 'manager'],
      module: 'worker-data'
    }
  }
]
