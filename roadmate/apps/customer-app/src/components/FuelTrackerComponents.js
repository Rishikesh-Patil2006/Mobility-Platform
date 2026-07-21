// roadmate/apps/customer-app/src/components/FuelTrackerComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { getFuelBadgeColor } from '../utils/vehicleUtils';
import { formatINR } from '../utils/fuelUtils';

const { width } = Dimensions.get('window');

// ── FUEL ENTRY CARD ──
export const FuelEntryCard = React.memo(function FuelEntryCard({ log, onViewDetails, onEdit, onDelete }) {
  if (!log) return null;
  const fuelColors = getFuelBadgeColor(log.fuelType);
  const isEV = log.fuelType === 'Electric';

  return (
    <View style={styles.fuelCard}>
      <View style={styles.fuelHeader}>
        <View style={styles.fuelIconGroup}>
          <View style={[styles.fuelIconCircle, { backgroundColor: fuelColors.bg }]}>
            <Text style={styles.fuelEmoji}>{isEV ? '⚡' : '⛽'}</Text>
          </View>
          <View style={styles.fuelHeaderInfo}>
            <Text style={styles.fuelStation} numberOfLines={1}>{log.station}</Text>
            <Text style={styles.fuelVehicle}>🚗 {log.vehicleName}</Text>
          </View>
        </View>
        <View style={styles.fuelAmountBlock}>
          <Text style={[styles.fuelAmount, { color: fuelColors.text }]}>{formatINR(log.cost)}</Text>
          <View style={[styles.fuelTypeBadge, { backgroundColor: fuelColors.bg, borderColor: fuelColors.border }]}>
            <Text style={[styles.fuelTypeText, { color: fuelColors.text }]}>{log.fuelType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.fuelMetricsRow}>
        <View style={styles.fuelMetric}>
          <Text style={styles.fuelMetricLabel}>{isEV ? 'ENERGY' : 'QUANTITY'}</Text>
          <Text style={styles.fuelMetricValue}>{log.quantity}{isEV ? ' kWh' : ' L'}</Text>
        </View>
        <View style={styles.fuelMetric}>
          <Text style={styles.fuelMetricLabel}>{isEV ? '₹/kWh' : '₹/LITRE'}</Text>
          <Text style={styles.fuelMetricValue}>₹{log.pricePerLitre}</Text>
        </View>
        <View style={styles.fuelMetric}>
          <Text style={styles.fuelMetricLabel}>MILEAGE</Text>
          <Text style={[styles.fuelMetricValue, { color: log.mileage > 0 ? '#10B981' : '#94A3B8' }]}>
            {log.mileage > 0 ? `${log.mileage} km/${isEV ? 'kWh' : 'L'}` : '—'}
          </Text>
        </View>
        <View style={styles.fuelMetric}>
          <Text style={styles.fuelMetricLabel}>COST/KM</Text>
          <Text style={styles.fuelMetricValue}>
            {log.costPerKm > 0 ? `₹${log.costPerKm}` : '—'}
          </Text>
        </View>
      </View>

      <View style={styles.fuelFooterRow}>
        <Text style={styles.fuelOdo}>📍 Odometer: {log.odometer?.toLocaleString()} km</Text>
        <Text style={styles.fuelDate}>📅 {log.date}</Text>
      </View>

      {log.distanceTravelled > 0 && (
        <View style={styles.distanceRow}>
          <Text style={styles.distanceText}>🛣️ Distance covered: {log.distanceTravelled} km</Text>
        </View>
      )}

      <View style={styles.fuelActionRow}>
        <TouchableOpacity style={styles.fuelActionBtn} onPress={() => onViewDetails && onViewDetails(log)} activeOpacity={0.7}>
          <Text style={[styles.fuelActionText, { color: '#2563EB' }]}>👁️ View</Text>
        </TouchableOpacity>
        <View style={styles.fuelActionRight}>
          <TouchableOpacity style={styles.fuelActionBtn} onPress={() => onEdit && onEdit(log)} activeOpacity={0.7}>
            <Text style={[styles.fuelActionText, { color: '#4B5563' }]}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fuelActionBtn} onPress={() => onDelete && onDelete(log.id)} activeOpacity={0.7}>
            <Text style={[styles.fuelActionText, { color: '#EF4444' }]}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// ── FUEL SUMMARY CARD (6 metrics) ──
export const FuelSummaryCard = React.memo(function FuelSummaryCard({ summary }) {
  if (!summary) return null;

  const metrics = [
    { icon: '💰', label: 'Total Fuel Cost',    value: formatINR(summary.totalCost),              color: '#EF4444' },
    { icon: '🛢️', label: 'Fuel Filled',         value: `${summary.totalFuelFilled} L`,            color: '#F59E0B' },
    { icon: '📈', label: 'Avg Mileage',         value: `${summary.avgMileage} km/L`,              color: '#10B981' },
    { icon: '⚡', label: 'Avg Cost per KM',    value: `₹${summary.avgCostPerKm}/km`,             color: '#8B5CF6' },
    { icon: '🛣️', label: 'Distance Travelled',  value: `${(summary.totalDistance || 0).toLocaleString()} km`, color: '#2563EB' },
    { icon: '📅', label: 'This Month',          value: formatINR(summary.costThisMonth),           color: '#06B6D4' },
  ];

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeaderRow}>
        <Text style={styles.summaryTitle}>Fuel Overview</Text>
        <View style={styles.entryBadge}>
          <Text style={styles.entryBadgeText}>{summary.logCount || 0} entries</Text>
        </View>
      </View>

      {/* Hero total */}
      <View style={styles.heroBlock}>
        <Text style={styles.heroLabel}>TOTAL FUEL COST</Text>
        <Text style={styles.heroValue}>{formatINR(summary.totalCost)}</Text>
        {summary.lastEntry && (
          <Text style={styles.lastEntry}>Last: {summary.lastEntry.station} · {summary.lastEntry.date}</Text>
        )}
      </View>

      {/* 6 metric grid */}
      <View style={styles.metricsGrid}>
        {metrics.slice(1).map(m => (
          <View key={m.label} style={[styles.metricBox, { borderLeftColor: m.color }]}>
            <Text style={styles.metricIcon}>{m.icon}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// ── MILEAGE CARD ──
export const MileageCard = React.memo(function MileageCard({ log }) {
  if (!log) return null;
  return (
    <View style={styles.mileageCard}>
      <View style={styles.mileageRow}>
        <Text style={styles.mileageEmoji}>📈</Text>
        <View style={styles.mileageInfo}>
          <Text style={styles.mileageVal}>{log.mileage > 0 ? `${log.mileage} km/L` : 'N/A'}</Text>
          <Text style={styles.mileageSub}>Latest Mileage</Text>
        </View>
        <View style={styles.mileageInfo}>
          <Text style={styles.mileageVal}>{log.costPerKm > 0 ? `₹${log.costPerKm}/km` : 'N/A'}</Text>
          <Text style={styles.mileageSub}>Cost per KM</Text>
        </View>
      </View>
    </View>
  );
});

// ── FUEL ANALYTICS BAR CHART ──
export const FuelAnalyticsBar = React.memo(function FuelAnalyticsBar({ data = [], title, valueKey = 'cost', color = '#EF4444' }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d[valueKey] || d.total || 0), 1);

  return (
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>{title}</Text>
      <View style={styles.barsContainer}>
        {data.map((item, i) => {
          const val = item[valueKey] || item.total || 0;
          const pct = maxVal > 0 ? (val / maxVal) : 0;
          const displayVal = val >= 1000 ? `₹${(val/1000).toFixed(1)}k` : (val > 0 ? (valueKey === 'quantity' ? `${val.toFixed(1)}L` : `₹${val}`) : '—');
          return (
            <View key={i} style={styles.barItem}>
              <Text style={styles.barValue}>{displayVal}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.max(pct * 100, val > 0 ? 4 : 0)}%`, backgroundColor: color }]} />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

// ── VEHICLE-WISE FUEL CARD ──
export const VehicleFuelCard = React.memo(function VehicleFuelCard({ vehicle, summary }) {
  if (!vehicle || !summary) return null;
  const isEV = vehicle.fuelType === 'Electric' || vehicle.type === 'ev';

  return (
    <View style={styles.vehicleFuelCard}>
      <View style={styles.vehicleFuelHeader}>
        <View style={styles.vehicleFuelIcon}>
          <Text style={{ fontSize: 20 }}>{isEV ? '⚡' : (vehicle.type === 'bike' || vehicle.type === 'scooty' ? '🛵' : '🚗')}</Text>
        </View>
        <View style={styles.vehicleFuelInfo}>
          <Text style={styles.vehicleFuelName} numberOfLines={1}>{vehicle.name || vehicle.model}</Text>
          <Text style={styles.vehicleFuelSub}>{vehicle.number || vehicle.licensePlate}</Text>
        </View>
        <Text style={styles.vehicleFuelTotal}>{formatINR(summary.totalFuelCost)}</Text>
      </View>
      <View style={styles.vehicleFuelStats}>
        <View style={styles.vehicleStat}>
          <Text style={styles.vehicleStatLabel}>AVG MILEAGE</Text>
          <Text style={styles.vehicleStatVal}>{summary.avgMileage > 0 ? `${summary.avgMileage} km/L` : '—'}</Text>
        </View>
        <View style={styles.vehicleStat}>
          <Text style={styles.vehicleStatLabel}>FUEL FILLED</Text>
          <Text style={styles.vehicleStatVal}>{summary.totalFuelFilled} L</Text>
        </View>
        <View style={styles.vehicleStat}>
          <Text style={styles.vehicleStatLabel}>ENTRIES</Text>
          <Text style={styles.vehicleStatVal}>{summary.logCount || 0}</Text>
        </View>
      </View>
    </View>
  );
});

// ── FUEL FILTER (search + sort) ──
export const FuelFilter = React.memo(function FuelFilter({ selectedFuelType, onFuelTypeChange, selectedSort, onSortChange }) {
  const fuelTypes = ['All Types', 'Petrol', 'Diesel', 'CNG', 'Electric'];
  return (
    <View style={{ gap: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {fuelTypes.map(ft => (
          <TouchableOpacity
            key={ft}
            style={[styles.sortPill, (selectedFuelType === ft || (!selectedFuelType && ft === 'All Types')) && styles.sortPillActive]}
            onPress={() => onFuelTypeChange(ft === 'All Types' ? null : ft)}
            activeOpacity={0.8}
          >
            <Text style={[styles.sortPillText, (selectedFuelType === ft || (!selectedFuelType && ft === 'All Types')) && styles.sortPillTextActive]}>{ft}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

// ── FUEL SEARCH BAR ──
export const FuelSearchBar = React.memo(function FuelSearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by vehicle, station or date..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={styles.searchClear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

// ── ANALYTICS CARD (generic) ──
export const AnalyticsCard = React.memo(function AnalyticsCard({ title, children }) {
  return (
    <View style={styles.analyticsCard}>
      {title && <Text style={styles.analyticsTitle}>{title}</Text>}
      {children}
    </View>
  );
});

// ── EMPTY STATE ──
export const EmptyState = React.memo(function EmptyState({ emoji = '⛽', title, subtitle }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
    </View>
  );
});

// ─────────────── STYLES ───────────────
const styles = StyleSheet.create({
  // Fuel Card
  fuelCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  fuelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  fuelIconGroup: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fuelIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fuelEmoji: { fontSize: 20 },
  fuelHeaderInfo: { flex: 1 },
  fuelStation: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  fuelVehicle: { fontSize: 11, color: '#64748B', fontWeight: '500', marginTop: 2 },
  fuelAmountBlock: { alignItems: 'flex-end', gap: 4 },
  fuelAmount: { fontSize: 16, fontWeight: '800' },
  fuelTypeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  fuelTypeText: { fontSize: 10, fontWeight: '700' },
  fuelMetricsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, marginBottom: 10 },
  fuelMetric: { alignItems: 'center', flex: 1 },
  fuelMetricLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.3, marginBottom: 2 },
  fuelMetricValue: { fontSize: 12, fontWeight: '800', color: '#1E293B' },
  fuelFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  fuelOdo: { fontSize: 11, color: '#475569', fontWeight: '600' },
  fuelDate: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  distanceRow: { marginBottom: 6 },
  distanceText: { fontSize: 11, color: '#7C3AED', fontWeight: '600' },
  fuelActionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 10 },
  fuelActionBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  fuelActionText: { fontSize: 12, fontWeight: '700' },
  fuelActionRight: { flexDirection: 'row', gap: 4 },

  // Summary Card
  summaryCard: { backgroundColor: '#7F1D1D', borderRadius: 20, padding: 20, marginBottom: 16 },
  summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  entryBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  entryBadgeText: { fontSize: 11, color: '#FCA5A5', fontWeight: '700' },
  heroBlock: { alignItems: 'center', marginBottom: 16 },
  heroLabel: { fontSize: 11, color: '#FCA5A5', fontWeight: '700', letterSpacing: 1 },
  heroValue: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginTop: 4 },
  lastEntry: { fontSize: 11, color: '#FECACA', fontWeight: '500', marginTop: 4, textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricBox: { flex: 1, minWidth: (width - 80) / 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, borderLeftWidth: 3 },
  metricIcon: { fontSize: 16, marginBottom: 4 },
  metricLabel: { fontSize: 9, color: '#FCA5A5', fontWeight: '700', letterSpacing: 0.3 },
  metricValue: { fontSize: 13, fontWeight: '800', marginTop: 2 },

  // Mileage Card
  mileageCard: { backgroundColor: '#ECFDF5', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  mileageRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mileageEmoji: { fontSize: 28 },
  mileageInfo: { flex: 1 },
  mileageVal: { fontSize: 16, fontWeight: '800', color: '#065F46' },
  mileageSub: { fontSize: 11, color: '#6EE7B7', fontWeight: '600' },

  // Analytics Bar
  analyticsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  analyticsTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 14 },
  barsContainer: { gap: 10 },
  barItem: { gap: 4 },
  barValue: { fontSize: 11, fontWeight: '700', color: '#1E293B' },
  barTrack: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  barLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // Vehicle Fuel Card
  vehicleFuelCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  vehicleFuelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  vehicleFuelIcon: { width: 40, height: 40, backgroundColor: '#FEF3C7', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  vehicleFuelInfo: { flex: 1 },
  vehicleFuelName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  vehicleFuelSub: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  vehicleFuelTotal: { fontSize: 18, fontWeight: '900', color: '#EF4444' },
  vehicleFuelStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 10, gap: 12 },
  vehicleStat: { flex: 1 },
  vehicleStatLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.3 },
  vehicleStatVal: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginTop: 2 },

  // Sort Pills
  sortPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  sortPillActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  sortPillText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  sortPillTextActive: { color: '#FFFFFF' },

  // Search Bar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, height: 46, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 13, color: '#1E293B', fontWeight: '500' },
  searchClear: { fontSize: 14, color: '#94A3B8', padding: 4 },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 },
});
