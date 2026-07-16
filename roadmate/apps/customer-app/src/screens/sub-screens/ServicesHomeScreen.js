import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'Car Wash', emoji: '🫧', accent: '#06B6D4', bg: '#ECFEFF' },
  { id: 'Garage', emoji: '🔧', accent: '#2563EB', bg: '#EFF6FF' },
  { id: 'Denting & Painting', emoji: '🎨', accent: '#EC4899', bg: '#FDF2F8' },
  { id: 'Towing', emoji: '🛻', accent: '#F97316', bg: '#FFF7ED' },
  { id: 'PUC Center', emoji: '💨', accent: '#22C55E', bg: '#F0FDF4' },
  { id: 'Service Center', emoji: '🏬', accent: '#6366F1', bg: '#EEF2FF' },
  { id: 'Showroom', emoji: '🏪', accent: '#D97706', bg: '#FFFBEB' },
];

const highlights = [
  { name: 'Speed Auto Garage', type: 'Garage', emoji: '🔧', rating: 4.8, dist: '0.8 km', open: true },
  { name: 'Crystal Car Wash', type: 'Car Wash', emoji: '🫧', rating: 4.6, dist: '1.2 km', open: true },
  { name: 'Jalgaon PUC Center', type: 'PUC Center', emoji: '💨', rating: 4.5, dist: '2.1 km', open: false },
];

export default function ServicesHomeScreen({ onBack, onSelectCategory }) {
  const [search, setSearch] = useState('');

  const filtered = categories.filter((c) => 
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Services</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Jalgaon, Maharashtra</Text>
            </View>
          </View>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={styles.clearSearchIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Categories Catalog */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Service Categories</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {filtered.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => onSelectCategory(cat.id)}
                style={styles.categoryCard}
                activeOpacity={0.8}
              >
                <View style={[styles.categoryIconCircle, { backgroundColor: cat.bg }]}>
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <Text style={[styles.categoryLabel, { color: cat.accent }]}>{cat.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Highlights */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeaderTitle}>📍 Nearby Highlights</Text>
              <Text style={styles.sectionHeaderSubtitle}>Top-rated providers in Jalgaon</Text>
            </View>
          </View>
          
          <View style={styles.highlightsList}>
            {highlights.map((p, i) => (
              <View key={p.name} style={[styles.highlightRow, i < highlights.length - 1 ? styles.borderBottom : null]}>
                <View style={styles.highlightLeft}>
                  <View style={styles.highlightEmojiCircle}>
                    <Text style={styles.highlightEmoji}>{p.emoji}</Text>
                  </View>
                  <View>
                    <Text style={styles.highlightName}>{p.name}</Text>
                    <Text style={styles.highlightSubText}>{p.type} · {p.dist}</Text>
                  </View>
                </View>
                
                <View style={styles.highlightRight}>
                  <Text style={styles.ratingText}>⭐ {p.rating}</Text>
                  <View style={[styles.openStatusPill, { backgroundColor: p.open ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Text style={[styles.openStatusText, { color: p.open ? '#2E7D32' : '#C62828' }]}>
                      {p.open ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
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
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 3,
  },
  locationPin: {
    fontSize: 10,
  },
  locationText: {
    color: 'rgba(219, 234, 254, 0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  clearSearchIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionCard: {
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
  sectionHeaderRow: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    paddingBottom: 10,
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sectionHeaderSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  highlightsList: {
    gap: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  highlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightEmojiCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightEmoji: {
    fontSize: 18,
  },
  highlightName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  highlightSubText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  highlightRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '850',
    color: '#111827',
  },
  openStatusPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  openStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
