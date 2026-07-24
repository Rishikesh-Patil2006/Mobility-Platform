// roadmate/apps/customer-app/src/screens/sub-screens/VehicleInfoScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { getVehicleInfo } from '../../services/vehicleInfoService';
import { VehicleFilterDropdown, VehicleInfoSection } from '../../components/VehicleComponents';
import { filterVehicles } from '../../utils/vehicleUtils';

const { width } = Dimensions.get('window');

export default function VehicleInfoScreen({ vehicles = [], initialVehicleId, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');
  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId || (vehicles[0]?.id || ''));
  const [loading, setLoading] = useState(true);
  const [vahanInfo, setVahanInfo] = useState(null);

  // Sync selected index when filter updates
  useEffect(() => {
    if (filteredVehicles.length > 0) {
      const exists = filteredVehicles.some(v => v.id === selectedVehicleId);
      if (!exists) {
        setSelectedVehicleId(filteredVehicles[0].id);
      }
    }
  }, [selectedFilter, filteredVehicles]);

  // Fetch specs when vehicle selection changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const info = await getVehicleInfo(selectedVehicleId);
        setVahanInfo(info);
      } catch (err) {
        console.error('Error fetching VAHAN specs in VehicleInfoScreen:', err);
        Alert.alert('Error', 'Unable to retrieve vehicle specs from database.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedVehicleId]);

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const getVehicleImage = (v) => {
    if (!v) return require('../../../assets/vehicle_placeholder.png');
    return v.images && v.images.length > 0
      ? { uri: v.images[0] }
      : v.image
        ? (typeof v.image === 'string' ? { uri: v.image } : v.image)
        : require('../../../assets/vehicle_placeholder.png');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Info</Text>
        </View>
        <VehicleFilterDropdown selectedOption={selectedFilter} onSelectOption={setSelectedFilter} darkTheme={false} />
      </View>

      {/* Horizontal switcher list */}
      {vehicles.length > 0 && (
        <View style={styles.switcherContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherScroll}>
            {filteredVehicles.map((v) => {
              const active = v.id === selectedVehicleId;
              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedVehicleId(v.id)}
                  style={[styles.switcherPill, active ? styles.switcherPillActive : null]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.switcherPillText, active ? styles.switcherPillTextActive : null]}>
                    {v.name}
                  </Text>
                  <Text style={[styles.switcherNumberText, active ? styles.switcherNumberTextActive : null]}>
                    {v.number}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loaderText}>Syncing VAHAN registration database...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          {/* Overview Box */}
          <View style={styles.overviewCard}>
            <Image source={getVehicleImage(activeVehicle)} style={styles.overviewImage} resizeMode="cover" />
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewName}>{activeVehicle?.name || vahanInfo?.name}</Text>
              <Text style={styles.overviewNumber}>🪪 {activeVehicle?.number || vahanInfo?.number}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.overviewBadge}>
                  <Text style={styles.overviewBadgeText}>⛽ {vahanInfo?.fuelType || activeVehicle?.fuel}</Text>
                </View>
                <View style={styles.overviewBadge}>
                  <Text style={styles.overviewBadgeText}>⚙️ {vahanInfo?.transmission || 'Manual'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* VAHAN Spec Section */}
          <Text style={styles.sectionHeading}>Official VAHAN Records</Text>
          <VehicleInfoSection vahanData={vahanInfo} />
        </ScrollView>
      )}
    </View>
  );
}

// Backward compatibility export alias
export { VehicleInfoScreen as VehicleInsightsScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  switcherContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#EFF2F5',
  },
  switcherScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  switcherPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minWidth: 120,
  },
  switcherPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  switcherPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  switcherPillTextActive: {
    color: '#2563EB',
  },
  switcherNumberText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '700',
  },
  switcherNumberTextActive: {
    color: '#3B82F6',
  },
  scroll: {
    flex: 1,
  },
  scrollPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loaderText: {
    marginTop: 14,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  overviewImage: {
    width: 90,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  overviewInfo: {
    flex: 1,
  },
  overviewName: {
    fontSize: 16,
    fontWeight: '850',
    color: '#1E293B',
  },
  overviewNumber: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 3,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  overviewBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  overviewBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '850',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
});
