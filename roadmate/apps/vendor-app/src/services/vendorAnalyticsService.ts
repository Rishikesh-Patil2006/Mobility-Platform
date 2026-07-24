import { TimeframePeriod } from './vendorDashboardService';

export interface CustomerEngagementStats {
  profileVisits: number;
  serviceClicks: number;
  phoneCalls: number;
  whatsAppClicks: number;
  navigationRequests: number;
  favouriteSaves: number;
  shareCount: number;
}

export interface BookingsAnalytics {
  pendingBookings: number;
  acceptedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  rejectedBookings: number;
  upcomingBookings: number;
  todaysBookings: number;
  totalBookings: number;
}

export interface TrendPoint {
  label: string; // e.g. "Mon", "Tue", "Jan", "10 AM"
  value: number;
}

export const getCustomerEngagementStats = (timeframe: TimeframePeriod): CustomerEngagementStats => {
  const multiplier = timeframe === 'Today' ? 1 : timeframe === 'Last 7 Days' ? 7 : timeframe === 'Last 30 Days' ? 30 : 90;

  return {
    profileVisits: Math.round(48 * (multiplier / 7)),
    serviceClicks: Math.round(124 * (multiplier / 7)),
    phoneCalls: Math.round(18 * (multiplier / 7)),
    whatsAppClicks: Math.round(28 * (multiplier / 7)),
    navigationRequests: Math.round(14 * (multiplier / 7)),
    favouriteSaves: Math.round(12 * (multiplier / 7)),
    shareCount: Math.round(8 * (multiplier / 7)),
  };
};

export const getBookingsAnalytics = (timeframe: TimeframePeriod): BookingsAnalytics => {
  const scale = timeframe === 'Today' ? 1 : timeframe === 'Last 7 Days' ? 6 : 24;

  return {
    pendingBookings: 3,
    acceptedBookings: Math.round(8 * scale),
    completedBookings: Math.round(24 * scale),
    cancelledBookings: Math.round(2 * scale),
    rejectedBookings: 1,
    upcomingBookings: 5,
    todaysBookings: 4,
    totalBookings: Math.round(35 * scale),
  };
};

export const getViewsTrend = (timeframe: TimeframePeriod): TrendPoint[] => {
  if (timeframe === 'Today') {
    return [
      { label: '8 AM', value: 12 },
      { label: '10 AM', value: 34 },
      { label: '12 PM', value: 48 },
      { label: '2 PM', value: 28 },
      { label: '4 PM', value: 42 },
      { label: '6 PM', value: 56 },
      { label: '8 PM', value: 30 },
    ];
  }
  if (timeframe === 'Last 7 Days') {
    return [
      { label: 'Mon', value: 92 },
      { label: 'Tue', value: 115 },
      { label: 'Wed', value: 140 },
      { label: 'Thu', value: 128 },
      { label: 'Fri', value: 185 },
      { label: 'Sat', value: 210 },
      { label: 'Sun', value: 165 },
    ];
  }
  return [
    { label: 'Week 1', value: 480 },
    { label: 'Week 2', value: 620 },
    { label: 'Week 3', value: 790 },
    { label: 'Week 4', value: 910 },
  ];
};

export const getBookingsTrend = (timeframe: TimeframePeriod): TrendPoint[] => {
  if (timeframe === 'Today') {
    return [
      { label: '9 AM', value: 1 },
      { label: '11 AM', value: 2 },
      { label: '1 PM', value: 0 },
      { label: '3 PM', value: 3 },
      { label: '5 PM', value: 2 },
    ];
  }
  return [
    { label: 'Mon', value: 4 },
    { label: 'Tue', value: 7 },
    { label: 'Wed', value: 6 },
    { label: 'Thu', value: 9 },
    { label: 'Fri', value: 12 },
    { label: 'Sat', value: 15 },
    { label: 'Sun', value: 10 },
  ];
};
