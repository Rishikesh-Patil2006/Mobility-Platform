import { VendorProfile } from '../context/VendorProfileContext';

export const validateEmail = (email: string): string => {
  const trimmed = email.trim();
  if (!trimmed) return 'Email address is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return 'Enter a valid email address.';
  return '';
};

export const validateMobileNumber = (mobile: string): string => {
  const trimmed = mobile.trim();
  if (!trimmed) return 'Mobile number is required.';
  if (trimmed.length !== 10 || !/^\d+$/.test(trimmed)) {
    return 'Mobile number must be exactly 10 digits.';
  }
  return '';
};

export const validateWhatsAppNumber = (whatsapp: string): string => {
  const trimmed = whatsapp.trim();
  if (!trimmed) return 'WhatsApp number is required.';
  if (trimmed.length !== 10 || !/^\d+$/.test(trimmed)) {
    return 'WhatsApp number must be exactly 10 digits.';
  }
  return '';
};

export const validatePassword = (password: string, confirmPassword?: string): string => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
};

export const validateBusinessDescription = (desc: string): string => {
  const len = desc.trim().length;
  if (len === 0) return 'Business description is required.';
  if (len < 50) return `Description is too short. Please add at least ${50 - len} more characters.`;
  if (len > 1000) return `Description exceeds limit by ${len - 1000} characters.`;
  return '';
};

export const validatePricing = (startingPrice: string, inspectionCharges: string): string => {
  if (!startingPrice || isNaN(Number(startingPrice)) || Number(startingPrice) < 0) {
    return 'Valid Starting Price is required.';
  }
  if (!inspectionCharges || isNaN(Number(inspectionCharges)) || Number(inspectionCharges) < 0) {
    return 'Valid Inspection Charges are required.';
  }
  return '';
};
