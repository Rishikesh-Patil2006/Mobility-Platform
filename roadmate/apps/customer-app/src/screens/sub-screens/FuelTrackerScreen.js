// roadmate/apps/customer-app/src/screens/sub-screens/FuelTrackerScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TextInput, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import {
  getFuelLogs, addFuelLog, updateFuelLog, deleteFuelLog
} from '../../services/fuelService';
import { getEnrichedFuelLogs } from '../../services/mileageService';
import {
  getFuelSummary, getVehicleFuelSummaries, getFuelAnalytics
} from '../../services/analyticsService';
import {
  FuelEntryCard, FuelSummaryCard, FuelAnalyticsBar,
  VehicleFuelCard, FuelFilter, FuelSearchBar, EmptyState
} from '../../components/FuelTrackerComponents';
import { FloatingActionButton } from '../../components/ExpenseTrackerComponents';
import { VehicleFilterDropdown } from '../../components/VehicleComponents';
import { filterFuelEntries, calculateMonthlyFuelCost, getVehicleWiseMileage, formatINR } from '../../utils/fuelUtils';
import { filterVehicles } from '../../utils/vehicleUtils';

const { width } = Dimensions.get('window');

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];

export default function FuelTrackerScreen({ vehicles = [], initialVehicleId, onBack }) {
  // ── Tabs: dashboard | logs | analytics | vehicles ──
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Vehicle filter ──
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');
  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  // ── Loading ──
  const [loading, setLoading] = useState(false);

  // ── Data ──
  const [enrichedLogs, setEnrichedLogs]         = useState([]);
  const [fuelSummary, setFuelSummary]           = useState(null);
  const [vehicleSummaries, setVehicleSummaries] = useState({});
  const [analyticsData, setAnalyticsData]       = useState(null);

  // ── History Filters ──
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [selectedSort, setSelectedSort]     = useState('Latest First');

  // ── Modals ──
  const [entryModalOpen, setEntryModalOpen]   = useState(false);
  const [editingEntryId, setEditingEntryId]   = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  // ── Form ──
  const [formVehicleId, setFormVehicleId]         = useState(vehicles[0]?.id || '');
  const [formDate, setFormDate]                   = useState('');
  const [formOdometer, setFormOdometer]           = useState('');
  const [formQuantity, setFormQuantity]           = useState('');
  const [formCost, setFormCost]                   = useState('');
  const [formPricePerLitre, setFormPricePerLitre] = useState('');
  const [formStation, setFormStation]             = useState('');
  const [formFuelType, setFormFuelType]           = useState('Petrol');
  const [formNotes, setFormNotes]                 = useState('');
  const [submitting, setSubmitting]               = useState(false);

  // ── Load (Avoid filter flicker by keeping previous data visible) ──
  const reloadData = useCallback(async () => {
    if (!fuelSummary) setLoading(true);
    try {
      const vId = (filteredVehicles.length === 1) ? filteredVehicles[0].id : null;
      const targetVehicles = filteredVehicles.length > 0 ? filteredVehicles : vehicles;

      const [summary, vehSums, analytics, logs] = await Promise.all([
        getFuelSummary(vId),
        getVehicleFuelSummaries(targetVehicles),
        getFuelAnalytics(vId),
        getEnrichedFuelLogs(vId),
      ]);

      setFuelSummary(summary);
      setVehicleSummaries(vehSums);
      setAnalyticsData(analytics);
      setEnrichedLogs(logs);
    } catch (err) {
      console.error('FuelTracker fetch error:', err);
      Alert.alert('Sync Error', 'Could not refresh fuel data.');
    } finally {
      setLoading(false);
    }
  }, [filteredVehicles, selectedFilter]);

  useEffect(() => { reloadData(); }, [reloadData]);

  // ── Derived: filtered log list ──
  const displayedLogs = filterFuelEntries(
    enrichedLogs,
    vehicles,
    selectedFilter,
    selectedFuelType,
    searchQuery
  ).sort((a, b) => {
    if (selectedSort === 'Oldest First') return new Date(a.date) - new Date(b.date);
    if (selectedSort === 'Highest Cost')  return b.cost - a.cost;
    return new Date(b.date) - new Date(a.date);
  });

  // Monthly fuel cost for charts
  const monthly6 = analyticsData?.last6Months || calculateMonthlyFuelCost(enrichedLogs);
  const vehicleWiseMileage = getVehicleWiseMileage(enrichedLogs, vehicles);

  // ── Form helpers ──
  const openAddModal = () => {
    setEditingEntryId(null);
    setFormVehicleId(vehicles[0]?.id || '');
    setFormDate(new Date().toISOString().substring(0, 10));
    setFormOdometer('');
    setFormQuantity('');
    setFormCost('');
    setFormPricePerLitre('');
    setFormStation('');
    setFormFuelType('Petrol');
    setFormNotes('');
    setEntryModalOpen(true);
  };

  const openEditModal = (log) => {
    setEditingEntryId(log.id);
    setFormVehicleId(log.vehicleId);
    setFormDate(log.date);
    setFormOdometer(String(log.odometer));
    setFormQuantity(String(log.quantity));
    setFormCost(String(log.cost));
    setFormPricePerLitre(String(log.pricePerLitre));
    setFormStation(log.station);
    setFormFuelType(log.fuelType);
    setFormNotes(log.notes || '');
    setEntryModalOpen(true);
  };

  const handleSubmitEntry = async () => {
    if (!formQuantity || !formCost || !formDate || !formStation || !formOdometer) {
      Alert.alert('Missing Fields', 'Please fill Odometer, Quantity, Cost, Date, and Station.');
      return;
    }
    const vehicle = vehicles.find(v => v.id === formVehicleId) || vehicles[0];
    setSubmitting(true);
    try {
      const payload = {
        vehicleId:     formVehicleId,
        vehicleName:   vehicle?.name || vehicle?.model || 'Unknown',
        date:          formDate,
        odometer:      parseInt(formOdometer),
        quantity:      parseFloat(formQuantity),
        cost:          parseFloat(formCost),
        pricePerLitre: parseFloat(formPricePerLitre) || parseFloat(formCost) / parseFloat(formQuantity),
        station:       formStation,
        fuelType:      formFuelType,
        notes:         formNotes
      };
      if (editingEntryId) {
        await updateFuelLog(editingEntryId, payload);
        Alert.alert('Updated', 'Fuel entry updated.');
      } else {
        await addFuelLog(payload);
        Alert.alert('Added', 'Fuel entry recorded and synced to Expense Tracker.');
      }
      setEntryModalOpen(false);
      reloadData();
    } catch (err) {
      Alert.alert('Error', 'Could not save fuel entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Entry', 'Remove this fuel log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await deleteFuelLog(id); reloadData(); }
      }
    ]);
  };

  // ── Tab renderer ──
  const renderTab = () => {
    if (loading && !fuelSummary) {
      return (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loaderText}>Calculating fuel metrics...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <View>
            <FuelSummaryCard summary={fuelSummary} />
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 18, marginBottom: 12 }}>
              ⛽ Recent Fuel Entries
            </Text>
            {displayedLogs.slice(0, 5).map(log => (
              <FuelEntryCard
                key={log.id}
                log={log}
                onViewDetails={(l) => { setSelectedDetails(l); setDetailsModalOpen(true); }}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
            {displayedLogs.length === 0 && (
              <EmptyState emoji="⛽" title="No Fuel Logs Recorded" subtitle="Log your first refuel entry to start tracking." />
            )}
          </View>
        );

      case 'logs':
        return (
          <View>
            <FuelFilter
              selectedFuelType={selectedFuelType}
              onFuelTypeChange={setSelectedFuelType}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />
            <FuelSearchBar value={searchQuery} onChangeText={setSearchQuery} />
            <View style={styles.historyMeta}>
              <Text style={styles.historyCount}>{displayedLogs.length} log{displayedLogs.length !== 1 ? 's' : ''}</Text>
            </View>
            {displayedLogs.length === 0 ? (
              <EmptyState
                emoji="⛽"
                title="No Fuel Logs"
                subtitle="Add your first fuel entry to start tracking mileage and costs."
              />
            ) : (
              displayedLogs.map(log => (
                <FuelEntryCard
                  key={log.id}
                  log={log}
                  onViewDetails={(l) => { setSelectedDetails(l); setDetailsModalOpen(true); }}
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
            {monthly6.length > 0 && (
              <FuelAnalyticsBar
                data={monthly6}
                title="Monthly Fuel Cost Trend"
                valueKey="cost"
                color="#EF4444"
              />
            )}
            {vehicleWiseMileage.length > 0 && (
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsCardTitle}>Vehicle-wise Mileage</Text>
                {vehicleWiseMileage.map(v => {
                  const maxM = Math.max(...vehicleWiseMileage.map(x => x.avgMileage), 1);
                  return (
                    <View key={v.vehicleId} style={styles.analyticsRow}>
                      <Text style={styles.analyticsRowLabel} numberOfLines={1}>{v.vehicleName}</Text>
                      <View style={styles.analyticsBarWrap}>
                        <View style={[styles.analyticsBarFill, { width: `${Math.max((v.avgMileage / maxM) * 100, 2)}%`, backgroundColor: '#10B981' }]} />
                      </View>
                      <Text style={[styles.analyticsRowPct, { color: '#10B981' }]}>
                        {v.avgMileage > 0 ? `${v.avgMileage} km/L` : '—'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
            {/* Total fuel cost per vehicle */}
            {vehicleWiseMileage.length > 0 && (
              <View style={styles.analyticsCard}>
                <Text style={styles.analyticsCardTitle}>Vehicle-wise Fuel Cost</Text>
                {vehicleWiseMileage.map(v => {
                  const maxC = Math.max(...vehicleWiseMileage.map(x => x.totalCost), 1);
                  return (
                    <View key={v.vehicleId} style={styles.analyticsRow}>
                      <Text style={styles.analyticsRowLabel} numberOfLines={1}>{v.vehicleName}</Text>
                      <View style={styles.analyticsBarWrap}>
                        <View style={[styles.analyticsBarFill, { width: `${Math.max((v.totalCost / maxC) * 100, 2)}%`, backgroundColor: '#EF4444' }]} />
                      </View>
                      <Text style={[styles.analyticsRowPct, { color: '#EF4444' }]}>{formatINR(v.totalCost)}</Text>
                    </View>
                  );
                })}
              </View>
            )}
            {monthly6.length > 0 && (
              <FuelAnalyticsBar
                data={monthly6}
                title="Monthly Fuel Volume Trend"
                valueKey="quantity"
                color="#F59E0B"
              />
            )}
          </View>
        );

      case 'vehicles':
        return (
          <View>
            {(filteredVehicles.length > 0 ? filteredVehicles : vehicles).map(v => (
              <VehicleFuelCard
                key={v.id}
                vehicle={v}
                summary={vehicleSummaries[v.id] || { avgMileage: 0, totalFuelCost: 0, totalFuelFilled: 0, logCount: 0 }}
              />
            ))}
            {vehicles.length === 0 && (
              <EmptyState emoji="🚗" title="No Vehicles" subtitle="Add a vehicle to track its fuel consumption." />
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
          <Text style={styles.headerTitle}>Fuel & Mileage</Text>
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
          { key: 'logs',      icon: '📋', label: 'Fuel Logs'  },
          { key: 'analytics', icon: '📈', label: 'Analytics'  },
          { key: 'vehicles',  icon: '🚗', label: 'Vehicles'   },
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
      <FloatingActionButton onPress={openAddModal} label="Log Fuel" icon="⛽" color="#EF4444" />

      {/* ── ADD / EDIT FUEL ENTRY MODAL ── */}
      <Modal visible={entryModalOpen} transparent animationType="slide" onRequestClose={() => setEntryModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingEntryId ? '✏️ Edit Fuel Entry' : '⛽ Log Fuel Entry'}</Text>
              <TouchableOpacity onPress={() => setEntryModalOpen(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Vehicle */}
              <Text style={styles.inputLabel}>Vehicle</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
                {vehicles.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vehiclePill, formVehicleId === v.id && styles.vehiclePillActive]}
                    onPress={() => { setFormVehicleId(v.id); setFormFuelType(v.fuelType || 'Petrol'); }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.vehiclePillText, formVehicleId === v.id && { color: '#FFF' }]}>
                      {v.name || v.model}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Fuel Type */}
              <Text style={styles.inputLabel}>Fuel Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
                {FUEL_TYPES.map(ft => (
                  <TouchableOpacity
                    key={ft}
                    style={[styles.fuelTypePill, formFuelType === ft && styles.fuelTypePillActive]}
                    onPress={() => setFormFuelType(ft)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.fuelTypePillText, formFuelType === ft && { color: '#FFF' }]}>{ft}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput style={styles.input} placeholder="e.g. 2026-07-20" placeholderTextColor="#94A3B8" value={formDate} onChangeText={setFormDate} />

              <Text style={styles.inputLabel}>Odometer Reading (km)</Text>
              <TextInput style={styles.input} placeholder="e.g. 25500" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formOdometer} onChangeText={setFormOdometer} />

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Quantity (L / kWh)</Text>
                  <TextInput style={styles.input} placeholder="e.g. 35" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formQuantity} onChangeText={setFormQuantity} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Total Cost (₹)</Text>
                  <TextInput style={styles.input} placeholder="e.g. 3500" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formCost} onChangeText={setFormCost} />
                </View>
              </View>

              <Text style={styles.inputLabel}>Price per Litre / kWh (₹)</Text>
              <TextInput style={styles.input} placeholder="e.g. 100" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formPricePerLitre} onChangeText={setFormPricePerLitre} />

              <Text style={styles.inputLabel}>Fuel Station</Text>
              <TextInput style={styles.input} placeholder="e.g. HP Fuel Pump, Jalgaon" placeholderTextColor="#94A3B8" value={formStation} onChangeText={setFormStation} />

              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput style={[styles.input, styles.inputMultiline]} placeholder="Add a note..." placeholderTextColor="#94A3B8" multiline numberOfLines={3} value={formNotes} onChangeText={setFormNotes} />

              <View style={styles.autoSyncNote}>
                <Text style={styles.autoSyncText}>⚡ This entry will be automatically synced to Expense Tracker.</Text>
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handleSubmitEntry}
                disabled={submitting}
                activeOpacity={0.85}
              >
                {submitting
                  ? <ActivityIndicator color="#FFFFFF" />
                  : <Text style={styles.submitBtnText}>{editingEntryId ? 'Save Changes' : 'Log Fuel Entry'}</Text>
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
              <Text style={styles.modalTitle}>Fuel Entry Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalOpen(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            {selectedDetails && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {[
                  { l: 'Vehicle',       v: selectedDetails.vehicleName },
                  { l: 'Date',          v: selectedDetails.date },
                  { l: 'Fuel Type',     v: selectedDetails.fuelType },
                  { l: 'Station',       v: selectedDetails.station },
                  { l: 'Quantity',      v: `${selectedDetails.quantity} ${selectedDetails.fuelType === 'Electric' ? 'kWh' : 'L'}` },
                  { l: 'Total Cost',    v: formatINR(selectedDetails.cost) },
                  { l: 'Price/Litre',   v: `₹${selectedDetails.pricePerLitre}` },
                  { l: 'Odometer',      v: `${selectedDetails.odometer?.toLocaleString()} km` },
                  { l: 'Distance',      v: selectedDetails.distanceTravelled > 0 ? `${selectedDetails.distanceTravelled} km` : '—' },
                  { l: 'Mileage',       v: selectedDetails.mileage > 0 ? `${selectedDetails.mileage} km/${selectedDetails.fuelType === 'Electric' ? 'kWh' : 'L'}` : '—' },
                  { l: 'Cost per KM',   v: selectedDetails.costPerKm > 0 ? `₹${selectedDetails.costPerKm}` : '—' },
                  { l: 'Notes',         v: selectedDetails.notes || '—' },
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
  header: { backgroundColor: '#7F1D1D', paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },

  // Vehicle selector
  vehicleSelectorBar: { backgroundColor: '#FEF3C7', paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#FDE68A' },
  vehicleSelectorLabel: { fontSize: 12, fontWeight: '700', color: '#92400E' },
  vehicleSelectorPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1.5, borderColor: '#F59E0B', backgroundColor: '#FFFFFF' },
  vehicleSelectorPillActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  vehicleSelectorText: { fontSize: 12, fontWeight: '700', color: '#92400E' },

  selectedVehicleBanner: { backgroundColor: '#ECFDF5', paddingVertical: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#A7F3D0' },
  selectedVehicleText: { fontSize: 12, fontWeight: '700', color: '#065F46' },
  clearFilterText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },

  // Tab bar
  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 3, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#EF4444' },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  tabLabelActive: { color: '#EF4444' },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },

  // Loader
  loaderBox: { alignItems: 'center', paddingVertical: 60 },
  loaderText: { fontSize: 13, color: '#64748B', marginTop: 14, fontWeight: '600' },

  // Buttons
  addButton: { backgroundColor: '#EF4444', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  historyMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  historyCount: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  addFab: { backgroundColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  addFabText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },

  // Analytics
  analyticsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  analyticsCardTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 14 },
  analyticsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  analyticsRowLabel: { fontSize: 11, color: '#475569', fontWeight: '600', width: 90 },
  analyticsBarWrap: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  analyticsBarFill: { height: 8, borderRadius: 4 },
  analyticsRowPct: { fontSize: 11, fontWeight: '800', width: 70, textAlign: 'right' },

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
  formRow: { flexDirection: 'row' },
  vehiclePill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  vehiclePillActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  vehiclePillText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  fuelTypePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  fuelTypePillActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  fuelTypePillText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  autoSyncNote: { backgroundColor: '#EFF6FF', borderRadius: 10, padding: 10, marginBottom: 14 },
  autoSyncText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  submitBtn: { backgroundColor: '#EF4444', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // Details modal
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1E293B', flex: 2, textAlign: 'right' },
});
