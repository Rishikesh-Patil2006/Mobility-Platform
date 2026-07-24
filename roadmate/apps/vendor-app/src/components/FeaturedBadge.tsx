import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type BadgeType = 'Featured' | 'Best Seller' | 'Most Popular' | 'Recommended' | 'Limited Time';

interface FeaturedBadgeProps {
  badge: BadgeType;
}

export const FeaturedBadge: React.FC<FeaturedBadgeProps> = ({ badge }) => {
  const getStyle = () => {
    switch (badge) {
      case 'Featured':
        return { bg: '#8B5CF6', text: '#FFFFFF', icon: '⭐' };
      case 'Best Seller':
        return { bg: '#DC2626', text: '#FFFFFF', icon: '🔥' };
      case 'Most Popular':
        return { bg: '#0284C7', text: '#FFFFFF', icon: '👑' };
      case 'Recommended':
        return { bg: '#16A34A', text: '#FFFFFF', icon: '👍' };
      case 'Limited Time':
        return { bg: '#D97706', text: '#FFFFFF', icon: '⏳' };
      default:
        return { bg: '#475569', text: '#FFFFFF', icon: '✨' };
    }
  };

  const config = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={styles.text}>{config.icon} {badge}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
    textTransform: 'uppercase',
  },
});
export default FeaturedBadge;
