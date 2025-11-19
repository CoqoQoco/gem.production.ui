/**
 * Product Routes Module
 * Routes for product management features
 */

const productRoutes = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/common/coming-soon-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Products'
    }
  }
]

export default productRoutes
