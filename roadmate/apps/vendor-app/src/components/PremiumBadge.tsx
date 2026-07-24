import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SubscriptionTier } from '../services/vendorSubscriptionService';

interface PremiumBadgeProps {
  tier: SubscriptionTier;
  size?: 'small' | 'medium' | 'large';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ tier, size = 'medium' }) => {
  const getStyle = () => {
    switch (tier) {
      case 'Premium':
        return { bg: '#8B5CF6', text: '#FFFFFF', icon: '👑', label: 'PREMIUM VENDOR' };
      case 'Professional':
        return { bg: '#1E3A8A', text: '#FFFFFF', icon: '🟣', label: 'PRO PARTNER' };
      case 'Starter':
        return { bg: '#0284C7', text: '#FFFFFF', icon: '🔵', label: 'STARTER' };
      default:
        return { bg: '#64748B', text: '#FFFFFF', icon: '⚪', label: 'FREE TIER' };
    }
  };

  const config = getStyle();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={styles.text}>
        {config.icon} {config.label}
      </Text>
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
    fontWeight: '900',
    color: 'white',
    letterSpacing: 0.5,
  },
});
export default PremiumBadge;
