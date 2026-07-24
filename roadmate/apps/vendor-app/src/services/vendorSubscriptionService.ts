import axios from 'axios';

export type SubscriptionTier = any;

export interface SubscriptionPlanItem {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  badgeEmoji: string;
  tagline: string;
  features: string[];
  status: string;
  validity: string;
  isPopular: boolean;
  hasPremiumBadge: boolean;
  // Legacy fields for backward compatibility
  annualPrice?: number;
  billingCycle?: string;
  serviceLimits?: string;
  priorityRanking?: string;
  featuredAccess?: boolean;
  analyticsAccess?: string;
  supportLevel?: string;
}

export interface CurrentSubscription {
  vendorId: string;
  planName: string;
  planId: string;
  status: string;
  duration: string;
  startDate: string;
  dueDate: string;
  remainingDays: number;
  daysRemaining?: number;
  renewalDate?: string;
  autoRenewal: boolean;
  recipient: string;
  premiumBadgeActive: boolean;
  featuredListingActive: boolean;
  unlockedFeatures?: string[];
}

const API_URL = 'http://localhost:5000/api/services';

export const subscriptionPlans: SubscriptionPlanItem[] = [
  {
    id: 'plan-basic',
    name: 'Basic',
    price: 0,
    formattedPrice: '₹0 / Year',
    badgeEmoji: '⚪',
    tagline: 'Standard Free Listing',
    features: [
      'Basic Business Listing',
      'Up to 3 Service Listings',
      'Limited Gallery Images (Max 3)',
      'Standard Search Visibility',
      'Email Customer Support',
    ],
    status: 'Available',
    validity: '1 Year',
    isPopular: false,
    hasPremiumBadge: false,
    serviceLimits: '3 Services Max',
    priorityRanking: 'Standard Listing',
    analyticsAccess: 'Basic',
    supportLevel: 'Email Support',
  },
  {
    id: 'plan-silver',
    name: 'Silver',
    price: 999,
    formattedPrice: '₹999 / Year',
    badgeEmoji: '🥈',
    tagline: 'Enhanced Visibility & Priority',
    features: [
      'Everything in Basic',
      'Up to 15 Service Listings',
      'Expanded Gallery Images (Max 10)',
      'Better Search Visibility in City',
      'Priority City Listing',
      'WhatsApp Direct Inquiry Button',
    ],
    status: 'Available',
    validity: '1 Year',
    isPopular: true,
    hasPremiumBadge: true,
    serviceLimits: '15 Services',
    priorityRanking: 'Priority City Listing',
    analyticsAccess: 'Advanced',
    supportLevel: 'Priority Support',
  },
  {
    id: 'plan-gold',
    name: 'Gold',
    price: 2499,
    formattedPrice: '₹2,499 / Year',
    badgeEmoji: '🥇',
    tagline: 'Maximum Reach & Premium Badge',
    features: [
      'Everything in Silver',
      'Unlimited Service Listings',
      'Unlimited Gallery Images',
      'Maximum Search Visibility Across Region',
      'Featured Business Banner',
      'Verified Gold Premium Badge',
      '24/7 Priority VIP Support',
    ],
    status: 'Available',
    validity: '1 Year',
    isPopular: false,
    hasPremiumBadge: true,
    serviceLimits: 'Unlimited Services',
    priorityRanking: 'Maximum Regional Visibility',
    analyticsAccess: 'Full Analytics',
    supportLevel: '24/7 VIP Support',
  },
];

let mockSubscriptionStore: CurrentSubscription = {
  vendorId: 'vendor-1',
  planName: 'Gold',
  planId: 'plan-gold',
  status: 'Active',
  duration: '1 Year (Annual)',
  startDate: '2026-01-01',
  dueDate: '2026-12-31',
  remainingDays: 161,
  daysRemaining: 161,
  renewalDate: '2026-12-31',
  autoRenewal: true,
  recipient: 'Super Admin',
  premiumBadgeActive: true,
  featuredListingActive: true,
  unlockedFeatures: ['Unlimited Listings', 'Premium Gold Badge', 'Featured Banner'],
};

let mockPaymentHistoryStore: any[] = [
  {
    id: 'pay-1',
    txnId: 'TXN-9840214',
    invoiceNo: 'INV-2026-001',
    date: '2026-01-01',
    amount: 2499,
    planName: 'Gold',
    status: 'SUCCESS',
    method: 'UPI (GPay)',
    recipient: 'Super Admin',
  },
  {
    id: 'pay-0',
    txnId: 'TXN-8730129',
    invoiceNo: 'INV-2025-084',
    date: '2025-01-01',
    amount: 999,
    planName: 'Silver',
    status: 'SUCCESS',
    method: 'Credit Card',
    recipient: 'Super Admin',
  },
];

export const validatePromoCode = (code: string, planPrice?: number) => {
  return { valid: false, discount: 0, discountAmount: 0, error: 'Invalid or expired promo code' };
};

export const getSubscriptionExpiryAlert = (remainingDays: number) => {
  if (remainingDays <= 0) {
    return {
      severity: 'CRITICAL',
      title: '❌ Subscription Expired',
      message: 'Your subscription has expired. Upgrade or renew now to restore your Premium Badge and Featured Listing status.',
    };
  } else if (remainingDays === 1) {
    return {
      severity: 'HIGH',
      title: '🚨 Subscription Expires Today!',
      message: 'Your subscription expires today! Renew now to avoid losing priority visibility in customer searches.',
    };
  } else if (remainingDays <= 7) {
    return {
      severity: 'WARNING',
      title: `⚠️ Subscription Expires in ${remainingDays} Days`,
      message: `Your active plan will expire in ${remainingDays} days. Renew early to maintain uninterrupted listing features.`,
    };
  } else if (remainingDays <= 15) {
    return {
      severity: 'INFO',
      title: `ℹ️ Subscription Expiry Advisory (${remainingDays} Days Left)`,
      message: `Your current annual plan expires in ${remainingDays} days. Tap Renew to extend your validity.`,
    };
  }
  return null;
};

export const fetchSubscriptionDetails = async (): Promise<CurrentSubscription> => {
  return { ...mockSubscriptionStore };
};

export const fetchPaymentHistory = async (): Promise<any[]> => {
  return [...mockPaymentHistoryStore];
};

export const purchaseOrRenewPlan = async (planName: string, paymentMethod = 'UPI') => {
  const selected = subscriptionPlans.find((p) => p.name === planName) || subscriptionPlans[1];
  const now = new Date().toISOString().split('T')[0];

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const due = nextYear.toISOString().split('T')[0];

  mockSubscriptionStore = {
    ...mockSubscriptionStore,
    planName: selected.name,
    planId: selected.id,
    status: 'Active',
    startDate: now,
    dueDate: due,
    remainingDays: 365,
    daysRemaining: 365,
    renewalDate: due,
    premiumBadgeActive: selected.hasPremiumBadge,
    featuredListingActive: selected.name === 'Gold',
  };

  const newPayment = {
    id: `pay-${Date.now()}`,
    txnId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
    invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: now,
    amount: selected.price,
    planName: selected.name,
    status: 'SUCCESS',
    method: paymentMethod,
    recipient: 'Super Admin',
  };

  mockPaymentHistoryStore.unshift(newPayment);
  await syncSubscriptionToBackend();
  return { subscription: mockSubscriptionStore, payment: newPayment };
};

export const toggleAutoRenewal = async (): Promise<boolean> => {
  mockSubscriptionStore.autoRenewal = !mockSubscriptionStore.autoRenewal;
  await syncSubscriptionToBackend();
  return mockSubscriptionStore.autoRenewal;
};

export const syncSubscriptionToBackend = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/sync-all`, {
      subscription: mockSubscriptionStore,
      payments: mockPaymentHistoryStore,
    });
  } catch (e) {
    // Offline fallback
  }
};
