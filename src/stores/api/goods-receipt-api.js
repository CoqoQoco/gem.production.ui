import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Goods Receipt API Store - Goods Receipt Management
 * Handles manual receipt operations for goods entry
 */
export const useGoodsReceiptApiStore = defineStore('goodsReceiptApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Manual receipt - Create goods receipt entry
   * @param {Object} params - Goods receipt data
   * @param {string} params.mold - Mold code
   * @param {string} params.originNumber - Origin number
   * @param {string} params.productNameTh - Product name (Thai)
   * @param {string} params.productNameEn - Product name (English)
   * @param {number} params.qty - Quantity
   * @param {string} params.qtyUnit - Quantity unit
   * @param {number} params.price - Price
   * @param {string} params.priceUnit - Price unit
   * @param {number} params.branchId - Branch ID
   * @param {string} params.branchNameTh - Branch name (Thai)
   * @param {string} params.branchNameEn - Branch name (English)
   * @param {string} params.productTypeCode - Product type code
   * @param {string} params.productTypeNameTh - Product type name (Thai)
   * @param {string} params.productTypeNameEn - Product type name (English)
   * @param {Array} params.gold - Gold components array
   * @param {Array} params.gem - Gem components array
   * @returns {Promise<Object>} Create response
   */
  const manualReceipt = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const payload = {
        mold: params.mold,
        originNumber: params.originNumber,
        productNameTh: params.productNameTh,
        productNameEn: params.productNameEn,
        qty: params.qty,
        qtyUnit: params.qtyUnit,
        price: params.price,
        priceUnit: params.priceUnit,
        branchId: params.branchId,
        branchNameTh: params.branchNameTh,
        branchNameEn: params.branchNameEn,
        productTypeCode: params.productTypeCode,
        productTypeNameTh: params.productTypeNameTh,
        productTypeNameEn: params.productTypeNameEn,
        gold: params.gold || [],
        gem: params.gem || []
      }

      const response = await api.jewelry.post('api/goodsreceipt/manualreceipt', payload)

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Goods receipt created successfully',
          data: response.data
        }
      } else {
        throw new Error(response.message || 'Failed to create goods receipt')
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
    manualReceipt,
    clearError
  }
})
