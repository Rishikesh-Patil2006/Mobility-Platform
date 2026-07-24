import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookingsAnalytics } from '../services/vendorAnalyticsService';

interface BookingSummaryCardProps {
  analytics: BookingsAnalytics;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ analytics }) => {
  const items = [
    { label: 'Today', count: analytics.todaysBookings, color: '#EFF6FF', textColor: '#1E3A8A' },
    { label: 'Pending', count: analytics.pendingBookings, color: '#FEF3C7', textColor: '#92400E' },
    { label: 'Accepted', count: analytics.acceptedBookings, color: '#DBEAFE', textColor: '#1E40AF' },
    { label: 'Upcoming', count: analytics.upcomingBookings, color: '#F3E8FF', textColor: '#6B21A8' },
    { label: 'Completed', count: analytics.completedBookings, color: '#DCFCE7', textColor: '#166534' },
    { label: 'Cancelled', count: analytics.cancelledBookings, color: '#FEE2E2', textColor: '#991B1B' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Bookings Analytics</Text>
        <Text style={styles.totalBadge}>Total: {analytics.totalBookings}</Text>
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={[styles.box, { backgroundColor: item.color }]}>
            <Text style={[styles.count, { color: item.textColor }]}>{item.count}</Text>
            <Text style={[styles.label, { color: item.textColor }]}>{item.label}</Text>
          </View>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  box: {
    width: '31%',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  count: {
    fontSize: 16,
    fontWeight: '900',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});
export default BookingSummaryCard;
