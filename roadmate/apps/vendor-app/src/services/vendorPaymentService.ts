export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
export type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';

export interface PaymentTransactionItem {
  id: string;
  vendorId: string;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  referenceNumber: string;
  invoiceNumber: string;
}

let mockTransactionsStore: PaymentTransactionItem[] = [
  {
    id: 'TXN-8840',
    vendorId: 'vendor-1',
    date: '2026-07-22',
    amount: 1768, // 1499 + 18% GST
    paymentMethod: 'UPI',
    status: 'Success',
    referenceNumber: 'UPI/9801/884012',
    invoiceNumber: 'INV-2026-071',
  },
  {
    id: 'TXN-8710',
    vendorId: 'vendor-1',
    date: '2026-06-22',
    amount: 1768,
    paymentMethod: 'Card',
    status: 'Success',
    referenceNumber: 'CARD/4012/871099',
    invoiceNumber: 'INV-2026-054',
  },
  {
    id: 'TXN-8601',
    vendorId: 'vendor-1',
    date: '2026-05-22',
    amount: 588, // 499 + GST
    paymentMethod: 'NetBanking',
    status: 'Success',
    referenceNumber: 'NB/HDFC/860122',
    invoiceNumber: 'INV-2026-032',
  },
];

export const fetchPaymentHistory = async (vendorId?: string): Promise<PaymentTransactionItem[]> => {
  return mockTransactionsStore;
};

export const recordPaymentTransaction = async (
  tx: Omit<PaymentTransactionItem, 'id' | 'invoiceNumber'>
): Promise<PaymentTransactionItem> => {
  const newTx: PaymentTransactionItem = {
    ...tx,
    id: `TXN-${Date.now().toString().slice(-4)}`,
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
  };
  mockTransactionsStore.unshift(newTx);
  return newTx;
};
