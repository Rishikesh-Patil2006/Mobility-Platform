import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SubscriptionPlanItem } from '../services/vendorSubscriptionService';
import PremiumBadge from './PremiumBadge';

interface PlanComparisonCardProps {
  plans: SubscriptionPlanItem[];
  currentPlanId: string;
  onSelectPlan: (plan: SubscriptionPlanItem) => void;
}

export const PlanComparisonCard: React.FC<PlanComparisonCardProps> = ({
  plans,
  currentPlanId,
  onSelectPlan,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>⭐ Compare Platform Plans</Text>
      <Text style={styles.sub}>Choose the optimal plan tier for your workshop growth</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollGrid}>
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;

          return (
            <View key={plan.id} style={[styles.planBox, isCurrent ? styles.activePlanBox : null]}>
              <PremiumBadge tier={plan.name} />

              <Text style={styles.planTitle}>{plan.name}</Text>

              <View style={styles.priceBox}>
                <Text style={styles.priceVal}>{plan.price === 0 ? 'Free' : `₹${plan.price}`}</Text>
                {plan.price > 0 && <Text style={styles.priceCycle}>/ Month</Text>}
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.limitItem}>
                <Text style={styles.limitLbl}>Service Limits:</Text>
                <Text style={styles.limitVal}>{plan.serviceLimits}</Text>
              </View>

              <View style={styles.limitItem}>
                <Text style={styles.limitLbl}>Search Rank:</Text>
                <Text style={styles.limitVal}>{plan.priorityRanking}</Text>
              </View>

              <View style={styles.limitItem}>
                <Text style={styles.limitLbl}>Analytics Access:</Text>
                <Text style={styles.limitVal}>{plan.analyticsAccess}</Text>
              </View>

              <View style={styles.limitItem}>
                <Text style={styles.limitLbl}>Support Level:</Text>
                <Text style={styles.limitVal}>{plan.supportLevel}</Text>
              </View>

              <View style={styles.metaDivider} />

              <Text style={styles.featuresHeader}>Included Features:</Text>
              {plan.features.map((f) => (
                <Text key={f} style={styles.featureItem}>
                  ✓ {f}
                </Text>
              ))}

              <TouchableOpacity
                disabled={isCurrent}
                onPress={() => onSelectPlan(plan)}
                style={[styles.selectBtn, isCurrent ? styles.selectBtnCurrent : null]}
              >
                <Text style={[styles.selectText, isCurrent ? styles.selectTextCurrent : null]}>
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  sub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 14,
  },
  scrollGrid: {
    gap: 12,
    paddingVertical: 4,
  },
  planBox: {
    width: 220,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
  },
  activePlanBox: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A8A',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 6,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  priceVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  priceCycle: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '600',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  limitItem: {
    marginBottom: 4,
  },
  limitLbl: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '700',
  },
  limitVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  featuresHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  featureItem: {
    fontSize: 10.5,
    color: '#334155',
    marginBottom: 4,
    lineHeight: 14,
  },
  selectBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  selectBtnCurrent: {
    backgroundColor: '#E2E8F0',
  },
  selectText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '900',
  },
  selectTextCurrent: {
    color: '#64748B',
  },
});
export default PlanComparisonCard;
