import router from '@/router'

/**
 * Router Helper Utilities
 * Functions to extract and manage router information
 */

/**
 * Get all available routes from Vue Router
 * @returns {Array} Array of route objects with name, path, title, and meta info
 */
export const getAllRoutes = () => {
  const routes = []
  const routerRoutes = router.getRoutes()

  routerRoutes.forEach(route => {
    // Only include routes that have a name (exclude redirects and layouts)
    if (route.name && route.name !== 'NotFound') {
      routes.push({
        name: route.name,
        path: route.path,
        title: route.meta?.title || route.name,
        requiresAuth: route.meta?.requiresAuth || false,
        requiresGuest: route.meta?.requiresGuest || false,
        isPublic: route.meta?.public || false,
        module: extractModuleName(route.path),
        description: route.meta?.description || null
      })
    }
  })

  return routes
}

/**
 * Get only protected routes (routes that require authentication)
 * @returns {Array} Array of protected route objects
 */
export const getProtectedRoutes = () => {
  return getAllRoutes().filter(route => route.requiresAuth === true)
}

/**
 * Get routes grouped by module
 * @returns {Object} Object with module names as keys and arrays of routes as values
 */
export const getRoutesGroupedByModule = () => {
  const routes = getAllRoutes()
  const grouped = {}

  routes.forEach(route => {
    const module = route.module || 'Other'
    
    if (!grouped[module]) {
      grouped[module] = []
    }
    
    grouped[module].push(route)
  })

  return grouped
}

/**
 * Get only route names (useful for role permissions)
 * @param {boolean} protectedOnly - If true, only return protected routes
 * @returns {Array<string>} Array of route names
 */
export const getRouteNames = (protectedOnly = false) => {
  const routes = protectedOnly ? getProtectedRoutes() : getAllRoutes()
  return routes.map(route => route.name)
}

/**
 * Extract module name from route path
 * @param {string} path - Route path
 * @returns {string} Module name
 */
function extractModuleName(path) {
  // Remove leading slash and split by slash
  const parts = path.replace(/^\//, '').split('/')
  
  // If path is just '/' return 'Root'
  if (parts.length === 0 || parts[0] === '') {
    return 'Root'
  }
  
  // Return first part capitalized
  const moduleName = parts[0]
  return moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
}

/**
 * Check if a route name exists
 * @param {string} routeName - Route name to check
 * @returns {boolean} True if route exists
 */
export const routeExists = (routeName) => {
  const routeNames = getRouteNames()
  return routeNames.includes(routeName)
}

/**
 * Get route info by name
 * @param {string} routeName - Route name
 * @returns {Object|null} Route object or null if not found
 */
export const getRouteByName = (routeName) => {
  const routes = getAllRoutes()
  return routes.find(route => route.name === routeName) || null
}

/**
 * Format routes for display in UI (with module grouping)
 * Returns structure suitable for tree view or grouped checkboxes
 * @returns {Array} Array of modules with their routes
 */
export const getRoutesForDisplay = () => {
  const grouped = getRoutesGroupedByModule()
  const result = []

  Object.keys(grouped).sort().forEach(moduleName => {
    result.push({
      module: moduleName,
      routes: grouped[moduleName].sort((a, b) => a.title.localeCompare(b.title))
    })
  })

  return result
}

export default {
  getAllRoutes,
  getProtectedRoutes,
  getRoutesGroupedByModule,
  getRouteNames,
  routeExists,
  getRouteByName,
  getRoutesForDisplay
}
