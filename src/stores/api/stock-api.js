import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Stock API Store - Stock Inventory Management
 * Handles all stock inventory operations: list with advanced filters
 */
export const useStockApiStore = defineStore('stockApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of stock inventory with advanced filters
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.receiptDateMin - Min receipt date (DateTimeOffset)
   * @param {string} params.criteria.receiptDateMax - Max receipt date (DateTimeOffset)
   * @param {Array<string>} params.criteria.productCodes - Product codes (origin number)
   * @param {Array<string>} params.criteria.stockNumbers - Stock numbers
   * @param {Array<string>} params.criteria.productTypeCodes - Product type codes
   * @param {number} params.criteria.priceMin - Min price
   * @param {number} params.criteria.priceMax - Max price
   * @param {Array<number>} params.criteria.branchIds - Branch IDs
   * @param {Object} params.criteria.goldFilter - Gold material filter
   * @param {Array<string>} params.criteria.goldFilter.typeCode1 - Gold type codes
   * @param {Array<string>} params.criteria.goldFilter.typeCode2 - Gold size codes
   * @param {Object} params.criteria.gemFilter - Gem material filter
   * @param {Array<string>} params.criteria.gemFilter.typeCode1 - Gem type codes
   * @param {Array<string>} params.criteria.gemFilter.typeCode2 - Gem shape codes
   * @returns {Promise<Object>} List response with pagination
   */
  const listStockInventory = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        skip: params.pageIndex || 0,
        take: params.pageSize || 10,
        sort: params.sort || [],
        criteria: {
          receiptDateMin: params.criteria?.receiptDateMin || null,
          receiptDateMax: params.criteria?.receiptDateMax || null,
          productCodes: params.criteria?.productCodes || null,
          stockNumbers: params.criteria?.stockNumbers || null,
          productTypeCodes: params.criteria?.productTypeCodes || null,
          priceMin: params.criteria?.priceMin || null,
          priceMax: params.criteria?.priceMax || null,
          branchIds: params.criteria?.branchIds || null,
          goldFilter: params.criteria?.goldFilter || null,
          gemFilter: params.criteria?.gemFilter || null
        }
      }

      console.log('Stock API - Payload being sent:', JSON.stringify(payload, null, 2))

      const response = await api.jewelry.post('api/stock/inventory/list', payload)

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
    listStockInventory,
    clearError
  }
})
