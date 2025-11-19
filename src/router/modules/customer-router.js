/**
 * Customer Routes Module
 * Routes for customer management features
 */

const customerRoutes = [
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Customers'
    }
  }
]

export default customerRoutes
