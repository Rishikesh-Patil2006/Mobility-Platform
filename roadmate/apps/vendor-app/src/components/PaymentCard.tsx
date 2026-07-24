import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SubscriptionPlanItem, validatePromoCode } from '../services/vendorSubscriptionService';
import { PaymentMethod } from '../services/vendorPaymentService';

interface PaymentCardProps {
  visible: boolean;
  targetPlan: SubscriptionPlanItem | null;
  onConfirmPayment: (planId: string, promoCode?: string, method?: PaymentMethod) => void;
  onClose: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  visible,
  targetPlan,
  onConfirmPayment,
  onClose,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountVal, setDiscountVal] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [processing, setProcessing] = useState(false);

  if (!targetPlan) return null;

  const basePrice = targetPlan.price;
  const taxable = Math.max(0, basePrice - discountVal);
  const gstAmount = Number((taxable * 0.18).toFixed(2));
  const finalTotal = Number((taxable + gstAmount).toFixed(2));

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = validatePromoCode(promoInput, basePrice);
    if (!res.valid) {
      setPromoError(res.error || 'Invalid promo code');
      return;
    }
    setAppliedCode(promoInput.trim().toUpperCase());
    setDiscountVal(res.discountAmount);
    Alert.alert('Promo Code Applied!', `Applied ${promoInput.trim().toUpperCase()}. You saved ₹${res.discountAmount}!`);
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirmPayment(targetPlan.id, appliedCode, selectedMethod);
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>💳 Upgrade Checkout: {targetPlan.name} Plan</Text>

          {/* Plan Summary */}
          <View style={styles.summaryBox}>
            <Text style={styles.planLbl}>{targetPlan.name} Monthly Subscription</Text>
            <Text style={styles.priceVal}>Base Plan Price: ₹{basePrice}</Text>
          </View>

          {/* Promo Code Application */}
          <Text style={styles.sectionLbl}>Promo / Referral Code:</Text>
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="e.g. PROMO100 or EARLYPARTNER"
              value={promoInput}
              onChangeText={setPromoInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={handleApplyPromo} style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {promoError ? <Text style={styles.errorText}>⚠️ {promoError}</Text> : null}
          {appliedCode ? <Text style={styles.successText}>✓ Applied Code: {appliedCode} (-₹{discountVal})</Text> : null}

          {/* Payment Method Selector */}
          <Text style={styles.sectionLbl}>Select Payment Method:</Text>
          <View style={styles.methodGrid}>
            {(['UPI', 'Card', 'NetBanking', 'Wallet'] as PaymentMethod[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setSelectedMethod(m)}
                style={[styles.methodBtn, selectedMethod === m ? styles.methodBtnActive : null]}
              >
                <Text style={[styles.methodText, selectedMethod === m ? styles.methodTextActive : null]}>
                  {m === 'UPI' ? '📲 UPI (GooglePay/PhonePe)' : m === 'Card' ? '💳 Credit/Debit Card' : m === 'NetBanking' ? '🏦 NetBanking' : '👛 Partner Wallet'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Financial Breakdown */}
          <View style={styles.calcBox}>
            <View style={styles.calcRow}>
              <Text style={styles.calcLbl}>Subtotal:</Text>
              <Text style={styles.calcVal}>₹{basePrice}</Text>
            </View>

            {discountVal > 0 && (
              <View style={styles.calcRow}>
                <Text style={[styles.calcLbl, { color: '#16A34A' }]}>Promo Discount:</Text>
                <Text style={[styles.calcVal, { color: '#16A34A' }]}>-₹{discountVal}</Text>
              </View>
            )}

            <View style={styles.calcRow}>
              <Text style={styles.calcLbl}>18% GST (CGST+SGST):</Text>
              <Text style={styles.calcVal}>₹{gstAmount}</Text>
            </View>

            <View style={styles.calcTotalRow}>
              <Text style={styles.totalLbl}>Total Payable Amount:</Text>
              <Text style={styles.totalVal}>₹{finalTotal}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={processing} onPress={handlePay} style={styles.payBtn}>
              {processing ? <ActivityIndicator color="white" /> : <Text style={styles.payText}>Pay ₹{finalTotal} & Activate</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  planLbl: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  priceVal: {
    fontSize: 11.5,
    color: '#2563EB',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionLbl: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '800',
  },
  applyBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  applyText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  successText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  methodGrid: {
    gap: 6,
    marginBottom: 12,
  },
  methodBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
  },
  methodBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A8A',
  },
  methodText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  methodTextActive: {
    color: '#1E3A8A',
    fontWeight: '900',
  },
  calcBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    gap: 4,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcLbl: {
    fontSize: 11,
    color: '#64748B',
  },
  calcVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  calcTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#CBD5E1',
    paddingTop: 6,
    marginTop: 4,
  },
  totalLbl: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  btnRow: {
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
    fontSize: 12,
    fontWeight: '700',
  },
  payBtn: {
    flex: 1.5,
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
export default PaymentCard;
