export interface ReferralHistoryItem {
  id: string;
  customerName: string;
  joinedDate: string;
  rewardEarned: string;
}

export interface ReferralDetails {
  referralCode: string;
  referralCount: number;
  rewardPoints: number;
  referralHistory: ReferralHistoryItem[];
}

export interface MarketingMetrics {
  offerViews: number;
  offerClicks: number;
  couponUsage: number;
  bannerClicks: number;
  conversionRate: number; // e.g. 14.8%
  topCampaign: string;
  bestPerformingOffer: string;
  mostClickedBanner: string;
  highestBookedService: string;
  mostSharedService: string;
}

const mockReferralData: ReferralDetails = {
  referralCode: 'SPEED-PARTNER-77',
  referralCount: 18,
  rewardPoints: 3600,
  referralHistory: [
    { id: 'ref-1', customerName: 'Rahul Sharma', joinedDate: 'Yesterday', rewardEarned: '₹200 Credit' },
    { id: 'ref-2', customerName: 'Sameer Patil', joinedDate: '3 days ago', rewardEarned: '₹200 Credit' },
    { id: 'ref-3', customerName: 'Priya Kulkarni', joinedDate: '1 week ago', rewardEarned: '₹200 Credit' },
  ],
};

const mockMarketingMetricsData: MarketingMetrics = {
  offerViews: 2480,
  offerClicks: 620,
  couponUsage: 160,
  bannerClicks: 1460,
  conversionRate: 14.8,
  topCampaign: 'Monsoon Car Wash Special',
  bestPerformingOffer: '25% Off Foam Wash',
  mostClickedBanner: 'Monsoon Breakdown Protection',
  highestBookedService: 'Engine Overhaul & Tuneup',
  mostSharedService: 'Ceramic Body Coating',
};

export const fetchReferralDetails = async (): Promise<ReferralDetails> => {
  return mockReferralData;
};

export const getMarketingMetrics = async (): Promise<MarketingMetrics> => {
  return mockMarketingMetricsData;
};
