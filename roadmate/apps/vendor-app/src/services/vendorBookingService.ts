import axios from 'axios';

export type BookingStatus =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Confirmed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  status: BookingStatus;
}

export interface BookingItem {
  id: string;
  vendorId: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  serviceName: string;
  serviceCategory: string;
  bookingDate: string;
  bookingTime: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending at Workshop' | 'Partial';
  bookingStatus: BookingStatus;
  vehicleName: string;
  vehicleNumber: string;
  address: string;
  notes: string;
  internalNotes?: string;
  timeline: TimelineEvent[];
}

const API_URL = 'http://localhost:5000/api/services/bookings';

let mockBookingsStore: BookingItem[] = [
  {
    id: 'BK-9801',
    vendorId: 'vendor-1',
    customerName: 'Rahul Sharma',
    customerMobile: '+91 98765 43210',
    customerEmail: 'rahul.s@gmail.com',
    serviceName: 'Engine Overhaul & Tuneup',
    serviceCategory: 'Garage',
    bookingDate: new Date().toISOString().split('T')[0], // Today
    bookingTime: '10:30 AM',
    amount: 8500,
    paymentStatus: 'Pending at Workshop',
    bookingStatus: 'Pending',
    vehicleName: 'Honda City',
    vehicleNumber: 'MH-19-AB-1234',
    address: 'Plot 12, Court Road, Jalgaon',
    notes: 'Please check engine knocking noise during acceleration.',
    internalNotes: 'Customer requested quick turn around.',
    timeline: [
      { id: 't1', title: 'Booking Created', timestamp: 'Today, 09:15 AM', status: 'Pending' },
    ],
  },
  {
    id: 'BK-9802',
    vendorId: 'vendor-1',
    customerName: 'Sameer Patil',
    customerMobile: '+91 90999 54321',
    customerEmail: 'sameer.p@yahoo.com',
    serviceName: 'Brake Caliper Pad Replacement',
    serviceCategory: 'Garage',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '01:30 PM',
    amount: 499,
    paymentStatus: 'Paid',
    bookingStatus: 'Accepted',
    vehicleName: 'Honda Activa 6G',
    vehicleNumber: 'MH-19-CD-5678',
    address: 'Near M.G. Road Market, Jalgaon',
    notes: 'Brake squeal sound when applying front brakes.',
    internalNotes: 'Parts reserved in warehouse bay 2.',
    timeline: [
      { id: 't1', title: 'Booking Created', timestamp: 'Today, 08:30 AM', status: 'Pending' },
      { id: 't2', title: 'Booking Accepted by Vendor', timestamp: 'Today, 09:00 AM', status: 'Accepted' },
    ],
  },
  {
    id: 'BK-9803',
    vendorId: 'vendor-1',
    customerName: 'Priya Kulkarni',
    customerMobile: '+91 91122 33445',
    customerEmail: 'priya.k@outlook.com',
    serviceName: 'AC Gas Recharging & Filter Cleaning',
    serviceCategory: 'Garage',
    bookingDate: new Date().toISOString().split('T')[0],
    bookingTime: '03:45 PM',
    amount: 1200,
    paymentStatus: 'Paid',
    bookingStatus: 'In Progress',
    vehicleName: 'Hyundai Creta EV',
    vehicleNumber: 'MH-19-EF-9012',
    address: 'Ring Road, Near Stadium, Jalgaon',
    notes: 'AC cooling is low in rear vents.',
    internalNotes: 'Technician Amit assigned.',
    timeline: [
      { id: 't1', title: 'Booking Created', timestamp: 'Yesterday', status: 'Pending' },
      { id: 't2', title: 'Confirmed by Workshop', timestamp: 'Yesterday', status: 'Confirmed' },
      { id: 't3', title: 'Vehicle Arrived & Work Started', timestamp: 'Today, 03:45 PM', status: 'In Progress' },
    ],
  },
  {
    id: 'BK-9799',
    vendorId: 'vendor-1',
    customerName: 'Manoj Kumar',
    customerMobile: '+91 93344 55667',
    customerEmail: 'manoj.k@gmail.com',
    serviceName: 'Full Synthetic Engine Oil Change',
    serviceCategory: 'Garage',
    bookingDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    bookingTime: '11:00 AM',
    amount: 1599,
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    vehicleName: 'Mahindra XUV700',
    vehicleNumber: 'MH-19-OP-4444',
    address: 'MIDC Phase 2, Jalgaon',
    notes: 'Regular periodic maintenance oil change.',
    internalNotes: '5W-30 Shell Helix Ultra oil filled.',
    timeline: [
      { id: 't1', title: 'Booking Created', timestamp: '2 days ago', status: 'Pending' },
      { id: 't2', title: 'Accepted', timestamp: '2 days ago', status: 'Accepted' },
      { id: 't3', title: 'Service In Progress', timestamp: 'Yesterday, 11:00 AM', status: 'In Progress' },
      { id: 't4', title: 'Completed & Delivered', timestamp: 'Yesterday, 12:30 PM', status: 'Completed' },
    ],
  },
  {
    id: 'BK-9795',
    vendorId: 'vendor-1',
    customerName: 'Anil Deshmukh',
    customerMobile: '+91 94455 66778',
    customerEmail: 'anil.d@gmail.com',
    serviceName: 'Computerized Wheel Alignment',
    serviceCategory: 'Garage',
    bookingDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    bookingTime: '04:00 PM',
    amount: 350,
    paymentStatus: 'Pending at Workshop',
    bookingStatus: 'Cancelled',
    vehicleName: 'Maruti Swift',
    vehicleNumber: 'MH-19-XX-9999',
    address: 'Station Road, Jalgaon',
    notes: 'Customer cancelled due to personal travel.',
    internalNotes: 'Customer notified via SMS.',
    timeline: [
      { id: 't1', title: 'Booking Created', timestamp: '3 days ago', status: 'Pending' },
      { id: 't2', title: 'Cancelled by Customer', timestamp: '3 days ago', status: 'Cancelled' },
    ],
  },
];

// Validate status transition rules
export const validateStatusTransition = (
  current: BookingStatus,
  target: BookingStatus
): { valid: boolean; reason?: string } => {
  if (current === target) return { valid: true };
  if (current === 'Completed') return { valid: false, reason: 'Completed bookings cannot change status.' };
  if (current === 'Cancelled') return { valid: false, reason: 'Cancelled bookings cannot be reopened.' };
  if (current === 'Rejected') return { valid: false, reason: 'Rejected bookings cannot be modified.' };

  if (target === 'Completed' && current !== 'In Progress' && current !== 'Accepted' && current !== 'Confirmed') {
    return { valid: false, reason: 'Booking must be in progress or accepted before completing.' };
  }

  return { valid: true };
};

export const fetchBookings = async (vendorId?: string): Promise<BookingItem[]> => {
  try {
    const res = await axios.get(API_URL);
    if (res.data?.success && res.data?.data) {
      mockBookingsStore = res.data.data;
      return mockBookingsStore;
    }
  } catch (error) {
    // API offline, fallback to local
  }
  return mockBookingsStore;
};

export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus,
  internalNote?: string
): Promise<{ success: boolean; data?: BookingItem; error?: string }> => {
  const booking = mockBookingsStore.find((b) => b.id === bookingId);
  if (!booking) return { success: false, error: 'Booking not found.' };

  const check = validateStatusTransition(booking.bookingStatus, newStatus);
  if (!check.valid) return { success: false, error: check.reason };

  const updatedTimeline = [
    ...booking.timeline,
    {
      id: `t-${Date.now()}`,
      title: `Status updated to ${newStatus}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: newStatus,
    },
  ];

  const updated: BookingItem = {
    ...booking,
    bookingStatus: newStatus,
    internalNotes: internalNote ? `${booking.internalNotes ? booking.internalNotes + ' | ' : ''}${internalNote}` : booking.internalNotes,
    timeline: updatedTimeline,
  };

  try {
    await axios.put(`${API_URL}/${bookingId}`, updated);
  } catch (e) {
    // Offline fallback
  }

  const idx = mockBookingsStore.findIndex((b) => b.id === bookingId);
  if (idx > -1) mockBookingsStore[idx] = updated;

  return { success: true, data: updated };
};

export const rescheduleBooking = async (
  bookingId: string,
  newDate: string,
  newTime: string
): Promise<{ success: boolean; data?: BookingItem; error?: string }> => {
  const booking = mockBookingsStore.find((b) => b.id === bookingId);
  if (!booking) return { success: false, error: 'Booking not found.' };

  const updated: BookingItem = {
    ...booking,
    bookingDate: newDate,
    bookingTime: newTime,
    timeline: [
      ...booking.timeline,
      {
        id: `t-${Date.now()}`,
        title: `Rescheduled to ${newDate} at ${newTime}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: booking.bookingStatus,
      },
    ],
  };

  try {
    await axios.put(`${API_URL}/${bookingId}`, updated);
  } catch (e) {
    // Offline
  }

  const idx = mockBookingsStore.findIndex((b) => b.id === bookingId);
  if (idx > -1) mockBookingsStore[idx] = updated;

  return { success: true, data: updated };
};
