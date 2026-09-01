import { apiClient } from './api.service.js';
import { API_ENDPOINTS } from '../constants/index.js';
import { handleApiResponse } from '../handlers/apiresponsehandler.js';

export const projectService = {
  async list(params = {}) {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS.BASE, { params });
    return {
      projects: res.data.data,
      pagination: res.data.meta,
    };
  },

  async getById(id) {
    const res = await apiClient.get(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return handleApiResponse(res);
  },

  async create(data) {
    const res = await apiClient.post(API_ENDPOINTS.PROJECTS.BASE, data);
    return handleApiResponse(res);
  },

  async update(id, data) {
    const res = await apiClient.patch(API_ENDPOINTS.PROJECTS.BY_ID(id), data);
    return handleApiResponse(res);
  },

  async delete(id) {
    await apiClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
    return true;
  },

  async addMember(projectId, data) {
    const res = await apiClient.post(API_ENDPOINTS.PROJECTS.MEMBERS(projectId), data);
    return handleApiResponse(res);
  },

  async removeMember(projectId, userId) {
    await apiClient.delete(API_ENDPOINTS.PROJECTS.MEMBER_BY_ID(projectId, userId));
    return true;
  },
};
