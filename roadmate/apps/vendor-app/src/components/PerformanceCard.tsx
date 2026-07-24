import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PerformanceSummary } from '../services/vendorDashboardService';

interface PerformanceCardProps {
  summary: PerformanceSummary;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ summary }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.periodText}>📊 Performance Summary ({summary.period})</Text>
        <View style={styles.growthBadge}>
          <Text style={styles.growthText}>+{summary.periodGrowth}% Growth</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Est. Revenue</Text>
          <Text style={styles.metricValue}>₹{summary.revenueEstimate.toLocaleString()}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Customer Leads</Text>
          <Text style={styles.metricValue}>{summary.totalLeads}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Conversion Rate</Text>
          <Text style={styles.metricValue}>{summary.conversionRate}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  growthBadge: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  growthText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
});
export default PerformanceCard;
