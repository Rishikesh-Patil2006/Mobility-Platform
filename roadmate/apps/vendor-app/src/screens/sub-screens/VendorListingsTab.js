import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const visitorsData = [
  { id: 'V-908', name: 'Rahul S.', phone: '+91 90888 12345', vehicle: 'Swift (MH-19-AB-1234)', service: 'Car Wash & Wax', time: '10:15 AM', status: 'Arrived', notes: 'Needs exterior foam wash and interior dashboard polish.' },
  { id: 'V-909', name: 'Sameer P.', phone: '+91 90999 54321', vehicle: 'Activa (MH-19-CD-5678)', service: 'Engine Oil Change', time: '11:30 AM', status: 'Scheduled', notes: 'Schedule check for brake sound and engine oil replacement.' },
  { id: 'V-910', name: 'Priya Patel', phone: '+91 91122 33445', vehicle: 'Creta (MH-19-EF-9012)', service: 'AC Gas Refill', time: '02:00 PM', status: 'Scheduled', notes: 'AC cooling is low. Check for gas leak.' },
  { id: 'V-911', name: 'Vinay Shah', phone: '+91 93344 55667', vehicle: 'KTM RC (MH-19-GH-3434)', service: 'Chain Lubrication', time: '04:30 PM', status: 'Completed', notes: 'Quick chain lube and washing.' },
];

export default function VendorListingsTab() {
  const [filter, setFilter] = useState('All'); // All | Arrived | Scheduled
  const [expandedId, setExpandedId] = useState(null);

  const filteredList = visitorsData.filter((v) => {
    if (filter === 'All') return true;
    return v.status === filter;
  });

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone, name) => {
    const text = encodeURIComponent(`Hello ${name}, this is Speed Auto Garage regarding your booking.`);
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${text}`).catch(() => {
      // Fallback to web link if WhatsApp client not installed
      Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitor Listings</Text>
        <Text style={styles.headerSubtitle}>Manage bookings & arrived customers</Text>

        {/* Filter Badges */}
        <View style={styles.filterBar}>
          {['All', 'Arrived', 'Scheduled'].map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterBadge, active ? styles.filterBadgeActive : null]}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.listContainer}>
          {filteredList.map((v) => {
            const expanded = expandedId === v.id;
            const isCompleted = v.status === 'Completed';
            const isArrived = v.status === 'Arrived';

            return (
              <View key={v.id} style={[styles.visitorCard, expanded ? styles.visitorCardExpanded : null]}>
                
                {/* Header Summary Row */}
                <TouchableOpacity 
                  onPress={() => setExpandedId(expanded ? null : v.id)}
                  style={styles.cardHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.headerLeft}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{v.name[0]}</Text>
                    </View>
                    <View>
                      <View style={styles.nameRow}>
                        <Text style={styles.visitorName}>{v.name}</Text>
                        <Text style={styles.visitorId}>#{v.id}</Text>
                      </View>
                      <Text style={styles.vehicleText}>{v.vehicle}</Text>
                    </View>
                  </View>

                  <View style={styles.headerRight}>
                    <Text style={styles.timeText}>{v.time}</Text>
                    <View style={[styles.statusPill, { backgroundColor: isCompleted ? '#F0FDF4' : isArrived ? '#EFF6FF' : '#FFF7ED' }]}>
                      <Text style={[styles.statusText, { color: isCompleted ? '#16A34A' : isArrived ? '#2563EB' : '#D97706' }]}>
                        {v.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Expanded Details Section */}
                {expanded && (
                  <View style={styles.cardBody}>
                    <View style={styles.detailsBlock}>
                      <Text style={styles.detailLine}><Text style={styles.bold}>Service:</Text> {v.service}</Text>
                      <Text style={styles.detailLine}><Text style={styles.bold}>Phone:</Text> {v.phone}</Text>
                      <Text style={styles.detailLine}><Text style={styles.bold}>Notes:</Text> {v.notes}</Text>
                    </View>

                    {/* Action buttons */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity 
                        onPress={() => handleCall(v.phone)}
                        style={styles.callButton} 
                        activeOpacity={0.75}
                      >
                        <Text style={styles.actionText}>📞 Call Now</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={() => handleWhatsApp(v.phone, v.name)}
                        style={styles.whatsappButton} 
                        activeOpacity={0.75}
                      >
                        <Text style={styles.actionText}>💬 WhatsApp</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 20,
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  filterBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterBadgeActive: {
    backgroundColor: 'white',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  filterTextActive: {
    color: '#1E3A8A',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  listContainer: {
    gap: 12,
  },
  visitorCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  visitorCardExpanded: {
    borderColor: '#BFDBFE',
    shadowColor: '#2563EB',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '800',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visitorName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  visitorId: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  vehicleText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  statusPill: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 12,
  },
  detailsBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailLine: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: '#4B5563',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});
