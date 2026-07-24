import axios from 'axios';

export type DiscountType = 'Percentage' | 'Flat';
export type OfferStatus = 'Active' | 'Upcoming' | 'Expired' | 'Draft';

export interface OfferItem {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  bannerUri?: string;
  applicableServices: string[];
  status: OfferStatus;
}

const API_URL = 'http://localhost:5000/api/services/promotions';

let mockOffersStore: OfferItem[] = [
  {
    id: 'OFFER-101',
    vendorId: 'vendor-1',
    title: 'Monsoon Car Wash Special',
    description: 'Get 25% flat discount on all full body foam washing & underbody rust treatment.',
    discountType: 'Percentage',
    discountValue: 25,
    minOrderAmount: 499,
    maxDiscountAmount: 300,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    bannerUri: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
    applicableServices: ['Car Wash & Wax', 'Full Detailing'],
    status: 'Active',
  },
  {
    id: 'OFFER-102',
    vendorId: 'vendor-1',
    title: 'Flat ₹500 Off Engine Tuneup',
    description: 'Flat ₹500 instant cash discount on full synthetic oil change & engine tuneup.',
    discountType: 'Flat',
    discountValue: 500,
    minOrderAmount: 2500,
    startDate: '2026-07-15',
    endDate: '2026-09-15',
    bannerUri: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
    applicableServices: ['Engine Overhaul & Tuneup'],
    status: 'Active',
  },
  {
    id: 'OFFER-103',
    vendorId: 'vendor-1',
    title: 'Diwali Festive Super Deal',
    description: 'Exclusive 30% off ceramic coating & interior sanitization.',
    discountType: 'Percentage',
    discountValue: 30,
    minOrderAmount: 5000,
    maxDiscountAmount: 2000,
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    bannerUri: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600',
    applicableServices: ['Ceramic Coating'],
    status: 'Upcoming',
  },
];

export const validateOffer = (offer: Partial<OfferItem>): { valid: boolean; error?: string } => {
  if (!offer.title || offer.title.trim().length < 3) {
    return { valid: false, error: 'Offer title must be at least 3 characters long.' };
  }
  if (!offer.discountValue || offer.discountValue <= 0) {
    return { valid: false, error: 'Discount value must be greater than 0.' };
  }
  if (offer.startDate && offer.endDate && offer.endDate <= offer.startDate) {
    return { valid: false, error: 'End date must be after start date.' };
  }
  return { valid: true };
};

export const fetchOffers = async (vendorId?: string): Promise<OfferItem[]> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data?.offers) {
      mockOffersStore = res.data.data.offers;
      return mockOffersStore;
    }
  } catch (e) {
    // Offline
  }
  return mockOffersStore;
};

export const saveOffer = async (
  offer: Partial<OfferItem>
): Promise<{ success: boolean; data?: OfferItem; error?: string }> => {
  const check = validateOffer(offer);
  if (!check.valid) return { success: false, error: check.error };

  const id = offer.id || `OFFER-${Date.now().toString().slice(-4)}`;
  const fullOffer: OfferItem = {
    id,
    vendorId: offer.vendorId || 'vendor-1',
    title: offer.title || '',
    description: offer.description || '',
    discountType: offer.discountType || 'Percentage',
    discountValue: Number(offer.discountValue) || 10,
    minOrderAmount: Number(offer.minOrderAmount) || 0,
    maxDiscountAmount: offer.maxDiscountAmount ? Number(offer.maxDiscountAmount) : undefined,
    startDate: offer.startDate || new Date().toISOString().split('T')[0],
    endDate: offer.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    bannerUri: offer.bannerUri || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
    applicableServices: offer.applicableServices || ['All'],
    status: offer.status || 'Active',
  };

  try {
    await axios.post(API_URL, { type: 'offer', item: fullOffer });
  } catch (e) {
    // Offline
  }

  const idx = mockOffersStore.findIndex((o) => o.id === id);
  if (idx > -1) mockOffersStore[idx] = fullOffer;
  else mockOffersStore.unshift(fullOffer);

  return { success: true, data: fullOffer };
};

export const deleteOffer = async (offerId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${offerId}`);
  } catch (e) {
    // Offline
  }
  mockOffersStore = mockOffersStore.filter((o) => o.id !== offerId);
  return true;
};
