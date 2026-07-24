import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getVerificationStatusDetails } from '../services/vendorVerificationService';

export default function VerificationBadge({ status }) {
  const details = getVerificationStatusDetails(status) || {
    label: 'Verified Partner',
    badgeColor: '#F0FDF4',
    textColor: '#16A34A',
    borderColor: '#DCFCE7',
  };

  const isVerified = status === 'Verified' || status === 'APPROVED' || status === 'VERIFIED';
  const isPending = status === 'Pending Verification' || status === 'PENDING';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: details.badgeColor,
          borderColor: details.borderColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: details.textColor }]}>
        {isVerified ? '✓ Verified Partner' : isPending ? '⌛ Pending Review' : `⚠️ ${details.label || status}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
