import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Per-vehicle document mock databases
const docsByVehicle = {
  '1': [
    { key: 'puc', label: 'PUC Certificate', emoji: '🟢', status: 'Valid', expiry: 'Dec 31, 2025', verified: true, color: '#22C55E', bg: '#F0FDF4' },
    { key: 'rc', label: 'RC Book', emoji: '🔵', status: 'Verified', expiry: 'Lifetime', verified: true, color: '#2563EB', bg: '#EFF6FF' },
    { key: 'driving-license', label: 'Driving License', emoji: '🟣', status: 'Valid', expiry: 'Mar 15, 2040', verified: true, color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'insurance', label: 'Insurance Policy', emoji: '🟡', status: 'Expiring Soon', expiry: 'Jun 25, 2026', verified: false, color: '#F59E0B', bg: '#FFFBEB' },
  ],
  '2': [
    { key: 'puc', label: 'PUC Certificate', emoji: '🔴', status: 'Expired', expiry: 'Jan 10, 2025', verified: false, color: '#EF4444', bg: '#FEF2F2' },
    { key: 'rc', label: 'RC Book', emoji: '🔵', status: 'Verified', expiry: 'Lifetime', verified: true, color: '#2563EB', bg: '#EFF6FF' },
    { key: 'driving-license', label: 'Driving License', emoji: '🟣', status: 'Valid', expiry: 'Mar 15, 2040', verified: true, color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'insurance', label: 'Insurance Policy', emoji: '🟢', status: 'Valid', expiry: 'Nov 30, 2026', verified: true, color: '#22C55E', bg: '#F0FDF4' },
  ],
  '3': [
    { key: 'puc', label: 'PUC Certificate', emoji: '🟢', status: 'Valid', expiry: 'Feb 28, 2026', verified: true, color: '#22C55E', bg: '#F0FDF4' },
    { key: 'rc', label: 'RC Book', emoji: '🔵', status: 'Verified', expiry: 'Lifetime', verified: true, color: '#2563EB', bg: '#EFF6FF' },
    { key: 'driving-license', label: 'Driving License', emoji: '🟣', status: 'Valid', expiry: 'Mar 15, 2040', verified: true, color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'insurance', label: 'Insurance Policy', emoji: '🟢', status: 'Valid', expiry: 'Mar 15, 2027', verified: true, color: '#22C55E', bg: '#F0FDF4' },
  ],
};

export default function InformationHubScreen({ onBack, onOpenDoc, vehicles = [] }) {
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '1');

  // Dropdown list togglers
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [numDropdownOpen, setNumDropdownOpen] = useState(false);

  // Filter vehicles by category
  const filteredVehicles = vehicleTypeFilter === 'all'
    ? vehicles
    : vehicles.filter((v) => 
        vehicleTypeFilter === '2 Wheeler' 
          ? v.type === 'bike' || v.type === 'scooty' 
          : v.type === 'car' || v.type === 'ev'
      );

  // Fallback check
  const activeId = filteredVehicles.find((v) => v.id === selectedVehicleId)?.id || filteredVehicles[0]?.id || '1';
  const selectedVehicle = vehicles.find((v) => v.id === activeId) || vehicles[0];
  const docs = docsByVehicle[activeId] || docsByVehicle['1'];

  // Calculate statistics
  const verifiedCount = docs.filter((d) => d.verified).length;
  const alertCount = docs.filter((d) => d.status === 'Expiring Soon' || d.status === 'Expired').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Information Hub</Text>
            <Text style={styles.headerSubtitle}>Manage and access verified documents</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* ── FILTERS ACCORDION CARD ── */}
        <View style={styles.filterCard}>
          <Text style={styles.filterSectionTitle}>Filters</Text>
          
          <View style={styles.filtersRow}>
            {/* Vehicle Type Filter */}
            <View style={styles.filterBox}>
              <Text style={styles.filterLabel}>Vehicle Class</Text>
              <TouchableOpacity 
                onPress={() => {
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setNumDropdownOpen(false);
                }}
                style={styles.dropdownTrigger}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{vehicleTypeFilter}</Text>
                <Text style={styles.dropdownChevron}>▼</Text>
              </TouchableOpacity>
              {typeDropdownOpen && (
                <View style={styles.dropdownList}>
                  {['all', '4 Wheeler', '2 Wheeler'].map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        setVehicleTypeFilter(opt);
                        setTypeDropdownOpen(false);
                        const first = (opt === 'all' ? vehicles : vehicles.filter((v) => opt === '2 Wheeler' ? v.type === 'bike' || v.type === 'scooty' : v.type === 'car' || v.type === 'ev'))[0];
                        if (first) setSelectedVehicleId(first.id);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Vehicle Number Filter */}
            <View style={styles.filterBox}>
              <Text style={styles.filterLabel}>Vehicle Code</Text>
              <TouchableOpacity 
                onPress={() => {
                  setNumDropdownOpen(!numDropdownOpen);
                  setTypeDropdownOpen(false);
                }}
                style={styles.dropdownTrigger}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{selectedVehicle?.number || 'Select'}</Text>
                <Text style={styles.dropdownChevron}>▼</Text>
              </TouchableOpacity>
              {numDropdownOpen && (
                <View style={styles.dropdownList}>
                  {filteredVehicles.map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      onPress={() => {
                        setSelectedVehicleId(v.id);
                        setNumDropdownOpen(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{v.number}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Selected Vehicle & Summary Counters */}
        <View style={styles.summaryCard}>
          <View style={styles.vehicleGraphicBox}>
            <Text style={styles.vehicleEmoji}>
              {selectedVehicle?.type === 'car' ? '🚗' : selectedVehicle?.type === 'ev' ? '⚡' : selectedVehicle?.type === 'scooty' ? '🛵' : '🏍️'}
            </Text>
          </View>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{selectedVehicle?.name}</Text>
            <Text style={styles.vehicleNumber}>{selectedVehicle?.number}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#22C55E' }]}>{verifiedCount}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>{alertCount}</Text>
              <Text style={styles.statLabel}>Alerts</Text>
            </View>
          </View>
        </View>

        {/* 2x2 Document grid */}
        <View style={styles.docGrid}>
          {docs.map((doc) => {
            const isExp = doc.status === 'Expired';
            const isSoon = doc.status === 'Expiring Soon';
            
            return (
              <View key={doc.key} style={styles.docCard}>
                {/* Visual header */}
                <View style={[styles.docCardHeader, { backgroundColor: doc.bg }]}>
                  <View style={styles.docIconCircle}>
                    <Text style={styles.docEmojiIcon}>{doc.emoji}</Text>
                  </View>
                  <View style={[styles.verifiedBadge, { backgroundColor: doc.verified ? '#F0FDF4' : '#FEF2F2', borderColor: doc.verified ? '#BBF7D0' : '#FECACA' }]}>
                    <Text style={[styles.verifiedBadgeText, { color: doc.verified ? '#16A34A' : '#DC2626' }]}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Text>
                  </View>
                </View>

                {/* Details body */}
                <View style={styles.docCardBody}>
                  <Text style={styles.docLabelName}>{doc.label}</Text>
                  <Text style={styles.docExpiryText}>Exp: {doc.expiry}</Text>

                  {/* Status pill */}
                  <View style={[
                    styles.statusPill, 
                    { 
                      backgroundColor: isExp ? '#FEF2F2' : isSoon ? '#FFFBEB' : '#F0FDF4', 
                      borderColor: isExp ? '#FECACA' : isSoon ? '#FDE68A' : '#BBF7D0' 
                    }
                  ]}>
                    <Text style={[styles.statusText, { color: isExp ? '#EF4444' : isSoon ? '#D97706' : '#16A34A' }]}>
                      {doc.status}
                    </Text>
                  </View>

                  {/* View action button */}
                  <TouchableOpacity 
                    onPress={() => onOpenDoc(doc.key, activeId)} 
                    style={styles.viewButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewButtonText}>👁️ View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(219, 234, 254, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  filterCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 20,
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterBox: {
    flex: 1,
    position: 'relative',
  },
  filterLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  dropdownChevron: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  dropdownList: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 99,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  vehicleGraphicBox: {
    width: 48,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleEmoji: {
    fontSize: 22,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleNumber: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  docGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  docCard: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  docCardHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  docEmojiIcon: {
    fontSize: 18,
  },
  verifiedBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  verifiedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  docCardBody: {
    padding: 12,
  },
  docLabelName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  docExpiryText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 10,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  viewButton: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
});
