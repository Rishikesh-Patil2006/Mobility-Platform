import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const recentActivities = [
  { id: '1', name: 'Rahul S.', time: '10 mins ago', service: 'Car Wash', status: 'Arrived', details: 'Swift (MH-19-AB-1234)' },
  { id: '2', name: 'Sameer P.', time: '1 hour ago', service: 'Engine Tune-up', status: 'Scheduled', details: 'Activa (MH-19-CD-5678)' },
  { id: '3', name: 'Amit K.', time: '2 hours ago', service: 'AC Gas Refill', status: 'Completed', details: 'Creta (MH-19-EF-9012)' },
];

export default function VendorHomeTab({ onSelectTab }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back 👋</Text>
            <Text style={styles.shopName}>Speed Auto Garage</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Jalgaon, Maharashtra</Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.onlineBadge}>
              <Text style={styles.onlineText}>● Active</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Performance metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricEmoji}>👤</Text>
            <Text style={styles.metricValue}>14</Text>
            <Text style={styles.metricLabel}>Visitors Today</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricEmoji}>⭐</Text>
            <Text style={styles.metricValue}>4.8</Text>
            <Text style={styles.metricLabel}>Average Rating</Text>
          </View>

          <TouchableOpacity onPress={() => onSelectTab('listings')} style={styles.metricCard} activeOpacity={0.8}>
            <Text style={styles.metricEmoji}>📋</Text>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>Pending Leads</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Towing / Breakdown Alerts panel */}
        <View style={styles.emergencyAlertCard}>
          <View style={styles.alertHeaderRow}>
            <Text style={styles.alertHeaderTitle}>🚨 Roadside Towing Alert</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>Live</Text>
            </View>
          </View>
          <Text style={styles.alertDesc}>
            Customer reported engine breakdown on NH-6 Highway.
          </Text>
          
          <View style={styles.alertDetailsBlock}>
            <Text style={styles.detailLine}><Text style={styles.bold}>Customer:</Text> Manoj K.</Text>
            <Text style={styles.detailLine}><Text style={styles.bold}>Vehicle:</Text> Maruti Swift (Red)</Text>
            <Text style={styles.detailLine}><Text style={styles.bold}>Distance:</Text> 1.8 km away</Text>
          </View>

          <View style={styles.alertActionsRow}>
            <TouchableOpacity style={styles.alertCallButton} activeOpacity={0.7}>
              <Text style={styles.alertCallText}>📞 Call Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertMapButton} activeOpacity={0.7}>
              <Text style={styles.alertMapText}>🗺️ View Route</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        
        <View style={styles.activityList}>
          {recentActivities.map((act) => {
            const isCompleted = act.status === 'Completed';
            const isArrived = act.status === 'Arrived';
            return (
              <View key={act.id} style={styles.activityRow}>
                <View style={styles.activityLeft}>
                  <View style={[styles.avatarCircle, { backgroundColor: isCompleted ? '#F0FDF4' : isArrived ? '#EFF6FF' : '#FFF7ED' }]}>
                    <Text style={styles.avatarEmoji}>{isCompleted ? '✅' : isArrived ? '🚗' : '🕒'}</Text>
                  </View>
                  <View>
                    <Text style={styles.activityName}>{act.name} · <Text style={styles.activityService}>{act.service}</Text></Text>
                    <Text style={styles.activityDetails}>{act.details}</Text>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <Text style={styles.activityTime}>{act.time}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isCompleted ? '#F0FDF4' : isArrived ? '#EFF6FF' : '#FFF7ED' }]}>
                    <Text style={[styles.statusText, { color: isCompleted ? '#16A34A' : isArrived ? '#2563EB' : '#D97706' }]}>
                      {act.status}
                    </Text>
                  </View>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  shopName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationPin: {
    fontSize: 10,
  },
  locationText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeContainer: {
    justifyContent: 'center',
  },
  onlineBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  onlineText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  metricEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  emergencyAlertCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EF4444',
  },
  liveBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  alertDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 10,
    fontWeight: '500',
  },
  alertDetailsBlock: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  detailLine: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  bold: {
    fontWeight: '700',
  },
  alertActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  alertCallButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCallText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  alertMapButton: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMapText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  activityList: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  activityName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  activityService: {
    fontWeight: '500',
    color: '#6B7280',
  },
  activityDetails: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  activityRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  activityTime: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
