/**
 * Permission Helper
 * Utilities for checking user permissions and router access
 */

/**
 * Get user data from storage
 * @returns {Object|null} User data or null
 */
export const getUserData = () => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

/**
 * Get all router permissions from user's roles
 * @returns {Array<string>} Array of router names that user can access
 */
export const getUserRouterPermissions = () => {
  const user = getUserData()
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return []
  }

  // Collect all routerAllow arrays from all roles
  const allPermissions = new Set()

  user.roles.forEach(role => {
    if (role.routerAllow && Array.isArray(role.routerAllow)) {
      role.routerAllow.forEach(routerName => {
        allPermissions.add(routerName)
      })
    }
  })

  return Array.from(allPermissions)
}

/**
 * Check if user has permission to access a specific router
 * @param {string} routerName - The router name to check
 * @param {Object} routeMeta - Optional route meta object to check for public/guest routes
 * @returns {boolean} True if user has permission
 */
export const hasRouterPermission = (routerName, routeMeta = null) => {
  if (!routerName) return false

  // Check if route is public or guest-only (no permission required)
  if (routeMeta) {
    if (routeMeta.public === true || routeMeta.requiresGuest === true) {
      return true
    }

    // Check if route should skip permission check
    // Routes with skipPermissionCheck=true require authentication but no specific permission
    if (routeMeta.skipPermissionCheck === true) {
      return true
    }
  }

  const permissions = getUserRouterPermissions()
  return permissions.includes(routerName)
}

/**
 * Check if user has any of the required permissions
 * @param {Array<string>} routerNames - Array of router names to check
 * @returns {boolean} True if user has at least one permission
 */
export const hasAnyRouterPermission = (routerNames) => {
  if (!routerNames || !Array.isArray(routerNames) || routerNames.length === 0) {
    return true // No restrictions
  }

  const permissions = getUserRouterPermissions()
  return routerNames.some(name => permissions.includes(name))
}

/**
 * Check if user has all required permissions
 * @param {Array<string>} routerNames - Array of router names to check
 * @returns {boolean} True if user has all permissions
 */
export const hasAllRouterPermissions = (routerNames) => {
  if (!routerNames || !Array.isArray(routerNames) || routerNames.length === 0) {
    return true // No restrictions
  }

  const permissions = getUserRouterPermissions()
  return routerNames.every(name => permissions.includes(name))
}

/**
 * Filter routes based on user permissions
 * Automatically allows public, guest-only, and skipPermissionCheck routes
 * @param {Array} routes - Array of route objects
 * @returns {Array} Filtered routes that user has permission to access
 */
export const filterRoutesByPermission = (routes) => {
  if (!routes || !Array.isArray(routes)) return []

  const permissions = getUserRouterPermissions()

  return routes.filter(route => {
    // If no name, don't filter (might be parent route)
    if (!route.name) return true

    // Allow public routes (no authentication required)
    if (route.isPublic === true || route.meta?.public === true) {
      return true
    }

    // Allow guest-only routes (login, register pages)
    if (route.requiresGuest === true || route.meta?.requiresGuest === true) {
      return true
    }

    // Allow routes that skip permission check (require auth but no specific permission)
    if (route.meta?.skipPermissionCheck === true) {
      return true
    }

    // For protected routes, check if user has permission
    return permissions.includes(route.name)
  })
}

/**
 * Check if current user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const user = getUserData()
  const token = localStorage.getItem('token-gem')
  return !!(user && token)
}

/**
 * Get user roles
 * @returns {Array} Array of role objects
 */
export const getUserRoles = () => {
  const user = getUserData()
  return user?.roles || []
}

/**
 * Check if user has a specific role by role name
 * @param {string} roleName - Role name to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (roleName) => {
  const roles = getUserRoles()
  return roles.some(role => role.roleName === roleName)
}

/**
 * Check if user has any of the specified roles
 * @param {Array<string>} roleNames - Array of role names
 * @returns {boolean} True if user has at least one role
 */
export const hasAnyRole = (roleNames) => {
  if (!roleNames || !Array.isArray(roleNames) || roleNames.length === 0) {
    return true
  }

  const roles = getUserRoles()
  return roleNames.some(roleName =>
    roles.some(role => role.roleName === roleName)
  )
}
