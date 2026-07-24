export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidMobile = (mobile: string): boolean => {
  const cleaned = mobile.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 12;
};

export const isValidPassword = (password: string): { valid: boolean; error?: string } => {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
};

export const generateSecureSessionToken = (vendorId: string): string => {
  return `RM_SESS_${vendorId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
