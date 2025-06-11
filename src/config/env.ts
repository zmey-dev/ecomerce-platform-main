
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  MERCADO_PAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '',
  APP_NAME: 'MusicWorks Platform',
  VERSION: '1.0.0'
} as const;
