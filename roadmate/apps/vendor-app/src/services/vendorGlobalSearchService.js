import { fetchServices, toggleServiceVisibility } from './vendorServiceService';
import { fetchTips } from './vendorTipService';
import { fetchReviews } from './vendorReviewService';

export const defaultFilterState = {
  query: '',
  category: 'All',
  subcategory: 'All',
  availability: 'All', // All | Available | Busy | Closed | On Leave
  serviceStatus: 'All', // All | Visible | Hidden | Pending Verification | Inactive
  tipStatus: 'All', // All | Published | Draft | Archived
  subscriptionPlan: 'All', // All | Gold | Silver | Basic
  verificationStatus: 'All', // All | Verified | Pending
  rating: 'All', // All | 5 | 4+ | 3+
  sortBy: 'Recently Added', // Recently Added | Recently Updated | Alphabetical (A-Z) | Alphabetical (Z-A) | Highest Rated | Most Viewed
};

export const executeGlobalSearch = async (filters = defaultFilterState, vendorProfile = null) => {
  const vendorId = vendorProfile?.vendorId || 'vendor-1';
  const mainCategory = vendorProfile?.mainCategory || 'Garage';

  const rawServices = await fetchServices(vendorId, mainCategory);
  const rawTips = await fetchTips(vendorId);
  const rawReviews = await fetchReviews(vendorId);

  const q = (filters.query || '').trim().toLowerCase();

  // Attach insights to service items
  const enrichedServices = rawServices.map((srv, idx) => ({
    ...srv,
    itemType: 'service',
    views: 450 + idx * 85,
    calls: 28 + idx * 6,
    whatsAppClicks: 42 + idx * 9,
    directionClicks: 18 + idx * 4,
    ctr: `${(11.2 + idx * 0.8).toFixed(1)}%`,
    averageRating: 4.8,
    createdDate: '2026-07-01',
    lastUpdated: '2026-07-20',
  }));

  const enrichedTips = rawTips.map((tip) => ({
    ...tip,
    itemType: 'tip',
    views: tip.analytics?.views || 320,
    ctr: tip.analytics?.ctr || '10.5%',
    calls: 12,
    whatsAppClicks: 24,
    directionClicks: 8,
    averageRating: 5.0,
  }));

  const enrichedReviews = rawReviews.map((rev) => ({
    ...rev,
    itemType: 'review',
    title: `Review by ${rev.customerName}`,
    shortDescription: rev.reviewText,
    createdDate: rev.date || '2026-07-20',
  }));

  // 1. FILTER SERVICES
  const filteredServices = enrichedServices.filter((srv) => {
    if (q) {
      const match =
        (srv.name || '').toLowerCase().includes(q) ||
        (srv.shortDescription || '').toLowerCase().includes(q) ||
        (srv.category || '').toLowerCase().includes(q) ||
        (srv.subcategory || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.category !== 'All' && srv.category !== filters.category) return false;
    if (filters.subcategory !== 'All' && srv.subcategory !== filters.subcategory) return false;
    if (filters.serviceStatus !== 'All' && srv.status !== filters.serviceStatus) return false;
    if (filters.rating === '5' && srv.averageRating < 5) return false;
    if (filters.rating === '4+' && srv.averageRating < 4) return false;
    if (filters.rating === '3+' && srv.averageRating < 3) return false;

    return true;
  });

  // 2. FILTER TIPS
  const filteredTips = enrichedTips.filter((tip) => {
    if (q) {
      const match =
        (tip.title || '').toLowerCase().includes(q) ||
        (tip.shortDescription || '').toLowerCase().includes(q) ||
        (tip.category || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.tipStatus !== 'All' && tip.status !== filters.tipStatus) return false;

    return true;
  });

  // 3. FILTER REVIEWS
  const filteredReviews = enrichedReviews.filter((rev) => {
    if (q) {
      const match =
        (rev.customerName || '').toLowerCase().includes(q) ||
        (rev.serviceName || '').toLowerCase().includes(q) ||
        (rev.reviewText || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.rating === '5' && rev.rating !== 5) return false;
    if (filters.rating === '4+' && rev.rating < 4) return false;
    if (filters.rating === '3+' && rev.rating < 3) return false;

    return true;
  });

  // SORT FUNCTION
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (filters.sortBy === 'Alphabetical (A-Z)') {
        return (a.name || a.title || '').localeCompare(b.name || b.title || '');
      }
      if (filters.sortBy === 'Alphabetical (Z-A)') {
        return (b.name || b.title || '').localeCompare(a.name || a.title || '');
      }
      if (filters.sortBy === 'Most Viewed') {
        return (b.views || 0) - (a.views || 0);
      }
      if (filters.sortBy === 'Highest Rated') {
        return (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0);
      }
      if (filters.sortBy === 'Recently Updated') {
        return new Date(b.lastUpdated || b.date || '2026-07-01').getTime() - new Date(a.lastUpdated || a.date || '2026-07-01').getTime();
      }
      // Default: Recently Added
      return new Date(b.createdDate || b.date || '2026-07-01').getTime() - new Date(a.createdDate || a.date || '2026-07-01').getTime();
    });
  };

  return {
    services: sortItems(filteredServices),
    tips: sortItems(filteredTips),
    reviews: sortItems(filteredReviews),
    totalCount: filteredServices.length + filteredTips.length + filteredReviews.length,
  };
};

export const toggleListingVisibility = async (serviceId) => {
  return await toggleServiceVisibility(serviceId);
};
