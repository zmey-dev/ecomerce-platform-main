
import { apiRequest } from './api';
import { API_ENDPOINTS } from '../config/endpoints';
import { Work, SearchFilters, PaginationParams, PaginatedResponse } from '../types';

export const workService = {
  createWork: async (workData: FormData): Promise<Work> => {
    return apiRequest.post<Work>(API_ENDPOINTS.WORKS.CREATE, workData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getWorks: async (params?: PaginationParams): Promise<PaginatedResponse<Work>> => {
    return apiRequest.get<PaginatedResponse<Work>>(API_ENDPOINTS.WORKS.LIST, {
      params,
    });
  },

  getWork: async (id: string): Promise<Work> => {
    return apiRequest.get<Work>(API_ENDPOINTS.WORKS.GET(id));
  },

  updateWork: async (id: string, workData: Partial<Work>): Promise<Work> => {
    return apiRequest.put<Work>(API_ENDPOINTS.WORKS.UPDATE(id), workData);
  },

  deleteWork: async (id: string): Promise<void> => {
    return apiRequest.delete(API_ENDPOINTS.WORKS.DELETE(id));
  },

  searchWorks: async (
    filters: SearchFilters,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Work>> => {
    return apiRequest.get<PaginatedResponse<Work>>(API_ENDPOINTS.WORKS.SEARCH, {
      params: { ...filters, ...params },
    });
  },

  uploadFiles: async (files: FileList, workId?: string): Promise<any> => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    
    if (workId) {
      formData.append('workId', workId);
    }

    return apiRequest.post(API_ENDPOINTS.WORKS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
