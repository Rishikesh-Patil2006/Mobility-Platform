import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

let mockReviewsStore = [
  {
    id: 'rev-1',
    vendorId: 'vendor-1',
    customerName: 'Rahul Deshmukh',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    serviceName: 'Full Engine Diagnostic & Tune Up',
    rating: 5,
    date: '2026-07-20',
    reviewText: 'Outstanding service! The mechanics detected a subtle timing belt wear that saved me from a costly engine breakdown on the highway. Very professional and transparent pricing.',
    vendorReply: {
      replyText: 'Thank you so much Rahul! Glad we could inspect the timing assembly in time. Drive safe!',
      date: '2026-07-21',
    },
  },
  {
    id: 'rev-2',
    vendorId: 'vendor-1',
    customerName: 'Priya Verma',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    serviceName: 'Car Foam Wash & Interior Steam Clean',
    rating: 5,
    date: '2026-07-18',
    reviewText: 'Sparkling clean car wash. Every corner of the cabin smells fresh. The underbody wax polish coating was applied meticulously.',
    vendorReply: null,
  },
  {
    id: 'rev-3',
    vendorId: 'vendor-1',
    customerName: 'Amitabh Joshi',
    customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    serviceName: 'Brake Pad Replacement & Fluid Refill',
    rating: 4,
    date: '2026-07-15',
    reviewText: 'Good quality brake pads installed. Quick turnaround time within 45 mins. Slightly busy waiting lounge, but overall solid work.',
    vendorReply: {
      replyText: 'Thanks Amitabh! We are upgrading our customer lounge air conditioning and seating this month!',
      date: '2026-07-16',
    },
  },
  {
    id: 'rev-4',
    vendorId: 'vendor-1',
    customerName: 'Sanjay Patil',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    serviceName: 'AC Gas Top Up & Cabin Filter Change',
    rating: 5,
    date: '2026-07-10',
    reviewText: 'AC cooling is restored to ice cold levels. Highly recommended garage in Jalgaon city!',
    vendorReply: null,
  },
  {
    id: 'rev-5',
    vendorId: 'vendor-1',
    customerName: 'Vikram Singh',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    serviceName: 'Emergency Flatbed Towing Support',
    rating: 3,
    date: '2026-07-02',
    reviewText: 'Towing vehicle arrived in 35 mins. Mechanical winch handling was safe, though waiting time could be shorter during rush hour.',
    vendorReply: null,
  },
];

export const calculateRatingDistribution = (reviews = mockReviewsStore) => {
  const total = reviews.length;
  if (total === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      responseRate: '0%',
      avgResponseTime: '< 2 Hrs',
      monthlyReviews: 0,
    };
  }

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let repliedCount = 0;

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    breakdown[star] = (breakdown[star] || 0) + 1;
    sum += star;
    if (r.vendorReply && r.vendorReply.replyText) repliedCount++;
  });

  const averageRating = parseFloat((sum / total).toFixed(1));
  const percentages = {
    5: Math.round((breakdown[5] / total) * 100),
    4: Math.round((breakdown[4] / total) * 100),
    3: Math.round((breakdown[3] / total) * 100),
    2: Math.round((breakdown[2] / total) * 100),
    1: Math.round((breakdown[1] / total) * 100),
  };

  const responseRate = `${Math.round((repliedCount / total) * 100)}%`;

  return {
    averageRating,
    totalReviews: total,
    breakdown,
    percentages,
    responseRate,
    avgResponseTime: '< 2 Hrs',
    monthlyReviews: 12,
  };
};

export const fetchReviews = async (vendorId = 'vendor-1') => {
  return [...mockReviewsStore];
};

export const addOrEditReply = async (reviewId, replyText) => {
  const now = new Date().toISOString().split('T')[0];
  const idx = mockReviewsStore.findIndex((r) => r.id === reviewId);
  if (idx > -1) {
    mockReviewsStore[idx] = {
      ...mockReviewsStore[idx],
      vendorReply: {
        replyText: replyText.trim(),
        date: now,
      },
    };
    await syncReviewsToBackend();
    return mockReviewsStore[idx];
  }
  return null;
};

export const deleteReply = async (reviewId) => {
  const idx = mockReviewsStore.findIndex((r) => r.id === reviewId);
  if (idx > -1) {
    mockReviewsStore[idx] = {
      ...mockReviewsStore[idx],
      vendorReply: null,
    };
    await syncReviewsToBackend();
    return mockReviewsStore[idx];
  }
  return null;
};

export const syncReviewsToBackend = async () => {
  try {
    await axios.post(`${API_URL}/sync-all`, {
      reviews: mockReviewsStore,
    });
  } catch (e) {
    // Offline
  }
};
