import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ServicePerformanceStat } from '../services/vendorInsightsService';

interface ServicePerformanceCardProps {
  service: ServicePerformanceStat;
  rank: number;
}

export const ServicePerformanceCard: React.FC<ServicePerformanceCardProps> = ({
  service,
  rank,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
          <Text style={styles.sub}>{service.subcategory}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>🔥 {service.popularityScore}%</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{service.views}</Text>
          <Text style={styles.statLbl}>Views</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{service.clicks}</Text>
          <Text style={styles.statLbl}>Clicks</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{service.bookings}</Text>
          <Text style={styles.statLbl}>Bookings</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>₹{service.revenue.toLocaleString()}</Text>
          <Text style={styles.statLbl}>Revenue</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '900',
  },
  nameBlock: {
    flex: 1,
    paddingRight: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  sub: {
    fontSize: 10.5,
    color: '#2563EB',
    fontWeight: '600',
  },
  scoreBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLbl: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
});
export default ServicePerformanceCard;
