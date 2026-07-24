import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { CouponItem } from '../services/vendorCouponService';

interface CouponCardProps {
  coupon: CouponItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onToggle, onDelete }) => {
  const usagePercent = Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100));

  return (
    <View style={[styles.card, !coupon.isEnabled ? styles.disabledCard : null]}>
      <View style={styles.topRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>🎟️ {coupon.code}</Text>
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.discountValue}>{coupon.discountValue}</Text>
          <Switch
            value={coupon.isEnabled}
            onValueChange={() => onToggle(coupon.id)}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={coupon.isEnabled ? '#1E3A8A' : '#94A3B8'}
          />
        </View>
      </View>

      <Text style={styles.desc}>{coupon.description}</Text>

      {/* Usage Progress Bar */}
      <View style={styles.usageBox}>
        <View style={styles.usageTextRow}>
          <Text style={styles.usageLbl}>Coupon Usage:</Text>
          <Text style={styles.usageVal}>
            {coupon.usageCount} / {coupon.usageLimit} ({usagePercent}%)
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${usagePercent}%` }]} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.validity}>📅 Valid until: {coupon.validityDate}</Text>
        <TouchableOpacity onPress={() => onDelete(coupon.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>🗑️ Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
  },
  disabledCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    opacity: 0.7,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 1,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16A34A',
  },
  desc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  usageBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  usageTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  usageLbl: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  usageVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
  },
  validity: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600',
  },
  deleteBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  deleteText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
});
export default CouponCard;
