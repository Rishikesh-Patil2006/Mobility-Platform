import axios from 'axios';

export type ThemeMode = 'Light' | 'Dark' | 'System';

export interface BusinessPreferences {
  currency: string;
  timeZone: string;
  language: string;
  dateFormat: string;
  themeMode: ThemeMode;
}

export interface PrivacySettings {
  businessVisibility: boolean;
  displayContactNumber: boolean;
  displayWhatsApp: boolean;
  displayEmail: boolean;
  displayAddress: boolean;
  displayBusinessHours: boolean;
}

const API_URL = 'http://localhost:5000/api/services/settings';

let mockPreferencesStore: BusinessPreferences = {
  currency: 'INR (₹)',
  timeZone: 'Asia/Kolkata (IST)',
  language: 'English',
  dateFormat: 'DD/MM/YYYY',
  themeMode: 'Light',
};

let mockPrivacyStore: PrivacySettings = {
  businessVisibility: true,
  displayContactNumber: true,
  displayWhatsApp: true,
  displayEmail: true,
  displayAddress: true,
  displayBusinessHours: true,
};

export const fetchPreferences = async (): Promise<BusinessPreferences> => {
  return mockPreferencesStore;
};

export const updatePreferences = async (
  prefs: Partial<BusinessPreferences>
): Promise<BusinessPreferences> => {
  mockPreferencesStore = {
    ...mockPreferencesStore,
    ...prefs,
  };
  return mockPreferencesStore;
};

export const fetchPrivacySettings = async (): Promise<PrivacySettings> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data?.privacy) {
      mockPrivacyStore = res.data.data.privacy;
      return mockPrivacyStore;
    }
  } catch (e) {
    // Offline
  }
  return mockPrivacyStore;
};

export const updatePrivacySettings = async (
  privacy: Partial<PrivacySettings>
): Promise<PrivacySettings> => {
  mockPrivacyStore = {
    ...mockPrivacyStore,
    ...privacy,
  };

  try {
    await axios.put(API_URL, { privacy: mockPrivacyStore });
  } catch (e) {
    // Offline
  }

  return mockPrivacyStore;
};
