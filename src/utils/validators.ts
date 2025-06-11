
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  required: (value: string | undefined | null): boolean => {
    return Boolean(value && value.trim().length > 0);
  },

  isrc: (isrc: string): boolean => {
    // ISRC format: CC-XXX-YY-NNNNN
    const isrcRegex = /^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$/;
    return isrcRegex.test(isrc);
  },

  iswc: (iswc: string): boolean => {
    // ISWC format: T-DDD.DDD.DDD-C
    const iswcRegex = /^T-\d{3}\.\d{3}\.\d{3}-\d$/;
    return iswcRegex.test(iswc);
  },

  fileType: (file: File, allowedTypes: string[]): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  },

  fileSize: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
  }
};
