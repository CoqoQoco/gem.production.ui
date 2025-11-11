import axios from "axios";
import get from "lodash/get";
import { useLoadingStore } from "@/stores/loading-overlay/loading-store.js";
import { useAuthStore } from "@/stores/auth.js";
import router from "@/router";

// Get API URLs from environment variables
const jewelryUrl =
  import.meta.env.VITE_JEWELRY_API_URL || "https://localhost:7001/";
const apiTimeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 100000;
const maxLoadingTime =
  parseInt(import.meta.env.VITE_MAX_LOADING_TIME) || 10000;

// Loading state management
const loadingManager = {
  timeoutId: null,
  maxLoadingTime: maxLoadingTime,

  showLoading() {
    const loadingStore = useLoadingStore();
    loadingStore.showLoading();

    // Set timeout to force hide loading after maxLoadingTime
    this.timeoutId = setTimeout(() => {
      this.hideLoading();
    }, this.maxLoadingTime);
  },

  hideLoading() {
    const loadingStore = useLoadingStore();
    loadingStore.hideLoading();

    // Clear timeout if exists
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  },

  // Force reset loading state
  resetLoading() {
    this.hideLoading();
    activeRequests.clear();
  },
};

// Create cancel token source
const createCancelToken = () => {
  return axios.CancelToken.source();
};

const getTokenInfo = () => {
  const token = localStorage.getItem("token-gem");
  return token;
};

// Axios instance for jewelry API
const axiosInstance = axios.create({
  baseURL: jewelryUrl,
  timeout: apiTimeout,
});

// Request tracking
let activeRequests = new Set();

// Configure request interceptors
const configureInterceptors = (instance) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const requestId = Math.random().toString(36).substring(7);
      config.requestId = requestId;
      activeRequests.add(requestId);

      // Reset loading state if it's stuck
      if (document.hidden) {
        loadingManager.resetLoading();
      }

      return config;
    },
    (error) => {
      loadingManager.hideLoading();
      return Promise.reject(error);
    }
  );

  // Response interceptor with enhanced error handling
  instance.interceptors.response.use(
    (response) => {
      // Clean up request tracking
      if (response.config.requestId) {
        activeRequests.delete(response.config.requestId);
      }
      if (activeRequests.size === 0) {
        loadingManager.hideLoading();
      }

      // Check for IsSuccess = false in 200 responses (following ReponseBase structure)
      if (response.status === 200 && response.data) {
        // Check if response has IsSuccess property and it's false
        if (response.data.hasOwnProperty('isSuccess') && response.data.isSuccess === false) {
          // Create error object for consistent error handling
          const error = new Error(response.data.message || 'เกิดข้อผิดพลาด');
          error.response = {
            status: 200,
            data: response.data
          };
          return Promise.reject(error);
        }
      }

      return response;
    },
    (error) => {
      // Clean up request tracking
      if (error.config?.requestId) {
        activeRequests.delete(error.config.requestId);
      }

      // Hide loading state only if it was shown and no other requests are pending
      if (!error.config?.skipLoading && activeRequests.size === 0) {
        loadingManager.hideLoading();
      }

      // Handle canceled requests
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        return Promise.reject(error);
      }

      // Extract error details
      const status = get(error, "response.status");
      const msg = get(error, "response.data.message");
      const errorSystem = get(error, "response.data.errors");

      const authStore = useAuthStore();

      // Handle different error cases
      switch (status) {
        case 200:
          // Handle IsSuccess = false case (already handled above, but keep for clarity)
          console.error("API returned error:", msg);
          break;

        case 401:
          {
            let errorMsg = "";
            if (error.response?.headers["token-expired"]) {
              errorMsg = "Token expired";
            } else if (
              error.response?.data.message === "User is inactive or not found"
            ) {
              errorMsg = "User is inactive or not found";
            }

            console.log("401 error:", errorMsg);

            // Logout and redirect to login
            authStore.logout();
            router.push("/login");
          }
          break;

        case 400:
          console.error("Bad Request:", msg || errorSystem);
          break;

        case 402:
        case 404:
        case 500:
        case 504:
          console.error(`Server Error (${status}):`, msg || errorSystem);
          break;

        default:
          console.error(
            `Unexpected error (${status || "Unknown"}):`,
            msg || error.message
          );
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to axios instance
configureInterceptors(axiosInstance);

// Enhanced cleanup function
const cleanupRequests = () => {
  loadingManager.resetLoading();
};

// Add enhanced event listeners
if (typeof window !== "undefined") {
  // Handle page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      loadingManager.resetLoading();
    }
  });

  // Handle page unload
  window.addEventListener("beforeunload", cleanupRequests);
  window.addEventListener("unload", cleanupRequests);

  // Handle navigation events
  window.addEventListener("popstate", cleanupRequests);
}

// GET method for Jewelry API
const fetchData = async (url, params, optionsConfig = {}) => {
  const token = getTokenInfo();
  const { skipLoading = false, ...restOptions } = optionsConfig;

  if (!skipLoading) {
    loadingManager.showLoading();
  }

  const source = createCancelToken();

  const res = await axiosInstance.get(url, {
    ...restOptions,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...restOptions?.headers,
    },
    params: params,
    cancelToken: source.token,
    skipLoading,
  });

  return res.data;
};

// POST method for Jewelry API
const postData = async (url, data, optionsConfig = {}) => {
  const token = getTokenInfo();
  const { skipLoading = false, ...restOptions } = optionsConfig;

  if (!skipLoading) {
    loadingManager.showLoading();
  }

  const source = createCancelToken();

  const res = await axiosInstance.post(url, data, {
    ...restOptions,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...restOptions?.headers,
    },
    cancelToken: source.token,
    skipLoading,
  });

  return res.data;
};

export default {
  jewelry: {
    get: async (url, params, optionsConfig) =>
      await fetchData(`${url}`, params, optionsConfig),
    post: async (url, params, optionsConfig) =>
      await postData(`${url}`, params, optionsConfig),
  },
};
