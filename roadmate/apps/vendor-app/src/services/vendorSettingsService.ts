import axios from 'axios';

export interface BusinessConfigSettings {
  workingRadius: number; // in km
  languagesSpoken: string[];
  supportedVehicleTypes: string[];
}

const API_URL = 'http://localhost:5000/api/services/settings';

let mockSettingsStore: BusinessConfigSettings = {
  workingRadius: 15,
  languagesSpoken: ['English', 'Hindi', 'Marathi'],
  supportedVehicleTypes: ['Hatchback', 'Sedan', 'SUV', 'EV', '2-Wheeler'],
};

export const fetchBusinessSettings = async (vendorId?: string): Promise<BusinessConfigSettings> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data?.businessConfig) {
      mockSettingsStore = res.data.data.businessConfig;
      return mockSettingsStore;
    }
  } catch (e) {
    // Offline
  }
  return mockSettingsStore;
};

export const updateBusinessSettings = async (
  settings: Partial<BusinessConfigSettings>
): Promise<{ success: boolean; data?: BusinessConfigSettings }> => {
  mockSettingsStore = {
    ...mockSettingsStore,
    ...settings,
  };

  try {
    await axios.put(API_URL, { businessConfig: mockSettingsStore });
  } catch (e) {
    // Offline
  }

  return { success: true, data: mockSettingsStore };
};
