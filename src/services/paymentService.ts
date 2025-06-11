
import { apiRequest } from './api';
import { API_ENDPOINTS } from '../config/endpoints';
import { Payment, PaginationParams, PaginatedResponse } from '../types';

export interface PaymentCreateRequest {
  workId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'mercado_pago' | 'subscription';
  description?: string;
}

export interface PaymentCreateResponse {
  paymentId: string;
  checkoutUrl: string;
  externalId: string;
}

export const paymentService = {
  createPayment: async (data: PaymentCreateRequest): Promise<PaymentCreateResponse> => {
    return apiRequest.post<PaymentCreateResponse>(API_ENDPOINTS.PAYMENTS.CREATE, data);
  },

  confirmPayment: async (paymentId: string): Promise<Payment> => {
    return apiRequest.post<Payment>(API_ENDPOINTS.PAYMENTS.CONFIRM, { paymentId });
  },

  getPaymentHistory: async (params?: PaginationParams): Promise<PaginatedResponse<Payment>> => {
    return apiRequest.get<PaginatedResponse<Payment>>(API_ENDPOINTS.PAYMENTS.HISTORY, {
      params,
    });
  },

  getPayment: async (id: string): Promise<Payment> => {
    return apiRequest.get<Payment>(`/payments/${id}`);
  },
};
