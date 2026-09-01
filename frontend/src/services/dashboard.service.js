import { apiClient } from './api.service.js';
import { API_ENDPOINTS } from '../constants/index.js';
import { handleApiResponse } from '../handlers/apiresponsehandler.js';

export const dashboardService = {
  async getMetrics() {
    const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.METRICS);
    return handleApiResponse(res);
  },
};
