import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarketingMetrics } from '../services/vendorReferralService';

interface MarketingDashboardCardProps {
  metrics: MarketingMetrics;
}

export const MarketingDashboardCard: React.FC<MarketingDashboardCardProps> = ({ metrics }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>📈 Marketing Conversion Dashboard</Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.val}>{metrics.offerViews}</Text>
          <Text style={styles.lbl}>Offer Views</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.val}>{metrics.offerClicks}</Text>
          <Text style={styles.lbl}>Offer Clicks</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.val}>{metrics.couponUsage}</Text>
          <Text style={styles.lbl}>Coupons Used</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.val, { color: '#16A34A' }]}>{metrics.conversionRate}%</Text>
          <Text style={styles.lbl}>Conversion Rate</Text>
        </View>
      </View>

      <View style={styles.topCampaignBox}>
        <Text style={styles.topLbl}>🏆 Top Performing Campaign:</Text>
        <Text style={styles.topVal}>{metrics.topCampaign}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E3A8A',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  val: {
    fontSize: 18,
    fontWeight: '900',
    color: '#93C5FD',
  },
  lbl: {
    fontSize: 10,
    color: '#E0F2FE',
    fontWeight: '700',
    marginTop: 2,
  },
  topCampaignBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLbl: {
    fontSize: 10.5,
    color: '#BFDBFE',
    fontWeight: '700',
  },
  topVal: {
    fontSize: 11.5,
    fontWeight: '900',
    color: 'white',
  },
});
export default MarketingDashboardCard;
