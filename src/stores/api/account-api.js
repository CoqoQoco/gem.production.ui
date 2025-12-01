import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Account API Store - User Management
 * Handles all user account operations: list, get, activate, deactivate
 */
export const useAccountApiStore = defineStore('accountApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of users with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.sortBy - Sort field
   * @param {boolean} params.isDescending - Sort direction
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (username, email, name)
   * @returns {Promise<Object>} List response with pagination
   */
  const listUsers = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        skip: params.pageIndex || 0,
        take: params.pageSize || 10,
        sortBy: params.sortBy || 'CreateDate',
        isDescending: params.isDescending !== undefined ? params.isDescending : true,
        criteria: {
          searchText: params.criteria?.searchText || null
        }
      }

      const response = await api.jewelry.post('api/user/list', payload)

      isLoading.value = false

      return {
        success: true,
        data: response.data || [],
        totalRecords: response.total || 0,
        pageIndex: payload.skip || 0,
        pageSize: payload.take || 10,
        //totalPages: response.totalPages || 0
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
   * Get user details by ID or Username
   * @param {Object} params - Query parameters
   * @param {number} params.id - User ID (optional)
   * @param {string} params.username - Username (optional)
   * @returns {Promise<Object>} User detail response
   */
  const getUser = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const queryParams = new URLSearchParams()
      
      if (params.id) queryParams.append('id', params.id)
      if (params.username) queryParams.append('username', params.username)

      const response = await api.jewelry.get(`api/user?${queryParams.toString()}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            username: response.username,
            email: response.email,
            tel: response.tel,
            firstName: response.firstName,
            lastName: response.lastName,
            isNew: response.isNew,
            isActive: response.isActive,
            roles: response.roles || [],
            createDate: response.createDate,
            createBy: response.createBy,
            lastLogin: response.lastLogin
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get user')
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
   * Activate user (set IsActive = true)
   * @param {Object} params - User identifier
   * @param {number} params.id - User ID (optional)
   * @param {string} params.username - Username (optional)
   * @returns {Promise<Object>} Activation response
   */
  const activateUser = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        id: params.id || null,
        username: params.username || null
      }

      const response = await api.jewelry.put('api/user/activate', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'User activated successfully'
        }
      } else {
        throw new Error(response.message || 'Failed to activate user')
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
   * Deactivate user (set IsActive = false)
   * @param {Object} params - User identifier
   * @param {number} params.id - User ID (optional)
   * @param {string} params.username - Username (optional)
   * @returns {Promise<Object>} Deactivation response
   */
  const deactivateUser = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        id: params.id || null,
        username: params.username || null
      }

      const response = await api.jewelry.put('api/user/deactivate', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'User deactivated successfully'
        }
      } else {
        throw new Error(response.message || 'Failed to deactivate user')
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
   * Update user role and optionally set isNew to false
   * @param {Object} params - Update parameters
   * @param {number} params.userId - User ID
   * @param {number} params.roleId - Role ID
   * @param {boolean|null} params.updateIsNew - Set isNew value (null to not update)
   * @returns {Promise<Object>} Update response
   */
  const updateUserRole = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        userId: params.userId,
        roleId: params.roleId,
        updateIsNew: params.updateIsNew
      }

      const response = await api.jewelry.put('api/user/update-role', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'User role updated successfully',
          data: {
            userId: response.userId,
            roleId: response.roleId,
            roleName: response.roleName,
            isNew: response.isNew
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update user role')
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
    listUsers,
    getUser,
    activateUser,
    deactivateUser,
    updateUserRole,
    clearError
  }
})
