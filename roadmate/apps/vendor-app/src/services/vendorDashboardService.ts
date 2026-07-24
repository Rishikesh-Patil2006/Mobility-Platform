export type TimeframePeriod = 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'This Year' | 'Custom';

export interface KPIMetrics {
  totalProfileViews: number;
  serviceViews: number;
  customerEnquiries: number;
  callsReceived: number;
  whatsAppClicks: number;
  directionRequests: number;
  bookings: number;
  activeServices: number;
  totalReviews: number;
  averageRating: number;

  // Percentage changes compared to previous period
  profileViewsChange: number; // e.g. +14.2
  serviceViewsChange: number;
  enquiriesChange: number;
  callsChange: number;
  whatsAppChange: number;
  directionsChange: number;
  bookingsChange: number;
}

export interface PerformanceSummary {
  period: string;
  revenueEstimate: number;
  totalLeads: number;
  conversionRate: number; // in %
  periodGrowth: number; // % vs previous
}

export const getKPIMetricsByTimeframe = (timeframe: TimeframePeriod): KPIMetrics => {
  switch (timeframe) {
    case 'Today':
      return {
        totalProfileViews: 48,
        serviceViews: 124,
        customerEnquiries: 12,
        callsReceived: 9,
        whatsAppClicks: 14,
        directionRequests: 7,
        bookings: 5,
        activeServices: 8,
        totalReviews: 42,
        averageRating: 4.8,
        profileViewsChange: 18.5,
        serviceViewsChange: 22.0,
        enquiriesChange: 15.2,
        callsChange: 8.4,
        whatsAppChange: 25.0,
        directionsChange: 12.0,
        bookingsChange: 20.0,
      };

    case 'Last 7 Days':
      return {
        totalProfileViews: 342,
        serviceViews: 890,
        customerEnquiries: 78,
        callsReceived: 54,
        whatsAppClicks: 92,
        directionRequests: 41,
        bookings: 34,
        activeServices: 8,
        totalReviews: 42,
        averageRating: 4.8,
        profileViewsChange: 14.2,
        serviceViewsChange: 19.8,
        enquiriesChange: 11.4,
        callsChange: 6.2,
        whatsAppChange: 18.3,
        directionsChange: 9.5,
        bookingsChange: 12.8,
      };

    case 'Last 30 Days':
      return {
        totalProfileViews: 1420,
        serviceViews: 3680,
        customerEnquiries: 310,
        callsReceived: 215,
        whatsAppClicks: 380,
        directionRequests: 165,
        bookings: 142,
        activeServices: 8,
        totalReviews: 42,
        averageRating: 4.8,
        profileViewsChange: 24.5,
        serviceViewsChange: 31.0,
        enquiriesChange: 18.6,
        callsChange: 14.1,
        whatsAppChange: 28.4,
        directionsChange: 16.2,
        bookingsChange: 22.1,
      };

    case 'Last 3 Months':
      return {
        totalProfileViews: 4150,
        serviceViews: 10890,
        customerEnquiries: 890,
        callsReceived: 620,
        whatsAppClicks: 1120,
        directionRequests: 480,
        bookings: 410,
        activeServices: 8,
        totalReviews: 42,
        averageRating: 4.8,
        profileViewsChange: 32.1,
        serviceViewsChange: 41.5,
        enquiriesChange: 29.0,
        callsChange: 22.4,
        whatsAppChange: 35.6,
        directionsChange: 24.8,
        bookingsChange: 30.5,
      };

    case 'This Year':
    case 'Custom':
    default:
      return {
        totalProfileViews: 12840,
        serviceViews: 34120,
        customerEnquiries: 2940,
        callsReceived: 1980,
        whatsAppClicks: 3650,
        directionRequests: 1420,
        bookings: 1250,
        activeServices: 8,
        totalReviews: 42,
        averageRating: 4.8,
        profileViewsChange: 45.2,
        serviceViewsChange: 52.8,
        enquiriesChange: 41.0,
        callsChange: 34.5,
        whatsAppChange: 48.9,
        directionsChange: 38.2,
        bookingsChange: 42.0,
      };
  }
};

export const getPerformanceSummary = (timeframe: TimeframePeriod): PerformanceSummary => {
  const metrics = getKPIMetricsByTimeframe(timeframe);
  const conversionRate = Number(((metrics.bookings / (metrics.totalProfileViews || 1)) * 100).toFixed(1));
  const estimatedRevenue = metrics.bookings * 1450; // avg order value estimation

  return {
    period: timeframe,
    revenueEstimate: estimatedRevenue,
    totalLeads: metrics.customerEnquiries + metrics.callsReceived + metrics.whatsAppClicks,
    conversionRate,
    periodGrowth: metrics.bookingsChange,
  };
};
