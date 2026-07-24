export interface CommunicationLogItem {
  id: string;
  customerName: string;
  customerMobile: string;
  channel: 'Call' | 'WhatsApp' | 'SMS' | 'Email' | 'Navigation';
  timestamp: string; // e.g. "Today, 10:45 AM"
  notes?: string;
}

let mockLogStore: CommunicationLogItem[] = [
  {
    id: 'log-1',
    customerName: 'Rahul Sharma',
    customerMobile: '+91 98765 43210',
    channel: 'Call',
    timestamp: 'Today, 10:45 AM',
    notes: 'Outbound call to confirm arrival slot for engine check.',
  },
  {
    id: 'log-2',
    customerName: 'Sameer Patil',
    customerMobile: '+91 90999 54321',
    channel: 'WhatsApp',
    timestamp: 'Today, 09:30 AM',
    notes: 'Sent quotation link for brake pad replacement.',
  },
  {
    id: 'log-3',
    customerName: 'Priya Kulkarni',
    customerMobile: '+91 91122 33445',
    channel: 'Navigation',
    timestamp: 'Yesterday, 03:15 PM',
    notes: 'Customer requested workshop location pin.',
  },
];

export const fetchCommunicationHistory = async (): Promise<CommunicationLogItem[]> => {
  return mockLogStore;
};

export const logCommunicationEvent = async (
  item: Omit<CommunicationLogItem, 'id'>
): Promise<CommunicationLogItem> => {
  const newItem: CommunicationLogItem = {
    ...item,
    id: `log-${Date.now()}`,
  };
  mockLogStore.unshift(newItem);
  return newItem;
};
