import axios from 'axios';

export type BannerType = 'Business' | 'Festival' | 'Seasonal' | 'Offer';

export interface PromotionBannerItem {
  id: string;
  vendorId: string;
  title: string;
  bannerType: BannerType;
  imageUri: string;
  scheduleVisibility: string;
  clickCount: number;
}

const API_URL = 'http://localhost:5000/api/services/promotions';

let mockBannersStore: PromotionBannerItem[] = [
  {
    id: 'BAN-101',
    vendorId: 'vendor-1',
    title: 'Monsoon Breakdown Protection Banner',
    bannerType: 'Seasonal',
    imageUri: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
    scheduleVisibility: 'Active · Valid until Aug 31',
    clickCount: 420,
  },
  {
    id: 'BAN-102',
    vendorId: 'vendor-1',
    title: 'Speed Auto Garage Official Cover',
    bannerType: 'Business',
    imageUri: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
    scheduleVisibility: 'Always Active',
    clickCount: 890,
  },
  {
    id: 'BAN-103',
    vendorId: 'vendor-1',
    title: 'Diwali Festive Mega Discounts',
    bannerType: 'Festival',
    imageUri: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600',
    scheduleVisibility: 'Scheduled · Oct 15 - Nov 15',
    clickCount: 150,
  },
];

export const fetchBanners = async (vendorId?: string): Promise<PromotionBannerItem[]> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data?.banners) {
      mockBannersStore = res.data.data.banners;
      return mockBannersStore;
    }
  } catch (e) {
    // Offline
  }
  return mockBannersStore;
};

export const saveBanner = async (
  banner: Partial<PromotionBannerItem>
): Promise<{ success: boolean; data?: PromotionBannerItem }> => {
  const id = banner.id || `BAN-${Date.now().toString().slice(-4)}`;
  const fullBanner: PromotionBannerItem = {
    id,
    vendorId: banner.vendorId || 'vendor-1',
    title: banner.title || 'Promotional Banner',
    bannerType: banner.bannerType || 'Offer',
    imageUri: banner.imageUri || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
    scheduleVisibility: banner.scheduleVisibility || 'Active · Scheduled',
    clickCount: banner.clickCount || 0,
  };

  try {
    await axios.post(API_URL, { type: 'banner', item: fullBanner });
  } catch (e) {
    // Offline
  }

  const idx = mockBannersStore.findIndex((b) => b.id === id);
  if (idx > -1) mockBannersStore[idx] = fullBanner;
  else mockBannersStore.unshift(fullBanner);

  return { success: true, data: fullBanner };
};

export const deleteBanner = async (bannerId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${bannerId}`);
  } catch (e) {
    // Offline
  }
  mockBannersStore = mockBannersStore.filter((b) => b.id !== bannerId);
  return true;
};
