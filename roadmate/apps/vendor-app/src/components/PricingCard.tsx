import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PricingCardProps {
  startingPrice: string;
  inspectionCharges: string;
  visitingCharges?: string;
  emergencyCharges?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  startingPrice,
  inspectionCharges,
  visitingCharges,
  emergencyCharges,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>💰 Pricing & Fees</Text>
      
      <View style={styles.grid}>
        <View style={styles.pricingItem}>
          <Text style={styles.label}>Starting Price</Text>
          <Text style={styles.value}>₹{startingPrice || '0'}</Text>
        </View>

        <View style={styles.pricingItem}>
          <Text style={styles.label}>Inspection Fee</Text>
          <Text style={styles.value}>₹{inspectionCharges || '0'}</Text>
        </View>

        <View style={styles.pricingItem}>
          <Text style={styles.label}>Visiting Charges</Text>
          <Text style={styles.value}>{visitingCharges ? `₹${visitingCharges}` : 'None'}</Text>
        </View>

        <View style={styles.pricingItem}>
          <Text style={styles.label}>Emergency Fee</Text>
          <Text style={styles.value}>{emergencyCharges ? `₹${emergencyCharges}` : 'None'}</Text>
        </View>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pricingItem: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '800',
  },
});
export default PricingCard;
