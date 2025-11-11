/**
 * Dashboard Module Routes
 * Main dashboard and overview routes
 *
 * Access Control:
 * - Requires authentication
 * - Accessible by: all authenticated users
 */

export default [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/dashboard-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      roles: ['admin', 'manager', 'user', 'staff'], // All authenticated users
      module: 'dashboard'
    }
  }
]
