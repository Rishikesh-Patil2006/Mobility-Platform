export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  subcategories: string[];
}

export interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    title: 'Regular Vendors',
    items: [
      {
        id: 'Garage',
        name: 'Garage',
        emoji: '🔧',
        description: 'Periodic services, mechanical repairs & diagnostics',
        subcategories: ['General Repair', 'Engine Diagnostics', 'Brake Service', 'Electrical Work', 'Battery Replacement', 'Suspension Work'],
      },
      {
        id: 'Car Wash',
        name: 'Car Wash',
        emoji: '🫧',
        description: 'Premium washing, detailing & interior cleanup',
        subcategories: ['Exterior Wash', 'Interior Detailing', 'Full Detailing', 'Ceramic Coating', 'Engine Bay Detailing', 'Dashboard Polishing'],
      },
    ],
  },
  {
    title: 'Service Providers',
    items: [
      {
        id: 'PUC Center',
        name: 'PUC Center',
        emoji: '💨',
        description: 'Pollution certificates & emission testing',
        subcategories: ['Petrol PUC', 'Diesel PUC', 'CNG/LPG PUC', 'HSRP Plate Booking Helper', 'DigiLocker Upload Assistance'],
      },
      {
        id: 'Towing',
        name: 'Towing Services',
        emoji: '🛻',
        description: '24/7 roadside assistance & flatbed towing',
        subcategories: ['Flatbed Towing', 'Hydraulic Towing', 'Accident Recovery', 'Breakdown Towing', 'Two-Wheeler Towing', 'Long Distance Towing'],
      },
      {
        id: 'Driving Classes',
        name: 'Driving Classes',
        emoji: '🚗',
        description: 'Professional driving lessons & tutoring',
        subcategories: ['Four Wheeler Course (15 Days)', 'Two Wheeler Driving Lessons', 'Refresher Driving Course (5 Days)', 'Simulator Driving Sessions', 'License Test Preparation'],
      },
      {
        id: 'RTO Agents',
        name: 'RTO Agents',
        emoji: '📝',
        description: 'License issues, registration & transfer agents',
        subcategories: ['Driving License Application Assistance', 'Vehicle Transfer & NOC Registration', 'Re-registration (Vehicle Ageing)', 'Address Change in RC', 'Hypothecation Termination (HP Endorsement)'],
      },
    ],
  },
  {
    title: 'Showrooms',
    items: [
      {
        id: 'Two Wheelers',
        name: 'Two Wheelers',
        emoji: '🏍️',
        description: 'New bikes showroom, test drives & bookings',
        subcategories: ['Commuter Bikes', 'Sports Touring Bikes', 'Scooters Booking', 'EV Scooters', 'Superbikes Showcase'],
      },
      {
        id: 'Four Wheelers',
        name: 'Four Wheelers',
        emoji: '🚘',
        description: 'New cars showroom, EV bookings & specs',
        subcategories: ['Hatchbacks Booking', 'Sedans Booking', 'SUVs Booking', 'Electric Vehicles (EV) Booking', 'Luxury Cars Showcase'],
      },
      {
        id: 'Service Center',
        name: 'Service Center',
        emoji: '🏬',
        description: 'Brand authorized workshop & checkups',
        subcategories: ['Scheduled Service', 'Warranty Service', 'Oil & Filter Replacement', 'Computerized Scanning', 'AC Filter Cleaning', 'Multi-Point Inspection'],
      },
    ],
  },
];

export const getAllCategories = (): CategoryItem[] => {
  return categoryGroups.flatMap((group) => group.items);
};

export const getCategoryById = (id: string): CategoryItem | undefined => {
  return getAllCategories().find((c) => c.id === id);
};
