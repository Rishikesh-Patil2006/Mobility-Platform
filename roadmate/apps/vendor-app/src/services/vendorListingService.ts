import axios from 'axios';
import { ServiceItem } from './vendorServiceService';

export interface CustomerAppSyncedService {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  description: string;
  images: string[];
  businessName: string;
  businessLogo: string;
  rating: number;
  verified: boolean;
  status: string;
}

export interface FullVendorSyncPayload {
  vendorId: string;
  businessName: string;
  logo: string;
  category: string;
  address: string;
  city: string;
  rating: number;
  reviewsCount: number;
  verificationStatus: string;
  subscriptionTier: string;
  premiumBadgeActive: boolean;
  services: ServiceItem[];
  offers: any[];
  privacy: any;
}

const API_URL = 'http://localhost:5000/api/services';

export const syncServicesForCustomerApp = async (
  vendorId: string,
  services: ServiceItem[]
): Promise<CustomerAppSyncedService[]> => {
  const visible = services.filter((s) => s.status === 'Visible');
  const formatted: CustomerAppSyncedService[] = visible.map((s) => ({
    id: `${vendorId}-${s.id}`,
    name: s.name,
    category: s.category || 'Garage',
    subcategory: (s as any).subcategory || (s as any).subCategory || 'General',
    price: Number(s.offerPrice || s.actualPrice || s.startingPrice || 0),
    description: s.shortDescription || s.detailedDescription,
    images: s.bannerImage ? [s.bannerImage, ...(s.gallery || [])] : [],
    businessName: 'Speedy Auto Care',
    businessLogo: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150',
    rating: 4.8,
    verified: true,
    status: s.status,
  }));

  try {
    await axios.post(`${API_URL}/sync-all`, { vendorId, services: formatted });
  } catch (e) {
    // Offline
  }

  return formatted;
};

export const syncFullVendorProfileToBackend = async (
  payload: FullVendorSyncPayload
): Promise<boolean> => {
  try {
    const res = await axios.post(`${API_URL}/sync-all`, payload);
    return res.data?.success || false;
  } catch (e) {
    return false;
  }
};
