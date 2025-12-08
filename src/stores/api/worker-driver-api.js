import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Worker Driver API Store - Worker Driver Management
 * Handles all worker driver operations: list, get, create, update
 */
export const useWorkerDriverApiStore = defineStore('workerDriverApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of worker drivers with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn, tel, vehicleRegistration)
   * @returns {Promise<Object>} List response with pagination
   */
  const listWorkerDrivers = async (params = {}) => {
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

      const response = await api.jewelry.post('api/workerdriver/list', payload)

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
   * Get worker driver details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Worker Driver ID
   * @returns {Promise<Object>} Worker driver detail response
   */
  const getWorkerDriver = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/workerdriver/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            tel: response.tel,
            gender: response.gender,
            vehicleRegistration: response.vehicleRegistration,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get worker driver')
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
   * Create new worker driver
   * @param {Object} params - Worker driver data
   * @param {string} params.nameTh - Name in Thai
   * @param {string} params.nameEn - Name in English
   * @param {string} params.tel - Telephone number
   * @param {string} params.gender - Gender
   * @param {string} params.vehicleRegistration - Vehicle registration number
   * @returns {Promise<Object>} Create response
   */
  const createWorkerDriver = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        tel: params.tel || null,
        gender: params.gender,
        vehicleRegistration: params.vehicleRegistration
      }

      const response = await api.jewelry.post('api/workerdriver', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Worker driver created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            tel: response.tel,
            gender: response.gender,
            vehicleRegistration: response.vehicleRegistration
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create worker driver')
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
   * Update existing worker driver
   * @param {Object} params - Worker driver data
   * @param {number} params.id - Worker Driver ID
   * @param {string} params.nameTh - Name in Thai
   * @param {string} params.nameEn - Name in English
   * @param {string} params.tel - Telephone number
   * @param {string} params.gender - Gender
   * @param {string} params.vehicleRegistration - Vehicle registration number
   * @returns {Promise<Object>} Update response
   */
  const updateWorkerDriver = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        tel: params.tel || null,
        gender: params.gender,
        vehicleRegistration: params.vehicleRegistration
      }

      const response = await api.jewelry.put(`api/workerdriver/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Worker driver updated successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            tel: response.tel,
            gender: response.gender,
            vehicleRegistration: response.vehicleRegistration
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update worker driver')
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
    listWorkerDrivers,
    getWorkerDriver,
    createWorkerDriver,
    updateWorkerDriver,
    clearError
  }
})
