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
      skipPermissionCheck: true, // Allow all authenticated users to access their profile
      title: 'Profile'
    }
  }
]

export default profileRoutes
