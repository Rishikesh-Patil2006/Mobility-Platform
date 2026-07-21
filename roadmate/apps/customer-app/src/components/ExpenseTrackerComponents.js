// roadmate/apps/customer-app/src/components/ExpenseTrackerComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { EXPENSE_CATEGORIES } from '../services/expenseService';
import { formatINR, getExpenseCategoryColor } from '../utils/expenseUtils';

const { width } = Dimensions.get('window');

// ── EXPENSE CARD ──
export const ExpenseCard = React.memo(function ExpenseCard({ expense, onViewDetails, onEdit, onDelete }) {
  if (!expense) return null;
  const cat = EXPENSE_CATEGORIES[expense.category] || EXPENSE_CATEGORIES['Other'];
  const isAutoLinked = expense.source === 'Auto-linked';

  return (
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { backgroundColor: cat.color + '1A' }]}>
            <Text style={[styles.iconEmoji, { color: cat.color }]}>{cat.icon}</Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              {isAutoLinked && (
                <View style={styles.autoLinkBadge}>
                  <Text style={styles.autoLinkText}>⚡ Auto</Text>
                </View>
              )}
            </View>
            <Text style={styles.vehicleSub}>🚗 {expense.vehicleName}</Text>
          </View>
        </View>
        <View style={styles.amountBlock}>
          <Text style={[styles.amountText, { color: cat.color }]}>{formatINR(expense.amount)}</Text>
          {expense.status && (
            <View style={[styles.statusBadge, { backgroundColor: expense.status === 'Paid' ? '#ECFDF5' : '#FEF3C7' }]}>
              <Text style={[styles.statusText, { color: expense.status === 'Paid' ? '#059669' : '#D97706' }]}>
                {expense.status}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.vendorRow}>
        <Text style={styles.vendorText} numberOfLines={1}>🏢 {expense.vendor}</Text>
        <Text style={styles.dateText}>📅 {expense.date}</Text>
      </View>

      {expense.linkedModule && (
        <View style={styles.linkedRow}>
          <Text style={styles.linkedText}>🔗 Linked: {expense.linkedModule}</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.cardActionBtn} onPress={() => onViewDetails && onViewDetails(expense)} activeOpacity={0.7}>
          <Text style={[styles.cardActionText, { color: '#2563EB' }]}>👁️ View</Text>
        </TouchableOpacity>
        <View style={styles.cardActionRight}>
          <TouchableOpacity style={styles.cardActionBtn} onPress={() => onEdit && onEdit(expense)} activeOpacity={0.7}>
            <Text style={[styles.cardActionText, { color: '#4B5563' }]}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardActionBtn} onPress={() => onDelete && onDelete(expense.id)} activeOpacity={0.7}>
            <Text style={[styles.cardActionText, { color: '#EF4444' }]}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// ── EXPENSE DASHBOARD SUMMARY CARD ──
// Shows 5 key metrics: Total, Fuel, Maintenance, Penalty, Insurance
export const ExpenseSummaryCard = React.memo(function ExpenseSummaryCard({ summary }) {
  if (!summary) return null;

  const metrics = [
    { label: 'TOTAL',       value: summary.total,       color: '#2563EB', icon: '💰' },
    { label: 'FUEL',        value: summary.fuelTotal,    color: '#EF4444', icon: '⛽' },
    { label: 'MAINTENANCE', value: summary.maintenanceTotal, color: '#3B82F6', icon: '🔧' },
    { label: 'INSURANCE',   value: summary.insuranceTotal, color: '#10B981', icon: '🛡️' },
    { label: 'PENALTY',     value: summary.penaltyTotal, color: '#DC2626', icon: '🚔' },
  ];

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeaderRow}>
        <Text style={styles.summaryTitle}>Expense Overview</Text>
        <View style={styles.summaryPeriodBadge}>
          <Text style={styles.summaryPeriodText}>Lifetime</Text>
        </View>
      </View>

      {/* Main total */}
      <View style={styles.totalBlock}>
        <Text style={styles.totalLabel}>TOTAL EXPENSES</Text>
        <Text style={styles.totalAmount}>{formatINR(summary.total)}</Text>
      </View>

      {/* Period row */}
      <View style={styles.periodRow}>
        <View style={styles.periodBox}>
          <Text style={styles.periodLabel}>THIS MONTH</Text>
          <Text style={styles.periodValue}>{formatINR(summary.thisMonth)}</Text>
        </View>
        <View style={[styles.periodBox, styles.periodBoxBorder]}>
          <Text style={styles.periodLabel}>THIS YEAR</Text>
          <Text style={styles.periodValue}>{formatINR(summary.thisYear)}</Text>
        </View>
      </View>

      {/* Category metrics grid */}
      <View style={styles.metricsGrid}>
        {metrics.slice(1).map(m => (
          <View key={m.label} style={[styles.metricBox, { borderLeftColor: m.color }]}>
            <Text style={styles.metricIcon}>{m.icon}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <Text style={[styles.metricValue, { color: m.color }]}>{formatINR(m.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

// ── EXPENSE CATEGORY FILTER PILLS ──
export const ExpenseCategoryFilter = React.memo(function ExpenseCategoryFilter({ selected, onSelect }) {
  const options = [
    { key: 'All Expenses',         icon: '📊' },
    { key: 'Fuel',                 icon: '⛽' },
    { key: 'Service & Maintenance',icon: '🔧' },
    { key: 'Insurance',            icon: '🛡️' },
    { key: 'PUC',                  icon: '🍃' },
    { key: 'Repairs',              icon: '⚙️' },
    { key: 'Accessories',          icon: '🛍️' },
    { key: 'Parking',              icon: '🅿️' },
    { key: 'Toll',                 icon: '🛣️' },
    { key: 'Penalty / Challan',    icon: '🚔' },
    { key: 'Other',                icon: '📝' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterScrollContent}
    >
      {options.map(o => {
        const isActive = selected === o.key || (!selected && o.key === 'All Expenses');
        const color = getExpenseCategoryColor(o.key).color;
        return (
          <TouchableOpacity
            key={o.key}
            style={[
              styles.filterPill,
              isActive && { backgroundColor: color, borderColor: color }
            ]}
            onPress={() => onSelect(o.key === 'All Expenses' ? null : o.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.filterPillIcon}>{o.icon}</Text>
            <Text style={[styles.filterPillText, isActive && { color: '#FFFFFF' }]}>
              {o.key === 'Service & Maintenance' ? 'Service' : o.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

// ── EXPENSE SEARCH BAR ──
export const ExpenseSearchBar = React.memo(function ExpenseSearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by vehicle, vendor, category or date..."
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

// ── ANALYTICS BAR CHART CARD ──
// Pure RN implementation — no external library required
export const ExpenseAnalyticsBar = React.memo(function ExpenseAnalyticsBar({ data = [], title, color = '#2563EB' }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.total || d.value || 0), 1);

  return (
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>{title}</Text>
      <View style={styles.barsContainer}>
        {data.map((item, i) => {
          const val = item.total || item.value || 0;
          const pct = maxVal > 0 ? (val / maxVal) : 0;
          return (
            <View key={i} style={styles.barItem}>
              <Text style={styles.barValue}>{val >= 1000 ? `₹${(val/1000).toFixed(1)}k` : `₹${val}`}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.max(pct * 100, 2)}%`, backgroundColor: color }]} />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});

// ── CATEGORY DISTRIBUTION CARD ──
export const CategoryDistributionCard = React.memo(function CategoryDistributionCard({ breakdown }) {
  if (!breakdown || Object.keys(breakdown).length === 0) return null;

  const entries = Object.entries(breakdown)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);

  const total = entries.reduce((s, [, v]) => s + v, 0);

  return (
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>Expense Distribution</Text>
      {entries.map(([cat, amount]) => {
        const cfg = getExpenseCategoryColor(cat);
        const pct = total > 0 ? ((amount / total) * 100).toFixed(1) : '0.0';
        return (
          <View key={cat} style={styles.distRow}>
            <View style={styles.distLeft}>
              <Text style={styles.distIcon}>{cfg.icon}</Text>
              <Text style={styles.distCat}>{cat}</Text>
            </View>
            <View style={styles.distBarWrap}>
              <View style={[styles.distBar, { width: `${Math.max(parseFloat(pct), 2)}%`, backgroundColor: cfg.color }]} />
            </View>
            <Text style={[styles.distPct, { color: cfg.color }]}>{pct}%</Text>
          </View>
        );
      })}
    </View>
  );
});

// ── VEHICLE EXPENSE CARD ──
export const VehicleExpenseCard = React.memo(function VehicleExpenseCard({ vehicle, summary }) {
  if (!vehicle || !summary) return null;
  return (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleCardHeader}>
        <View style={styles.vehicleIconCircle}>
          <Text style={styles.vehicleIcon}>{vehicle.type === 'bike' || vehicle.type === 'scooty' ? '🛵' : '🚗'}</Text>
        </View>
        <View style={styles.vehicleCardInfo}>
          <Text style={styles.vehicleCardName} numberOfLines={1}>{vehicle.name || vehicle.model}</Text>
          <Text style={styles.vehicleCardSub}>{vehicle.number || vehicle.licensePlate}</Text>
        </View>
        <Text style={styles.vehicleCardTotal}>{formatINR(summary.lifetime)}</Text>
      </View>
      <View style={styles.vehicleCardRow}>
        <View style={styles.vehicleCardStat}>
          <Text style={styles.vehicleStatLabel}>THIS MONTH</Text>
          <Text style={styles.vehicleStatValue}>{formatINR(summary.monthly)}</Text>
        </View>
        <View style={styles.vehicleCardStat}>
          <Text style={styles.vehicleStatLabel}>TRANSACTIONS</Text>
          <Text style={styles.vehicleStatValue}>{summary.count || 0}</Text>
        </View>
        {summary.lastExpense && (
          <View style={styles.vehicleCardStat}>
            <Text style={styles.vehicleStatLabel}>LAST EXPENSE</Text>
            <Text style={styles.vehicleStatValue} numberOfLines={1}>{summary.lastExpense.category}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

// ── ANALYTICS CARD (generic wrapper) ──
export const AnalyticsCard = React.memo(function AnalyticsCard({ title, children }) {
  return (
    <View style={styles.analyticsCard}>
      {title && <Text style={styles.analyticsTitle}>{title}</Text>}
      {children}
    </View>
  );
});

// ── EXPENSE FILTER (sort dropdown trigger) ──
export const ExpenseFilter = React.memo(function ExpenseFilter({ selectedSort, onSortChange }) {
  const options = ['Latest First', 'Oldest First', 'Highest Amount', 'Lowest Amount'];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.sortPill, selectedSort === opt && styles.sortPillActive]}
          onPress={() => onSortChange(opt)}
          activeOpacity={0.8}
        >
          <Text style={[styles.sortPillText, selectedSort === opt && styles.sortPillTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

// ── EMPTY STATE ──
export const EmptyState = React.memo(function EmptyState({ emoji = '📭', title, subtitle }) {
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
  // Expense Card
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  iconWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconEmoji: { fontSize: 20 },
  headerInfo: { flex: 1 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  vehicleSub: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  amountBlock: { alignItems: 'flex-end', gap: 4 },
  amountText: { fontSize: 16, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },
  autoLinkBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  autoLinkText: { fontSize: 10, color: '#2563EB', fontWeight: '700' },
  vendorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  vendorText: { fontSize: 12, color: '#475569', flex: 1 },
  dateText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  linkedRow: { marginBottom: 8 },
  linkedText: { fontSize: 11, color: '#7C3AED', fontWeight: '600' },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 10 },
  cardActionBtn: { paddingHorizontal: 6, paddingVertical: 4 },
  cardActionText: { fontSize: 12, fontWeight: '700' },
  cardActionRight: { flexDirection: 'row', gap: 4 },

  // Summary Card
  summaryCard: { backgroundColor: '#1E40AF', borderRadius: 20, padding: 20, marginBottom: 16 },
  summaryHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  summaryPeriodBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  summaryPeriodText: { fontSize: 11, color: '#BFDBFE', fontWeight: '700' },
  totalBlock: { alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 11, color: '#BFDBFE', fontWeight: '700', letterSpacing: 1 },
  totalAmount: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginTop: 4 },
  periodRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 14, marginBottom: 14 },
  periodBox: { flex: 1, alignItems: 'center' },
  periodBoxBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.15)' },
  periodLabel: { fontSize: 10, color: '#BFDBFE', fontWeight: '700', letterSpacing: 0.5 },
  periodValue: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginTop: 2 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricBox: { flex: 1, minWidth: (width - 80) / 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, borderLeftWidth: 3 },
  metricIcon: { fontSize: 18, marginBottom: 4 },
  metricLabel: { fontSize: 9, color: '#BFDBFE', fontWeight: '700', letterSpacing: 0.5 },
  metricValue: { fontSize: 14, fontWeight: '800', marginTop: 2 },

  // Category Filter Pills
  filterScroll: { marginBottom: 12 },
  filterScrollContent: { gap: 8, paddingRight: 16 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  filterPillIcon: { fontSize: 14 },
  filterPillText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  // Search Bar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, height: 46, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 13, color: '#1E293B', fontWeight: '500' },
  searchClear: { fontSize: 14, color: '#94A3B8', padding: 4 },

  // Analytics Bar
  analyticsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  analyticsTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 14 },
  barsContainer: { gap: 10 },
  barItem: { gap: 4 },
  barValue: { fontSize: 11, fontWeight: '700', color: '#1E293B' },
  barTrack: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  barLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // Distribution
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  distLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 130 },
  distIcon: { fontSize: 14 },
  distCat: { fontSize: 11, color: '#475569', fontWeight: '600', flex: 1 },
  distBarWrap: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  distBar: { height: 6, borderRadius: 3 },
  distPct: { fontSize: 11, fontWeight: '800', width: 40, textAlign: 'right' },

  // Vehicle Card
  vehicleCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  vehicleCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  vehicleIconCircle: { width: 40, height: 40, backgroundColor: '#EFF6FF', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  vehicleIcon: { fontSize: 18 },
  vehicleCardInfo: { flex: 1 },
  vehicleCardName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  vehicleCardSub: { fontSize: 11, color: '#64748B', fontWeight: '500', marginTop: 1 },
  vehicleCardTotal: { fontSize: 18, fontWeight: '900', color: '#2563EB' },
  vehicleCardRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 10, gap: 12 },
  vehicleCardStat: { flex: 1 },
  vehicleStatLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5 },
  vehicleStatValue: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginTop: 2 },

  // Sort Pills
  sortPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  sortPillActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  sortPillText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  sortPillTextActive: { color: '#FFFFFF' },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 48, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 20 },
});

// ── FLOATING ACTION BUTTON (FAB) ──
export function FloatingActionButton({ onPress, label = '+ Add', icon = '➕', color = '#2563EB' }) {
  return (
    <TouchableOpacity
      style={[
        fabStyles.fab,
        { backgroundColor: color }
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={fabStyles.fabIcon}>{icon}</Text>
      {label ? <Text style={fabStyles.fabLabel}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
    gap: 8,
  },
  fabIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fabLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
