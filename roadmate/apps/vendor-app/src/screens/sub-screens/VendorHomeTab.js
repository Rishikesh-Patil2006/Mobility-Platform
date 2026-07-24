import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { useVendorProfile } from '../../context/VendorProfileContext';
import { getListingKPIMetricsByTimeframe } from '../../services/vendorListingAnalyticsService';
import StatCard from '../../components/StatCard';
import QuickActionCard from '../../components/QuickActionCard';
import AvailabilityStatusCard from '../../components/AvailabilityStatusCard';
import GlobalSearchModal from '../../components/GlobalSearchModal';
import NotificationCenterModal from '../../components/NotificationCenterModal';

const { width } = Dimensions.get('window');

const periods = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'This Year'];

export default function VendorHomeTab({ onSelectTab }) {
  const { profile } = useVendorProfile();

  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 Days');
  const [refreshing, setRefreshing] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Listing Platform KPI Metrics
  const kpis = getListingKPIMetricsByTimeframe(selectedPeriod);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // Listing Quick Action shortcuts
  const quickActions = [
    {
      id: 'add-service',
      label: 'Add Service',
      emoji: '＋',
      color: '#1E3A8A',
      onPress: () => onSelectTab && onSelectTab('listings'),
    },
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      emoji: '📝',
      color: '#2563EB',
      onPress: () => onSelectTab && onSelectTab('profile', 'particulars'),
    },
    {
      id: 'update-hours',
      label: 'Working Hours',
      emoji: '⏰',
      color: '#0D9488',
      onPress: () => onSelectTab && onSelectTab('profile', 'availability'),
    },
    {
      id: 'view-listings',
      label: 'View Listings',
      emoji: '📋',
      color: '#7C3AED',
      onPress: () => onSelectTab && onSelectTab('listings'),
    },
    {
      id: 'view-reviews',
      label: 'View Reviews',
      emoji: '⭐',
      color: '#EA580C',
      onPress: () => onSelectTab && onSelectTab('profile', 'particulars', 'reviews'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back 👋</Text>
            <Text style={styles.shopName}>{profile?.businessName || 'RoadMate Partner'}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>
                {profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : 'Jalgaon, Maharashtra'}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowNotificationModal(true)}
              style={styles.headerBellBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.headerBellEmoji}>🔔</Text>
              <View style={styles.headerBellBadge}>
                <Text style={styles.headerBellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.badgeContainer}>
              <View style={styles.onlineBadge}>
                <Text style={styles.onlineText}>● {kpis.verificationStatus}</Text>
              </View>
              <Text style={styles.categoryBadgeText}>{profile?.mainCategory || 'Garage'}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#1E3A8A']} />}
      >
        {/* ── Global Search Launch Bar ── */}
        <TouchableOpacity
          onPress={() => setShowSearchModal(true)}
          style={styles.globalSearchLaunchBar}
          activeOpacity={0.8}
        >
          <Text style={styles.launchSearchIcon}>🔍</Text>
          <Text style={styles.launchSearchPlaceholder}>Search services, categories, tips, reviews...</Text>
          <View style={styles.launchFilterBadge}>
            <Text style={styles.launchFilterText}>⚙️ Filter</Text>
          </View>
        </TouchableOpacity>

        {/* ── Shared Availability Component ── */}
        <AvailabilityStatusCard />

        {/* ── Timeframe Filter Bar ── */}
        <View style={styles.filterBar}>
          <Text style={styles.filterTitle}>Analytics Window:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {periods.map((p) => {
              const selected = selectedPeriod === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setSelectedPeriod(p)}
                  style={[styles.filterPill, selected ? styles.filterPillActive : null]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterPillText, selected ? styles.filterPillTextActive : null]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── 1. Listing Platform Key Metrics Grid ── */}
        <Text style={styles.sectionHeader}>📈 Business Listing Performance</Text>
        <View style={styles.kpiGrid}>
          <StatCard
            label="Business Profile Views"
            value={kpis.profileViews}
            emoji="👁️"
            change={kpis.profileViewsChange}
            accentColor="#2563EB"
          />
          <StatCard
            label="Service Listing Views"
            value={kpis.serviceViews}
            emoji="🔍"
            change={kpis.serviceViewsChange}
            accentColor="#8B5CF6"
          />
        </View>

        <View style={styles.kpiGrid}>
          <StatCard
            label="WhatsApp Inquiries"
            value={kpis.whatsAppClicks}
            emoji="💬"
            change={kpis.whatsAppChange}
            accentColor="#10B981"
          />
          <StatCard
            label="Phone Call Clicks"
            value={kpis.phoneCalls}
            emoji="📞"
            change={kpis.callsChange}
            accentColor="#F59E0B"
          />
        </View>

        <View style={styles.kpiGrid}>
          <StatCard
            label="Direction Requests"
            value={kpis.directionRequests}
            emoji="🗺️"
            change={kpis.directionsChange}
            accentColor="#EC4899"
          />
          <StatCard
            label="Customer Rating"
            value={`${kpis.averageRating} ★`}
            emoji="⭐"
            subtitle={kpis.ratingSubtitle}
            accentColor="#EAB308"
          />
        </View>

        <View style={styles.kpiGrid}>
          <StatCard
            label="Published Tips Views"
            value={kpis.tipsViews}
            emoji="🛠️"
            subtitle={`${kpis.tipsSubtitle} · ${kpis.tipsCTR}`}
            accentColor="#06B6D4"
          />
          <StatCard
            label="Profile Completion"
            value={`${kpis.profileCompletion}%`}
            emoji="📊"
            subtitle={kpis.subscriptionBadge}
            accentColor="#16A34A"
            onPress={() => onSelectTab && onSelectTab('profile', 'particulars')}
          />
        </View>

        {/* ── 2. Quick Shortcuts Panel ── */}
        <QuickActionCard actions={quickActions} />

        {/* ── Preserved Emergency Roadside Assistance Alert Card ── */}
        <View style={styles.emergencyAlertCard}>
          <View style={styles.alertHeaderRow}>
            <Text style={styles.alertHeaderTitle}>🚨 Roadside Assistance Alert</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>Live</Text>
            </View>
          </View>
          <Text style={styles.alertDesc}>
            Customer requested emergency breakdown assistance on NH-6 Highway.
          </Text>
          <View style={styles.alertActionsRow}>
            <TouchableOpacity style={styles.alertCallButton} activeOpacity={0.7}>
              <Text style={styles.alertCallText}>📞 Call Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertMapButton} activeOpacity={0.7}>
              <Text style={styles.alertMapText}>🗺️ View Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── Global Search & Advanced Filters Modal ── */}
      <GlobalSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        vendorProfile={profile}
      />

      {/* ── Centralized Notification & Activity Center Modal ── */}
      <NotificationCenterModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBellEmoji: {
    fontSize: 16,
  },
  headerBellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  headerBellBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },
  globalSearchLaunchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#1E3A8A',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  launchSearchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  launchSearchPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  launchFilterBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  launchFilterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
  },
  shopName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPin: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  onlineBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },
  onlineText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  categoryBadgeText: {
    color: '#BFDBFE',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 8,
  },
  filterScroll: {
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#1E3A8A',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterPillTextActive: {
    color: 'white',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  emergencyAlertCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  alertHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  liveBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  alertDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    marginBottom: 12,
  },
  alertActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  alertCallButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  alertCallText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  alertMapButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  alertMapText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
});
