import { BookingItem } from './vendorBookingService';
import { EnquiryItem } from './vendorEnquiryService';

export interface CustomerHistoryProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  visitCount: number;
  lastInteraction: string; // e.g. "Today, 10:30 AM"
  vehicles: string[];
  frequentlyUsedServices: string[];
  previousBookingsCount: number;
  previousEnquiriesCount: number;
}

export const mockCustomerDirectory: CustomerHistoryProfile[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    mobile: '+91 98765 43210',
    email: 'rahul.s@gmail.com',
    visitCount: 6,
    lastInteraction: 'Today, 10:30 AM',
    vehicles: ['Honda City (MH-19-AB-1234)', 'Hero Splendor (MH-19-JK-1111)'],
    frequentlyUsedServices: ['Engine Overhaul', 'Oil Change', 'General Service'],
    previousBookingsCount: 4,
    previousEnquiriesCount: 2,
  },
  {
    id: 'cust-2',
    name: 'Sameer Patil',
    mobile: '+91 90999 54321',
    email: 'sameer.p@yahoo.com',
    visitCount: 4,
    lastInteraction: 'Today, 01:30 PM',
    vehicles: ['Honda Activa 6G (MH-19-CD-5678)'],
    frequentlyUsedServices: ['Brake Service', 'Foam Wash'],
    previousBookingsCount: 3,
    previousEnquiriesCount: 1,
  },
  {
    id: 'cust-3',
    name: 'Priya Kulkarni',
    mobile: '+91 91122 33445',
    email: 'priya.k@outlook.com',
    visitCount: 8,
    lastInteraction: 'Today, 03:45 PM',
    vehicles: ['Hyundai Creta EV (MH-19-EF-9012)'],
    frequentlyUsedServices: ['AC Service & Refill', 'Battery Health Check', 'Interior Detailing'],
    previousBookingsCount: 5,
    previousEnquiriesCount: 3,
  },
  {
    id: 'cust-4',
    name: 'Manoj Kumar',
    mobile: '+91 93344 55667',
    email: 'manoj.k@gmail.com',
    visitCount: 2,
    lastInteraction: 'Yesterday, 11:00 AM',
    vehicles: ['Mahindra XUV700 (MH-19-OP-4444)'],
    frequentlyUsedServices: ['Synthetic Oil Change', 'Wheel Balancing'],
    previousBookingsCount: 2,
    previousEnquiriesCount: 0,
  },
];

export const fetchCustomerDirectory = async (): Promise<CustomerHistoryProfile[]> => {
  return mockCustomerDirectory;
};
