import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RevenueMetrics } from '../services/vendorRevenueService';

interface RevenueCardProps {
  metrics: RevenueMetrics;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({ metrics }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>📈 Revenue & Financial Earnings</Text>

      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.val}>₹{metrics.monthlyRevenue.toLocaleString()}</Text>
          <Text style={styles.lbl}>Monthly Revenue</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.val}>₹{metrics.annualRevenue.toLocaleString()}</Text>
          <Text style={styles.lbl}>Annual Revenue</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.val, { color: '#16A34A' }]}>₹{metrics.totalEarnings.toLocaleString()}</Text>
          <Text style={styles.lbl}>Total Earnings</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.val}>₹{metrics.averageBookingValue.toLocaleString()}</Text>
          <Text style={styles.lbl}>Avg Booking Value</Text>
        </View>
      </View>

      {/* Revenue Breakdown */}
      <View style={styles.breakdownBox}>
        <View style={styles.row}>
          <Text style={styles.breakLbl}>🔧 Service Booking Revenue:</Text>
          <Text style={styles.breakVal}>₹{metrics.bookingRevenue.toLocaleString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.breakLbl}>🎯 Promotions & Offers Revenue:</Text>
          <Text style={styles.breakVal}>₹{metrics.promotionRevenuePlaceholder.toLocaleString()}</Text>
        </View>
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
    fontSize: 13.5,
    fontWeight: '900',
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
    fontSize: 16,
    fontWeight: '900',
    color: '#93C5FD',
  },
  lbl: {
    fontSize: 10,
    color: '#E0F2FE',
    fontWeight: '700',
    marginTop: 2,
  },
  breakdownBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakLbl: {
    fontSize: 10.5,
    color: '#BFDBFE',
    fontWeight: '700',
  },
  breakVal: {
    fontSize: 11.5,
    fontWeight: '900',
    color: 'white',
  },
});
export default RevenueCard;
