// roadmate/apps/customer-app/src/screens/sub-screens/ExpenseTrackerScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TextInput, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import {
  getExpenses, addExpense, updateExpense, deleteExpense,
  EXPENSE_CATEGORIES
} from '../../services/expenseService';
import {
  getExpenseSummary, getCategoryBreakdown, getVehicleSummaries,
  getMonthlyExpenseTrend, getVehicleWiseExpenses, getFuelVsMaintenance
} from '../../services/expenseAnalyticsService';
import {
  ExpenseCard, ExpenseSummaryCard, ExpenseCategoryFilter,
  ExpenseSearchBar, VehicleExpenseCard, ExpenseAnalyticsBar,
  CategoryDistributionCard, EmptyState, ExpenseFilter, FloatingActionButton
} from '../../components/ExpenseTrackerComponents';
import { VehicleFilterDropdown } from '../../components/VehicleComponents';
import { filterExpenses, formatINR } from '../../utils/expenseUtils';
import { filterVehicles } from '../../utils/vehicleUtils';

const { width } = Dimensions.get('window');

export default function ExpenseTrackerScreen({ vehicles = [], initialVehicleId, onBack }) {
  // ── Tabs: dashboard | history | analytics | vehicles ──
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Global vehicle category filter (drives all tabs) ──
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');
  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  // ── Loading ──
  const [loading, setLoading] = useState(false);

  // ── Data ──
  const [expenses, setExpenses]             = useState([]);
  const [overallSummary, setOverallSummary] = useState(null);
  const [analyticsData, setAnalyticsData]   = useState(null);
  const [vehicleSummaries, setVehicleSummaries] = useState({});
  const [monthlyTrend, setMonthlyTrend]     = useState([]);
  const [vehicleWise, setVehicleWise]       = useState([]);
  const [fuelVsMaintenance, setFuelVsMaintenance] = useState(null);

  // ── History filters ──
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort]     = useState('Latest First');

  // ── Modals ──
  const [expenseModalOpen, setExpenseModalOpen]   = useState(false);
  const [editingExpenseId, setEditingExpenseId]   = useState(null);
  const [detailsModalOpen, setDetailsModalOpen]   = useState(false);
  const [selectedExpenseDetails, setSelectedExpenseDetails] = useState(null);

  // ── Form ──
  const [formVehicleId, setFormVehicleId]     = useState(vehicles[0]?.id || '');
  const [formCategory, setFormCategory]       = useState('Fuel');
  const [formAmount, setFormAmount]           = useState('');
  const [formDate, setFormDate]               = useState('');
  const [formVendor, setFormVendor]           = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [submitting, setSubmitting]           = useState(false);

  // ── Load / Reload (Fix filter flickering: quiet background update) ──
  const reloadData = useCallback(async () => {
    if (!overallSummary) setLoading(true);
    try {
      const vehicleId = (filteredVehicles.length === 1) ? filteredVehicles[0].id : null;
      const vehicleIds = filteredVehicles.map(v => v.id);

      const [summary, breakdown, vehSums, trend, vWise, fvm] = await Promise.all([
        getExpenseSummary(vehicleId),
        getCategoryBreakdown(vehicleId),
        getVehicleSummaries(filteredVehicles.length > 0 ? filteredVehicles : vehicles),
        getMonthlyExpenseTrend(vehicleId),
        getVehicleWiseExpenses(filteredVehicles.length > 0 ? filteredVehicles : vehicles),
        getFuelVsMaintenance(vehicleId)
      ]);

      const listParams = {
        vehicleIds: vehicleIds.length > 0 ? vehicleIds : null,
        sort: selectedSort
      };
      const list = await getExpenses(listParams);

      setOverallSummary(summary);
      setAnalyticsData(breakdown);
      setVehicleSummaries(vehSums);
      setMonthlyTrend(trend);
      setVehicleWise(vWise);
      setFuelVsMaintenance(fvm);
      setExpenses(list);
    } catch (err) {
      console.error('ExpenseTracker fetch error:', err);
      Alert.alert('Sync Error', 'Could not refresh expense data.');
    } finally {
      setLoading(false);
    }
  }, [filteredVehicles, selectedSort]);

  useEffect(() => { reloadData(); }, [reloadData]);

  // ── Derived: filtered history list ──
  const displayedExpenses = filterExpenses(
    expenses,
    vehicles,
    selectedFilter,
    selectedCategory,
    searchQuery
  ).sort((a, b) => {
    if (selectedSort === 'Oldest First') return new Date(a.date) - new Date(b.date);
    if (selectedSort === 'Highest Amount') return b.amount - a.amount;
    if (selectedSort === 'Lowest Amount')  return a.amount - b.amount;
    return new Date(b.date) - new Date(a.date);
  });

  // ── Add / Edit form helpers ──
  const openAddModal = () => {
    setEditingExpenseId(null);
    setFormVehicleId(vehicles[0]?.id || '');
    setFormCategory('Fuel');
    setFormAmount('');
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormVendor('');
    setFormDescription('');
    setExpenseModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpenseId(exp.id);
    setFormVehicleId(exp.vehicleId);
    setFormCategory(exp.category);
    setFormAmount(String(exp.amount));
    setFormDate(exp.date);
    setFormVendor(exp.vendor);
    setFormDescription(exp.description || '');
    setExpenseModalOpen(true);
  };

  const handleSubmitExpense = async () => {
    if (!formAmount || !formDate || !formVendor) {
      Alert.alert('Missing Fields', 'Please fill Amount, Date, and Vendor.'); return;
    }
    const vehicle = vehicles.find(v => v.id === formVehicleId) || vehicles[0];
    setSubmitting(true);
    try {
      const payload = {
        vehicleId:   formVehicleId,
        vehicleName: vehicle?.name || vehicle?.model || 'Unknown',
        category:    formCategory,
        amount:      parseFloat(formAmount),
        date:        formDate,
        vendor:      formVendor,
        description: formDescription,
        source:      'Manual'
      };
      if (editingExpenseId) {
        await updateExpense(editingExpenseId, payload);
        Alert.alert('Updated', 'Expense has been updated.');
      } else {
        await addExpense(payload);
        Alert.alert('Added', 'Expense has been recorded.');
      }
      setExpenseModalOpen(false);
      reloadData();
    } catch (err) {
      Alert.alert('Error', 'Could not save expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteExpense(id);
          reloadData();
        }
      }
    ]);
  };

  // ── Tab renderer ──
  const renderTab = () => {
    if (loading && !overallSummary) {
      return (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loaderText}>Loading expense data...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <View>
            <ExpenseSummaryCard summary={overallSummary} />
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 18, marginBottom: 12 }}>
              📋 Recent Expenses
            </Text>
            {displayedExpenses.slice(0, 5).map(exp => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onViewDetails={(e) => { setSelectedExpenseDetails(e); setDetailsModalOpen(true); }}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
            {displayedExpenses.length === 0 && (
              <EmptyState emoji="📭" title="No Expenses Logged" subtitle="Add your first vehicle expense." />
            )}
          </View>
        );

      case 'history':
        return (
          <View>
            <ExpenseCategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            <ExpenseSearchBar value={searchQuery} onChangeText={setSearchQuery} />
            <ExpenseFilter selectedSort={selectedSort} onSortChange={setSelectedSort} />
            <View style={styles.historyMeta}>
              <Text style={styles.historyCount}>{displayedExpenses.length} expense{displayedExpenses.length !== 1 ? 's' : ''}</Text>
            </View>
            {displayedExpenses.length === 0 ? (
              <EmptyState
                emoji="📭"
                title="No Expenses Found"
                subtitle="Try adjusting your filters or add a new expense to get started."
              />
            ) : (
              displayedExpenses.map(exp => (
                <ExpenseCard
                  key={exp.id}
                  expense={exp}
                  onViewDetails={(e) => { setSelectedExpenseDetails(e); setDetailsModalOpen(true); }}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))
            )}
          </View>
        );

      case 'analytics':
        return (
          <View>
            {/* Monthly trend */}
            {monthlyTrend.length > 0 && (
              <ExpenseAnalyticsBar
                data={monthlyTrend}
                title="Monthly Expense Trend"
                color="#2563EB"
              />
            )}

            {/* Fuel vs Maintenance split */}
            {fuelVsMaintenance && fuelVsMaintenance.total > 0 && (
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsCardTitle}>Category Breakdown</Text>
                {[
                  { label: 'Fuel',        value: fuelVsMaintenance.fuel,        color: '#EF4444' },
                  { label: 'Maintenance', value: fuelVsMaintenance.maintenance,  color: '#3B82F6' },
                  { label: 'Insurance',   value: fuelVsMaintenance.insurance,    color: '#10B981' },
                  { label: 'Penalty',     value: fuelVsMaintenance.penalty,      color: '#DC2626' },
                  { label: 'Other',       value: fuelVsMaintenance.other,        color: '#8B5CF6' },
                ].filter(r => r.value > 0).map(row => {
                  const pct = fuelVsMaintenance.total > 0 ? (row.value / fuelVsMaintenance.total) * 100 : 0;
                  return (
                    <View key={row.label} style={styles.analyticsRow}>
                      <Text style={styles.analyticsRowLabel}>{row.label}</Text>
                      <View style={styles.analyticsBarWrap}>
                        <View style={[styles.analyticsBarFill, { width: `${Math.max(pct, 2)}%`, backgroundColor: row.color }]} />
                      </View>
                      <Text style={[styles.analyticsRowPct, { color: row.color }]}>{formatINR(row.value)}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Vehicle-wise expenses */}
            {vehicleWise.length > 0 && (
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsCardTitle}>Vehicle-wise Expenses</Text>
                {vehicleWise.filter(v => v.total > 0).map(v => {
                  const maxTotal = Math.max(...vehicleWise.map(x => x.total), 1);
                  return (
                    <View key={v.vehicleId} style={styles.analyticsRow}>
                      <Text style={styles.analyticsRowLabel} numberOfLines={1}>{v.vehicleName}</Text>
                      <View style={styles.analyticsBarWrap}>
                        <View style={[styles.analyticsBarFill, { width: `${Math.max((v.total / maxTotal) * 100, 2)}%`, backgroundColor: '#2563EB' }]} />
                      </View>
                      <Text style={[styles.analyticsRowPct, { color: '#2563EB' }]}>{formatINR(v.total)}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {analyticsData && <CategoryDistributionCard breakdown={analyticsData} />}
          </View>
        );

      case 'vehicles':
        return (
          <View>
            {(filteredVehicles.length > 0 ? filteredVehicles : vehicles).map(v => (
              <VehicleExpenseCard
                key={v.id}
                vehicle={v}
                summary={vehicleSummaries[v.id] || { lifetime: 0, monthly: 0, count: 0, lastExpense: null }}
              />
            ))}
            {(filteredVehicles.length === 0 && vehicles.length === 0) && (
              <EmptyState emoji="🚗" title="No Vehicles" subtitle="Add a vehicle to track its expenses." />
            )}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Expense Tracker</Text>
        </View>
        <VehicleFilterDropdown
          selectedOption={selectedFilter}
          onSelectOption={setSelectedFilter}
          vehicles={vehicles}
          darkTheme={false}
        />
      </View>

      {/* ── TAB BAR ── */}
      <View style={styles.tabBar}>
        {[
          { key: 'dashboard', icon: '📊', label: 'Dashboard' },
          { key: 'history',   icon: '📋', label: 'History'   },
          { key: 'analytics', icon: '📈', label: 'Analytics' },
          { key: 'vehicles',  icon: '🚗', label: 'Vehicles'  },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── BODY ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {renderTab()}
      </ScrollView>

      {/* ── FLOATING ACTION BUTTON ── */}
      <FloatingActionButton onPress={openAddModal} label="Add Expense" icon="➕" color="#2563EB" />

      {/* ── ADD / EDIT EXPENSE MODAL ── */}
      <Modal visible={expenseModalOpen} transparent animationType="slide" onRequestClose={() => setExpenseModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingExpenseId ? '✏️ Edit Expense' : '+ Add Expense'}</Text>
              <TouchableOpacity onPress={() => setExpenseModalOpen(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Vehicle selector */}
              <Text style={styles.inputLabel}>Vehicle</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
                {vehicles.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vehiclePill, formVehicleId === v.id && styles.vehiclePillActive]}
                    onPress={() => setFormVehicleId(v.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.vehiclePillText, formVehicleId === v.id && { color: '#FFFFFF' }]}>
                      {v.name || v.model}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Category selector */}
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
                {Object.entries(EXPENSE_CATEGORIES).map(([key, cfg]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.catPill, formCategory === key && { backgroundColor: cfg.color, borderColor: cfg.color }]}
                    onPress={() => setFormCategory(key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.catPillIcon}>{cfg.icon}</Text>
                    <Text style={[styles.catPillText, formCategory === key && { color: '#FFFFFF' }]}>
                      {key === 'Service & Maintenance' ? 'Service' : key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Amount */}
              <Text style={styles.inputLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2500"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formAmount}
                onChangeText={setFormAmount}
              />

              {/* Date */}
              <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2026-07-20"
                placeholderTextColor="#94A3B8"
                value={formDate}
                onChangeText={setFormDate}
              />

              {/* Vendor */}
              <Text style={styles.inputLabel}>Vendor / Source</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. HP Fuel Station, Jalgaon"
                placeholderTextColor="#94A3B8"
                value={formVendor}
                onChangeText={setFormVendor}
              />

              {/* Description */}
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Add a note..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={formDescription}
                onChangeText={setFormDescription}
              />

              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handleSubmitExpense}
                disabled={submitting}
                activeOpacity={0.85}
              >
                {submitting
                  ? <ActivityIndicator color="#FFFFFF" />
                  : <Text style={styles.submitBtnText}>{editingExpenseId ? 'Save Changes' : 'Add Expense'}</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── DETAILS MODAL ── */}
      <Modal visible={detailsModalOpen} transparent animationType="fade" onRequestClose={() => setDetailsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '70%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Expense Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalOpen(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            {selectedExpenseDetails && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {[
                  { l: 'Vehicle',      v: selectedExpenseDetails.vehicleName },
                  { l: 'Category',     v: selectedExpenseDetails.category },
                  { l: 'Amount',       v: formatINR(selectedExpenseDetails.amount) },
                  { l: 'Date',         v: selectedExpenseDetails.date },
                  { l: 'Vendor',       v: selectedExpenseDetails.vendor },
                  { l: 'Status',       v: selectedExpenseDetails.status || 'Paid' },
                  { l: 'Source',       v: selectedExpenseDetails.source || 'Manual' },
                  { l: 'Linked To',    v: selectedExpenseDetails.linkedModule || 'None' },
                  { l: 'Description',  v: selectedExpenseDetails.description || '—' },
                ].map(row => (
                  <View key={row.l} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{row.l}</Text>
                    <Text style={styles.detailValue}>{row.v}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────── STYLES ───────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: { backgroundColor: '#1E293B', paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },

  // Tab bar
  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 3, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#2563EB' },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  tabLabelActive: { color: '#2563EB' },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },

  // Loader
  loaderBox: { alignItems: 'center', paddingVertical: 60 },
  loaderText: { fontSize: 13, color: '#64748B', marginTop: 14, fontWeight: '600' },

  // Add button
  addButton: { backgroundColor: '#2563EB', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  // History meta
  historyMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  historyCount: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  addFab: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  addFabText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },

  // Analytics
  analyticsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  analyticsCardTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 14 },
  analyticsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  analyticsRowLabel: { fontSize: 11, color: '#475569', fontWeight: '600', width: 90 },
  analyticsBarWrap: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  analyticsBarFill: { height: 8, borderRadius: 4 },
  analyticsRowPct: { fontSize: 11, fontWeight: '800', width: 62, textAlign: 'right' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  modalClose: { fontSize: 20, color: '#94A3B8', padding: 4 },

  // Form
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, fontSize: 14, color: '#1E293B', marginBottom: 14 },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  vehiclePill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  vehiclePillActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  vehiclePillText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  catPillIcon: { fontSize: 13 },
  catPillText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  submitBtn: { backgroundColor: '#2563EB', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // Detail modal rows
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1E293B', flex: 2, textAlign: 'right' },
});
