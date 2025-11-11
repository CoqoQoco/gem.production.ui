import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/service/axios";

export const useRegisterApiStore = defineStore("registerApi", () => {
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Register new user account
   * @param {Object} registerData - Registration data
   * @param {string} registerData.username - Username (required)
   * @param {string} registerData.password - Password (required)
   * @param {string} registerData.firstName - First name (required)
   * @param {string} registerData.lastName - Last name (required)
   * @param {string} registerData.email - Email (required)
   * @param {string} registerData.tel - Telephone number (optional)
   * @param {string} registerData.imageUrl - Profile image URL (optional)
   * @returns {Promise<Object>} Registration response
   */
  const register = async (registerData) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Call register API
      const response = await api.jewelry.post("api/register", {
        username: registerData.username,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        tel: registerData.tel || null,
        imageUrl: registerData.imageUrl || null,
      });

      // API returns: { isSuccess, message, userId, username, email }
      if (response.isSuccess) {
        isLoading.value = false;
        return {
          success: true,
          message: response.message,
          data: {
            userId: response.userId,
            username: response.username,
            email: response.email,
          },
        };
      } else {
        // This should be handled by axios interceptor, but just in case
        throw new Error(response.message || "Registration failed");
      }
    } catch (err) {
      isLoading.value = false;
      error.value = err.response?.data?.message || err.message;

      return {
        success: false,
        message: error.value,
        errors: err.response?.data?.errors || null,
      };
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    isLoading,
    error,

    // Actions
    register,
    clearError,
  };
});
