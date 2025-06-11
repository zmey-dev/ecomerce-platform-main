
import { create } from 'zustand';
import { Work, SearchFilters, PaginationParams, PaginatedResponse } from '../types';
import { workService } from '../services/workService';

interface WorkState {
  works: Work[];
  currentWork: Work | null;
  searchResults: Work[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
}

interface WorkActions {
  fetchWorks: (params?: PaginationParams) => Promise<void>;
  fetchWork: (id: string) => Promise<void>;
  createWork: (formData: FormData) => Promise<Work>;
  updateWork: (id: string, data: Partial<Work>) => Promise<void>;
  deleteWork: (id: string) => Promise<void>;
  searchWorks: (filters: SearchFilters, params?: PaginationParams) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  clearCurrentWork: () => void;
  clearError: () => void;
}

type WorkStore = WorkState & WorkActions;

export const useWorkStore = create<WorkStore>((set, get) => ({
  // Initial state
  works: [],
  currentWork: null,
  searchResults: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  fetchWorks: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<Work> = await workService.getWorks(params);
      set({
        works: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch works',
        isLoading: false,
      });
    }
  },

  fetchWork: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const work = await workService.getWork(id);
      set({
        currentWork: work,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch work',
        isLoading: false,
      });
    }
  },

  createWork: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const work = await workService.createWork(formData);
      set((state) => ({
        works: [work, ...state.works],
        isLoading: false,
      }));
      return work;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create work',
        isLoading: false,
      });
      throw error;
    }
  },

  updateWork: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedWork = await workService.updateWork(id, data);
      set((state) => ({
        works: state.works.map((work) =>
          work.id === id ? updatedWork : work
        ),
        currentWork: state.currentWork?.id === id ? updatedWork : state.currentWork,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update work',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteWork: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await workService.deleteWork(id);
      set((state) => ({
        works: state.works.filter((work) => work.id !== id),
        currentWork: state.currentWork?.id === id ? null : state.currentWork,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete work',
        isLoading: false,
      });
      throw error;
    }
  },

  searchWorks: async (filters, params) => {
    set({ isLoading: true, error: null, filters });
    try {
      const response: PaginatedResponse<Work> = await workService.searchWorks(filters, params);
      set({
        searchResults: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to search works',
        isLoading: false,
      });
    }
  },

  setFilters: (filters) => set({ filters }),
  clearCurrentWork: () => set({ currentWork: null }),
  clearError: () => set({ error: null }),
}));
