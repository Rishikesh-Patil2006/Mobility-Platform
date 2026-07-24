export const getListingKPIMetricsByTimeframe = (period = 'Last 7 Days') => {
  const periodMultipliers = {
    'Today': 0.15,
    'Last 7 Days': 1,
    'Last 30 Days': 3.8,
    'Last 3 Months': 11.2,
    'This Year': 42.5,
  };

  const mult = periodMultipliers[period] || 1;

  return {
    profileViews: Math.round(1420 * mult),
    profileViewsChange: '+18.4% vs last period',

    serviceViews: Math.round(3850 * mult),
    serviceViewsChange: '+24.1% vs last period',

    whatsAppClicks: Math.round(240 * mult),
    whatsAppChange: '+15.2% vs last period',

    phoneCalls: Math.round(185 * mult),
    callsChange: '+12.8% vs last period',

    directionRequests: Math.round(94 * mult),
    directionsChange: '+8.6% vs last period',

    averageRating: 4.8,
    totalReviews: 48,
    ratingSubtitle: '48 total verified reviews',

    publishedTipsCount: 5,
    tipsViews: Math.round(1316 * mult),
    tipsCTR: '12.4% CTR',
    tipsSubtitle: '5 Articles Published',

    profileCompletion: 95,
    verificationStatus: 'Verified',
    
    subscriptionPlan: 'Gold',
    subscriptionBadge: '🥇 Gold Plan',
  };
};
