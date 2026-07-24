// src/components/ValuationComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── VEHICLE SUMMARY CARD ──
export const VehicleSummaryCard = React.memo(function VehicleSummaryCard({ vehicle }) {
  if (!vehicle) return null;

  const vehicleImage = vehicle.images && vehicle.images.length > 0
    ? { uri: vehicle.images[0] }
    : vehicle.image
      ? (typeof vehicle.image === 'string' ? { uri: vehicle.image } : vehicle.image)
      : require('../../assets/vehicle_placeholder.png');

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <Image source={vehicleImage} style={styles.summaryImage} resizeMode="cover" />
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryName}>{vehicle.name}</Text>
          <Text style={styles.summaryNumber}>{vehicle.number}</Text>
          <View style={styles.specGrid}>
            <Text style={styles.specText}>🏷️ {vehicle.brand}</Text>
            <Text style={styles.specText}>⚙️ {vehicle.model}</Text>
            <Text style={styles.specText}>⛽ {vehicle.fuel}</Text>
            <Text style={styles.specText}>📅 {vehicle.year || '2022'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

// ── VALUE CARD ──
export const ValueCard = React.memo(function ValueCard({ value, range, confidence, date }) {
  if (!value) return null;

  return (
    <View style={styles.valueCard}>
      <Text style={styles.valueLabel}>ESTIMATED MARKET VALUE</Text>
      <Text style={styles.valueAmount}>{value}</Text>

      <View style={styles.valueMetricsRow}>
        <View style={styles.valueMetricColumn}>
          <Text style={styles.metricLabel}>VALUE RANGE</Text>
          <Text style={styles.metricValue}>{range}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.valueMetricColumn}>
          <Text style={styles.metricLabel}>CONFIDENCE</Text>
          <Text style={[styles.metricValue, { color: '#16A34A' }]}>{confidence}</Text>
        </View>
      </View>

      <Text style={styles.valueDate}>Last updated: {date}</Text>
    </View>
  );
});

// ── FACTOR CARD ──
export const FactorCard = React.memo(function FactorCard({ title, value, type, impact }) {
  return (
    <View style={styles.factorCard}>
      <View style={styles.factorLeft}>
        <Text style={styles.factorCheck}>✔</Text>
        <View>
          <Text style={styles.factorTitle}>{title}</Text>
          <Text style={styles.factorDesc}>{value}</Text>
        </View>
      </View>
      <View style={[
        styles.impactTag,
        {
          backgroundColor: impact === 'Positive' ? '#E8F5E9' : '#FFFBEB',
          borderColor: impact === 'Positive' ? '#A5D6A7' : '#FDE68A'
        }
      ]}>
        <Text style={[
          styles.impactText,
          { color: impact === 'Positive' ? '#2E7D32' : '#D97706' }
        ]}>
          {impact}
        </Text>
      </View>
    </View>
  );
});

// ── CONDITION SELECTOR ──
export const ConditionSelector = React.memo(function ConditionSelector({ selected, onSelect }) {
  const options = [
    { label: 'Excellent', desc: 'No repairs needed, looks brand new' },
    { label: 'Good', desc: 'Minor scratches, engine is healthy' },
    { label: 'Average', desc: 'Some wear & tear, needs minor servicing' },
    { label: 'Needs Repair', desc: 'Noticeable repairs or service required' }
  ];

  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionHeading}>Vehicle Condition</Text>
      <View style={styles.selectorGrid}>
        {options.map((opt) => {
          const isSelected = selected === opt.label;
          return (
            <TouchableOpacity
              key={opt.label}
              onPress={() => onSelect(opt.label)}
              style={[styles.selectorCard, isSelected ? styles.selectorCardActive : null]}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorLabel, isSelected ? styles.selectorLabelActive : null]}>
                {opt.label}
              </Text>
              <Text style={styles.selectorDesc} numberOfLines={2}>
                {opt.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

// ── ESTIMATE BUTTON ──
export const EstimateButton = React.memo(function EstimateButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.estimateBtn}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={styles.estimateBtnText}>Estimate Value</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: '850',
    color: '#0F172A',
  },
  summaryNumber: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 8,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E293B',
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  valueCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  valueLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 1.5,
  },
  valueAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E40AF',
    marginTop: 6,
    marginBottom: 16,
  },
  valueMetricsRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DBEAFE',
    paddingVertical: 12,
    marginBottom: 12,
  },
  valueMetricColumn: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '850',
    color: '#1E3FAA',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#DBEAFE',
    height: '100%',
  },
  valueDate: {
    fontSize: 9,
    color: '#60A5FA',
    fontWeight: '700',
  },
  factorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  factorCheck: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '900',
  },
  factorTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  factorDesc: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  impactTag: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  impactText: {
    fontSize: 8,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 8,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectorCard: {
    width: (width - 50) / 2,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    minHeight: 68,
  },
  selectorCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
  },
  selectorLabelActive: {
    color: '#2563EB',
  },
  selectorDesc: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 11,
  },
  estimateBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  estimateBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '850',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  depGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  depItem: {
    flex: 1,
  },
  depLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
  },
  depValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 2,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '850',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  timelineScroll: {
    paddingVertical: 8,
  },
  timelinePoint: {
    width: 80,
    alignItems: 'center',
  },
  timelineDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  timelineDotActive: {
    backgroundColor: '#2563EB',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineYearText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '800',
    marginTop: 6,
  },
  timelineValText: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: '900',
    marginTop: 2,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  insightHeaderBox: {
    flex: 1,
  },
  insightMiniLabel: {
    fontSize: 8,
    fontWeight: '850',
    color: '#94A3B8',
  },
  insightHeaderVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 2,
  },
  statsGrid: {
    gap: 8,
  },
  statCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  statCellLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  statCellVal: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E293B',
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  compInfo: {
    flex: 1,
  },
  compName: {
    fontSize: 12,
    fontWeight: '850',
    color: '#1E293B',
  },
  compSub: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  compRight: {
    alignItems: 'flex-end',
  },
  compPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  compHealthBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 2,
  },
  compHealthText: {
    fontSize: 8,
    color: '#16A34A',
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellBtn: {
    backgroundColor: '#D97706',
  },
  sellBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '850',
  },
  exchangeBtn: {
    backgroundColor: '#2563EB',
  },
  exchangeBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '850',
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reportBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  reportBtnText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '800',
  },
});

// ── DEPRECIATION CHART ──
export const DepreciationChart = React.memo(function DepreciationChart({ data }) {
  if (!data) return null;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionHeading}>Depreciation Analysis</Text>

      <View style={styles.depGrid}>
        <View style={styles.depItem}>
          <Text style={styles.depLabel}>Original Price</Text>
          <Text style={styles.depValue}>{data.formattedPurchasePrice}</Text>
        </View>
        <View style={styles.depItem}>
          <Text style={styles.depLabel}>Total Depreciation</Text>
          <Text style={[styles.depValue, { color: '#EF4444' }]}>
            {data.formattedTotalDepreciation} ({data.depreciationPercentage})
          </Text>
        </View>
        <View style={styles.depItem}>
          <Text style={styles.depLabel}>Annual Depreciation</Text>
          <Text style={styles.depValue}>{data.formattedAnnualDepreciation}/yr</Text>
        </View>
      </View>

      <Text style={styles.timelineTitle}>Value Retention Curve</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
        {data.timeline?.map((item, index) => {
          const isFirst = index === 0;
          return (
            <View key={index} style={styles.timelinePoint}>
              <View style={styles.timelineDotRow}>
                {!isFirst && <View style={styles.timelineLine} />}
                <View style={[styles.timelineDot, isFirst ? styles.timelineDotActive : null]} />
                <View style={styles.timelineLine} />
              </View>
              <Text style={styles.timelineYearText}>{item.label}</Text>
              <Text style={styles.timelineValText}>{item.formatted}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

// ── MARKET INSIGHT CARD ──
export const MarketInsightCard = React.memo(function MarketInsightCard({ data }) {
  if (!data) return null;

  const getTrendIcon = (tr) => {
    if (tr === 'Upward') return '📈 Upward';
    if (tr === 'Downward') return '📉 Downward';
    return '➡️ Stable';
  };

  const getDemandColor = (dm) => {
    if (dm.includes('Very') || dm.includes('Extremely')) return '#10B981';
    return '#3B82F6';
  };

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionHeading}>Market Price Insights</Text>

      <View style={styles.insightHeaderRow}>
        <View style={styles.insightHeaderBox}>
          <Text style={styles.insightMiniLabel}>DEMAND LEVEL</Text>
          <Text style={[styles.insightHeaderVal, { color: getDemandColor(data.demandLevel) }]}>{data.demandLevel}</Text>
        </View>
        <View style={styles.insightHeaderBox}>
          <Text style={styles.insightMiniLabel}>PRICE TREND</Text>
          <Text style={styles.insightHeaderVal}>{getTrendIcon(data.priceTrend)}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCell}>
          <Text style={styles.statCellLabel}>AVERAGE SELLING PRICE</Text>
          <Text style={styles.statCellVal}>{data.formattedAvgPrice}</Text>
        </View>
        <View style={styles.statCell}>
          <Text style={styles.statCellLabel}>HIGHEST MARKET SALE</Text>
          <Text style={[styles.statCellVal, { color: '#10B981' }]}>{data.formattedHighestPrice}</Text>
        </View>
        <View style={styles.statCell}>
          <Text style={styles.statCellLabel}>LOWEST MARKET SALE</Text>
          <Text style={[styles.statCellVal, { color: '#EF4444' }]}>{data.formattedLowestPrice}</Text>
        </View>
      </View>
    </View>
  );
});

// ── COMPARISON CARD ──
export const ComparisonCard = React.memo(function ComparisonCard({ list }) {
  if (!list || list.length === 0) return null;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionHeading}>Compare Similar Vehicles</Text>
      {list.map((item) => (
        <View key={item.id} style={styles.compRow}>
          <View style={styles.compInfo}>
            <Text style={styles.compName}>{item.name}</Text>
            <Text style={styles.compSub}>
              {item.year} · {item.mileage} · {item.owners}
            </Text>
          </View>
          <View style={styles.compRight}>
            <Text style={styles.compPrice}>{item.price}</Text>
            <View style={styles.compHealthBadge}>
              <Text style={styles.compHealthText}>⭐ {item.healthScore} Health</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
});

// ── ACTION CARD ──
export const ActionCard = React.memo(function ActionCard({ onSave, onShare, onDownload, onSell, onExchange }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionHeading}>Available Actions</Text>

      {/* Sell / Exchange Row */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.sellBtn]}
          onPress={onSell}
          activeOpacity={0.8}
        >
          <Text style={styles.sellBtnText}>Sell Vehicle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.exchangeBtn]}
          onPress={onExchange}
          activeOpacity={0.8}
        >
          <Text style={styles.exchangeBtnText}>Exchange Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Share / Save / Download buttons */}
      <View style={styles.reportRow}>
        <TouchableOpacity style={styles.reportBtn} onPress={onSave} activeOpacity={0.7}>
          <Text style={styles.reportBtnText}>💾 Save Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportBtn} onPress={onShare} activeOpacity={0.7}>
          <Text style={styles.reportBtnText}>📤 Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportBtn} onPress={onDownload} activeOpacity={0.7}>
          <Text style={styles.reportBtnText}>📄 PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
