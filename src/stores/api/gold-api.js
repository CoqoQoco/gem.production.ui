import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Gold API Store - Gold Management
 * Handles all gold operations: list, get, create, update
 */
export const useGoldApiStore = defineStore('goldApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of golds with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn)
   * @returns {Promise<Object>} List response with pagination
   */
  const listGolds = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        skip: params.pageIndex || 0,
        take: params.pageSize || 10,
        sort: params.sort || [],
        criteria: {
          searchText: params.criteria?.searchText || null
        }
      }

      const response = await api.jewelry.post('api/gold/list', payload)

      isLoading.value = false

      return {
        success: true,
        data: response.data || [],
        totalRecords: response.total || 0,
        pageIndex: payload.skip || 0,
        pageSize: payload.take || 10
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
   * Get gold details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Gold ID
   * @returns {Promise<Object>} Gold detail response
   */
  const getGold = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/gold/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get gold')
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
   * Create new gold
   * @param {Object} params - Gold data
   * @param {string} params.code - Gold code
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @returns {Promise<Object>} Create response
   */
  const createGold = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        code: params.code,
        nameTh: params.nameTh,
        nameEn: params.nameEn
      }

      const response = await api.jewelry.post('api/gold', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Gold created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create gold')
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
   * Update existing gold
   * @param {Object} params - Gold data
   * @param {number} params.id - Gold ID
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @returns {Promise<Object>} Update response
   */
  const updateGold = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        id: params.id,
        nameTh: params.nameTh,
        nameEn: params.nameEn
      }

      const response = await api.jewelry.put(`api/gold/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Gold updated successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update gold')
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
    listGolds,
    getGold,
    createGold,
    updateGold,
    clearError
  }
})
