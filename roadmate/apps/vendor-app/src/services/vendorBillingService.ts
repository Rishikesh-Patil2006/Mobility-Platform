export interface BillingInvoiceItem {
  invoiceNumber: string;
  date: string;
  planName: string;
  baseAmount: number;
  gstAmount: number; // 18% GST
  discountAmount: number;
  totalAmount: number;
  gstinPlaceholder: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

let mockInvoicesStore: BillingInvoiceItem[] = [
  {
    invoiceNumber: 'INV-2026-071',
    date: '2026-07-22',
    planName: 'Professional Plan (Monthly)',
    baseAmount: 1499,
    gstAmount: 269.82,
    discountAmount: 0,
    totalAmount: 1768.82,
    gstinPlaceholder: '27AABCU9603R1ZM',
    status: 'Paid',
  },
  {
    invoiceNumber: 'INV-2026-054',
    date: '2026-06-22',
    planName: 'Professional Plan (Monthly)',
    baseAmount: 1499,
    gstAmount: 269.82,
    discountAmount: 0,
    totalAmount: 1768.82,
    gstinPlaceholder: '27AABCU9603R1ZM',
    status: 'Paid',
  },
  {
    invoiceNumber: 'INV-2026-032',
    date: '2026-05-22',
    planName: 'Starter Plan (Monthly)',
    baseAmount: 499,
    gstAmount: 89.82,
    discountAmount: 0,
    totalAmount: 588.82,
    gstinPlaceholder: '27AABCU9603R1ZM',
    status: 'Paid',
  },
];

export const fetchBillingInvoices = async (vendorId?: string): Promise<BillingInvoiceItem[]> => {
  return mockInvoicesStore;
};

export const generateBillingInvoice = async (
  planName: string,
  baseAmount: number,
  discountAmount: number = 0,
  gstin?: string
): Promise<BillingInvoiceItem> => {
  const taxable = Math.max(0, baseAmount - discountAmount);
  const gst = Number((taxable * 0.18).toFixed(2));
  const total = Number((taxable + gst).toFixed(2));

  const inv: BillingInvoiceItem = {
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split('T')[0],
    planName,
    baseAmount,
    gstAmount: gst,
    discountAmount,
    totalAmount: total,
    gstinPlaceholder: gstin || '27AABCU9603R1ZM',
    status: 'Paid',
  };

  mockInvoicesStore.unshift(inv);
  return inv;
};
