import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

let mockTipsStore = [
  {
    id: 'tip-1',
    vendorId: 'vendor-1',
    title: '10 Maintenance Hacks to Boost Vehicle Mileage',
    category: 'Fuel Saving',
    thumbnailImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
    coverImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000',
    shortDescription: 'Essential engine tune-up guidelines and oil inspection routines for optimum mileage.',
    detailedContent: `1. Check Tyre Air Pressure: Ensure tyres are inflated to OEM recommended PSI to lower rolling resistance.\n\n2. Engine Oil Replacement: Replace engine oil every 5,000 to 7,500 km to ensure internal lubrication.\n\n3. Clean Air Filters: Clogged air filters reduce combustion efficiency by up to 10%.\n\n4. Spark Plug Inspection: Clean or replace fouled spark plugs for smoother ignition and reduced fuel waste.`,
    tags: ['Mileage', 'Fuel', 'Engine', 'Maintenance'],
    status: 'Published', // Published | Draft | Archived
    createdDate: '2026-07-12',
    lastUpdated: '2026-07-20',
    analytics: {
      views: 482,
      ctr: '12.4%',
      likes: 64,
      shares: 18,
    },
  },
  {
    id: 'tip-2',
    vendorId: 'vendor-1',
    title: 'Monsoon Preparation & Anti-Rust Protection Checklist',
    category: 'Seasonal Tips',
    thumbnailImage: 'https://images.unsplash.com/photo-1619642e1cd6c?w=600',
    coverImage: 'https://images.unsplash.com/photo-1619642e1cd6c?w=1000',
    shortDescription: 'Guidelines for inspecting wipers, chassis anti-rust coatings, and brake pads during rains.',
    detailedContent: `1. Replace Wiper Blades: Inspect rubber squeegees for cracks or streaks. Replace before monsoon rains hit.\n\n2. Chassis Anti-Rust Undercoating: Apply zinc spray or rubberized undercoating to prevent acidic rain corrosion.\n\n3. Brake Pad Thickness: Wet roads double stopping distance. Ensure pad thickness is above 4mm.\n\n4. Tyre Tread Depth: Verify tread depth is at least 2mm to prevent hydroplaning on highways.`,
    tags: ['Monsoon', 'Rust', 'Wipers', 'Brakes'],
    status: 'Published',
    createdDate: '2026-07-04',
    lastUpdated: '2026-07-15',
    analytics: {
      views: 310,
      ctr: '9.8%',
      likes: 42,
      shares: 11,
    },
  },
  {
    id: 'tip-3',
    vendorId: 'vendor-1',
    title: 'EV Battery Thermal Management & Range Optimization',
    category: 'EV Tips',
    thumbnailImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600',
    coverImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000',
    shortDescription: 'Tips for servicing electric two-wheelers and four-wheelers to maintain battery health.',
    detailedContent: `1. Keep Charge Levels 20%-80%: Avoid deep discharge to protect lithium-ion cell chemistry.\n\n2. Cool-Down Before Fast Charging: Let the battery pack cool down for 15 mins after long highway runs before plugging into high-voltage DC chargers.\n\n3. Coolant & Thermal Check: Verify liquid battery coolant loops in electric cars during routine inspections.`,
    tags: ['EV', 'Battery', 'Range', 'Thermal'],
    status: 'Published',
    createdDate: '2026-06-28',
    lastUpdated: '2026-07-10',
    analytics: {
      views: 524,
      ctr: '14.2%',
      likes: 89,
      shares: 32,
    },
  },
  {
    id: 'tip-4',
    vendorId: 'vendor-1',
    title: 'Draft: Winter Synthetic Oil Viscosity Guide',
    category: 'Engine Care',
    thumbnailImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
    coverImage: '',
    shortDescription: 'Draft guide explaining 0W-20 vs 5W-30 synthetic oil grades for cold weather starts.',
    detailedContent: 'Draft content undergoing technical review before public release.',
    tags: ['Oil', 'Engine', 'Synthetic'],
    status: 'Draft',
    createdDate: '2026-07-22',
    lastUpdated: '2026-07-22',
    analytics: {
      views: 0,
      ctr: '0.0%',
      likes: 0,
      shares: 0,
    },
  },
  {
    id: 'tip-5',
    vendorId: 'vendor-1',
    title: 'Archived: Summer Coolant Flush 2025 Protocol',
    category: 'Maintenance Tips',
    thumbnailImage: 'https://images.unsplash.com/photo-1619642e1cd6c?w=600',
    coverImage: '',
    shortDescription: 'Retired 2025 summer radiator coolant maintenance guidelines.',
    detailedContent: 'Archived technical guide replaced by updated 2026 standards.',
    tags: ['Coolant', 'Radiator', 'Archived'],
    status: 'Archived',
    createdDate: '2025-05-10',
    lastUpdated: '2025-06-01',
    analytics: {
      views: 195,
      ctr: '5.4%',
      likes: 12,
      shares: 3,
    },
  },
];

export const fetchTips = async (vendorId = 'vendor-1') => {
  try {
    const res = await axios.get(`${API_URL}/sync-all`);
    if (res.data?.success && res.data?.data?.tips) {
      mockTipsStore = res.data.data.tips;
    }
  } catch (e) {
    // Local fallback
  }
  return [...mockTipsStore];
};

export const saveTip = async (tipData) => {
  const now = new Date().toISOString().split('T')[0];

  if (tipData.id) {
    const idx = mockTipsStore.findIndex((t) => t.id === tipData.id);
    if (idx > -1) {
      mockTipsStore[idx] = {
        ...mockTipsStore[idx],
        ...tipData,
        lastUpdated: now,
      };
      await syncTipsToBackend();
      return mockTipsStore[idx];
    }
  }

  const newTip = {
    id: `tip-${Date.now()}`,
    vendorId: tipData.vendorId || 'vendor-1',
    title: tipData.title,
    category: tipData.category || 'Vehicle Care',
    thumbnailImage: tipData.thumbnailImage || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
    coverImage: tipData.coverImage || '',
    shortDescription: tipData.shortDescription,
    detailedContent: tipData.detailedContent,
    tags: tipData.tags || [tipData.category || 'Vehicle Care'],
    status: tipData.status || 'Published',
    createdDate: now,
    lastUpdated: now,
    analytics: {
      views: 0,
      ctr: '0.0%',
      likes: 0,
      shares: 0,
    },
  };

  mockTipsStore.unshift(newTip);
  await syncTipsToBackend();
  return newTip;
};

export const deleteTip = async (id) => {
  mockTipsStore = mockTipsStore.filter((t) => t.id !== id);
  await syncTipsToBackend();
  return true;
};

export const changeTipStatus = async (id, newStatus) => {
  const tip = mockTipsStore.find((t) => t.id === id);
  if (tip) {
    tip.status = newStatus;
    tip.lastUpdated = new Date().toISOString().split('T')[0];
    await syncTipsToBackend();
    return tip;
  }
  return null;
};

export const syncTipsToBackend = async () => {
  try {
    const publishedOnly = mockTipsStore.filter((t) => t.status === 'Published');
    await axios.post(`${API_URL}/sync-all`, {
      tips: mockTipsStore,
      publishedTips: publishedOnly,
    });
  } catch (e) {
    // Offline
  }
};
