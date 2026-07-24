import axios from 'axios';

export interface ServiceItem {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  detailedDescription: string;
  startingPrice: string;
  actualPrice: string;
  offerPrice?: string;
  duration: string;
  warranty?: string;
  bannerImage: string;
  gallery: string[];
  tags: string[];
  status: 'Visible' | 'Hidden' | 'Draft';
  isPopular: boolean;
  isFeatured: boolean;
  isOffer: boolean;
}

const API_URL = 'http://localhost:5000/api/services';

// In-Memory store fallback
let mockServicesStore: ServiceItem[] = [];

// Helper to pre-populate mock services depending on category
export const getPrepopulatedServices = (vendorId: string, category: string): ServiceItem[] => {
  if (category === 'Garage') {
    return [
      {
        id: 'srv-garage-1',
        vendorId,
        name: 'Engine Overhaul',
        category: 'Garage',
        subcategory: 'General Repair',
        shortDescription: 'Complete engine diagnostic and overhaul.',
        detailedDescription: 'Professional multi-point engine block check, cylinder honing, replacement of worn pistons, rings, valves, timing kits, and oil pump systems with genuine factory replacement units.',
        startingPrice: '199',
        actualPrice: '9999',
        offerPrice: '8500',
        duration: '1 Day',
        warranty: '12 Months',
        bannerImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
        gallery: [],
        tags: ['Engine', 'Overhaul', 'Repair'],
        status: 'Visible',
        isPopular: true,
        isFeatured: true,
        isOffer: true,
      },
      {
        id: 'srv-garage-2',
        vendorId,
        name: 'Brake Service',
        category: 'Garage',
        subcategory: 'Brake Service',
        shortDescription: 'Full brake caliper clean & pad replacement.',
        detailedDescription: 'Full inspection of brake liners, cleaning of disc calipers, brake pads lubrication, brake fluid topping up, and optional brake pads replacement with premium friction material.',
        startingPrice: '99',
        actualPrice: '599',
        offerPrice: '499',
        duration: '45 Mins',
        warranty: '3 Months',
        bannerImage: 'https://images.unsplash.com/photo-1619642e1cd6c?w=600',
        gallery: [],
        tags: ['Brakes', 'Safety', 'Disc'],
        status: 'Visible',
        isPopular: true,
        isFeatured: false,
        isOffer: true,
      },
      {
        id: 'srv-garage-3',
        vendorId,
        name: 'AC Repair & Refill',
        category: 'Garage',
        subcategory: 'Electrical Work',
        shortDescription: 'Car AC gas topping and filter cleaning.',
        detailedDescription: 'AC cooling unit evaluation, condenser dust blow-out, cabin AC filter cleanup, and eco-friendly R134a cooling gas recharging to restore original chilled cabin temperatures.',
        startingPrice: '149',
        actualPrice: '1499',
        offerPrice: '1200',
        duration: '30 Mins',
        warranty: '6 Months',
        bannerImage: 'https://images.unsplash.com/photo-1619642e1cd6c?w=600',
        gallery: [],
        tags: ['AC', 'Cooling', 'Refill'],
        status: 'Visible',
        isPopular: false,
        isFeatured: false,
        isOffer: true,
      },
    ];
  } else if (category === 'Car Wash') {
    return [
      {
        id: 'srv-wash-1',
        vendorId,
        name: 'Exterior Foam Wash',
        category: 'Car Wash',
        subcategory: 'Exterior Wash',
        shortDescription: 'Sparkling exterior body shampoo and wax coating.',
        detailedDescription: 'Underbody high pressure spraying, active foam shampoo exterior rubbing, micro-fiber clean dry, alloy wheel polishing, tyre dress shine, and exterior glaze protective wax finish.',
        startingPrice: '299',
        actualPrice: '399',
        offerPrice: '299',
        duration: '20 Mins',
        warranty: '',
        bannerImage: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600',
        gallery: [],
        tags: ['Wash', 'Foam', 'Exterior'],
        status: 'Visible',
        isPopular: true,
        isFeatured: true,
        isOffer: true,
      },
      {
        id: 'srv-wash-2',
        vendorId,
        name: 'Interior Deep Detailing',
        category: 'Car Wash',
        subcategory: 'Interior Detailing',
        shortDescription: 'Total cabin vacuum, steam cleanup and sanitization.',
        detailedDescription: 'Full cabin deep vacuum cleaner sweep, roof carpet steam wash, dashboard vinyl polish protectant layer, seat stain spot scrubbing, leather nourishment oil, and AC vents ozone sanitizing treatment.',
        startingPrice: '299',
        actualPrice: '1200',
        offerPrice: '999',
        duration: '2 Hours',
        warranty: '1 Month',
        bannerImage: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
        gallery: [],
        tags: ['Interior', 'Deep Clean', 'Steam'],
        status: 'Visible',
        isPopular: false,
        isFeatured: false,
        isOffer: true,
      },
    ];
  }

  // Generic showroom/provider preload
  return [
    {
      id: `srv-${category.toLowerCase().replace(/\s/g, '')}-1`,
      vendorId,
      name: `Standard ${category} Offering`,
      category,
      subcategory: 'General Services',
      shortDescription: `Professional ${category} package details.`,
      detailedDescription: `Full certified operational procedure for ${category} offerings. Genuine parts, quick turnaround times, and verified expert support staff.`,
      startingPrice: '499',
      actualPrice: '599',
      offerPrice: '499',
      duration: '1 Hour',
      warranty: '',
      bannerImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
      gallery: [],
      tags: ['Premium', 'Verified'],
      status: 'Visible',
      isPopular: true,
      isFeatured: true,
      isOffer: false,
    },
  ];
};

export const fetchServices = async (vendorId: string, category: string): Promise<ServiceItem[]> => {
  try {
    const res = await axios.get(`${API_URL}?vendorId=${vendorId}`);
    if (res.data?.success && res.data?.data && res.data.data.length > 0) {
      mockServicesStore = res.data.data;
      return mockServicesStore;
    }
  } catch (error) {
    console.warn('Backend offline, loading services locally.');
  }

  // Fallback to local memory
  if (mockServicesStore.length === 0) {
    mockServicesStore = getPrepopulatedServices(vendorId, category);
  }
  return mockServicesStore.filter((s) => s.vendorId === vendorId);
};

export const saveService = async (service: ServiceItem): Promise<ServiceItem> => {
  try {
    const res = await axios.post(API_URL, service);
    if (res.data?.success && res.data?.data) {
      const saved = res.data.data;
      const idx = mockServicesStore.findIndex((s) => s.id === saved.id);
      if (idx > -1) {
        mockServicesStore[idx] = saved;
      } else {
        mockServicesStore.push(saved);
      }
      return saved;
    }
  } catch (error) {
    console.warn('Backend API failed, saving service in-memory.');
  }

  // Fallback save in local
  const idx = mockServicesStore.findIndex((s) => s.id === service.id);
  if (idx > -1) {
    mockServicesStore[idx] = service;
  } else {
    mockServicesStore.push(service);
  }
  return service;
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    if (res.data?.success) {
      mockServicesStore = mockServicesStore.filter((s) => s.id !== id);
      return true;
    }
  } catch (error) {
    console.warn('Backend API failed, deleting service in-memory.');
  }

  mockServicesStore = mockServicesStore.filter((s) => s.id !== id);
  return true;
};

export const duplicateService = async (id: string): Promise<ServiceItem | null> => {
  const existing = mockServicesStore.find((s) => s.id === id);
  if (!existing) return null;

  const duplicated: ServiceItem = {
    ...existing,
    id: `srv-dup-${Date.now()}`,
    name: `Copy of ${existing.name}`,
    status: 'Visible',
  };

  return await saveService(duplicated);
};

export const toggleServiceVisibility = async (id: string): Promise<ServiceItem | null> => {
  const existing = mockServicesStore.find((s) => s.id === id);
  if (!existing) return null;

  const updated: ServiceItem = {
    ...existing,
    status: existing.status === 'Visible' ? 'Hidden' : 'Visible',
  };

  return await saveService(updated);
};
