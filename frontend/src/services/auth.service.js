import { apiClient } from './api.service.js';
import { API_ENDPOINTS } from '../constants/index.js';
import { handleApiResponse } from '../handlers/apiresponsehandler.js';

export const authService = {
  async register(data) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return handleApiResponse(res);
  },

  async login(data) {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return handleApiResponse(res);
  },

  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore network errors on logout
    }
  },

  async getMe() {
    const res = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return handleApiResponse(res);
  },

  async updateProfile(data) {
    const res = await apiClient.put(API_ENDPOINTS.AUTH.ME, data);
    return handleApiResponse(res);
  },
};

