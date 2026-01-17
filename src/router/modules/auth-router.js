/**
 * Authentication Routes Module
 * Routes for login, register, forgot password, etc.
 */

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login/login-view.vue'),
    meta: {
      requiresGuest: true,
      title: 'Login',
      public: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/register/register-view.vue'),
    meta: {
      requiresGuest: true,
      title: 'Register',
      public: false
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/reset-password/reset-password-view.vue'),
    meta: {
      requiresAuth: true,
      title: 'Reset Password',
      skipPermissionCheck: true // Allow all authenticated users to reset their password
    }
  }
  // Add more auth routes here (forgot password, etc.)
  // {
  //   path: '/forgot-password',
  //   name: 'ForgotPassword',
  //   component: () => import('@/views/auth/forgot-password/forgot-password-view.vue'),
  //   meta: {
  //     requiresGuest: true,
  //     title: 'Forgot Password'
  //   }
  // }
]
