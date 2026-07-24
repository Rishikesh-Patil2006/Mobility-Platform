import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ServicePriceCardProps {
  startingPrice: string;
  actualPrice: string;
  offerPrice?: string;
}

export const ServicePriceCard: React.FC<ServicePriceCardProps> = ({
  startingPrice,
  actualPrice,
  offerPrice,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Service Pricing Comparison</Text>
      
      <View style={styles.priceRow}>
        <View style={styles.priceBox}>
          <Text style={styles.label}>Starting Price</Text>
          <Text style={styles.value}>₹{startingPrice || '0'}</Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.label}>Actual Price</Text>
          <Text style={styles.value}>₹{actualPrice || '0'}</Text>
        </View>

        <View style={[styles.priceBox, offerPrice ? styles.priceBoxOffer : null]}>
          <Text style={[styles.label, offerPrice ? styles.labelOffer : null]}>Offer Price</Text>
          <Text style={[styles.value, offerPrice ? styles.valueOffer : null]}>
            {offerPrice ? `₹${offerPrice}` : 'None'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 10,
  },
  priceBoxOffer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  labelOffer: {
    color: '#EF4444',
  },
  value: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '800',
  },
  valueOffer: {
    color: '#DC2626',
    fontWeight: '900',
  },
});
export default ServicePriceCard;
