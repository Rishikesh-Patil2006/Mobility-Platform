import axios from 'axios';

export interface CouponItem {
  id: string;
  vendorId: string;
  code: string;
  description: string;
  discountValue: string;
  validityDate: string;
  usageLimit: number;
  usageCount: number;
  applicableServices: string[];
  isEnabled: boolean;
}

const API_URL = 'http://localhost:5000/api/services/promotions';

let mockCouponsStore: CouponItem[] = [
  {
    id: 'COUP-101',
    vendorId: 'vendor-1',
    code: 'ROAD500',
    description: 'Save ₹500 instantly on engine diagnostics and periodic service.',
    discountValue: '₹500 Off',
    validityDate: '2026-08-31',
    usageLimit: 100,
    usageCount: 42,
    applicableServices: ['Engine Overhaul & Tuneup', 'Scheduled Service'],
    isEnabled: true,
  },
  {
    id: 'COUP-102',
    vendorId: 'vendor-1',
    code: 'WASH20',
    description: 'Get 20% discount on all premium foam washing services.',
    discountValue: '20% Off',
    validityDate: '2026-09-30',
    usageLimit: 200,
    usageCount: 118,
    applicableServices: ['Car Wash & Wax'],
    isEnabled: true,
  },
  {
    id: 'COUP-103',
    vendorId: 'vendor-1',
    code: 'FREEAC',
    description: 'Free AC gas pressure test with any periodic oil change.',
    discountValue: '100% Off Inspection',
    validityDate: '2026-07-31',
    usageLimit: 50,
    usageCount: 50,
    applicableServices: ['AC Gas Recharging & Filter Cleaning'],
    isEnabled: false,
  },
];

export const validateCouponCode = (code: string, currentId?: string): { valid: boolean; error?: string } => {
  const formatted = code.trim().toUpperCase();
  if (!formatted || formatted.length < 3) {
    return { valid: false, error: 'Coupon code must be at least 3 characters long.' };
  }
  const duplicate = mockCouponsStore.find((c) => c.code === formatted && c.id !== currentId);
  if (duplicate) {
    return { valid: false, error: `Coupon code '${formatted}' already exists.` };
  }
  return { valid: true };
};

export const fetchCoupons = async (vendorId?: string): Promise<CouponItem[]> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data?.coupons) {
      mockCouponsStore = res.data.data.coupons;
      return mockCouponsStore;
    }
  } catch (e) {
    // Offline
  }
  return mockCouponsStore;
};

export const saveCoupon = async (
  coupon: Partial<CouponItem>
): Promise<{ success: boolean; data?: CouponItem; error?: string }> => {
  const formattedCode = (coupon.code || '').trim().toUpperCase();
  const check = validateCouponCode(formattedCode, coupon.id);
  if (!check.valid) return { success: false, error: check.error };

  const id = coupon.id || `COUP-${Date.now().toString().slice(-4)}`;
  const fullCoupon: CouponItem = {
    id,
    vendorId: coupon.vendorId || 'vendor-1',
    code: formattedCode,
    description: coupon.description || '',
    discountValue: coupon.discountValue || '10% Off',
    validityDate: coupon.validityDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    usageLimit: Number(coupon.usageLimit) || 100,
    usageCount: coupon.usageCount || 0,
    applicableServices: coupon.applicableServices || ['All'],
    isEnabled: coupon.isEnabled !== undefined ? coupon.isEnabled : true,
  };

  try {
    await axios.post(API_URL, { type: 'coupon', item: fullCoupon });
  } catch (e) {
    // Offline
  }

  const idx = mockCouponsStore.findIndex((c) => c.id === id);
  if (idx > -1) mockCouponsStore[idx] = fullCoupon;
  else mockCouponsStore.unshift(fullCoupon);

  return { success: true, data: fullCoupon };
};

export const toggleCoupon = async (couponId: string): Promise<boolean> => {
  const idx = mockCouponsStore.findIndex((c) => c.id === couponId);
  if (idx > -1) {
    mockCouponsStore[idx].isEnabled = !mockCouponsStore[idx].isEnabled;
    try {
      await axios.post(API_URL, { type: 'coupon', item: mockCouponsStore[idx] });
    } catch (e) {
      // Offline
    }
    return true;
  }
  return false;
};

export const deleteCoupon = async (couponId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${couponId}`);
  } catch (e) {
    // Offline
  }
  mockCouponsStore = mockCouponsStore.filter((c) => c.id !== couponId);
  return true;
};
