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
        // Store token first
        token.value = response.token;
        localStorage.setItem("token-gem", response.token);

        // Call getUser API to get complete user data including roles and router permissions
        try {
          const userResponse = await api.jewelry.get("api/user", {
            id: response.userId,
            username: response.username,
          });

          if (userResponse.isSuccess) {
            // Store complete user data from getUser API
            const userData = {
              id: userResponse.id,
              userId: userResponse.id,
              username: userResponse.username,
              email: userResponse.email,
              tel: userResponse.tel,
              firstName: userResponse.firstName,
              lastName: userResponse.lastName,
              createDate: userResponse.createDate,
              createBy: userResponse.createBy,
              lastLogin: userResponse.lastLogin,
              roles: userResponse.roles, // Contains roleId, roleName, and routerAllow
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
            // If getUser fails, use basic user data from login response
            const basicUserData = {
              userId: response.userId,
              username: response.username,
              email: response.email,
              expiresAt: response.expiresAt,
            };

            user.value = basicUserData;
            isAuthenticated.value = true;

            if (credentials.rememberMe) {
              localStorage.setItem("user", JSON.stringify(basicUserData));
              localStorage.setItem("rememberMe", "true");
            } else {
              sessionStorage.setItem("user", JSON.stringify(basicUserData));
            }

            return basicUserData;
          }
        } catch (getUserError) {
          console.error("Error fetching user details:", getUserError);

          // Fallback to basic user data from login
          const basicUserData = {
            userId: response.userId,
            username: response.username,
            email: response.email,
            expiresAt: response.expiresAt,
          };

          user.value = basicUserData;
          isAuthenticated.value = true;

          if (credentials.rememberMe) {
            localStorage.setItem("user", JSON.stringify(basicUserData));
            localStorage.setItem("rememberMe", "true");
          } else {
            sessionStorage.setItem("user", JSON.stringify(basicUserData));
          }

          return basicUserData;
        }
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

  /**
   * Refresh user data from API
   * Call this after role permissions change to get updated router permissions
   * @returns {Promise} Updated user data
   */
  const refreshUser = async () => {
    try {
      if (!user.value || !token.value) {
        return { success: false, message: "No user logged in" };
      }

      // Call getUser API to get updated user data
      const userResponse = await api.jewelry.get("api/user", {
        id: user.value.userId || user.value.id,
        username: user.value.username,
      });

      if (userResponse.isSuccess) {
        // Update user data with new information
        const updatedUserData = {
          id: userResponse.id,
          userId: userResponse.id,
          username: userResponse.username,
          email: userResponse.email,
          tel: userResponse.tel,
          firstName: userResponse.firstName,
          lastName: userResponse.lastName,
          createDate: userResponse.createDate,
          createBy: userResponse.createBy,
          lastLogin: userResponse.lastLogin,
          roles: userResponse.roles, // Updated router permissions
          expiresAt: user.value.expiresAt, // Keep original token expiration
        };

        user.value = updatedUserData;

        // Update storage (check if rememberMe was enabled)
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(updatedUserData));
        } else {
          sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        }

        return { success: true, data: updatedUserData };
      } else {
        return { success: false, message: userResponse.message };
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return { success: false, message: error.message };
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
    refreshUser,
  };
});
