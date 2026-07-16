import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Custom Vector Badges drawn with Views
const VehicleIcon = ({ type }) => {
  const isEv = type === 'ev';
  const isScoot = type === 'scooty';
  return (
    <View style={[styles.vehicleIconContainer, { backgroundColor: isEv ? '#F5F3FF' : isScoot ? '#FFF7ED' : '#EFF6FF' }]}>
      <Text style={styles.vehicleEmoji}>{isEv ? '⚡' : isScoot ? '🛵' : '🚗'}</Text>
    </View>
  );
};

export default function DashboardTab({ 
  vehicles, 
  backendStatus, 
  onOpenDrawer, 
  onAddVehicle, 
  onOpenDoc, 
  onOpenServices, 
  onOpenInfoHub 
}) {

  const docCards = [
    { key: 'puc', label: 'PUC', emoji: '🟢', text: 'PUC', color: '#22C55E', bg: '#F0FDF4' },
    { key: 'rc', label: 'RC Book', emoji: '🔵', text: 'RC Book', color: '#2563EB', bg: '#EFF6FF' },
    { key: 'driving-license', label: 'License', emoji: '🟣', text: 'License', color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'insurance', label: 'Insurance', emoji: '🟡', text: 'Insurance', color: '#F59E0B', bg: '#FFFBEB' },
  ];

  const services = [
    { label: 'Car Wash', emoji: '🫧', count: 8, color: '#06B6D4', bg: '#ECFEFF' },
    { label: 'Garage', emoji: '🔧', count: 24, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Denting', emoji: '🎨', count: 6, color: '#EC4899', bg: '#FDF2F8' },
    { label: 'Towing', emoji: '🛻', count: 5, color: '#F97316', bg: '#FFF7ED' },
    { label: 'PUC Center', emoji: '💨', count: 12, color: '#22C55E', bg: '#F0FDF4' },
    { label: 'Service Center', emoji: '🏬', count: 9, color: '#6366F1', bg: '#EEF2FF' },
  ];

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        {/* Decorative background vectors */}
        <View style={styles.circleOrnament1} />
        <View style={styles.circleOrnament2} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Hello 👋</Text>
            <Text style={styles.profileName}>Rushikesh</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Jalgaon, Maharashtra</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            {/* Bell Notification */}
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconEmoji}>🔔</Text>
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            {/* Menu Hamburger */}
            <TouchableOpacity onPress={onOpenDrawer} style={styles.iconButton} activeOpacity={0.7}>
              <Text style={styles.iconEmoji}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollBody} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        {/* Backend health status badge */}
        <View style={styles.healthBanner}>
          <View style={[styles.healthDot, { backgroundColor: backendStatus === 'Connected' ? '#22C55E' : '#EF4444' }]} />
          <Text style={styles.healthText}>Backend: {backendStatus}</Text>
        </View>

        {/* ── MY VEHICLES SECTION ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.vehiclesScroll}
        >
          {vehicles.map((v) => (
            <View key={v.id} style={styles.vehicleCard}>
              {/* Graphic container simulating vehicle image */}
              <View style={styles.vehicleGraphicBox}>
                <VehicleIcon type={v.type} />
                <Text style={styles.vehicleTypeTag}>{v.type.toUpperCase()}</Text>
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
            </View>
          ))}

          {/* Add Vehicle horizontal item card */}
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

        {/* ── INFORMATION HUB SECTION ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Information Hub</Text>
          <TouchableOpacity onPress={onOpenInfoHub} activeOpacity={0.6}>
            <Text style={styles.viewAllLink}>View All ❯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docGrid}>
          {docCards.map((doc) => (
            <TouchableOpacity 
              key={doc.key} 
              onPress={() => onOpenDoc(doc.key, '1')} 
              style={styles.docButtonCard}
              activeOpacity={0.85}
            >
              <View style={[styles.docIconCircle, { backgroundColor: doc.bg }]}>
                <Text style={styles.docEmoji}>{doc.emoji}</Text>
              </View>
              <Text style={[styles.docLabel, { color: doc.color }]}>{doc.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SERVICES SECTION ── */}
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
              <View style={[styles.serviceGraphicBox, { backgroundColor: s.bg }]}>
                <Text style={styles.serviceBigEmoji}>{s.emoji}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>{s.label}</Text>
                <Text style={[styles.serviceCount, { color: s.color }]}>{s.count} Near You</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#2563EB',
    paddingTop: 50,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
    fontSize: 16,
    fontWeight: '800',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  vehicleIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleEmoji: {
    fontSize: 28,
  },
  vehicleTypeTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
    backgroundColor: 'white',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleNumber: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
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
  docIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  docEmoji: {
    fontSize: 18,
  },
  docLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
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
  serviceGraphicBox: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceBigEmoji: {
    fontSize: 28,
  },
  serviceInfo: {
    padding: 10,
  },
  serviceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  serviceCount: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
