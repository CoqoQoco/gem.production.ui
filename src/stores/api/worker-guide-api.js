import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Worker Guide API Store - Worker Guide Management
 * Handles all worker guide operations: list, get, create, update
 */
export const useWorkerGuideApiStore = defineStore('workerGuideApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of worker guides with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {string} params.sortBy - Sort field
   * @param {boolean} params.isDescending - Sort direction
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn, email, tel)
   * @returns {Promise<Object>} List response with pagination
   */
  const listWorkerGuides = async (params = {}) => {
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

      const response = await api.jewelry.post('api/workerguide/list', payload)

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
   * Get worker guide details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Worker Guide ID
   * @returns {Promise<Object>} Worker guide detail response
   */
  const getWorkerGuide = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/workerguide/${params.id}`)

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
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get worker guide')
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
   * Create new worker guide
   * @param {Object} params - Worker guide data
   * @param {string} params.nameTh - Name in Thai
   * @param {string} params.nameEn - Name in English
   * @param {string} params.email - Email address
   * @param {string} params.tel - Telephone number
   * @param {string} params.gender - Gender
   * @returns {Promise<Object>} Create response
   */
  const createWorkerGuide = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        eMail: params.email || null,
        tel: params.tel || null,
        gender: params.gender
      }

      const response = await api.jewelry.post('api/workerguide', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Worker guide created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            email: response.eMail,
            tel: response.tel,
            gender: response.gender
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create worker guide')
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
   * Update existing worker guide
   * @param {Object} params - Worker guide data
   * @param {number} params.id - Worker Guide ID
   * @param {string} params.nameTh - Name in Thai
   * @param {string} params.nameEn - Name in English
   * @param {string} params.email - Email address
   * @param {string} params.tel - Telephone number
   * @param {string} params.gender - Gender
   * @returns {Promise<Object>} Update response
   */
  const updateWorkerGuide = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        eMail: params.email || null,
        tel: params.tel || null,
        gender: params.gender
      }

      const response = await api.jewelry.put(`api/workerguide/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Worker guide updated successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            email: response.eMail,
            tel: response.tel,
            gender: response.gender
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update worker guide')
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
    listWorkerGuides,
    getWorkerGuide,
    createWorkerGuide,
    updateWorkerGuide,
    clearError
  }
})
