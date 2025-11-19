import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/service/axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const token = ref(null);

  /**
   * Login user with API
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username
   * @param {string} credentials.password - Password
   * @param {boolean} credentials.rememberMe - Remember me option
   * @returns {Promise} Login response
   */
  const login = async (credentials) => {
    try {
      // Call login API - Response structure: { isSuccess, message, token, userId, username, email, expiresAt }
      const response = await api.jewelry.post("api/login", {
        username: credentials.username,
        password: credentials.password,
      });

      // API returns: { isSuccess, message, token, userId, username, email, expiresAt }
      if (response.isSuccess) {
        // Store token
        token.value = response.token;
        localStorage.setItem("token-gem", response.token);

        // Store user data
        const userData = {
          userId: response.userId,
          username: response.username,
          email: response.email,
          expiresAt: response.expiresAt,
        };

        user.value = userData;
        isAuthenticated.value = true;

        // Store in localStorage if remember me
        if (credentials.rememberMe) {
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("rememberMe", "true");
        } else {
          // Store in sessionStorage instead
          sessionStorage.setItem("user", JSON.stringify(userData));
        }

        return userData;
      } else {
        // This case should be handled by axios interceptor, but just in case
        throw new Error(response || "Login failed");
      }
    } catch (error) {
      // Clear any existing auth data
      clearAuthData();

      // Re-throw error for component to handle
      throw error.response ? error.response : error;
    }
  };

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token.value) {
        await api.jewelry.post("api/login/logout");
      }
    } catch (error) {
      // Log error but don't throw - we still want to clear local data
      console.error("Logout API error:", error);
    } finally {
      // Always clear local auth data
      clearAuthData();
    }
  };

  /**
   * Clear authentication data
   */
  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token-gem");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    
    sessionStorage.removeItem("user");
  };

  /**
   * Check authentication status on app load
   */
  const checkAuth = () => {
    // Check token first
    const storedToken = localStorage.getItem("token-gem");
    if (!storedToken) {
      clearAuthData();
      return false;
    }

    token.value = storedToken;

    // Check if remember me was enabled
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const storedUser = rememberMe
      ? localStorage.getItem("user")
      : sessionStorage.getItem("user");

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
        isAuthenticated.value = true;
        return true;
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        clearAuthData();
        return false;
      }
    } else {
      clearAuthData();
      return false;
    }
  };

  /**
   * Register new user (if needed in future)
   * @param {Object} userData - Registration data
   * @returns {Promise} Registration response
   */
  const register = async (userData) => {
    try {
      // Placeholder for register API when implemented
      const response = await api.jewelry.post("api/register", userData);

      if (response.isSuccess) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    token,

    // Actions
    login,
    logout,
    register,
    checkAuth,
    clearAuthData,
  };
});
