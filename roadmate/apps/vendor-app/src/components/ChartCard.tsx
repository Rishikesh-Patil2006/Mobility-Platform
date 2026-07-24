import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendPoint } from '../services/vendorAnalyticsService';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: TrendPoint[];
  barColor?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  data = [],
  barColor = '#2563EB',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.chartContainer}>
        {data.map((item, idx) => {
          const heightPercent = Math.max(Math.round((item.value / maxValue) * 100), 8);
          return (
            <View key={item.label + idx} style={styles.barColumn}>
              <Text style={styles.barValue}>{item.value}</Text>
              <View style={styles.track}>
                <View style={[styles.bar, { height: `${heightPercent}%`, backgroundColor: barColor }]} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 4,
  },
  track: {
    width: 14,
    height: 90,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 6,
  },
});
export default ChartCard;
