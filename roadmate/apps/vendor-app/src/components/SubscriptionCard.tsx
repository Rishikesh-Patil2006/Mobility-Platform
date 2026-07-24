import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { CurrentSubscription } from '../services/vendorSubscriptionService';
import PremiumBadge from './PremiumBadge';

interface SubscriptionCardProps {
  subscription: CurrentSubscription;
  onToggleAutoRenew: () => void;
  onUpgrade: () => void;
  onCancel: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onToggleAutoRenew,
  onUpgrade,
  onCancel,
}) => {
  const percentDays = Math.min(100, Math.round((subscription.daysRemaining / 30) * 100));

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.topRow}>
        <View style={styles.leftHeader}>
          <PremiumBadge tier={subscription.planName} />
          <Text style={styles.planName}>{subscription.planName} Plan</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>● {subscription.status}</Text>
        </View>
      </View>

      {/* Days Remaining Progress Bar */}
      <View style={styles.progressBox}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLbl}>Billing Cycle Days Remaining:</Text>
          <Text style={styles.progressVal}>{subscription.daysRemaining} Days ({percentDays}%)</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentDays}%` }]} />
        </View>
      </View>

      {/* Renewal Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLine}>📅 Renewal Date: <Text style={styles.boldVal}>{subscription.renewalDate}</Text></Text>
        <View style={styles.autoRenewRow}>
          <Text style={styles.infoLine}>🔄 Auto-Renewal Active:</Text>
          <Switch
            value={subscription.autoRenewal}
            onValueChange={onToggleAutoRenew}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={subscription.autoRenewal ? '#1E3A8A' : '#94A3B8'}
          />
        </View>
      </View>

      {/* Feature Highlights */}
      <Text style={styles.featureTitle}>Unlocked Partner Benefits:</Text>
      <View style={styles.featureGrid}>
        {subscription.unlockedFeatures.map((feat) => (
          <View key={feat} style={styles.featureTag}>
            <Text style={styles.featureTagText}>✓ {feat}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={onUpgrade} style={styles.upgradeBtn}>
          <Text style={styles.upgradeText}>⚡ Upgrade Plan Tier</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Plan</Text>
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
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftHeader: {
    gap: 6,
  },
  planName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  progressBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLbl: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  track: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 3,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  infoLine: {
    fontSize: 11.5,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  boldVal: {
    fontWeight: '800',
  },
  autoRenewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  featureTag: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  featureTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  upgradeBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  upgradeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
  },
  cancelBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
});
export default SubscriptionCard;
