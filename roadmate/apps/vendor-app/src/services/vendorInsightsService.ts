import { TimeframePeriod } from './vendorDashboardService';

export interface ServicePerformanceStat {
  id: string;
  name: string;
  subcategory: string;
  views: number;
  clicks: number;
  bookings: number;
  revenue: number;
  rating: number;
  popularityScore: number; // 0 - 100
}

export interface CustomerInsights {
  newCustomersCount: number;
  returningCustomersCount: number;
  newCustomersPercentage: number;
  peakEnquiryHour: string; // e.g. "5:00 PM - 7:00 PM"
  mostPopularCategory: string; // e.g. "Garage Services"
  mostPopularDay: string; // e.g. "Saturday"
  mostPopularTime: string; // e.g. "Evening (4 PM - 8 PM)"
}

export const getTopServicesPerformance = (category: string = 'Garage'): ServicePerformanceStat[] => {
  if (category === 'Car Wash') {
    return [
      {
        id: '1',
        name: 'Exterior Foam Wash',
        subcategory: 'Exterior Wash',
        views: 450,
        clicks: 210,
        bookings: 68,
        revenue: 20332,
        rating: 4.9,
        popularityScore: 96,
      },
      {
        id: '2',
        name: 'Interior Deep Detailing',
        subcategory: 'Interior Detailing',
        views: 320,
        clicks: 140,
        bookings: 32,
        revenue: 31968,
        rating: 4.8,
        popularityScore: 88,
      },
      {
        id: '3',
        name: 'Full Body Ceramic Coating',
        subcategory: 'Ceramic Coating',
        views: 190,
        clicks: 75,
        bookings: 12,
        revenue: 72000,
        rating: 4.7,
        popularityScore: 74,
      },
    ];
  }

  // Default Garage services leaderboard
  return [
    {
      id: '1',
      name: 'Engine Overhaul & Tuneup',
      subcategory: 'General Repair',
      views: 620,
      clicks: 340,
      bookings: 84,
      revenue: 714000,
      rating: 4.9,
      popularityScore: 98,
    },
    {
      id: '2',
      name: 'Brake Caliper Pad Replacement',
      subcategory: 'Brake Service',
      views: 480,
      clicks: 260,
      bookings: 62,
      revenue: 30938,
      rating: 4.8,
      popularityScore: 91,
    },
    {
      id: '3',
      name: 'AC Gas Recharging & Filter Cleaning',
      subcategory: 'Electrical Work',
      views: 390,
      clicks: 195,
      bookings: 45,
      revenue: 54000,
      rating: 4.7,
      popularityScore: 84,
    },
    {
      id: '4',
      name: 'Computerized Wheel Alignment',
      subcategory: 'Suspension Work',
      views: 290,
      clicks: 140,
      bookings: 38,
      revenue: 13300,
      rating: 4.6,
      popularityScore: 76,
    },
    {
      id: '5',
      name: 'Full Synthetic Engine Oil Change',
      subcategory: 'General Repair',
      views: 240,
      clicks: 110,
      bookings: 29,
      revenue: 46371,
      rating: 4.5,
      popularityScore: 70,
    },
  ];
};

export const getCustomerInsights = (timeframe: TimeframePeriod): CustomerInsights => {
  return {
    newCustomersCount: 185,
    returningCustomersCount: 127,
    newCustomersPercentage: 59.3,
    peakEnquiryHour: '4:00 PM - 7:00 PM',
    mostPopularCategory: 'Periodic Garage Maintenance',
    mostPopularDay: 'Saturday & Sunday',
    mostPopularTime: 'Evening (5:00 PM - 8:00 PM)',
  };
};
