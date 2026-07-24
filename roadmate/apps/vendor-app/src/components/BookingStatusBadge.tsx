import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookingStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const getColors = () => {
    switch (status) {
      case 'Pending':
      case 'New':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
      case 'Accepted':
      case 'Contacted':
        return { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' };
      case 'Confirmed':
      case 'Quotation Sent':
        return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' };
      case 'In Progress':
      case 'Converted':
        return { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' };
      case 'Completed':
      case 'Closed':
        return { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' };
      case 'Cancelled':
      case 'Rejected':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium,
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]}>● {status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  medium: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  large: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});
export default BookingStatusBadge;
