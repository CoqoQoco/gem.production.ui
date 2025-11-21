/**
 * Profile Routes Module
 * Routes for user profile management
 */

const profileRoutes = [
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/setting/profile/profile-index.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profile'
    }
  }
]

export default profileRoutes
