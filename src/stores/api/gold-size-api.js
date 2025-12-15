import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Gold Size API Store - Gold Size Management
 * Handles all gold size operations: list, get, create, update
 */
export const useGoldSizeApiStore = defineStore('goldSizeApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of gold sizes with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn)
   * @returns {Promise<Object>} List response with pagination
   */
  const listGoldSizes = async (params = {}) => {
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

      const response = await api.jewelry.post('api/goldsize/list', payload)

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
   * Get gold size details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Gold Size ID
   * @returns {Promise<Object>} Gold size detail response
   */
  const getGoldSize = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/goldsize/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            isActive: response.isActive,
            isReceipt: response.isReceipt
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get gold size')
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
   * Create new gold size
   * @param {Object} params - Gold size data
   * @param {string} params.code - Gold size code
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @returns {Promise<Object>} Create response
   */
  const createGoldSize = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        code: params.code,
        nameTh: params.nameTh,
        nameEn: params.nameEn
      }

      const response = await api.jewelry.post('api/goldsize', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Gold size created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create gold size')
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
   * Update existing gold size
   * @param {Object} params - Gold size data
   * @param {number} params.id - Gold Size ID
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @returns {Promise<Object>} Update response
   */
  const updateGoldSize = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        id: params.id,
        nameTh: params.nameTh,
        nameEn: params.nameEn
      }

      const response = await api.jewelry.put(`api/goldsize/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Gold size updated successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update gold size')
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
    listGoldSizes,
    getGoldSize,
    createGoldSize,
    updateGoldSize,
    clearError
  }
})
