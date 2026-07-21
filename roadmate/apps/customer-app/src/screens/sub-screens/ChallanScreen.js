// roadmate/apps/customer-app/src/screens/sub-screens/ChallanScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  ActivityIndicator, 
  Alert, 
  Modal 
} from 'react-native';
import { getChallanSummary, payChallan } from '../../services/challanService';
import { VehicleFilterDropdown, ChallanCard } from '../../components/VehicleComponents';
import { filterVehicles } from '../../utils/vehicleUtils';

export default function ChallanScreen({ vehicles = [], initialVehicleId, onBack }) {
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');
  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId || 'all');
  const [loading, setLoading] = useState(true);
  
  // Dashboard statistics
  const [summary, setSummary] = useState(null);
  const [activeChallan, setActiveChallan] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [subTab, setSubTab] = useState('recent'); // 'recent' | 'pending' | 'paid'

  // Sync selected index when filter updates
  useEffect(() => {
    setSelectedVehicleId('all');
  }, [selectedFilter]);

  const fetchChallans = async () => {
    setLoading(true);
    try {
      if (selectedVehicleId === 'all') {
        let allRecentChallans = [];
        let totalPending = 0;
        let totalPaid = 0;
        let totalFine = 0;

        for (const v of filteredVehicles) {
          const data = await getChallanSummary(v.id);
          if (data) {
            totalPending += data.pendingCount;
            totalPaid += data.paidCount;
            totalFine += data.totalPenalties;
            
            const mapped = (data.recentChallans || []).map(c => ({
              ...c,
              vehicleName: v.name,
              vehicleNumber: v.number
            }));
            allRecentChallans = allRecentChallans.concat(mapped);
          }
        }

        // Sort recent challans by date or show all
        setSummary({
          pendingCount: totalPending,
          paidCount: totalPaid,
          totalPenalties: totalFine,
          recentChallans: allRecentChallans
        });
      } else if (selectedVehicleId) {
        const data = await getChallanSummary(selectedVehicleId);
        const v = vehicles.find(x => x.id === selectedVehicleId);
        const mapped = (data?.recentChallans || []).map(c => ({
          ...c,
          vehicleName: v?.name,
          vehicleNumber: v?.number
        }));
        setSummary({
          ...data,
          recentChallans: mapped
        });
      } else {
        setSummary(null);
      }
    } catch (err) {
      console.error('Error fetching challans:', err);
      Alert.alert('Error', 'Unable to retrieve traffic violation records.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics when vehicle selection changes or filter changes
  useEffect(() => {
    fetchChallans();
  }, [selectedVehicleId, selectedFilter, vehicles]);

  const handlePay = async (challanId) => {
    setPayingId(challanId);
    try {
      const res = await payChallan(challanId);
      if (res.success) {
        Alert.alert('Payment Successful', `Challan paid successfully! Trans ID: ${res.transactionId}`);
        setActiveChallan(null);
        // Refresh summary
        await fetchChallans();
      } else {
        Alert.alert('Payment Failed', 'Transaction rejected by gateway.');
      }
    } catch (err) {
      console.error('Payment failure:', err);
      Alert.alert('Payment Error', 'Connection to payment gateway timed out.');
    } finally {
      setPayingId(null);
    }
  };

  const activeVehicle = selectedVehicleId === 'all' ? null : (vehicles.find(v => v.id === selectedVehicleId) || vehicles[0]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Challan</Text>
        </View>
        <VehicleFilterDropdown selectedOption={selectedFilter} onSelectOption={setSelectedFilter} darkTheme={false} />
      </View>

      {/* Horizontal switcher list */}
      {vehicles.length > 0 && (
        <View style={styles.switcherContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherScroll}>
            <TouchableOpacity
              onPress={() => setSelectedVehicleId('all')}
              style={[styles.switcherPill, selectedVehicleId === 'all' ? styles.switcherPillActive : null]}
              activeOpacity={0.7}
            >
              <Text style={[styles.switcherPillText, selectedVehicleId === 'all' ? styles.switcherPillTextActive : null]}>
                All Vehicles
              </Text>
              <Text style={[styles.switcherNumberText, selectedVehicleId === 'all' ? styles.switcherNumberTextActive : null]}>
                {filteredVehicles.length} Vehicles
              </Text>
            </TouchableOpacity>

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
          <Text style={styles.loaderText}>Syncing traffic penalty records...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Summary Dashboard widgets */}
          {summary && (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{summary.pendingCount}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: '#10B981' }]}>{summary.paidCount}</Text>
                <Text style={styles.statLabel}>Paid</Text>
              </View>
              <View style={[styles.statBox, { flex: 1.3 }]}>
                <Text style={[styles.statNum, { color: '#EF4444' }]}>₹{summary.totalPenalties}</Text>
                <Text style={styles.statLabel}>Pending Fine</Text>
              </View>
            </View>
          )}

          {/* Sub-tabs for Pending / Paid / Recent */}
          <View style={styles.subTabContainer}>
            <TouchableOpacity 
              style={[styles.subTab, subTab === 'recent' && styles.subTabActive]} 
              onPress={() => setSubTab('recent')}
              activeOpacity={0.7}
            >
              <Text style={[styles.subTabText, subTab === 'recent' && styles.subTabTextActive]}>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.subTab, subTab === 'pending' && styles.subTabActive]} 
              onPress={() => setSubTab('pending')}
              activeOpacity={0.7}
            >
              <Text style={[styles.subTabText, subTab === 'pending' && styles.subTabTextActive]}>
                Pending ({summary?.pendingCount || 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.subTab, subTab === 'paid' && styles.subTabActive]} 
              onPress={() => setSubTab('paid')}
              activeOpacity={0.7}
            >
              <Text style={[styles.subTabText, subTab === 'paid' && styles.subTabTextActive]}>
                Paid ({summary?.paidCount || 0})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Challans List */}
          <FlatList
            data={(summary?.recentChallans || []).filter(c => {
              if (subTab === 'pending') return c.status === 'Pending';
              if (subTab === 'paid') return c.status === 'Paid';
              return true;
            })}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🛡️</Text>
                <Text style={styles.emptyTitle}>
                  {subTab === 'pending' ? 'No Pending Challans' : subTab === 'paid' ? 'No Paid Challans' : 'Zero Challans Found'}
                </Text>
                <Text style={styles.emptyDesc}>
                  {subTab === 'pending' 
                    ? 'No outstanding traffic violations found.' 
                    : subTab === 'paid' 
                      ? 'You have not paid any challans recently.' 
                      : 'No traffic violations have been registered for this vehicle.'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChallanCard
                violation={item.violation}
                amount={item.amount}
                status={item.status}
                date={item.date}
                location={item.location}
                vehicleName={item.vehicleName}
                vehicleNumber={item.vehicleNumber}
                onViewDetails={() => setActiveChallan(item)}
              />
            )}
          />
        </View>
      )}

      {/* Details Dialog */}
      {activeChallan && (
        <Modal transparent animationType="slide" visible={!!activeChallan}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Violation Details</Text>
                <TouchableOpacity onPress={() => setActiveChallan(null)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.detailLabel}>Violation Offense</Text>
                <Text style={styles.detailValue}>{activeChallan.violation}</Text>

                <Text style={styles.detailLabel}>Registered Penalty</Text>
                <Text style={[styles.detailValue, { color: '#EF4444', fontWeight: '900' }]}>₹{activeChallan.amount}</Text>

                <Text style={styles.detailLabel}>Challan Number</Text>
                <Text style={styles.detailValue}>{activeChallan.id.toUpperCase()}</Text>

                <Text style={styles.detailLabel}>Violation Date</Text>
                <Text style={styles.detailValue}>{activeChallan.date}</Text>

                <Text style={styles.detailLabel}>Location Captured</Text>
                <Text style={styles.detailValue}>{activeChallan.location}</Text>

                <Text style={styles.detailLabel}>Description of Offense</Text>
                <Text style={styles.detailDesc}>{activeChallan.description}</Text>
              </ScrollView>

              {activeChallan.status === 'Pending' ? (
                <TouchableOpacity 
                  style={styles.payBtn}
                  onPress={() => handlePay(activeChallan.id)}
                  disabled={payingId !== null}
                >
                  {payingId !== null ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.payBtnText}>Pay Penalty Now</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.paidNotice}>
                  <Text style={styles.paidNoticeText}>✓ Paid & Settled</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

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
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '750',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  listPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '850',
    color: '#1E293B',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginTop: 6,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '850',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalBody: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '750',
    color: '#1E293B',
    marginTop: 4,
    marginBottom: 14,
  },
  detailDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  payBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
  },
  paidNotice: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  paidNoticeText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '800',
  },
  subTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  subTabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subTabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  subTabTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
