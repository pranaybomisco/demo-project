import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS, APP_ROUTES } from '../constants/index.js';
import { toast } from '../app/providers/toastprovider.jsx';

export const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage utilities
export const tokenService = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  clearToken: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

// Request Interceptor: Injects Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles success toasts, errors & 401 Unauthorized redirect
apiClient.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase();
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const successMsg = response.data?.message;

    // Show success toast for non-silent mutating operations with a message
    if (isMutation && successMsg && !response.config?.skipSuccessToast) {
      toast.success(successMsg);
    }

    return response;
  },
  (error) => {
    // Extract clean, human-friendly error details
    const backendError = error.response?.data?.error;
    const errorMessage =
      backendError?.message ||
      error.response?.data?.message ||
      (error.response ? 'Something went wrong. Please try again.' : 'Unable to connect to server.');

    const errorTitle =
      error.response?.status === 400
        ? 'Validation Error'
        : error.response?.status === 404
        ? 'Not Found'
        : error.response?.status === 409
        ? 'Conflict'
        : error.response?.status >= 500
        ? 'Server Error'
        : 'Error';

    // Handle 401 Unauthorized redirect
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login') && !error.config?.url?.includes('/auth/register')) {
      tokenService.clearToken();
      toast.warning('Your session has expired. Please sign in again.', 'Session Expired');
      if (window.location.pathname !== APP_ROUTES.LOGIN) {
        window.location.href = APP_ROUTES.LOGIN;
      }
      return Promise.reject(error);
    }

    // Trigger error toast alert with clean title and message
    if (!error.config?.skipErrorToast) {
      toast.error(errorMessage, errorTitle);
    }

    return Promise.reject(error);
  }
);
