import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/service/axios'

/**
 * Upload API Store - File Upload Management
 * Handles image upload to Azure Blob Storage
 */
export const useUploadApiStore = defineStore('uploadApi', () => {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Upload product image to Azure Blob Storage
   * @param {Object} params - Upload parameters
   * @param {File|Blob} params.file - Image file (compressed)
   * @param {string} params.containerName - Container name (default: product-images)
   * @returns {Promise<Object>} Upload response with blob URL
   */
  const uploadProductImage = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', params.file)
      if (params.containerName) {
        formData.append('containerName', params.containerName)
      }

      // Debug logging
      console.log('=== Upload Image Debug ===')
      console.log('File:', params.file)
      console.log('File name:', params.file.name)
      console.log('File size:', params.file.size)
      console.log('File type:', params.file.type)
      console.log('Container name:', params.containerName)
      console.log('FormData keys:', Array.from(formData.keys()))
      console.log('FormData values:', Array.from(formData.values()))

      // Upload to API
      // NOTE: Don't set Content-Type manually for FormData
      // Browser will automatically set it with correct boundary
      const response = await api.jewelry.post('api/upload/product-image', formData)

      console.log('Upload response:', response)
      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Image uploaded successfully',
          data: {
            blobUrl: response.blobUrl,
            blobName: response.blobName,
            fileSize: response.fileSize,
            uploadedAt: response.uploadedAt
          }
        }
      } else {
        throw new Error(response.message || 'Failed to upload image')
      }
    } catch (err) {
      isLoading.value = false
      error.value = err.response?.data?.message || err.message

      console.error('Upload error:', err)
      console.error('Error response:', err.response)
      console.error('Error data:', err.response?.data)

      return {
        success: false,
        message: error.value
      }
    }
  }

  /**
   * Delete product image from Azure Blob Storage
   * @param {Object} params - Delete parameters
   * @param {string} params.blobName - Blob file name
   * @param {string} params.containerName - Container name (default: product-images)
   * @returns {Promise<Object>} Delete response
   */
  const deleteProductImage = async (params) => {
    isLoading.value = true
    error.value = null

    try {
      const containerName = params.containerName || 'image-gem'
      const response = await api.jewelry.delete(
        `api/upload/product-image/${params.blobName}?containerName=${containerName}`
      )

      isLoading.value = false

      if (response.isSuccess) {
        return {
          success: true,
          message: response.message || 'Image deleted successfully'
        }
      } else {
        throw new Error(response.message || 'Failed to delete image')
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
    uploadProductImage,
    deleteProductImage,
    clearError
  }
})
