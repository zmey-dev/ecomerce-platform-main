
import { apiRequest } from './api';
import { API_ENDPOINTS } from '../config/endpoints';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiRequest.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Store tokens in localStorage
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    return response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    // Store tokens in localStorage
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiRequest.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    localStorage.setItem('authToken', response.token);
    return response.token;
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest.get<User>('/auth/me');
  },

  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem('authToken'));
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  }
};
