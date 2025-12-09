import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Gem API Store - Gem Management
 * Handles all gem operations: list, get, create
 */
export const useGemApiStore = defineStore('gemApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of gems with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn, color)
   * @returns {Promise<Object>} List response with pagination
   */
  const listGems = async (params = {}) => {
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

      const response = await api.jewelry.post('api/gem/list', payload)

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
   * Get gem details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Gem ID
   * @returns {Promise<Object>} Gem detail response
   */
  const getGem = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/gem/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            color: response.color,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get gem')
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
   * Create new gem
   * @param {Object} params - Gem data
   * @param {string} params.code - Gem code
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @param {string} params.color - Gem color
   * @returns {Promise<Object>} Create response
   */
  const createGem = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        code: params.code,
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        color: params.color || null
      }

      const response = await api.jewelry.post('api/gem', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Gem created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            color: response.color
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create gem')
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
    listGems,
    getGem,
    createGem,
    clearError
  }
})
