import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AnalyticsItem {
  label: string;
  count: number;
  emoji: string;
  color: string;
}

interface AnalyticsCardProps {
  items: AnalyticsItem[];
  title?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  items,
  title = 'Customer Engagement Activity',
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.itemBox}>
            <View style={[styles.iconBox, { backgroundColor: item.color }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.itemTextContent}>
              <Text style={styles.count}>{item.count.toLocaleString()}</Text>
              <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            </View>
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
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emoji: {
    fontSize: 15,
  },
  itemTextContent: {
    flex: 1,
  },
  count: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  label: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
  },
});
export default AnalyticsCard;
