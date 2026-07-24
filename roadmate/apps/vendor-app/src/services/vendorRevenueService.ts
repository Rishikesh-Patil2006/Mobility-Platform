export interface RevenueTrendItem {
  month: string;
  amount: number;
}

export interface RevenueMetrics {
  monthlyRevenue: number;
  annualRevenue: number;
  totalEarnings: number;
  averageBookingValue: number;
  bookingRevenue: number;
  promotionRevenuePlaceholder: number;
  revenueTrends: RevenueTrendItem[];
}

const mockRevenueData: RevenueMetrics = {
  monthlyRevenue: 48500,
  annualRevenue: 540000,
  totalEarnings: 892000,
  averageBookingValue: 1250,
  bookingRevenue: 42100,
  promotionRevenuePlaceholder: 6400,
  revenueTrends: [
    { month: 'Jan', amount: 32000 },
    { month: 'Feb', amount: 36500 },
    { month: 'Mar', amount: 41000 },
    { month: 'Apr', amount: 39500 },
    { month: 'May', amount: 44000 },
    { month: 'Jun', amount: 46200 },
    { month: 'Jul', amount: 48500 },
  ],
};

export const fetchRevenueMetrics = async (vendorId?: string): Promise<RevenueMetrics> => {
  return mockRevenueData;
};
