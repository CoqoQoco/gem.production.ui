import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Branch API Store - Branch Management
 * Handles all branch operations: list, get, create, update
 */
export const useBranchApiStore = defineStore('branchApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of branches with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.sortBy - Sort field
   * @param {boolean} params.isDescending - Sort direction
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (nameTh, nameEn, address)
   * @returns {Promise<Object>} List response with pagination
   */
  const listBranches = async (params = {}) => {
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

      const response = await api.jewelry.post('api/branch/list', payload)

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
   * Get branch details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Branch ID
   * @returns {Promise<Object>} Branch detail response
   */
  const getBranch = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/branch/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            branchId: response.branchId,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            address: response.address,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get branch')
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
   * Create new branch
   * @param {Object} params - Branch data
   * @param {string} params.nameTh - Branch name in Thai
   * @param {string} params.nameEn - Branch name in English
   * @param {string} params.address - Branch address
   * @returns {Promise<Object>} Create response
   */
  const createBranch = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        address: params.address
      }

      const response = await api.jewelry.post('api/branch', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Branch created successfully',
          data: {
            branchId: response.branchId,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            address: response.address
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create branch')
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
   * Update existing branch
   * @param {Object} params - Branch data
   * @param {number} params.id - Branch ID
   * @param {string} params.nameTh - Branch name in Thai
   * @param {string} params.nameEn - Branch name in English
   * @param {string} params.address - Branch address
   * @returns {Promise<Object>} Update response
   */
  const updateBranch = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        address: params.address
      }

      const response = await api.jewelry.put(`api/branch/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Branch updated successfully',
          data: {
            branchId: response.branchId,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            address: response.address
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update branch')
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
    listBranches,
    getBranch,
    createBranch,
    updateBranch,
    clearError
  }
})
