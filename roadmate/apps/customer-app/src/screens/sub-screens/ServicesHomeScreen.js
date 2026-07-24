// roadmate/apps/customer-app/src/screens/sub-screens/ServicesHomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Image, ImageBackground } from 'react-native';
import { categories, providers } from '../../services/serviceMockData';
import { CategorySection } from '../../components/ServiceComponents';

const { width } = Dimensions.get('window');

export default function ServicesHomeScreen({ onBack, onSelectCategory, savedProviderIds, toggleSaveProvider, onSelectProvider }) {
  const [search, setSearch] = useState('');

  // Structured service categories lists
  const serviceSections = [
    {
      title: 'Regular Vendors',
      items: [
        { id: 'Garage', name: 'Garage', emoji: '🔧', accent: '#2563EB', bg: '#EFF6FF', count: 12, description: 'Periodic services, mechanical repairs & diagnostics', image: require('../../../assets/services_images/garage.jpg') },
        { id: 'Car Wash', name: 'Car Wash', emoji: '🫧', accent: '#06B6D4', bg: '#ECFEFF', count: 5, description: 'Premium washing, detailing & interior cleanup', image: require('../../../assets/services_images/car_wash.jpg') },
      ]
    },
    {
      title: 'Service Providers',
      items: [
        { id: 'PUC Center', name: 'PUC Center', emoji: '💨', accent: '#22C55E', bg: '#F0FDF4', count: 4, description: 'Pollution certificates & emission testing', image: require('../../../assets/services_images/puc center.jpg') },
        { id: 'Towing', name: 'Towing', emoji: '🛻', accent: '#F97316', bg: '#FFF7ED', count: 8, description: '24/7 roadside assistance & flatbed towing', image: require('../../../assets/services_images/towing.jpg') },
        { id: 'Driving Classes', name: 'Driving Classes', emoji: '🚗', accent: '#3B82F6', bg: '#EFF6FF', count: 3, description: 'Professional driving lessons & tutoring', image: require('../../../assets/services_images/service center.jpg') },
        { id: 'RTO Agents', name: 'RTO Agents', emoji: '📝', accent: '#EC4899', bg: '#FDF2F8', count: 6, description: 'License issues, registration & transfer agents', image: require('../../../assets/services_images/denting_painting.jpg') },
      ]
    },
    {
      title: 'Showrooms',
      items: [
        { id: 'Two Wheelers', name: 'Two Wheelers', emoji: '🏍️', accent: '#8B5CF6', bg: '#F5F3FF', count: 4, description: 'New bikes showroom, test drives & bookings', image: require('../../../assets/vehicle_placeholder.png') },
        { id: 'Four Wheelers', name: 'Four Wheelers', emoji: '🚘', accent: '#EF4444', bg: '#FEF2F2', count: 2, description: 'New cars showroom, EV bookings & specs', image: require('../../../assets/vehicle_placeholder.png') },
        { id: 'Service Center', name: 'Service Center', emoji: '🏬', accent: '#6366F1', bg: '#EEF2FF', count: 6, description: 'Brand authorized workshop & checkups', image: require('../../../assets/services_images/service center.jpg') },
      ]
    }
  ];

  // Filter sections by search query
  const filteredSections = serviceSections.map(section => {
    const matchedItems = section.items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
    return { ...section, items: matchedItems };
  }).filter(section => section.items.length > 0);

  // Get saved providers details
  const savedProviders = providers.filter((p) => savedProviderIds.includes(p.id));

  return (
    <View style={styles.container}>
      {/* ── Premium Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>YOUR LOCATION</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>Jalgaon, Maharashtra</Text>
            </View>
          </View>
        </View>

        {/* Search & Location Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search category, service, workshop..."
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

        {/* ── Saved Services Section (Only visible if user has saved ones) ── */}
        {savedProviders.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Saved Services</Text>
              <Text style={styles.sectionCountBadge}>{savedProviders.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedScrollContainer}>
              {savedProviders.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => onSelectProvider(p)}
                  style={styles.savedCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.savedCardHeader}>
                    <View style={styles.savedEmojiCircle}>
                      <Text style={styles.savedEmoji}>🔧</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleSaveProvider(p.id)}
                      style={styles.removeSavedButton}
                    >
                      <Text style={styles.removeSavedText}>❤️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.savedCardName} numberOfLines={1}>{p.name}</Text>
                  <Text style={styles.savedCardCat}>{p.category}</Text>
                  <View style={styles.savedCardFooter}>
                    <Text style={styles.savedCardRating}>⭐ {p.rating}</Text>
                    <Text style={styles.savedCardDist}>• {p.distance} km</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Restructured Categories Catalog ── */}
        {filteredSections.map((section, idx) => (
          <CategorySection 
            key={idx}
            title={section.title}
            items={section.items}
            onSelectCategory={onSelectCategory}
          />
        ))}

        {filteredSections.length === 0 && (
          <View style={styles.emptyCategories}>
            <Text style={styles.emptyText}>No matching categories found</Text>
          </View>
        )}

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
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationContainer: {
    flex: 1,
  },
  locationTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  locationPin: {
    fontSize: 12,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  searchRow: {
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
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    padding: 0,
    fontWeight: '600',
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
    paddingBottom: 88,
  },

  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCountBadge: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'white',
    backgroundColor: '#EF4444',
    paddingVertical: 2.5,
    paddingHorizontal: 6.5,
    borderRadius: 10,
  },
  savedScrollContainer: {
    gap: 12,
    paddingRight: 16,
  },
  savedCard: {
    width: 140,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  savedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedEmojiCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedEmoji: {
    fontSize: 14,
  },
  removeSavedButton: {
    padding: 4,
  },
  removeSavedText: {
    fontSize: 14,
  },
  savedCardName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111827',
  },
  savedCardCat: {
    fontSize: 11.5,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  savedCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  savedCardRating: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#111827',
  },
  savedCardDist: {
    fontSize: 10.5,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '600',
  },

  emptyCategories: {
    width: '100%',
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});
