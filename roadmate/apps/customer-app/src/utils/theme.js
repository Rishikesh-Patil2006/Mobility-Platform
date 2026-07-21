// roadmate/apps/customer-app/src/utils/theme.js

// Shared UI style token variables for Roadmate Customer App
export const Theme = {
  colors: {
    primary: '#2563EB', // Brand Blue
    primaryLight: '#EFF6FF',
    primaryBorder: '#BFDBFE',
    
    success: '#10B981', // Brand Green
    successDark: '#059669',
    successLight: '#ECFDF5',
    successBorder: '#A7F3D0',
    
    danger: '#EF4444', // Brand Red
    dangerDark: '#DC2626',
    dangerLight: '#FEF2F2',
    dangerBorder: '#FECACA',
    
    warning: '#F59E0B', // Brand Yellow/Amber
    warningDark: '#D97706',
    warningLight: '#FEF3C7',
    warningBorder: '#FDE68A',
    
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textPlaceholder: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    xxl: 24,
    round: 9999,
  }
};

// Common style utility functions for rendering empty states and validation helpers
export const validateDateString = (dateStr) => {
  // Matches YYYY-MM-DD format
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};
