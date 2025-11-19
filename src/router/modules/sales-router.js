/**
 * Sales Routes Module
 * Routes for sales management features
 */

const salesRoutes = [
  {
    path: '/sales',
    name: 'Sales',
    redirect: '/sales/orders',
    meta: {
      requiresAuth: true,
      title: 'Sales Management'
    }
  },
  {
    path: '/sales/orders',
    name: 'SalesOrder',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Sales Order'
    }
  },
  {
    path: '/sales/quotation',
    name: 'Quotation',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Quotation'
    }
  },
  {
    path: '/sales/invoice',
    name: 'Invoice',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Invoice'
    }
  }
]

export default salesRoutes
