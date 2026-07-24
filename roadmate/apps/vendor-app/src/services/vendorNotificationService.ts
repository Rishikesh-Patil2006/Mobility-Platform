export interface NotificationPreferences {
  newBookings?: boolean;
  bookingUpdates?: boolean;
  enquiries?: boolean;
  reviews: boolean;
  whatsAppMessages?: boolean;
  calls?: boolean;
  promotions?: boolean;
  systemNotifications?: boolean;
  listings?: boolean;
  tips?: boolean;
  subscription?: boolean;
  verification?: boolean;
  announcements?: boolean;
  general?: boolean;
}

let mockNotificationStore: NotificationPreferences = {
  reviews: true,
  listings: true,
  tips: true,
  subscription: true,
  verification: true,
  announcements: true,
  general: true,
};

export const fetchNotificationPreferences = async (): Promise<NotificationPreferences> => {
  return { ...mockNotificationStore };
};

export const updateNotificationPreferences = async (
  prefs: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  mockNotificationStore = {
    ...mockNotificationStore,
    ...prefs,
  };
  return { ...mockNotificationStore };
};
