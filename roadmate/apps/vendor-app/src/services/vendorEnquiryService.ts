import axios from 'axios';

export type EnquiryStatus = 'New' | 'Contacted' | 'Quotation Sent' | 'Converted' | 'Closed';

export interface EnquiryItem {
  id: string;
  vendorId: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  requestedService: string;
  dateTime: string;
  message: string;
  status: EnquiryStatus;
  quotationAmount?: number;
  notes?: string;
}

const API_URL = 'http://localhost:5000/api/services/enquiries';

let mockEnquiriesStore: EnquiryItem[] = [
  {
    id: 'EQ-501',
    vendorId: 'vendor-1',
    customerName: 'Karan Malhotra',
    customerMobile: '+91 98220 11223',
    customerEmail: 'karan.m@gmail.com',
    requestedService: 'Full Car Paint & Ceramic Coating',
    dateTime: 'Today, 11:20 AM',
    message: 'Interested in full body black matte paint job for Tata Nexon EV. What is the estimate duration and cost?',
    status: 'New',
  },
  {
    id: 'EQ-502',
    vendorId: 'vendor-1',
    customerName: 'Sanjay Rao',
    customerMobile: '+91 98330 44556',
    customerEmail: 'sanjay.r@yahoo.com',
    requestedService: 'Engine Overhaul Service',
    dateTime: 'Yesterday, 04:15 PM',
    message: 'My Honda City has compression leak in cylinder 2. Need full engine check quote.',
    status: 'Contacted',
    notes: 'Called customer on phone. Shared diagnostic schedule.',
  },
  {
    id: 'EQ-503',
    vendorId: 'vendor-1',
    customerName: 'Neha Joshi',
    customerMobile: '+91 98440 77889',
    customerEmail: 'neha.j@gmail.com',
    requestedService: 'AC Gas & Evaporator Repair',
    dateTime: '2 days ago',
    message: 'Need AC gas topping quote for Swift Dzire 2020 model.',
    status: 'Quotation Sent',
    quotationAmount: 1499,
    notes: 'Sent formal WhatsApp quotation.',
  },
  {
    id: 'EQ-504',
    vendorId: 'vendor-1',
    customerName: 'Vijay Varma',
    customerMobile: '+91 98550 99001',
    customerEmail: 'vijay.v@gmail.com',
    requestedService: 'Brake Disc & Pad Change',
    dateTime: '3 days ago',
    message: 'Brake noise when stopping. Want to book slot for Saturday morning.',
    status: 'Converted',
    notes: 'Converted to Booking BK-9802.',
  },
  {
    id: 'EQ-505',
    vendorId: 'vendor-1',
    customerName: 'Vikram Singh',
    customerMobile: '+91 98660 22334',
    customerEmail: 'vikram.s@outlook.com',
    requestedService: 'Wheel Alignment & Balancing',
    dateTime: '4 days ago',
    message: 'Do you provide laser wheel alignment for heavy 18 inch alloys?',
    status: 'Closed',
    notes: 'Customer postponed service requirement.',
  },
];

export const fetchEnquiries = async (vendorId?: string): Promise<EnquiryItem[]> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data) {
      mockEnquiriesStore = res.data.data;
      return mockEnquiriesStore;
    }
  } catch (error) {
    // Offline
  }
  return mockEnquiriesStore;
};

export const updateEnquiryStatus = async (
  enquiryId: string,
  newStatus: EnquiryStatus,
  quotationAmount?: number,
  notes?: string
): Promise<{ success: boolean; data?: EnquiryItem }> => {
  const enquiry = mockEnquiriesStore.find((e) => e.id === enquiryId);
  if (!enquiry) return { success: false };

  const updated: EnquiryItem = {
    ...enquiry,
    status: newStatus,
    quotationAmount: quotationAmount !== undefined ? quotationAmount : enquiry.quotationAmount,
    notes: notes !== undefined ? notes : enquiry.notes,
  };

  try {
    await axios.put(`${API_URL}/${enquiryId}`, updated);
  } catch (e) {
    // Offline
  }

  const idx = mockEnquiriesStore.findIndex((e) => e.id === enquiryId);
  if (idx > -1) mockEnquiriesStore[idx] = updated;

  return { success: true, data: updated };
};

export const deleteEnquiry = async (enquiryId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${enquiryId}`);
  } catch (e) {
    // Offline
  }
  mockEnquiriesStore = mockEnquiriesStore.filter((e) => e.id !== enquiryId);
  return true;
};
