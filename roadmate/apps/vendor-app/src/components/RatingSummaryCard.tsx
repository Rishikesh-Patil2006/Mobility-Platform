import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RatingBreakdown } from '../services/vendorRatingService';

interface RatingSummaryCardProps {
  rating: RatingBreakdown;
}

export const RatingSummaryCard: React.FC<RatingSummaryCardProps> = ({ rating }) => {
  const starsList = [
    { label: '5 Star', count: rating.fiveStarCount },
    { label: '4 Star', count: rating.fourStarCount },
    { label: '3 Star', count: rating.threeStarCount },
    { label: '2 Star', count: rating.twoStarCount },
    { label: '1 Star', count: rating.oneStarCount },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        <Text style={styles.bigScore}>{rating.overallRating}</Text>
        <Text style={styles.starsRow}>⭐⭐⭐⭐⭐</Text>
        <Text style={styles.totalText}>{rating.totalReviews} Customer Reviews</Text>
        <View style={styles.growthBadge}>
          <Text style={styles.growthText}>+{rating.reviewGrowthPercentage}% Rating Growth</Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        {starsList.map((item) => {
          const percent = Math.round((item.count / (rating.totalReviews || 1)) * 100);
          return (
            <View key={item.label} style={styles.barRow}>
              <Text style={styles.starLabel}>{item.label}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.countText}>{item.count}</Text>
            </View>
          );
        })}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftCol: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderColor: '#F1F5F9',
    width: '42%',
  },
  bigScore: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
  },
  starsRow: {
    fontSize: 12,
    marginVertical: 2,
  },
  totalText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
  },
  growthBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  growthText: {
    color: '#166534',
    fontSize: 9,
    fontWeight: '800',
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    width: 36,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#EAB308',
    borderRadius: 3,
  },
  countText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
    width: 16,
    textAlign: 'right',
  },
});
export default RatingSummaryCard;
