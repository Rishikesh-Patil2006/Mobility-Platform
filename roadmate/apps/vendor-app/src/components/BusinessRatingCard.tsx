import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RatingBreakdown } from '../services/vendorRatingService';

interface BusinessRatingCardProps {
  rating: RatingBreakdown;
}

export const BusinessRatingCard: React.FC<BusinessRatingCardProps> = ({ rating }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🏆 Workshop Reputation Scorecard</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.val}>{rating.responseRate}%</Text>
          <Text style={styles.lbl}>Response Rate</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.val}>{rating.avgResponseTime}</Text>
          <Text style={styles.lbl}>Avg Response Time</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.val}>{rating.csatScore}%</Text>
          <Text style={styles.lbl}>CSAT Satisfaction</Text>
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
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
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
    fontSize: 9.5,
    color: '#E0F2FE',
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
});
export default BusinessRatingCard;
