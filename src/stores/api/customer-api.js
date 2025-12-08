import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Customer API Store - Customer Management
 * Handles all customer operations: list, get, create, update
 */
export const useCustomerApiStore = defineStore('customerApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of customers with pagination and search
   * @param {Object} params - Search parameters
   * @param {number} params.pageIndex - Page index (0-based)
   * @param {number} params.pageSize - Number of items per page
   * @param {Array} params.sort - Sort array [{ field: 'fieldName', dir: 'asc' or 'desc' }]
   * @param {Object} params.criteria - Search criteria
   * @param {string} params.criteria.searchText - Search text (customerNumber, customerName, phone, email, address)
   * @returns {Promise<Object>} List response with pagination
   */
  const listCustomers = async (params = {}) => {
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

      const response = await api.jewelry.post('api/customer/list', payload)

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
   * Get customer details by ID
   * @param {Object} params - Query parameters
   * @param {number} params.id - Customer ID
   * @returns {Promise<Object>} Customer detail response
   */
  const getCustomer = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.jewelry.get(`api/customer/${params.id}`)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          data: {
            id: response.customerId,
            customerNumber: response.customerNumber,
            customerName: response.customerName,
            custtype: response.custtype,
            address1: response.address1,
            address2: response.address2,
            country: response.country,
            postcode: response.postcode,
            phone: response.phone,
            email: response.email,
            remark: response.remark,
            payid: response.payid,
            payterm: response.payterm,
            discount: response.discount,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to get customer')
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
   * Create new customer
   * @param {Object} params - Customer data
   * @param {string} params.customerNumber - Customer number
   * @param {string} params.customerName - Customer name
   * @param {number} params.custtype - Customer type
   * @param {string} params.address1 - Address line 1
   * @param {string} params.address2 - Address line 2
   * @param {string} params.country - Country
   * @param {string} params.postcode - Postcode
   * @param {string} params.phone - Phone number
   * @param {string} params.email - Email address
   * @param {string} params.remark - Remark
   * @param {number} params.payid - Payment ID
   * @param {number} params.payterm - Payment term
   * @param {string} params.discount - Discount
   * @returns {Promise<Object>} Create response
   */
  const createCustomer = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        customerNumber: params.customerNumber,
        customerName: params.customerName,
        custtype: params.custtype || null,
        address1: params.address1 || null,
        address2: params.address2 || null,
        country: params.country || null,
        postcode: params.postcode || null,
        phone: params.phone || null,
        email: params.email || null,
        remark: params.remark || null,
        payid: params.payid || null,
        payterm: params.payterm || null,
        discount: params.discount || null
      }

      const response = await api.jewelry.post('api/customer', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Customer created successfully',
          data: {
            id: response.customerId,
            customerNumber: response.customerNumber,
            customerName: response.customerName,
            address1: response.address1,
            address2: response.address2,
            country: response.country,
            postcode: response.postcode,
            phone: response.phone,
            email: response.email
          }
        }
      } else {
        throw new Error(response.message || 'Failed to create customer')
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
   * Update existing customer
   * @param {Object} params - Customer data
   * @param {number} params.id - Customer ID
   * @param {string} params.address1 - Address line 1
   * @param {string} params.address2 - Address line 2
   * @param {string} params.phone - Phone number
   * @param {string} params.email - Email address
   * @param {string} params.country - Country
   * @param {string} params.postcode - Postcode
   * @param {boolean} params.isActive - Active status
   * @param {string} params.discount - Discount
   * @returns {Promise<Object>} Update response
   */
  const updateCustomer = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        address1: params.address1 || null,
        address2: params.address2 || null,
        phone: params.phone || null,
        email: params.email || null,
        country: params.country || null,
        postcode: params.postcode || null,
        isActive: params.isActive !== undefined ? params.isActive : null,
        discount: params.discount || null
      }

      const response = await api.jewelry.put(`api/customer/${params.id}`, payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Customer updated successfully',
          data: {
            id: response.customerId,
            customerNumber: response.customerNumber,
            customerName: response.customerName,
            address1: response.address1,
            address2: response.address2,
            phone: response.phone,
            email: response.email,
            country: response.country,
            postcode: response.postcode,
            discount: response.discount,
            isActive: response.isActive
          }
        }
      } else {
        throw new Error(response.message || 'Failed to update customer')
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
    listCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    clearError
  }
})
