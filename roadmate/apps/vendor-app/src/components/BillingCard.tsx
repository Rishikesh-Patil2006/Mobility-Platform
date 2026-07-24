import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BillingInvoiceItem } from '../services/vendorBillingService';

interface BillingCardProps {
  invoice: BillingInvoiceItem;
}

export const BillingCard: React.FC<BillingCardProps> = ({ invoice }) => {
  const handleDownloadInvoice = () => {
    Alert.alert('Download Invoice', `Generating PDF for ${invoice.invoiceNumber}... Invoice saved to downloads.`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={styles.invNum}>🧾 {invoice.invoiceNumber}</Text>
          <Text style={styles.planName}>{invoice.planName}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>● {invoice.status}</Text>
        </View>
      </View>

      <View style={styles.gstinBox}>
        <Text style={styles.gstinLbl}>GSTIN Placeholder:</Text>
        <Text style={styles.gstinVal}>{invoice.gstinPlaceholder}</Text>
      </View>

      {/* Tax Breakdown */}
      <View style={styles.breakdownBox}>
        <View style={styles.breakdownRow}>
          <Text style={styles.lbl}>Base Amount:</Text>
          <Text style={styles.val}>₹{invoice.baseAmount}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.lbl}>18% GST (CGST 9% + SGST 9%):</Text>
          <Text style={styles.val}>₹{invoice.gstAmount}</Text>
        </View>

        {invoice.discountAmount > 0 && (
          <View style={styles.breakdownRow}>
            <Text style={[styles.lbl, { color: '#16A34A' }]}>Promo Discount:</Text>
            <Text style={[styles.val, { color: '#16A34A' }]}>-₹{invoice.discountAmount}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLbl}>Total Paid Amount:</Text>
          <Text style={styles.totalVal}>₹{invoice.totalAmount}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.date}>📅 Payment Date: {invoice.date}</Text>

        <TouchableOpacity onPress={handleDownloadInvoice} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>📥 Download PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  left: {
    flex: 1,
  },
  invNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  planName: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#166534',
  },
  gstinBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 6,
    marginBottom: 8,
  },
  gstinLbl: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  gstinVal: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  breakdownBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    gap: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lbl: {
    fontSize: 11,
    color: '#475569',
  },
  val: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#BFDBFE',
    paddingTop: 6,
    marginTop: 4,
  },
  totalLbl: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  totalVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
  },
  date: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  downloadBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  downloadText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2563EB',
  },
});
export default BillingCard;
