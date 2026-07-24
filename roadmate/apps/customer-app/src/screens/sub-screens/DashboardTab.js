import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Modal, Alert } from 'react-native';
import { getRemainingDays, getVehicleAlert } from '../../utils/expiryUtils';
import { VehicleFilterDropdown } from '../../components/VehicleComponents';
import { getFuelBadgeColor, filterVehicles } from '../../utils/vehicleUtils';
import { getChallanSummary } from '../../services/challanService';

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

const docNames = {
  puc: 'PUC',
  rc: 'RC',
  'driving-license': 'Driving License',
  insurance: 'Insurance',
};

const docIcons = {
  puc: require('../../../assets/document_images/puc_book.jpg'),
  rc: require('../../../assets/document_images/rc_book.jpg'),
  'driving-license': require('../../../assets/document_images/driving_license.jpg'),
  insurance: require('../../../assets/document_images/insurance.jpg'),
};

const serviceImages = {
  car_wash: require('../../../assets/services_images/car_wash.jpg'),
  denting: require('../../../assets/services_images/denting_painting.jpg'),
  garage: require('../../../assets/services_images/garage.jpg'),
  puc: require('../../../assets/services_images/puc center.jpg'),
  service: require('../../../assets/services_images/service center.jpg'),
  towing: require('../../../assets/services_images/towing.jpg'),
  placeholder: require('../../../assets/vehicle_placeholder.png'),
};

const serviceBadges = {
  'Car Wash': { text: 'Nearby', color: '#3B82F6', bg: '#EFF6FF' },
  'Garage': { text: '24×7', color: '#EF4444', bg: '#FEF2F2' },
  'Denting': { text: 'Offer', color: '#10B981', bg: '#ECFDF5' },
  'Towing': { text: 'Verified', color: '#8B5CF6', bg: '#F5F3FF' },
  'PUC Center': { text: 'Open Now', color: '#16A34A', bg: '#F0FDF4' },
  'Service Center': { text: 'Top Rated', color: '#F59E0B', bg: '#FFFBEB' },
};

export default function DashboardTab({
  vehicles,
  documents = [],
  backendStatus,
  onOpenDrawer,
  onAddVehicle,
  onOpenDoc,
  onOpenServices,
  onOpenInfoHub,
  onOpenProfile,
  onOpenTips,
  notifications = [],
  onNotificationClick,
  onCheckValuation,
  onOpenVehicleInsights,
  onOpenExpenseTracker,
  onOpenFuelTracker,
  onOpenChallan
}) {
  const [notifBoxOpen, setNotifBoxOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Vehicles');

  const [challanStats, setChallanStats] = useState({ pendingCount: 0, totalFine: 0, recentList: [] });

  useEffect(() => {
    let active = true;
    const fetchStats = async () => {
      try {
        let pendingCount = 0;
        let totalFine = 0;
        let recentList = [];

        for (const v of vehicles) {
          const summary = await getChallanSummary(v.id);
          if (summary) {
            pendingCount += summary.pendingCount;
            totalFine += summary.totalPenalties;
            const pendingChallans = (summary.recentChallans || []).filter(c => c.status === 'Pending');
            pendingChallans.forEach(c => {
              recentList.push({
                ...c,
                vehicleId: v.id,
                vehicleName: v.name,
                vehicleNumber: v.number
              });
            });
          }
        }

        if (active) {
          setChallanStats({
            pendingCount,
            totalFine,
            recentList: recentList.slice(0, 3)
          });
        }
      } catch (err) {
        console.error('Error fetching challan stats:', err);
      }
    };
    fetchStats();
    return () => { active = false; };
  }, [vehicles]);

  const filteredVehicles = filterVehicles(vehicles, selectedFilter);

  const homeMockTips = [
    { id: 't1', title: '10 Tips to Maximize Fuel Efficiency', description: 'Simple driving habits that can reduce fuel consumption...', category: 'Mileage', readTime: '4 min read', imageKey: 'garage' },
    { id: 't2', title: 'Monsoon Car Care Special Checklist', description: 'Ensure your brakes, wipers, and tyres are ready for rain...', category: 'Monsoon Care', readTime: '6 min read', imageKey: 'service' },
    { id: 't3', title: 'EV Battery Longevity Hacks', description: 'Maximize the battery service life of your electric vehicle...', category: 'EV Care', readTime: '5 min read', imageKey: 'denting' },
  ];

  const tipImages = {
    garage: require('../../../assets/services_images/garage.jpg'),
    service: require('../../../assets/services_images/service center.jpg'),
    denting: require('../../../assets/services_images/denting_painting.jpg'),
  };

  const docCards = [
    { key: 'insurance', label: 'Insurance', emoji: '🛡️', text: 'Insurance', color: '#F59E0B', bg: '#FFFBEB' },
    { key: 'puc', label: 'PUC', emoji: '🍃', text: 'PUC', color: '#10B981', bg: '#ECFDF5' },
    { key: 'rc', label: 'RC Book', emoji: '🪪', text: 'RC Book', color: '#2563EB', bg: '#EFF6FF' },
  ];

  const services = [
    {
      label: 'Car Wash',
      imageKey: 'car_wash',
      emoji: '🧼',
      count: 8,
      color: '#06B6D4',
    },
    {
      label: 'Garage',
      imageKey: 'garage',
      emoji: '🔧',
      count: 24,
      color: '#2563EB',
    },
    {
      label: 'Denting',
      imageKey: 'denting',
      emoji: '🎨',
      count: 6,
      color: '#EC4899',
    },
    {
      label: 'Towing',
      imageKey: 'towing',
      emoji: '🚗',
      count: 5,
      color: '#F97316',
    },
    {
      label: 'PUC Center',
      imageKey: 'puc',
      emoji: '📋',
      count: 12,
      color: '#22C55E',
    },
    {
      label: 'Service Center',
      imageKey: 'service',
      emoji: '🏢',
      count: 9,
      color: '#6366F1',
    },
  ];

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        {/* Decorative background vectors */}
        <View style={styles.circleOrnament1} />
        <View style={styles.circleOrnament2} />

        {/* Top actions bar */}
        <View style={styles.headerTopRow}>
          {/* Hamburger Menu (top-left) */}
          <TouchableOpacity onPress={onOpenDrawer} style={styles.iconButton} activeOpacity={0.7}>
            <Text style={styles.iconEmoji}>☰</Text>
          </TouchableOpacity>

          {/* Right actions (Bell + Profile Avatar) */}
          <View style={styles.headerRightActions}>
            {/* Bell Notification */}
            <TouchableOpacity onPress={() => setNotifBoxOpen(true)} style={styles.iconButton} activeOpacity={0.7}>
              <Image
                source={require('../../../assets/notification_icon.png')}
                style={styles.notifIconImage}
                resizeMode="contain"
              />
              {notifications.filter(n => n.status === 'Unread').length > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {notifications.filter(n => n.status === 'Unread').length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile Avatar */}
            <TouchableOpacity onPress={onOpenProfile} style={styles.avatarButton} activeOpacity={0.7}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>RP</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.headerGreetingSection}>
          <Text style={styles.welcomeText}>Hello 👋</Text>
          <Text style={styles.profileName}>Rushikesh</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText}>Jalgaon, Maharashtra</Text>
          </View>
        </View>
      </View>

      <View style={styles.dashboardContent}>
        <View style={styles.healthBanner}>
          <View style={[styles.healthDot, { backgroundColor: backendStatus === 'Connected' ? '#22C55E' : '#EF4444' }]} />
          <Text style={styles.healthText}>Backend: {backendStatus}</Text>
        </View>

        {/* ── 1. MY VEHICLES SECTION ── */}
        <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
          <VehicleFilterDropdown selectedOption={selectedFilter} onSelectOption={setSelectedFilter} vehicles={vehicles} darkTheme={true} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesScroll}
        >
          {filteredVehicles.length === 0 ? (
            <View style={styles.emptyVehiclesBox}>
              <Text style={styles.emptyVehiclesText}>No vehicles found in this category.</Text>
            </View>
          ) : (
            filteredVehicles.map((v) => {
              const vehicleImage = v.images && v.images.length > 0
                ? { uri: v.images[0] }
                : v.image
                  ? (typeof v.image === 'string' ? { uri: v.image } : v.image)
                  : require('../../../assets/vehicle_placeholder.png');

              const vehicleAlert = getVehicleAlert(v.id, documents);
              const fuelColors = getFuelBadgeColor(v.fuel);

              return (
                <TouchableOpacity
                  key={v.id}
                  style={styles.vehicleCard}
                  onPress={() => onOpenVehicleInsights && onOpenVehicleInsights(v.id)}
                  activeOpacity={0.9}
                >
                  <View style={styles.vehicleGraphicBox}>
                    <Image
                      source={vehicleImage}
                      style={styles.vehicleCoverImage}
                      resizeMode="cover"
                    />
                    <View style={[styles.cardFuelBadge, { backgroundColor: fuelColors.bg, borderColor: fuelColors.border }]}>
                      <Text style={[styles.cardFuelBadgeText, { color: fuelColors.text }]}>{v.fuel}</Text>
                    </View>
                  </View>

                  <Text style={styles.vehicleName}>{v.name}</Text>
                  <Text style={styles.vehicleNumber}>{v.number}</Text>

                  <View style={styles.tagsContainer}>
                    <View style={[styles.tag, { backgroundColor: '#F0FDF4' }]}>
                      <Text style={[styles.tagText, { color: '#16A34A' }]}>● Active</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: '#EFF6FF' }]}>
                      <Text style={[styles.tagText, { color: '#2563EB' }]}>{v.fuel}</Text>
                    </View>
                  </View>

                  {vehicleAlert && (
                    <TouchableOpacity
                      onPress={() => {
                        const vehicleDocs = documents.filter(d => d.vehicleId === v.id);
                        const alertDocs = vehicleDocs
                          .map(doc => ({ doc, days: getRemainingDays(doc.expiry) }))
                          .filter(item => item.days <= 30)
                          .sort((a, b) => a.days - b.days);

                        if (alertDocs.length > 0) {
                          onOpenDoc(alertDocs[0].doc.key, v.id);
                        }
                      }}
                      style={[
                        styles.vehicleAlertBadge,
                        {
                          backgroundColor: vehicleAlert.bg,
                          borderColor: vehicleAlert.border
                        }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.vehicleAlertBadgeText, { color: vehicleAlert.color }]}>
                        {vehicleAlert.text}
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })
          )}

          <TouchableOpacity
            onPress={onAddVehicle}
            style={styles.addVehicleCard}
            activeOpacity={0.8}
          >
            <View style={styles.plusCircle}>
              <Text style={styles.plusSign}>+</Text>
            </View>
            <Text style={styles.addVehicleLabel}>Add{'\n'}Vehicle</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── 2. SERVICES SECTION ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity onPress={() => onOpenServices()} activeOpacity={0.6}>
            <Text style={styles.viewAllLink}>View All ❯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((s) => (
            <TouchableOpacity
              key={s.label}
              onPress={() => onOpenServices(s.label)}
              style={styles.serviceButtonCard}
              activeOpacity={0.85}
            >
              <View style={styles.serviceImageContainer}>
                <Image
                  source={serviceImages[s.imageKey] || serviceImages.placeholder}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
                <View style={[styles.serviceBadge, { backgroundColor: serviceBadges[s.label].bg }]}>
                  <Text style={[styles.serviceBadgeText, { color: serviceBadges[s.label].color }]}>
                    {serviceBadges[s.label].text}
                  </Text>
                </View>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>{s.label}</Text>
                <Text style={[styles.serviceCount, { color: s.color }]}>{s.count} Near You</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── 3. VEHICLE TRACKER SECTION ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vehicle Tracker</Text>
        </View>

        <TouchableOpacity
          style={styles.valuationQuickCard}
          onPress={() => onCheckValuation(vehicles[0]?.id || '1')}
          activeOpacity={0.9}
        >
          <View style={styles.valuationQuickRow}>
            <View style={styles.valuationIconCircle}>
              <Text style={styles.valuationIcon}>📈</Text>
            </View>
            <View style={styles.valuationQuickContent}>
              <Text style={styles.valuationQuickTitle}>Vehicle Value</Text>
              <Text style={styles.valuationQuickDesc}>Estimate your vehicle's current resale market value.</Text>
            </View>
            <TouchableOpacity
              style={styles.valuationQuickBtn}
              onPress={() => onCheckValuation(vehicles[0]?.id || '1')}
              activeOpacity={0.8}
            >
              <Text style={styles.valuationQuickBtnText}>Check Value</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.valuationQuickCard, { marginTop: 12 }]}
          onPress={() => onOpenExpenseTracker && onOpenExpenseTracker(vehicles[0]?.id || '1')}
          activeOpacity={0.9}
        >
          <View style={styles.valuationQuickRow}>
            <View style={[styles.valuationIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Text style={styles.valuationIcon}>💰</Text>
            </View>
            <View style={styles.valuationQuickContent}>
              <Text style={styles.valuationQuickTitle}>Expense Tracker</Text>
              <Text style={styles.valuationQuickDesc}>Track all vehicle expenses, fuel, tolls, and maintenance costs.</Text>
            </View>
            <TouchableOpacity
              style={[styles.valuationQuickBtn, { backgroundColor: '#10B981' }]}
              onPress={() => onOpenExpenseTracker && onOpenExpenseTracker(vehicles[0]?.id || '1')}
              activeOpacity={0.8}
            >
              <Text style={styles.valuationQuickBtnText}>Open Tracker</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.valuationQuickCard, { marginTop: 12 }]}
          onPress={() => onOpenFuelTracker && onOpenFuelTracker(vehicles[0]?.id || '1')}
          activeOpacity={0.9}
        >
          <View style={styles.valuationQuickRow}>
            <View style={[styles.valuationIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.valuationIcon}>⛽</Text>
            </View>
            <View style={styles.valuationQuickContent}>
              <Text style={styles.valuationQuickTitle}>Fuel & Mileage Tracker</Text>
              <Text style={styles.valuationQuickDesc}>Monitor mileage efficiency, fuel price history, and logs.</Text>
            </View>
            <TouchableOpacity
              style={[styles.valuationQuickBtn, { backgroundColor: '#F59E0B' }]}
              onPress={() => onOpenFuelTracker && onOpenFuelTracker(vehicles[0]?.id || '1')}
              activeOpacity={0.8}
            >
              <Text style={styles.valuationQuickBtnText}>Track Fuel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* ── 4. TRAFFIC CHALLANS SECTION ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Traffic Challans</Text>
          <TouchableOpacity onPress={() => onOpenChallan && onOpenChallan(null)} activeOpacity={0.6}>
            <Text style={styles.viewAllLink}>View All ❯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.challanOverviewCard}>
          <View style={styles.challanStatsRow}>
            <View style={styles.challanStatItem}>
              <Text style={styles.challanStatValue}>{challanStats.pendingCount}</Text>
              <Text style={styles.challanStatLabel}>Pending Violations</Text>
            </View>
            <View style={[styles.challanStatItem, styles.borderLeft]}>
              <Text style={[styles.challanStatValue, { color: challanStats.totalFine > 0 ? '#EF4444' : '#10B981' }]}>
                ₹{challanStats.totalFine}
              </Text>
              <Text style={styles.challanStatLabel}>Total Fine</Text>
            </View>
          </View>

          {challanStats.totalFine > 0 ? (
            <TouchableOpacity
              style={styles.payChallanBtn}
              onPress={() => onOpenChallan && onOpenChallan(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.payChallanBtnText}>⚠️ Pay Pending Penalties Now</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.noChallansBadge}>
              <Text style={styles.noChallansBadgeText}>✅ No pending violations found</Text>
            </View>
          )}
        </View>

        {challanStats.recentList.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.challanScrollList}
          >
            {challanStats.recentList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.homeChallanCardItem}
                onPress={() => onOpenChallan && onOpenChallan(item.vehicleId)}
                activeOpacity={0.85}
              >
                <View style={styles.homeChallanTop}>
                  <Text style={styles.homeChallanViolation}>{item.violation}</Text>
                  <Text style={styles.homeChallanAmount}>₹{item.amount}</Text>
                </View>
                <Text style={styles.homeChallanLoc} numberOfLines={1}>{item.location}</Text>
                <View style={styles.homeChallanFooter}>
                  <View style={styles.homeChallanBadge}>
                    <Text style={styles.homeChallanBadgeText}>{item.vehicleNumber}</Text>
                  </View>
                  <Text style={styles.homeChallanDate}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── 5. TIPS & MAINTENANCE SECTION ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tips & Maintenance</Text>
          <TouchableOpacity onPress={onOpenTips} activeOpacity={0.6}>
            <Text style={styles.viewAllLink}>View All ❯</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeFeaturedCard}
          onPress={onOpenTips}
          activeOpacity={0.88}
        >
          <Image source={require('../../../assets/services_images/service center.jpg')} style={styles.homeFeaturedImg} resizeMode="cover" />
          <View style={styles.homeFeaturedOverlay} />
          <View style={styles.homeFeaturedContent}>
            <View style={styles.homeFeaturedBadge}>
              <Text style={styles.homeFeaturedBadgeText}>🔥 MONSOON SPECIAL</Text>
            </View>
            <Text style={styles.homeFeaturedTitle}>Monsoon Car Care Special Checklist</Text>
            <Text style={styles.homeFeaturedDesc} numberOfLines={1}>Ensure brakes, wipers, and tyres are ready for heavy rains...</Text>
          </View>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.homeTipsScroll}
        >
          {homeMockTips.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={styles.homeTipCard}
              onPress={onOpenTips}
              activeOpacity={0.88}
            >
              <Image source={tipImages[tip.imageKey]} style={styles.homeTipCardImg} resizeMode="cover" />
              <View style={styles.homeTipCardContent}>
                <View style={styles.homeTipCategoryBadge}>
                  <Text style={styles.homeTipCategoryText}>{tip.category}</Text>
                </View>
                <Text style={styles.homeTipCardTitle} numberOfLines={2}>{tip.title}</Text>
                <Text style={styles.homeTipCardMeta}>⏳ {tip.readTime}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── WEEKLY NOTIFICATIONS MODAL ── */}
      <Modal visible={notifBoxOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.notifOverlay}
          activeOpacity={1}
          onPress={() => setNotifBoxOpen(false)}
        >
          <View style={styles.notifDropdown}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Weekly Insights & Alerts</Text>
              <TouchableOpacity onPress={() => setNotifBoxOpen(false)} style={styles.notifCloseBtn}>
                <Text style={styles.notifCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.notifScroll} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={{ padding: 32, alignItems: 'center' }}>
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>🔔</Text>
                  <Text style={{ fontSize: 11, fontWeight: '750', color: '#64748B', textAlign: 'center' }}>
                    No alerts or notifications yet.
                  </Text>
                </View>
              ) : (
                notifications.map((notif, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.notifItem, index < notifications.length - 1 ? styles.borderBottom : null]}
                    onPress={() => {
                      setNotifBoxOpen(false);
                      onNotificationClick(notif);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.notifIconFrame}>
                      <Text style={styles.notifIconText}>{notif.icon}</Text>
                    </View>
                    <View style={styles.notifItemContent}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[
                          styles.notifItemTitle,
                          notif.status === 'Unread' ? { fontWeight: '900', color: '#1E3FAA' } : null
                        ]}>
                          {notif.title}
                        </Text>
                        {notif.status === 'Unread' && (
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' }} />
                        )}
                      </View>
                      <Text style={styles.notifItemBody}>{notif.description}</Text>
                      <Text style={styles.notifItemTime}>{notif.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  circleOrnament1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circleOrnament2: {
    position: 'absolute',
    top: 10,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  headerGreetingSection: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: 'rgba(219, 234, 254, 0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  profileName: {
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
    color: 'rgba(219, 234, 254, 0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconEmoji: {
    fontSize: 16,
    color: 'white',
  },
  notifIconImage: {
    width: '78%',
    height: '78%',
    alignSelf: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  notifBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },
  notificationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    top: 6,
    right: 8,
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  dashboardContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  healthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    gap: 6,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  healthText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllLink: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  vehiclesScroll: {
    gap: 12,
    paddingBottom: 6,
  },
  vehicleCard: {
    width: 220,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginRight: 4,
  },
  vehicleGraphicBox: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  vehicleCoverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  vehicleTypeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: 'white',
    paddingVertical: 2.5,
    paddingHorizontal: 6.5,
    borderRadius: 6,
    overflow: 'hidden',
    zIndex: 10,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  vehicleNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  tag: {
    paddingVertical: 3.5,
    paddingHorizontal: 7.5,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  vehicleAlertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4.5,
    paddingHorizontal: 8.5,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  vehicleAlertBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  addVehicleCard: {
    width: 140,
    height: '100%',
    minHeight: 180,
    backgroundColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#BFDBFE',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  plusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  plusSign: {
    color: '#2563EB',
    fontSize: 22,
    fontWeight: 'bold',
  },
  addVehicleLabel: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
  docGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
    gap: 8,
  },
  docButtonCard: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  docIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  docIconImage: {
    width: '100%',
    height: '100%',
  },
  docLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  docStatusBadge: {
    paddingVertical: 2.5,
    paddingHorizontal: 6.5,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'center',
  },
  docStatusBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  serviceButtonCard: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceImageContainer: {
    width: '100%',
    height: 135,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  serviceBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  serviceInfo: {
    padding: 10,
  },
  serviceLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111827',
  },
  serviceCount: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 2,
  },
  notifBadge: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    top: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  notifBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
  },
  // Valuation home preview styles
  checkValueLink: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkValueLinkText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '800',
  },
  valuationQuickCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginVertical: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  valuationQuickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valuationIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valuationIcon: {
    fontSize: 20,
  },
  valuationQuickContent: {
    flex: 1,
  },
  valuationQuickTitle: {
    fontSize: 13,
    fontWeight: '850',
    color: '#111827',
  },
  valuationQuickDesc: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  valuationQuickBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  valuationQuickBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '850',
  },
  // Weekly Notifications Modal dropdown styling
  notifOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDropdown: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: width - 40,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notifCloseBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifCloseText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '800',
  },
  notifScroll: {
    paddingHorizontal: 16,
  },
  notifItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    gap: 12,
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  notifIconFrame: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIconText: {
    fontSize: 18,
  },
  notifItemContent: {
    flex: 1,
  },
  notifItemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  notifItemBody: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  notifItemTime: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 4,
  },

  // Home preview tips style overrides
  homeFeaturedCard: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  homeFeaturedImg: {
    width: '100%',
    height: '100%',
  },
  homeFeaturedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  homeFeaturedContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  homeFeaturedBadge: {
    backgroundColor: '#EF4444',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  homeFeaturedBadgeText: {
    color: 'white',
    fontSize: 7,
    fontWeight: '850',
  },
  homeFeaturedTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
  homeFeaturedDesc: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 2,
  },
  homeTipsScroll: {
    gap: 12,
    paddingBottom: 6,
  },
  homeTipCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginRight: 10,
  },
  homeTipCardImg: {
    width: '100%',
    height: 100,
  },
  homeTipCardContent: {
    padding: 10,
  },
  homeTipCategoryBadge: {
    backgroundColor: '#EBF5FF',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  homeTipCategoryText: {
    color: '#2563EB',
    fontSize: 8,
    fontWeight: '800',
  },
  homeTipCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 15,
  },
  homeTipCardMeta: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 4,
  },
  cardFuelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    zIndex: 15,
  },
  cardFuelBadgeText: {
    fontSize: 8,
    fontWeight: '850',
    textTransform: 'uppercase',
  },
  emptyVehiclesBox: {
    width: 220,
    height: 180,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginRight: 10,
  },
  emptyVehiclesText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  challanOverviewCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  challanStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challanStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  challanStatValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#EF4444',
  },
  challanStatLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  payChallanBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  payChallanBtnText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  noChallansBadge: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  noChallansBadgeText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '800',
  },
  challanScrollList: {
    gap: 12,
    paddingBottom: 16,
  },
  homeChallanCardItem: {
    width: 220,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  homeChallanTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  homeChallanViolation: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  homeChallanAmount: {
    fontSize: 12,
    fontWeight: '900',
    color: '#EF4444',
  },
  homeChallanLoc: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 10,
  },
  homeChallanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
  },
  homeChallanBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  homeChallanBadgeText: {
    color: '#475569',
    fontSize: 8,
    fontWeight: '800',
  },
  homeChallanDate: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '700',
  },
});
