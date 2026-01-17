import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * User API Store - User Password Management
 * Handles user password operations: reset password
 */
export const useUserApiStore = defineStore('userApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Reset user password
   * @param {Object} params - Reset password parameters
   * @param {number} params.id - User ID (optional)
   * @param {string} params.username - Username (optional)
   * @param {string} params.oldPassword - Current password for verification
   * @param {string} params.newPassword - New password to set
   * @param {string} params.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Reset password response
   */
  const resetPassword = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        id: params.id || 0,
        username: params.username || null,
        oldPassword: params.oldPassword,
        newPassword: params.newPassword,
        confirmPassword: params.confirmPassword
      }

      const response = await api.jewelry.put('api/user/reset-password', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Password reset successfully'
        }
      } else {
        throw new Error(response.message || 'Failed to reset password')
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value,
        errors: err.response?.data?.errors || null
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
    resetPassword,
    clearError
  }
})
