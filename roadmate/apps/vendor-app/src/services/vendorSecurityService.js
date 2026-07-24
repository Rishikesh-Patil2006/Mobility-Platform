const SESSION_TOKEN_KEY = '@roadmate_vendor_session_token';
const ACTIVE_VENDOR_ID = 'vendor-1';

let inMemoryToken = null;

// 1. ROLE-BASED ACCESS CONTROL (RBAC) DATA ISOLATION
export const validateVendorOwnership = (resourceVendorId, activeVendorId = ACTIVE_VENDOR_ID) => {
  if (!resourceVendorId) return true;
  if (resourceVendorId !== activeVendorId) {
    throw new Error('403 Forbidden: Access denied. You can only manage your own business data.');
  }
  return true;
};

// 2. INPUT VALIDATORS
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return { valid: false, error: 'Email address is required.' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return { valid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  return { valid: true };
};

export const validateMobileNumber = (mobile) => {
  if (!mobile) return { valid: false, error: 'Mobile phone number is required.' };
  const cleanMobile = String(mobile).replace(/\D/g, '');
  const re = /^[6-9]\d{9}$/;
  if (!re.test(cleanMobile)) return { valid: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  return { valid: true, cleanMobile };
};

export const validateImageUrl = (url) => {
  if (!url || typeof url !== 'string') return { valid: true }; // Optional URL
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
    return { valid: false, error: 'Image URL must begin with http:// or https://' };
  }
  return { valid: true };
};

export const validateTextLength = (text, fieldName = 'Field', min = 3, max = 500) => {
  if (!text || typeof text !== 'string') return { valid: false, error: `${fieldName} is required.` };
  const trimmed = text.trim();
  if (trimmed.length < min) return { valid: false, error: `${fieldName} must be at least ${min} characters long.` };
  if (trimmed.length > max) return { valid: false, error: `${fieldName} cannot exceed ${max} characters.` };
  return { valid: true, text: trimmed };
};

// 3. FILE UPLOAD VALIDATION
export const validateImageUpload = (file) => {
  if (!file) return { valid: false, error: 'No image file selected.' };
  const fileName = file.name || file.uri || '';
  const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const hasValidExt = validExts.some((ext) => fileName.toLowerCase().endsWith(ext)) || fileName.startsWith('data:image/');

  if (!hasValidExt) {
    return { valid: false, error: 'Unsupported file format. Please upload JPG, PNG, or WebP images.' };
  }

  // 5MB limit check (5 * 1024 * 1024 bytes)
  if (file.size && file.size > 5242880) {
    return { valid: false, error: 'File size exceeds 5 MB limit. Please select a compressed image.' };
  }

  return { valid: true };
};

// 4. SESSION & TOKEN STORAGE PLACEHOLDERS
export const saveVendorSessionToken = async (token) => {
  try {
    inMemoryToken = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SESSION_TOKEN_KEY, token);
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const getVendorSessionToken = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(SESSION_TOKEN_KEY) || inMemoryToken;
    }
    return inMemoryToken;
  } catch (e) {
    return inMemoryToken;
  }
};

export const clearVendorSessionToken = async () => {
  try {
    inMemoryToken = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(SESSION_TOKEN_KEY);
    }
    return true;
  } catch (e) {
    return false;
  }
};

// 5. API ERROR PROTECTION & HANDLING
export const handleApiError = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (error.response) {
    const status = error.response.status;
    if (status === 401) return '401 Unauthorized: Session expired. Please log in again.';
    if (status === 403) return '403 Forbidden: Access denied. Permission validation failed.';
    if (status === 404) return '404 Not Found: Requested resource or endpoint does not exist.';
    if (status === 500) return '500 Server Error: Internal server error. Please try again later.';
  }

  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Connection Timeout: Server response took too long. Please retry.';
  }

  if (error.message?.includes('Network Error') || !navigator.onLine) {
    return 'No Internet Connection: Please check your network connectivity.';
  }

  return error.message || 'Network request failed. Please try again.';
};
