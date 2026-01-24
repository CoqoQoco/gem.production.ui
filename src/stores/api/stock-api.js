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
      const pageIndex = params.pageIndex || 0
      const pageSize = params.pageSize || 10
      const skip = pageIndex * pageSize // Calculate skip from pageIndex and pageSize

      // Helper function to convert empty arrays to null
      const normalizeArray = (value) => {
        if (Array.isArray(value) && value.length > 0) {
          return value
        }
        return null
      }

      // Normalize goldFilter
      const goldFilter = params.criteria?.goldFilter
      const normalizedGoldFilter = (goldFilter?.typeCode1?.length > 0 || goldFilter?.typeCode2?.length > 0)
        ? {
            typeCode1: normalizeArray(goldFilter.typeCode1),
            typeCode2: normalizeArray(goldFilter.typeCode2)
          }
        : null

      // Normalize gemFilter
      const gemFilter = params.criteria?.gemFilter
      const normalizedGemFilter = (gemFilter?.typeCode1?.length > 0 || gemFilter?.typeCode2?.length > 0)
        ? {
            typeCode1: normalizeArray(gemFilter.typeCode1),
            typeCode2: normalizeArray(gemFilter.typeCode2)
          }
        : null

      const payload = {
        skip: skip,
        take: pageSize,
        sort: params.sort || [],
        criteria: {
          receiptDateMin: params.criteria?.receiptDateMin || null,
          receiptDateMax: params.criteria?.receiptDateMax || null,
          productCodes: normalizeArray(params.criteria?.productCodes),
          stockNumbers: normalizeArray(params.criteria?.stockNumbers),
          productTypeCodes: normalizeArray(params.criteria?.productTypeCodes),
          priceMin: params.criteria?.priceMin || null,
          priceMax: params.criteria?.priceMax || null,
          branchIds: normalizeArray(params.criteria?.branchIds),
          goldFilter: normalizedGoldFilter,
          gemFilter: normalizedGemFilter
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
   * Get stock inventory by stock number
   * @param {Object} params - Request parameters
   * @param {string} params.stockNumber - Stock number to search for
   * @returns {Promise<Object>} Stock inventory data
   */
  const getStockInventory = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        stockNumber: params.stockNumber || ''
      }

      console.log('Stock API - Get Stock Inventory Payload:', JSON.stringify(payload, null, 2))

      const response = await api.jewelry.post('api/stock/inventory/get', payload)

      isLoading.value = false

      return {
        success: response.success || false,
        message: response.message || '',
        data: response.data || null
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value,
        data: null
      }
    }
  }

  /**
   * Edit stock inventory (supports multiple stock items)
   * @param {Object} params - Request parameters
   * @param {Array} params.stocks - Array of stock items to edit
   * @returns {Promise<Object>} Edit response
   */
  const editStockInventory = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        stocks: params.stocks || []
      }

      console.log('Stock API - Edit Stock Inventory Payload:', JSON.stringify(payload, null, 2))

      const response = await api.jewelry.post('api/stock/inventory/edit', payload)

      isLoading.value = false

      return {
        success: response.success || false,
        message: response.message || '',
        data: response.data || null
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value,
        data: null
      }
    }
  }

  /**
   * Get inventory summary grouped by Branch → Product Type → Gold Type → Karat
   * @param {Object} params - Request parameters (optional filters can be added)
   * @returns {Promise<Object>} Summary response
   */
  const getSummary = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = params

      console.log('Stock API - Get Summary Payload:', JSON.stringify(payload, null, 2))

      const response = await api.jewelry.post('api/stock/inventory/summary', payload)

      isLoading.value = false

      return {
        success: response.success || false,
        message: response.message || '',
        data: response.branches || []
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      return {
        success: false,
        message: error.value,
        data: []
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
    getStockInventory,
    editStockInventory,
    getSummary,
    clearError
  }
})
