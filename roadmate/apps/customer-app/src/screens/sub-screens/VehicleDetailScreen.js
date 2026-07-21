import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { 
  VehicleImageCarousel, 
  VehicleOverviewCard, 
  VehicleStatusCard, 
  VehicleSection, 
  VehicleDetailRow, 
  VehicleQuickActionCard,
  VehicleSpecificationCard,
  VehicleDocumentCard
} from '../../components/VehicleComponents';
import { getVehicleInfo } from '../../services/vehicleInfoService';

const { width } = Dimensions.get('window');

// Mock doc expiries matching other screens
const docExpiries = {
  '1': { puc: 'Dec 31, 2025', rc: 'Lifetime', 'driving-license': 'Sep 11, 2040', insurance: 'Jun 25, 2026', fitness: 'Apr 20, 2037' },
  '2': { puc: 'Jan 10, 2025', rc: 'Lifetime', 'driving-license': 'Sep 11, 2040', insurance: 'Nov 30, 2026', fitness: 'Mar 10, 2036' },
  '3': { puc: 'Feb 28, 2026', rc: 'Lifetime', 'driving-license': 'Sep 11, 2040', insurance: 'Mar 15, 2027', fitness: 'Jun 15, 2038' },
};

// Mock recent activity feed
const mockRecentActivity = {
  '1': {
    fuel: '₹4,200 on Jul 18, 2026 (BPCL Pump)',
    expense: '₹1,500 on Jul 20, 2026 (General Service)',
    challan: 'No pending challans (₹0)',
    service: 'Brake Service completed on Jul 10, 2026'
  },
  '2': {
    fuel: '₹480 on Jul 19, 2026 (Indian Oil)',
    expense: '₹500 on Jul 05, 2026 (Refuel)',
    challan: '1 Pending Challan (₹500 for No Helmet)',
    service: 'Engine Oil Change completed on Jun 28, 2026'
  },
  '3': {
    fuel: '₹256 on Jul 10, 2026 (Fortum Charge)',
    expense: '₹240 on Jun 30, 2026 (Charging)',
    challan: 'No pending challans (₹0)',
    service: 'EV Diagnostic Checkup on Jun 15, 2026'
  }
};

export default function VehicleDetailScreen({ 
  vehicleId, 
  vehicles = [], 
  documents = [],
  onBack, 
  onEdit, 
  onDelete, 
  onOpenDoc, 
  onOpenVehicleValuation,
  onOpenChallan,
  onOpenExpenseTracker,
  onOpenFuelTracker,
  initialSection = 'info'
}) {
  console.log('DEBUG COMPONENT IMPORTS:', {
    VehicleImageCarousel: !!VehicleImageCarousel,
    VehicleOverviewCard: !!VehicleOverviewCard,
    VehicleStatusCard: !!VehicleStatusCard,
    VehicleSection: !!VehicleSection,
    VehicleDetailRow: !!VehicleDetailRow,
    VehicleQuickActionCard: !!VehicleQuickActionCard,
    VehicleSpecificationCard: !!VehicleSpecificationCard,
    VehicleDocumentCard: !!VehicleDocumentCard,
  });

  const [vahanData, setVahanData] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (initialSection === 'info') {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 360, animated: true });
      }, 400);
    } else if (initialSection === 'activity') {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 950, animated: true });
      }, 400);
    }
  }, [initialSection, vehicleId]);

  useEffect(() => {
    const fetchVahan = async () => {
      try {
        const info = await getVehicleInfo(vehicleId);
        setVahanData(info);
      } catch (err) {
        console.error('Error fetching VAHAN specs:', err);
      }
    };
    fetchVahan();
  }, [vehicleId]);

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Vehicle details not found.</Text>
        <TouchableOpacity onPress={onBack} style={styles.errorBackBtn}>
          <Text style={styles.errorBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pre-fill fields if not present on vehicle object
  const enrichedVehicle = {
    ...vehicle,
    ownerName: vehicle.ownerName || 'Rushikesh Patil',
    regDate: vehicle.regDate || 'Apr 20, 2022',
    color: vehicle.color || 'Pearl White',
    transmission: vehicle.transmission || 'Manual',
    year: vehicle.year || '2022',
    brandName: vehicle.brandName || vehicle.brand || 'Honda'
  };

  const vehicleDocs = documents.filter(d => d.vehicleId === vehicle.id);
  const pucDoc = vehicleDocs.find(d => d.key === 'puc');
  const rcDoc = vehicleDocs.find(d => d.key === 'rc');
  const insDoc = vehicleDocs.find(d => d.key === 'ins' || d.key === 'insurance');

  const expiries = {
    puc: pucDoc ? pucDoc.expiry : (vehicle.pucExpiry || 'Dec 31, 2026'),
    rc: rcDoc ? rcDoc.expiry : (vehicle.rcExpiry || 'Lifetime'),
    insurance: insDoc ? insDoc.expiry : (vehicle.insuranceExpiry || 'Jun 25, 2026'),
    fitness: rcDoc ? rcDoc.expiry : (vehicle.rcExpiry || 'Lifetime')
  };

  const statusValues = {
    rcStatus: rcDoc ? rcDoc.status : (vehicle.status || 'Active'),
    insuranceStatus: insDoc ? insDoc.status : 'Valid',
    pucStatus: pucDoc ? pucDoc.status : 'Valid',
    fitnessStatus: 'Active'
  };

  const activity = mockRecentActivity[vehicle.id] || {
    fuel: 'No logged refuels.',
    expense: 'No logged expenses.',
    challan: 'No violations detected.',
    service: 'No past booking appointments.'
  };

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.name}? This will remove all associated documents.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(vehicle.id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{enrichedVehicle.name}</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Images Carousel */}
        <View style={styles.carouselWrapper}>
          <VehicleImageCarousel images={vehicle.images} />
        </View>

        {/* ── 1. VEHICLE OVERVIEW CARD ── */}
        <VehicleOverviewCard vehicle={enrichedVehicle} />

        {/* ── VEHICLE INFO DEDICATED SECTION ── */}
        <VehicleSection title="Vehicle Information">
          <VehicleSpecificationCard title="Registration Information">
            <VehicleDetailRow label="Registration Number" value={enrichedVehicle.number} />
            <VehicleDetailRow label="Registration Date" value={vahanData?.regDate || enrichedVehicle.regDate || 'Apr 20, 2022'} />
            <VehicleDetailRow label="RTO Details" value={vahanData?.registrationAuthority || 'Jalgaon RTO, MH'} />
            <VehicleDetailRow label="RC Status" value={vahanData?.rcStatus || enrichedVehicle.status || 'Active'} />
          </VehicleSpecificationCard>

          <VehicleSpecificationCard title="Vehicle Specifications">
            <VehicleDetailRow label="Manufacturer" value={enrichedVehicle.brandName || enrichedVehicle.brand} />
            <VehicleDetailRow label="Model" value={enrichedVehicle.model} />
            <VehicleDetailRow label="Variant" value={enrichedVehicle.variant || 'N/A'} />
            <VehicleDetailRow label="Manufacturing Year" value={enrichedVehicle.year} />
            <VehicleDetailRow label="Vehicle Category" value={enrichedVehicle.type === 'car' ? '4 Wheeler' : '2 Wheeler'} />
            <VehicleDetailRow label="Vehicle Age" value={enrichedVehicle.age || '4 Years'} />
          </VehicleSpecificationCard>

          <VehicleSpecificationCard title="Engine Information">
            <VehicleDetailRow label="Engine Number" value={vahanData?.engineNumber || 'L15Z3******234'} />
            <VehicleDetailRow label="Chassis Number" value={vahanData?.chassisNumber || 'MHHRH2G5********3456'} />
          </VehicleSpecificationCard>

          <VehicleSpecificationCard title="Fuel Information">
            <VehicleDetailRow label="Fuel Type" value={enrichedVehicle.fuel} />
          </VehicleSpecificationCard>

          <VehicleSpecificationCard title="Owner Details">
            <VehicleDetailRow label="Registered Owner" value={vahanData?.ownerName || enrichedVehicle.ownerName || 'Rushikesh Patil'} />
          </VehicleSpecificationCard>
        </VehicleSection>

        {/* ── 4. VEHICLE DOCUMENTS ── */}
        <VehicleSection title="Vehicle Documents">
          {['rc', 'insurance', 'puc'].map(key => {
            const doc = vehicleDocs.find(d => d.key === key) || {
              vehicleId: vehicle.id,
              key: key,
              label: key === 'rc' ? 'RC Book' : key === 'insurance' ? 'Insurance Policy' : 'PUC Certificate',
              expiry: key === 'rc' ? (vehicle.rcExpiry || 'Lifetime') : key === 'insurance' ? (vehicle.insuranceExpiry || 'Not Available') : (vehicle.pucExpiry || 'Not Available'),
              status: 'Not Uploaded'
            };
            return (
              <VehicleDocumentCard
                key={key}
                document={doc}
                onViewDetails={(d) => onOpenDoc && onOpenDoc(d.key || d.type, vehicle.id)}
              />
            );
          })}
        </VehicleSection>

        {/* ── 5. RECENT ACTIVITY CARD ── */}
        <VehicleSection title="Recent Activity Logs">
          <VehicleDetailRow label="Latest Refuel" value={activity.fuel} />
          <VehicleDetailRow label="Last Logged Expense" value={activity.expense} />
          <VehicleDetailRow label="Pending Traffic Challans" value={activity.challan} />
          <VehicleDetailRow label="Last Maintenance Service" value={activity.service} />
        </VehicleSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 22,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  scroll: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  carouselWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  alertBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  alertDesc: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
    lineHeight: 14,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 16,
  },
  errorBackBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  errorBackText: {
    color: 'white',
    fontWeight: '700',
  },
});
