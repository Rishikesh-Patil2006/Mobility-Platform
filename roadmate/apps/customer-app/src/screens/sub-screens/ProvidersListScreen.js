import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const providerData = {
  'Garage': [
    { id: '1', name: 'Speed Auto Garage', rating: 4.8, reviews: 312, distance: '0.8 km', address: 'Near Civil Hospital, Jalgaon', open: true, hours: '9 AM – 8 PM', phone: '+91 98765 43210' },
    { id: '2', name: 'Patil Motors & Garage', rating: 4.6, reviews: 218, distance: '1.4 km', address: 'Station Road, Jalgaon', open: true, hours: '8 AM – 9 PM', phone: '+91 98765 43211' },
    { id: '3', name: 'Royal Garage Center', rating: 4.5, reviews: 184, distance: '2.1 km', address: 'Navi Peth, Jalgaon', open: false, hours: '9 AM – 7 PM', phone: '+91 98765 43212' },
    { id: '4', name: 'Expert Auto Works', rating: 4.3, reviews: 156, distance: '2.8 km', address: 'Ajintha Road, Jalgaon', open: true, hours: '8 AM – 8 PM', phone: '+91 98765 43213' },
    { id: '5', name: 'Shree Auto Service', rating: 4.2, reviews: 98, distance: '3.2 km', address: 'Raver Naka, Jalgaon', open: true, hours: '9 AM – 6 PM', phone: '+91 98765 43214' },
  ],
  'Car Wash': [
    { id: '1', name: 'Crystal Car Wash', rating: 4.7, reviews: 245, distance: '1.2 km', address: 'MG Road, Jalgaon', open: true, hours: '7 AM – 9 PM', phone: '+91 98765 44210' },
    { id: '2', name: 'Shine Auto Spa', rating: 4.5, reviews: 189, distance: '1.8 km', address: 'Khandesh Plaza, Jalgaon', open: true, hours: '8 AM – 8 PM', phone: '+91 98765 44211' },
    { id: '3', name: 'Pro Wash Center', rating: 4.4, reviews: 134, distance: '2.5 km', address: 'Bhusawal Road, Jalgaon', open: false, hours: '9 AM – 7 PM', phone: '+91 98765 44212' },
    { id: '4', name: 'Quick Clean Wash', rating: 4.2, reviews: 112, distance: '3.0 km', address: 'Ring Road, Jalgaon', open: true, hours: '8 AM – 8 PM', phone: '+91 98765 44213' },
    { id: '5', name: 'Diamond Auto Wash', rating: 4.1, reviews: 87, distance: '3.5 km', address: 'Savda Road, Jalgaon', open: true, hours: '9 AM – 6 PM', phone: '+91 98765 44214' },
  ],
  'Towing': [
    { id: '1', name: 'Rescue Towing 24x7', rating: 4.9, reviews: 189, distance: '1.0 km', address: 'Mumbai Highway, Jalgaon', open: true, hours: '24 Hours', phone: '+91 98765 55210' },
    { id: '2', name: 'Highway Help Towing', rating: 4.7, reviews: 156, distance: '1.6 km', address: 'Pune Road, Jalgaon', open: true, hours: '24 Hours', phone: '+91 98765 55211' },
    { id: '3', name: 'Quick Rescue Services', rating: 4.5, reviews: 128, distance: '2.3 km', address: 'NH-6, Jalgaon', open: true, hours: '24 Hours', phone: '+91 98765 55212' },
    { id: '4', name: 'Safe Haul Towing', rating: 4.4, reviews: 98, distance: '3.1 km', address: 'Dhule Road, Jalgaon', open: false, hours: '8 AM – 10 PM', phone: '+91 98765 55213' },
    { id: '5', name: 'Metro Tow & Recovery', rating: 4.3, reviews: 76, distance: '3.8 km', address: 'Chalisgaon Road, Jalgaon', open: true, hours: '24 Hours', phone: '+91 98765 55214' },
  ],
  'PUC Center': [
    { id: '1', name: 'Jalgaon PUC Center', rating: 4.6, reviews: 312, distance: '2.1 km', address: 'NH-6, Near Toll Plaza, Jalgaon', open: true, hours: '9 AM – 7 PM', phone: '+91 98765 66210' },
    { id: '2', name: 'Green Emission Center', rating: 4.5, reviews: 267, distance: '2.8 km', address: 'Ajintha Road, Jalgaon', open: true, hours: '9 AM – 6 PM', phone: '+91 98765 66211' },
    { id: '3', name: 'Auto Emission Check', rating: 4.3, reviews: 198, distance: '3.4 km', address: 'MG Road, Jalgaon', open: false, hours: '10 AM – 6 PM', phone: '+91 98765 66212' },
    { id: '4', name: 'Eco PUC Station', rating: 4.2, reviews: 145, distance: '4.0 km', address: 'Station Area, Jalgaon', open: true, hours: '9 AM – 7 PM', phone: '+91 98765 66213' },
    { id: '5', name: 'City Emission Point', rating: 4.1, reviews: 98, distance: '4.5 km', address: 'Ring Road, Jalgaon', open: true, hours: '9 AM – 5 PM', phone: '+91 98765 66214' },
  ],
};

const categoryTheme = {
  'Garage': { icon: '🔧', color: '#2563EB', bg: '#EFF6FF' },
  'Car Wash': { icon: '🫧', color: '#06B6D4', bg: '#ECFEFF' },
  'Towing': { icon: '🛻', color: '#F97316', bg: '#FFF7ED' },
  'PUC Center': { icon: '💨', color: '#22C55E', bg: '#F0FDF4' },
  'Denting & Painting': { icon: '🎨', color: '#EC4899', bg: '#FDF2F8' },
  'Service Center': { icon: '🏬', color: '#6366F1', bg: '#EEF2FF' },
  'Showroom': { icon: '🏪', color: '#D97706', bg: '#FFFBEB' },
};

export default function ProvidersListScreen({ category, onBack, onSelect }) {
  const [filter, setFilter] = useState('Top Rated'); // Top Rated | Open Now | Nearest

  const theme = categoryTheme[category] || categoryTheme.Garage;
  const rawList = providerData[category] || providerData.Garage;

  const sortedList = [...rawList].sort((a, b) => {
    if (filter === 'Top Rated') return b.rating - a.rating;
    if (filter === 'Open Now') return (b.open ? 1 : 0) - (a.open ? 1 : 0);
    // Sort by distance (parsing float from "X.Y km")
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View style={[styles.headerIconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Text style={styles.headerIconEmoji}>{theme.icon}</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Nearby {category}s</Text>
              <Text style={styles.headerSubtitle}>Top providers in Jalgaon</Text>
            </View>
          </View>
        </View>

        {/* Sorting filter pill list */}
        <View style={styles.filterBar}>
          {['Top Rated', 'Open Now', 'Nearest'].map((f) => {
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
          {sortedList.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => onSelect(p)}
              style={styles.providerCard}
              activeOpacity={0.88}
            >
              {/* Header Info */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.avatarCircle, { backgroundColor: theme.bg }]}>
                    <Text style={styles.avatarEmoji}>{theme.icon}</Text>
                  </View>
                  <View style={styles.nameBlock}>
                    <Text style={styles.providerName}>{p.name}</Text>
                    <Text style={styles.providerAddress}>{p.address}</Text>
                  </View>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: p.open ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={[styles.statusBadgeText, { color: p.open ? '#2E7D32' : '#C62828' }]}>
                    {p.open ? '● Open' : '● Closed'}
                  </Text>
                </View>
              </View>

              {/* Footer info stats */}
              <View style={styles.cardFooter}>
                <View style={styles.footerStat}>
                  <Text style={styles.statEmoji}>⭐</Text>
                  <Text style={styles.statBoldVal}>{p.rating}</Text>
                  <Text style={styles.statLabel}>({p.reviews})</Text>
                </View>
                
                <View style={styles.footerStat}>
                  <Text style={styles.statEmoji}>📍</Text>
                  <Text style={styles.statTextVal}>{p.distance}</Text>
                </View>

                <View style={styles.footerStat}>
                  <Text style={styles.statEmoji}>🕒</Text>
                  <Text style={styles.statTextVal}>{p.hours}</Text>
                </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 16,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(219, 234, 254, 0.85)',
    fontSize: 11,
    marginTop: 2,
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
    color: '#2563EB',
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
  providerCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  nameBlock: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  providerAddress: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  footerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: {
    fontSize: 12,
  },
  statBoldVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  statTextVal: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
