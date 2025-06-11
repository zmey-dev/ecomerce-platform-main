
import { create } from 'zustand';
import { Payment, PaginationParams, PaginatedResponse } from '../types';
import { paymentService, PaymentCreateRequest } from '../services/paymentService';

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PaymentActions {
  createPayment: (data: PaymentCreateRequest) => Promise<string>;
  fetchPayments: (params?: PaginationParams) => Promise<void>;
  fetchPayment: (id: string) => Promise<void>;
  confirmPayment: (paymentId: string) => Promise<void>;
  clearError: () => void;
}

type PaymentStore = PaymentState & PaymentActions;

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // Initial state
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },

  // Actions
  createPayment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentService.createPayment(data);
      set({ isLoading: false });
      return response.checkoutUrl;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create payment',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPayments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<Payment> = await paymentService.getPaymentHistory(params);
      set({
        payments: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch payments',
        isLoading: false,
      });
    }
  },

  fetchPayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const payment = await paymentService.getPayment(id);
      set({
        currentPayment: payment,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch payment',
        isLoading: false,
      });
    }
  },

  confirmPayment: async (paymentId) => {
    set({ isLoading: true, error: null });
    try {
      const payment = await paymentService.confirmPayment(paymentId);
      set((state) => ({
        payments: state.payments.map((p) =>
          p.id === paymentId ? payment : p
        ),
        currentPayment: state.currentPayment?.id === paymentId ? payment : state.currentPayment,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to confirm payment',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
