import { apiClient } from './api.service.js';
import { API_ENDPOINTS } from '../constants/index.js';
import { handleApiResponse } from '../handlers/apiresponsehandler.js';

export const taskService = {
  async list(params = {}) {
    const res = await apiClient.get(API_ENDPOINTS.TASKS.BASE, { params });
    return {
      tasks: res.data.data,
      pagination: res.data.meta,
    };
  },

  async getById(id) {
    const res = await apiClient.get(API_ENDPOINTS.TASKS.BY_ID(id));
    return handleApiResponse(res);
  },

  async create(data) {
    const res = await apiClient.post(API_ENDPOINTS.TASKS.BASE, data);
    return handleApiResponse(res);
  },

  async update(id, data) {
    const res = await apiClient.patch(API_ENDPOINTS.TASKS.BY_ID(id), data);
    return handleApiResponse(res);
  },

  async delete(id) {
    await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
    return true;
  },
};
