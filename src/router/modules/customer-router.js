/**
 * Customer Routes Module
 * Routes for customer management features
 */

const customerRoutes = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/views/customer/customer-index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Customers'
    }
  }
]

export default customerRoutes
