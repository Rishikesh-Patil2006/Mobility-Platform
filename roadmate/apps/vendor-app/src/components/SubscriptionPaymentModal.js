import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

const paymentMethods = [
  { id: 'UPI', label: '📱 UPI (GPay / PhonePe / Paytm)', desc: 'Instant 0% fee payment' },
  { id: 'Credit Card', label: '💳 Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'Net Banking', label: '🏦 Net Banking', desc: 'All major Indian banks' },
];

export default function SubscriptionPaymentModal({ visible, selectedPlan, onConfirmPayment, onClose }) {
  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  if (!selectedPlan) return null;

  const handlePay = async () => {
    setProcessing(true);
    setTimeout(async () => {
      try {
        await onConfirmPayment(selectedPlan.name, method);
        onClose();
      } catch (e) {
        console.error(e);
      } finally {
        setProcessing(false);
      }
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>💳 Subscription Payment Checkout</Text>
          <Text style={styles.modalSub}>
            Complete subscription payment. Payment recipient: <Text style={styles.recipientHighlight}>Super Admin</Text>
          </Text>

          {/* Plan Summary Box */}
          <View style={styles.planSummaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Purchasing Plan:</Text>
              <Text style={styles.summaryVal}>{selectedPlan.badgeEmoji} {selectedPlan.name} Plan</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Validity:</Text>
              <Text style={styles.summaryVal}>1 Year (Annual Subscription)</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Recipient:</Text>
              <Text style={styles.summaryVal}>Super Admin (RoadMate Platform)</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable Amount:</Text>
              <Text style={styles.totalVal}>{selectedPlan.formattedPrice}</Text>
            </View>
          </View>

          {/* Payment Method Selector */}
          <Text style={styles.sectionLabel}>Select Payment Gateway Method *</Text>
          <ScrollView style={styles.methodsScroll} showsVerticalScrollIndicator={false}>
            {paymentMethods.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setMethod(m.id)}
                style={[styles.methodCard, method === m.id ? styles.methodCardActive : null]}
              >
                <View style={styles.radioCol}>
                  <View style={[styles.radioOuter, method === m.id ? styles.radioOuterActive : null]}>
                    {method === m.id ? <View style={styles.radioInner} /> : null}
                  </View>
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  <Text style={styles.methodDesc}>{m.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity disabled={processing} onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={processing} onPress={handlePay} style={styles.payBtn}>
              {processing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.payText}>🔒 Pay {selectedPlan.formattedPrice} to Super Admin</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 14,
  },
  recipientHighlight: {
    fontWeight: '800',
    color: '#1E3A8A',
  },
  planSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '700',
  },
  summaryVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#16A34A',
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
  },
  methodsScroll: {
    maxHeight: 180,
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  methodCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A8A',
  },
  radioCol: {
    marginRight: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#1E3A8A',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E3A8A',
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodDesc: {
    fontSize: 10.5,
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '700',
  },
  payBtn: {
    flex: 2,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  payText: {
    color: 'white',
    fontSize: 12.5,
    fontWeight: '900',
  },
});
