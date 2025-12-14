import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Product Type API Store - Product Type Management
 * Handles all product type operations: list, get, create, update
 */
export const useProductTypeApiStore = defineStore('productTypeApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of product types with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (code, nameTh, nameEn, productCode, silverCode)
   * @returns {Promise<Object>} List response with pagination
   */
  const listProductTypes = async (params = {}) => {
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

      const response = await api.jewelry.post('api/producttype/list', payload)

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
   * Get product type details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Product Type ID
   * @returns {Promise<Object>} Product type detail response
   */
  const getProductType = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/producttype/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            productCode: response.productCode,
            silverCode: response.silverCode,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get product type')
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
   * Create new product type
   * @param {Object} params - Product type data
   * @param {string} params.code - Product type code
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @param {string} params.productCode - Product code (optional)
   * @param {string} params.silverCode - Silver code (optional)
   * @returns {Promise<Object>} Create response
   */
  const createProductType = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        code: params.code,
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        productCode: params.productCode || null,
        silverCode: params.silverCode || null
      }

      const response = await api.jewelry.post('api/producttype', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Product type created successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            productCode: response.productCode,
            silverCode: response.silverCode
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create product type')
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
   * Update existing product type
   * @param {Object} params - Product type data
   * @param {number} params.id - Product type ID
   * @param {string} params.code - Product type code
   * @param {string} params.nameTh - Thai name
   * @param {string} params.nameEn - English name
   * @param {string} params.productCode - Product code (optional)
   * @param {string} params.silverCode - Silver code (optional)
   * @param {boolean} params.isActive - Active status
   * @returns {Promise<Object>} Update response
   */
  const updateProductType = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        id: params.id,
        code: params.code,
        nameTh: params.nameTh,
        nameEn: params.nameEn,
        productCode: params.productCode || null,
        silverCode: params.silverCode || null,
        isActive: params.isActive !== undefined ? params.isActive : true
      }

      const response = await api.jewelry.put(`api/producttype/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Product type updated successfully',
          data: {
            id: response.id,
            code: response.code,
            nameTh: response.nameTh,
            nameEn: response.nameEn,
            productCode: response.productCode,
            silverCode: response.silverCode,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update product type')
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
    listProductTypes,
    getProductType,
    createProductType,
    updateProductType,
    clearError
  }
})
