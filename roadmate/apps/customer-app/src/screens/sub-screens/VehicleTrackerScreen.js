// roadmate/apps/customer-app/src/screens/sub-screens/VehicleTrackerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { getVehicleTrackerSummary } from '../../services/vehicleTrackerService';
import { VehicleFilterDropdown, VehicleTrackerCard, VehicleTrackerGrid } from '../../components/VehicleComponents';
import { filterVehicles } from '../../utils/vehicleUtils';

const { width } = Dimensions.get('window');

// ── Hub Module Cards (3 featured trackers: Vehicle Value, Expense Tracker, Fuel & Mileage) ──
const HUB_MODULES = [
  {
    id: 'valuation',
    icon: '📈',
    title: 'Vehicle Value',
    subtitle: 'Estimated resell market price',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    id: 'expenses',
    icon: '💰',
    title: 'Expense Tracker',
    subtitle: 'All vehicle running costs',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    id: 'fuel',
    icon: '⛽',
    title: 'Fuel & Mileage',
    subtitle: 'Fuel logs & efficiency stats',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
];

export default function VehicleTrackerScreen({
  vehicles = [],
  onBack,
  onOpenVehicleInfo,
  onOpenVehicleValuation,
  onOpenChallan,
  onOpenExpenseTracker,
  onOpenFuelTracker,
}) {
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');
  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [loading, setLoading]     = useState(true);
  const [summary, setSummary]     = useState(null);

  // Sync selected vehicle when filter changes
  useEffect(() => {
    if (filteredVehicles.length > 0) {
      const exists = filteredVehicles.some(v => v.id === selectedVehicleId);
      if (!exists) setSelectedVehicleId(filteredVehicles[0].id);
    }
  }, [selectedFilter, filteredVehicles]);

  // Fetch telemetry summary for active vehicle
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
        if (vehicle) {
          const stats = await getVehicleTrackerSummary(vehicle);
          setSummary(stats);
        } else {
          setSummary(null);
        }
      } catch (err) {
        console.error('VehicleTrackerScreen fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedVehicleId]);

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Hub module action dispatcher
  const handleHubModulePress = (id) => {
    switch (id) {
      case 'valuation': onOpenVehicleValuation && onOpenVehicleValuation(selectedVehicleId); break;
      case 'expenses':  onOpenExpenseTracker && onOpenExpenseTracker(selectedVehicleId); break;
      case 'fuel':      onOpenFuelTracker && onOpenFuelTracker(selectedVehicleId); break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Vehicle Tracker</Text>
              <Text style={styles.headerSub}>Track, analyse & manage your vehicles</Text>
            </View>
          </View>
          <VehicleFilterDropdown
            selectedOption={selectedFilter}
            onSelectOption={setSelectedFilter}
            vehicles={vehicles}
            darkTheme={false}
          />
        </View>
      </View>

      {/* Horizontal vehicle switcher */}
      {vehicles.length > 0 && (
        <View style={styles.switcherContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherScroll}>
            {filteredVehicles.map(v => {
              const active = v.id === selectedVehicleId;
              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedVehicleId(v.id)}
                  style={[styles.switcherPill, active && styles.switcherPillActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.switcherPillText, active && styles.switcherPillTextActive]}>{v.name}</Text>
                  <Text style={[styles.switcherNumberText, active && styles.switcherNumberTextActive]}>{v.number}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loaderText}>Syncing vehicle data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          {vehicles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>No Vehicles Available</Text>
              <Text style={styles.emptyDesc}>Add a vehicle from the dashboard to start tracking.</Text>
            </View>
          ) : (
            <View>
              {/* Active vehicle overview */}
              <View style={styles.overviewCard}>
                <View style={styles.overviewLeft}>
                  <Text style={styles.overviewLabel}>ACTIVE VEHICLE</Text>
                  <Text style={styles.overviewName}>{activeVehicle?.name}</Text>
                  <Text style={styles.overviewNumber}>{activeVehicle?.number} · {activeVehicle?.fuel}</Text>
                </View>
                <View style={styles.overviewBadge}>
                  <Text style={styles.overviewBadgeText}>
                    {activeVehicle?.type === 'ev' ? '⚡' : activeVehicle?.type === 'bike' || activeVehicle?.type === 'scooty' ? '🛵' : '🚗'}
                  </Text>
                </View>
              </View>

              {/* ── HUB MODULES SECTION ── */}
              <Text style={styles.sectionHeading}>📊 Tracker Modules</Text>
              <View style={styles.hubGrid}>
                {HUB_MODULES.map(mod => (
                  <TouchableOpacity
                    key={mod.id}
                    style={[styles.hubCard, { backgroundColor: mod.bg, borderColor: mod.border }]}
                    onPress={() => handleHubModulePress(mod.id)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.hubIconCircle, { backgroundColor: mod.color + '20' }]}>
                      <Text style={styles.hubIcon}>{mod.icon}</Text>
                    </View>
                    <Text style={[styles.hubCardTitle, { color: mod.color }]}>{mod.title}</Text>
                    <Text style={styles.hubCardSubtitle} numberOfLines={2}>{mod.subtitle}</Text>
                    {/* Live value from telemetry if available */}
                    {summary && mod.id === 'valuation' && (
                      <Text style={[styles.hubCardValue, { color: mod.color }]}>{summary.valuation}</Text>
                    )}
                    {summary && mod.id === 'expenses' && (
                      <Text style={[styles.hubCardValue, { color: mod.color }]}>{summary.expensesTotal}</Text>
                    )}
                    {summary && mod.id === 'fuel' && (
                      <Text style={[styles.hubCardValue, { color: mod.color }]}>{summary.fuelEfficiency}</Text>
                    )}
                    <Text style={[styles.hubCardArrow, { color: mod.color }]}>Open →</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── TELEMETRY DETAIL CARDS ── */}
              {summary && (
                <>
                  <Text style={[styles.sectionHeading, { marginTop: 8 }]}>🔬 Telemetry Summary</Text>
                  <VehicleTrackerGrid>
                    <VehicleTrackerCard
                      title="Vehicle Value"
                      subtitle="Estimated resell price"
                      value={summary.valuation}
                      icon="📈"
                      color="#2563EB"
                      bg="#EFF6FF"
                      border="#BFDBFE"
                      onPress={() => onOpenVehicleValuation && onOpenVehicleValuation(selectedVehicleId)}
                    />
                    <VehicleTrackerCard
                      title="Expenses"
                      subtitle="Total costs logged"
                      value={summary.expensesTotal}
                      icon="💰"
                      color="#059669"
                      bg="#ECFDF5"
                      border="#A7F3D0"
                      onPress={() => onOpenExpenseTracker && onOpenExpenseTracker(selectedVehicleId)}
                    />
                    <VehicleTrackerCard
                      title="Fuel & Mileage"
                      subtitle="Fuel efficiency"
                      value={summary.fuelEfficiency}
                      icon="⛽"
                      color="#D97706"
                      bg="#FFFBEB"
                      border="#FDE68A"
                      onPress={() => onOpenFuelTracker && onOpenFuelTracker(selectedVehicleId)}
                    />
                  </VehicleTrackerGrid>
                </>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  backArrow: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', marginTop: 2 },

  // Vehicle switcher
  switcherContainer: { backgroundColor: 'white', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#EFF2F5' },
  switcherScroll: { paddingHorizontal: 20, gap: 12 },
  switcherPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', minWidth: 120 },
  switcherPillActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  switcherPillText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  switcherPillTextActive: { color: '#2563EB' },
  switcherNumberText: { fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: '700' },
  switcherNumberTextActive: { color: '#3B82F6' },

  // Loader
  loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loaderText: { marginTop: 14, fontSize: 13, color: '#64748B', fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  scrollPadding: { padding: 20, paddingBottom: 40 },

  // Overview card
  overviewCard: {
    backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0',
    padding: 18, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  overviewLeft: { flex: 1 },
  overviewLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 4 },
  overviewName: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  overviewNumber: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 3 },
  overviewBadge: { width: 52, height: 52, backgroundColor: '#EFF6FF', borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  overviewBadgeText: { fontSize: 26 },

  // Section heading
  sectionHeading: { fontSize: 13, fontWeight: '800', color: '#475569', letterSpacing: 0.3, marginBottom: 14 },

  // Hub grid
  hubGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  hubCard: {
    width: (width - 52) / 2,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 6,
  },
  hubIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  hubIcon: { fontSize: 22 },
  hubCardTitle: { fontSize: 14, fontWeight: '800' },
  hubCardSubtitle: { fontSize: 11, color: '#64748B', fontWeight: '500', lineHeight: 16 },
  hubCardValue: { fontSize: 13, fontWeight: '900', marginTop: 2 },
  hubCardArrow: { fontSize: 11, fontWeight: '800', marginTop: 4 },

  // Empty state
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  emptyDesc: { fontSize: 12, color: '#64748B', textAlign: 'center', paddingHorizontal: 24, marginTop: 6, lineHeight: 18 },
});
