import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Storage API Store - Storage Management (Mock)
 * Mock store for storage data — real API will replace this in the future
 * Storage is filtered by branchId
 */

// Mock storage data grouped by branchId
const MOCK_STORAGES = [
  // Branch 1 สำนักงานใหญ่
  { storageId: 101, branchId: 1, nameTh: 'คลังหลัก A', nameEn: 'Main Warehouse A', code: 'WH-01-A' },
  { storageId: 102, branchId: 1, nameTh: 'คลังหลัก B', nameEn: 'Main Warehouse B', code: 'WH-01-B' },
  { storageId: 103, branchId: 1, nameTh: 'ตู้แข็บ สาขา 1', nameEn: 'Display Case Branch 1', code: 'DC-01' },

  // Branch 2 สาขาท่าพระ
  { storageId: 201, branchId: 2, nameTh: 'คลังสาขา ท่าพระ', nameEn: 'Tha Phra Warehouse', code: 'WH-02-A' },
  { storageId: 202, branchId: 2, nameTh: 'ตู้แข็บ ท่าพระ 1', nameEn: 'Tha Phra Display 1', code: 'DC-02-1' },
  { storageId: 203, branchId: 2, nameTh: 'ตู้แข็บ ท่าพระ 2', nameEn: 'Tha Phra Display 2', code: 'DC-02-2' },

  // Branch 3 สาขาบางนา
  { storageId: 301, branchId: 3, nameTh: 'คลังสาขา บางนา', nameEn: 'Bangna Warehouse', code: 'WH-03-A' },
  { storageId: 302, branchId: 3, nameTh: 'ตู้แข็บ บางนา', nameEn: 'Bangna Display', code: 'DC-03' },

  // Branch 4 สาขาปทุมวัน
  { storageId: 401, branchId: 4, nameTh: 'คลังสาขา ปทุมวัน', nameEn: 'Pathum Wan Warehouse', code: 'WH-04-A' },
  { storageId: 402, branchId: 4, nameTh: 'ตู้แข็บ ปทุมวัน 1', nameEn: 'Pathum Wan Display 1', code: 'DC-04-1' },
  { storageId: 403, branchId: 4, nameTh: 'ตู้แข็บ ปทุมวัน 2', nameEn: 'Pathum Wan Display 2', code: 'DC-04-2' }
]

export const useStorageApiStore = defineStore('storageApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Get list of storages filtered by branchId
   * @param {Object} params - Query parameters
   * @param {number} params.branchId - Branch ID to filter storages
   * @param {string} [params.searchText] - Optional search text (nameTh, nameEn, code)
   * @returns {Promise<Object>} List response
   */
  const listStorages = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      let result = [...MOCK_STORAGES]

      // Filter by branchId
      if (params.branchId) {
        result = result.filter((s) => s.branchId === params.branchId)
      }

      // Filter by searchText
      if (params.searchText) {
        const query = params.searchText.toLowerCase().trim()
        result = result.filter(
          (s) =>
            s.nameTh.toLowerCase().includes(query) ||
            s.nameEn.toLowerCase().includes(query) ||
            s.code.toLowerCase().includes(query)
        )
      }

      isLoading.value = false

      return {
        success: true,
        data: result,
        totalRecords: result.length
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.message

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
    listStorages,
    clearError
  }
})
