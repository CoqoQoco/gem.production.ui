import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Role API Store - Role Management
 * Handles role operations: list, get, update (including router permissions)
 */
export const useRoleApiStore = defineStore('roleApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of all roles with optional filtering
   * @param {Object} params - Query parameters
   * @param {boolean} params.isActiveOnly - Filter active roles only (optional)
   * @param {string} params.searchText - Search text in name/description (optional)
   * @returns {Promise<Object>} List of roles
   */
  const listRoles = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      if (params.isActiveOnly !== undefined) {
        queryParams.append('isActiveOnly', params.isActiveOnly)
      }
      if (params.searchText) {
        queryParams.append('searchText', params.searchText)
      }

      const queryString = queryParams.toString()
      const url = queryString ? `api/role?${queryString}` : 'api/role'

      const response = await api.jewelry.get(url)

      isLoading.value = false

      if (response.success) {
        return {
          success: true,
          data: response.data || [],
          totalRecords: response.totalRecords || 0,
          message: response.message
        }
      } else {
        throw new Error(response.message || 'Failed to get roles')
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value,
        data: [],
        totalRecords: 0
      }
    }
  }

  /**
   * Get role details by ID including router allow list
   * @param {number} roleId - Role ID
   * @returns {Promise<Object>} Role detail with router permissions
   */
  const getRole = async (roleId) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/role/${roleId}`)

      isLoading.value = false

      if (response.success) {
        return {
          success: true,
          data: {
            roleId: response.data.roleId,
            roleName: response.data.roleName,
            description: response.data.description,
            level: response.data.level,
            isActive: response.data.isActive,
            isSystemRole: response.data.isSystemRole,
            routerAllow: response.data.routerAllow || []
          },
          message: response.message
        }
      } else {
        throw new Error(response.message || 'Failed to get role')
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value
      }
    }
  }

  /**
   * Update role including router permissions
   * @param {number} roleId - Role ID
   * @param {Object} data - Update data
   * @param {string} data.roleName - Role name (optional)
   * @param {string} data.description - Description (optional)
   * @param {number} data.level - Level (optional)
   * @param {boolean} data.isActive - Active status (optional)
   * @param {Array<string>} data.routerAllow - List of allowed router names (optional)
   * @returns {Promise<Object>} Update response
   */
  const updateRole = async (roleId, data) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        roleId: roleId
      }

      // Add optional fields if provided
      if (data.roleName !== undefined) payload.roleName = data.roleName
      if (data.description !== undefined) payload.description = data.description
      if (data.level !== undefined) payload.level = data.level
      if (data.isActive !== undefined) payload.isActive = data.isActive
      if (data.routerAllow !== undefined) payload.routerAllow = data.routerAllow

      const response = await api.jewelry.put(`api/role/${roleId}`, payload)

      isLoading.value = false

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Role updated successfully'
        }
      } else {
        throw new Error(response.message || 'Failed to update role')
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value
      }
    }
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    isLoading,
    error,

    // Actions
    listRoles,
    getRole,
    updateRole,
    clearError
  }
})
