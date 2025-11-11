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
  }
  // Add more auth routes here (forgot password, reset password, etc.)
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
