import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MarketingMetrics } from '../services/vendorReferralService';

interface CampaignAnalyticsCardProps {
  metrics: MarketingMetrics;
}

export const CampaignAnalyticsCard: React.FC<CampaignAnalyticsCardProps> = ({ metrics }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>💡 Business Growth Insights</Text>

      <View style={styles.row}>
        <Text style={styles.lbl}>🔥 Best Performing Offer:</Text>
        <Text style={styles.val}>{metrics.bestPerformingOffer}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.lbl}>🖼️ Most Clicked Banner:</Text>
        <Text style={styles.val}>{metrics.mostClickedBanner}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.lbl}>🏆 Highest Booked Service:</Text>
        <Text style={styles.val}>{metrics.highestBookedService}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.lbl}>📲 Most Shared Service:</Text>
        <Text style={styles.val}>{metrics.mostSharedService}</Text>
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
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  lbl: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  val: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
});
export default CampaignAnalyticsCard;
