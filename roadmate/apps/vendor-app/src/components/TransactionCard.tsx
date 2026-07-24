import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PaymentTransactionItem } from '../services/vendorPaymentService';

interface TransactionCardProps {
  transaction: PaymentTransactionItem;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getStatusStyle = () => {
    switch (transaction.status) {
      case 'Success':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'Pending':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'Failed':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const st = getStatusStyle();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.refNum}>💳 {transaction.referenceNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
          <Text style={[styles.statusText, { color: st.text }]}>● {transaction.status}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.method}>Method: {transaction.paymentMethod}</Text>
          <Text style={styles.date}>📅 {transaction.date} · {transaction.invoiceNumber}</Text>
        </View>
        <Text style={styles.amount}>₹{transaction.amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  refNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  method: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  date: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E3A8A',
  },
});
export default TransactionCard;
