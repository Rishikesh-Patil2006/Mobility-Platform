import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

let mockNotificationsFeed = [
  {
    id: 'notif-1',
    type: 'SUBSCRIPTION',
    title: '💳 Subscription Expiry Advisory',
    message: 'Your Gold Plan expires in 15 days. Tap Renew to maintain uninterrupted priority search visibility.',
    date: '2026-07-24',
    time: '09:30 AM',
    isRead: false,
    icon: '💳',
    accentColor: '#EAB308',
  },
  {
    id: 'notif-2',
    type: 'VERIFICATION',
    title: '✅ Business Verified',
    message: 'Congratulations! Your workshop documents (Shop Act, PAN) were verified by Super Admin.',
    date: '2026-07-23',
    time: '04:15 PM',
    isRead: false,
    icon: '✅',
    accentColor: '#16A34A',
  },
  {
    id: 'notif-3',
    type: 'REVIEW',
    title: '⭐ New Customer Review (5 Stars)',
    message: 'Rahul Deshmukh posted a 5-star review for "Full Engine Diagnostic & Tune Up".',
    date: '2026-07-20',
    time: '02:45 PM',
    isRead: false,
    icon: '⭐',
    accentColor: '#2563EB',
  },
  {
    id: 'notif-4',
    type: 'TIP',
    title: '🛠️ Tip Published Live',
    message: 'Your educational tip "5 Essential Car Battery Maintenance Tips" was approved and published.',
    date: '2026-07-21',
    time: '11:20 AM',
    isRead: true,
    icon: '🛠️',
    accentColor: '#06B6D4',
  },
  {
    id: 'notif-5',
    type: 'LISTING',
    title: '🟢 Listing Approved',
    message: 'Service listing "Car Foam Wash & Interior Steam Clean" is now active on Customer App.',
    date: '2026-07-18',
    time: '10:00 AM',
    isRead: true,
    icon: '🟢',
    accentColor: '#10B981',
  },
  {
    id: 'notif-6',
    type: 'ANNOUNCEMENT',
    title: '📢 Super Admin Announcement',
    message: 'Festive Season Priority Listing Boost is now active across Maharashtra region!',
    date: '2026-07-15',
    time: '08:00 AM',
    isRead: true,
    icon: '📢',
    accentColor: '#7C3AED',
  },
];

let mockActivityTimeline = [
  {
    id: 'act-1',
    type: 'SERVICE_CREATED',
    title: 'Service Listing Created',
    description: 'Added "Brake Pad Replacement & Fluid Refill" to catalog',
    date: '2026-07-22',
    time: '02:30 PM',
    status: 'Approved',
    icon: '🔧',
  },
  {
    id: 'act-2',
    type: 'TIP_PUBLISHED',
    title: 'Educational Article Published',
    description: 'Published "5 Essential Car Battery Care Tips"',
    date: '2026-07-21',
    time: '11:15 AM',
    status: 'Published',
    icon: '🛠️',
  },
  {
    id: 'act-3',
    type: 'PROFILE_UPDATED',
    title: 'Profile Particulars Updated',
    description: 'Updated operating hours to 09:00 AM - 08:00 PM',
    date: '2026-07-20',
    time: '09:45 AM',
    status: 'Completed',
    icon: '📝',
  },
  {
    id: 'act-4',
    type: 'AVAILABILITY_CHANGED',
    title: 'Workshop Status Changed',
    description: 'Set workshop status to Available for service inquiries',
    date: '2026-07-19',
    time: '08:00 AM',
    status: 'Active',
    icon: '⏱️',
  },
  {
    id: 'act-5',
    type: 'SUBSCRIPTION_RENEWED',
    title: 'Gold Annual Subscription',
    description: 'Purchased Gold Plan for ₹2,499/year (Receipt #INV-2026-001)',
    date: '2026-01-01',
    time: '10:00 AM',
    status: 'Success',
    icon: '💳',
  },
  {
    id: 'act-6',
    type: 'BUSINESS_VERIFIED',
    title: 'Official Verification Verified',
    description: 'Shop Act & GST documents approved by Super Admin',
    date: '2025-12-15',
    time: '04:20 PM',
    status: 'Verified',
    icon: '✅',
  },
];

let mockPreferences = {
  reviews: true,
  listings: true,
  tips: true,
  subscription: true,
  verification: true,
  announcements: true,
  general: true,
};

export const fetchNotifications = async () => {
  return [...mockNotificationsFeed];
};

export const getUnreadCount = (notifications = mockNotificationsFeed) => {
  return notifications.filter((n) => !n.isRead).length;
};

export const markAsRead = async (id) => {
  const idx = mockNotificationsFeed.findIndex((n) => n.id === id);
  if (idx > -1) {
    mockNotificationsFeed[idx] = {
      ...mockNotificationsFeed[idx],
      isRead: true,
    };
    await syncNotificationsToBackend();
  }
  return [...mockNotificationsFeed];
};

export const markAllAsRead = async () => {
  mockNotificationsFeed = mockNotificationsFeed.map((n) => ({
    ...n,
    isRead: true,
  }));
  await syncNotificationsToBackend();
  return [...mockNotificationsFeed];
};

export const deleteNotification = async (id) => {
  mockNotificationsFeed = mockNotificationsFeed.filter((n) => n.id !== id);
  await syncNotificationsToBackend();
  return [...mockNotificationsFeed];
};

export const clearAllNotifications = async () => {
  mockNotificationsFeed = [];
  await syncNotificationsToBackend();
  return [];
};

export const fetchActivityTimeline = async () => {
  return [...mockActivityTimeline];
};

export const fetchNotificationPreferences = async () => {
  return { ...mockPreferences };
};

export const updateNotificationPreferences = async (newPrefs) => {
  mockPreferences = {
    ...mockPreferences,
    ...newPrefs,
  };
  await syncNotificationsToBackend();
  return { ...mockPreferences };
};

export const syncNotificationsToBackend = async () => {
  try {
    await axios.post(`${API_URL}/sync-all`, {
      notifications: mockNotificationsFeed,
      preferences: mockPreferences,
      timeline: mockActivityTimeline,
    });
  } catch (e) {
    // Offline
  }
};
