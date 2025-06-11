
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'super_admin';
  createdAt: string;
  updatedAt: string;
}

export interface Work {
  id: string;
  title: string;
  authors: string[];
  coAuthors?: string[];
  isrc?: string;
  iswc?: string;
  upcCode?: string;
  status: 'pending' | 'paid' | 'authorized' | 'exclusive' | 'rejected';
  files: WorkFile[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkFile {
  id: string;
  fileName: string;
  fileType: 'audio' | 'lyrics' | 'contract' | 'document';
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface AuthorizationRequest {
  id: string;
  workId: string;
  userId: string;
  requestType: 'exclusivity' | 'additional_rights';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  proofFiles: WorkFile[];
  createdAt: string;
  updatedAt: string;
  work?: Work;
}

export interface Payment {
  id: string;
  userId: string;
  workId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'mercado_pago' | 'subscription';
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  author?: string;
  upcCode?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
