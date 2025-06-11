
export const WORK_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  AUTHORIZED: 'authorized',
  EXCLUSIVE: 'exclusive',
  REJECTED: 'rejected'
} as const;

export const AUTHORIZATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export const FILE_TYPES = {
  AUDIO: ['mp3', 'wav', 'flac', 'm4a'],
  DOCUMENT: ['pdf', 'doc', 'docx'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif']
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'home' },
  { label: 'Register Work', path: '/register-work', icon: 'plus' },
  { label: 'Search Works', path: '/search', icon: 'search' },
  { label: 'My Works', path: '/my-works', icon: 'file' },
  { label: 'Payments', path: '/payments', icon: 'calendar' }
] as const;
