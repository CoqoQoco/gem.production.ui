import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Worker Sale API Store - Worker Sale Management
 * Handles all worker sale operations: list, get, create, update
 */
export const useWorkerSaleApiStore = defineStore('workerSaleApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of worker sales with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.sortBy - Sort field
   * @param {boolean} params.isDescending - Sort direction
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn, email, tel)
   * @returns {Promise<Object>} List response with pagination
   */
  const listWorkerSales = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        pageIndex: params.pageIndex || 0,
        pageSize: params.pageSize || 10,
        sortBy: params.sortBy || 'CreateDate',
        isDescending: params.isDescending !== undefined ? params.isDescending : true,
        criteria: {
          searchText: params.criteria?.searchText || null
        }
      }

      const response = await api.jewelry.post('api/workersale/list', payload)

      isLoading.value = false

      return {
        success: true,
        data: response.data || [],
        totalRecords: response.totalRecords || 0,
        pageIndex: response.pageIndex || 0,
        pageSize: response.pageSize || 10,
        totalPages: response.totalPages || 0
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
   * Get worker sale details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Worker Sale ID
   * @returns {Promise<Object>} Worker sale detail response
   */
  const getWorkerSale = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/workersale/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            email: response.eMail,
            tel: response.tel,
            gender: response.gender,
            branch: response.branch,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get worker sale')
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
   * Create new worker sale
   * @param {Object} params - Worker sale data
   * @param {string} params.nameTh - Name in Thai
   * @param {string} params.nameEn - Name in English
   * @param {string} params.email - Email address
   * @param {string} params.tel - Telephone number
   * @param {string} params.gender - Gender
   * @param {number} params.branch - Branch ID
   * @returns {Promise<Object>} Create response
   */
  const createWorkerSale = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        eMail: params.email || null,
        tel: params.tel || null,
        gender: params.gender,
        branch: params.branch
      }

      const response = await api.jewelry.post('api/workersale', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Worker sale created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            email: response.eMail,
            tel: response.tel,
            gender: response.gender,
            branch: response.branch
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create worker sale')
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
   * Update existing worker sale
   * @param {Object} params - Worker sale data
   * @param {number} params.id - Worker Sale ID
   * @param {string} params.nameTh - Name in Thai
   * @param {string} params.nameEn - Name in English
   * @param {string} params.email - Email address
   * @param {string} params.tel - Telephone number
   * @param {string} params.gender - Gender
   * @param {number} params.branch - Branch ID
   * @returns {Promise<Object>} Update response
   */
  const updateWorkerSale = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        eMail: params.email || null,
        tel: params.tel || null,
        gender: params.gender,
        branch: params.branch
      }

      const response = await api.jewelry.put(`api/workersale/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Worker sale updated successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            email: response.eMail,
            tel: response.tel,
            gender: response.gender,
            branch: response.branch
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update worker sale')
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
    listWorkerSales,
    getWorkerSale,
    createWorkerSale,
    updateWorkerSale,
    clearError
  }
})
