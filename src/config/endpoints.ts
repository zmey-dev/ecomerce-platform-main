
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Works endpoints
  WORKS: {
    LIST: '/works',
    CREATE: '/works',
    GET: (id: string) => `/works/${id}`,
    UPDATE: (id: string) => `/works/${id}`,
    DELETE: (id: string) => `/works/${id}`,
    SEARCH: '/works/search',
    UPLOAD: '/works/upload'
  },
  
  // Authorization endpoints
  AUTHORIZATION: {
    REQUEST: '/authorization/request',
    LIST: '/authorization',
    APPROVE: (id: string) => `/authorization/${id}/approve`,
    REJECT: (id: string) => `/authorization/${id}/reject`
  },
  
  // Payment endpoints
  PAYMENTS: {
    CREATE: '/payments/create',
    CONFIRM: '/payments/confirm',
    HISTORY: '/payments/history',
    WEBHOOK: '/payments/webhook'
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    WORKS: '/admin/works',
    PAYMENTS: '/admin/payments',
    ANALYTICS: '/admin/analytics'
  }
} as const;
