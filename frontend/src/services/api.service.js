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

// Global API latency metrics tracker
const metricsListeners = new Set();
let latestApiMetric = {
  durationMs: 0,
  serverDurationMs: 0,
  url: '',
  method: 'GET',
  timestamp: Date.now(),
};

export const apiMetricsTracker = {
  getLatest: () => latestApiMetric,
  subscribe: (listener) => {
    metricsListeners.add(listener);
    return () => metricsListeners.delete(listener);
  },
  broadcast: (metric) => {
    latestApiMetric = metric;
    metricsListeners.forEach((fn) => {
      try {
        fn(metric);
      } catch {
        // ignore subscriber errors
      }
    });
  },
};

// Request Interceptor: Injects Bearer token and records start timestamp
apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: performance.now() };
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Calculates response duration, handles success toasts, errors & 401 Unauthorized redirect
apiClient.interceptors.response.use(
  (response) => {
    const startTime = response.config?.metadata?.startTime || performance.now();
    const durationMs = Math.max(1, Math.round(performance.now() - startTime));
    const serverDurationMs = response.data?.meta?.serverResponseTimeMs ?? durationMs;

    response.durationMs = durationMs;
    if (response.data && typeof response.data === 'object') {
      if (!response.data.meta) response.data.meta = {};
      response.data.meta.clientDurationMs = durationMs;
      response.data.meta.serverResponseTimeMs = serverDurationMs;
    }

    // Broadcast live metric
    apiMetricsTracker.broadcast({
      durationMs,
      serverDurationMs,
      url: response.config?.url || '',
      method: (response.config?.method || 'GET').toUpperCase(),
      timestamp: Date.now(),
    });

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
    const startTime = error.config?.metadata?.startTime || performance.now();
    const durationMs = Math.max(1, Math.round(performance.now() - startTime));

    apiMetricsTracker.broadcast({
      durationMs,
      serverDurationMs: durationMs,
      url: error.config?.url || '',
      method: (error.config?.method || 'GET').toUpperCase(),
      status: error.response?.status || 500,
      timestamp: Date.now(),
    });

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
