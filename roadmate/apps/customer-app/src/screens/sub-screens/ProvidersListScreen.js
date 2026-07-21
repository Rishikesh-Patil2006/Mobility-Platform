import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Modal, TextInput, Alert } from 'react-native';
import { providers, getCategoryTheme, subscribeToAvailability } from '../../services/serviceMockData';
import { AvailabilityBadge, EnquiryButton } from '../../components/ServiceComponents';

const { width } = Dimensions.get('window');

export default function ProvidersListScreen({ category, onBack, onSelect, savedProviderIds, toggleSaveProvider }) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState(null); // 'distance' | 'price'
  const [localProviders, setLocalProviders] = useState(providers);

  React.useEffect(() => {
    const unsubscribe = subscribeToAvailability((providerId, newStatus) => {
      setLocalProviders(prev =>
        prev.map(p => p.id === providerId ? { ...p, availability: newStatus } : p)
      );
    });
    return unsubscribe;
  }, []);
  
  // Enquiry states
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryProvider, setEnquiryProvider] = useState(null);
  const [enquiryName, setEnquiryName] = useState('Rushikesh Patil');
  const [enquiryPhone, setEnquiryPhone] = useState('+91 98765 43210');
  const [enquiryVehicle, setEnquiryVehicle] = useState('Nexon EV');
  const [enquiryMessage, setEnquiryMessage] = useState('I want to enquire about oil change and general service slot.');

  const handleOpenEnquiry = (provider) => {
    setEnquiryProvider(provider);
    setEnquiryModalOpen(true);
  };

  const handleSubmitEnquiry = () => {
    Alert.alert(
      "Enquiry Submitted",
      `Your enquiry for ${enquiryProvider?.name} has been sent successfully. The vendor will contact you shortly.`,
      [{ text: "OK", onPress: () => setEnquiryModalOpen(false) }]
    );
  };

  const theme = getCategoryTheme(category);

  // Filter & sort logic
  let list = localProviders.filter((p) => p.category === category);

  activeFilters.forEach((filter) => {
    if (filter === 'Nearby') list = list.filter((p) => p.distance <= 1.5);
    if (filter === 'Open Now') list = list.filter((p) => p.open);
    if (filter === 'Verified Businesses Only') list = list.filter((p) => p.verified);
    if (filter === 'Top Rated') list = list.filter((p) => p.rating >= 4.5);
    if (filter === 'Offers') list = list.filter((p) => p.offer !== null && p.offer !== undefined);
    if (filter === '24x7') list = list.filter((p) => p.hours === '24 Hours');
    if (filter === 'Emergency') list = list.filter((p) => p.isEmergency);
  });

  if (sortBy === 'distance') {
    list.sort((a, b) => a.distance - b.distance);
  } else if (sortBy === 'price') {
    list.sort((a, b) => a.price - b.price);
  }

  const filterPills = [
    'Nearby',
    'Open Now',
    'Verified Businesses Only',
    'Top Rated',
    'Offers',
    '24x7',
    'Emergency',
    'Distance',
    'Price',
  ];

  const handleToggle = (pill) => {
    if (pill === 'Distance' || pill === 'Price') {
      const type = pill.toLowerCase();
      setSortBy((prev) => (prev === type ? null : type));
    } else {
      setActiveFilters((prev) =>
        prev.includes(pill) ? prev.filter((x) => x !== pill) : [...prev, pill]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <View style={[styles.headerIconCircle, { backgroundColor: theme.bg }]}>
              <Text style={styles.headerIconEmoji}>{theme.icon}</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{category}s Nearby</Text>
              <Text style={styles.headerSubtitle}>{list.length} active service providers</Text>
            </View>
          </View>
        </View>

        {/* Filters pills ScrollView */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterBar}>
          {filterPills.map((f) => {
            const isSort = f === 'Distance' || f === 'Price';
            const active = isSort ? sortBy === f.toLowerCase() : activeFilters.includes(f);

            return (
              <TouchableOpacity
                key={f}
                onPress={() => handleToggle(f)}
                style={[styles.filterBadge, active ? styles.filterBadgeActive : null]}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>
                  {f} {isSort ? (sortBy === f.toLowerCase() ? '↓' : '↕') : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Providers list body ── */}
      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.listContainer}>
          {list.map((p) => {
            const isSaved = savedProviderIds.includes(p.id);

            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => onSelect(p)}
                style={styles.providerCard}
                activeOpacity={0.9}
              >
                {/* Image Cover header */}
                <View style={styles.cardImageContainer}>
                  <Image source={theme.image} style={styles.cardImage} />
                  
                  {/* Emergency status pill */}
                  {p.isEmergency && (
                    <View style={styles.emergencyTag}>
                      <Text style={styles.emergencyTagText}>EMERGENCY</Text>
                    </View>
                  )}

                  {/* Offers tag */}
                  {p.offer && (
                    <View style={styles.offerTag}>
                      <Text style={styles.offerTagText}>🎁 {p.offer}</Text>
                    </View>
                  )}

                  {/* Favourite heart overlay */}
                  <TouchableOpacity
                    onPress={() => toggleSaveProvider(p.id)}
                    style={styles.favOverlayButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.favHeartEmoji}>{isSaved ? '❤️' : '🤍'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Body details info */}
                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <View style={styles.titleTextGroup}>
                      <Text style={styles.providerName} numberOfLines={1}>{p.name}</Text>
                      <View style={styles.categoryRow}>
                        <Text style={styles.categoryText}>{p.category}</Text>
                        {p.verified && (
                          <View style={{ gap: 4 }}>
                            <View style={styles.verifiedBadge}>
                              <Text style={styles.verifiedBadgeText}>🛡 Verified Business</Text>
                            </View>
                            <Text style={{ fontSize: 8, color: '#9CA3AF', fontWeight: '600' }}>Verified via Udyam Registration</Text>
                          </View>
                        )}
                      </View>
                      
                      {p.category === 'Garage' && p.availability && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                          <AvailabilityBadge status={p.availability} />
                          {p.availability === 'Unavailable' && (
                            <EnquiryButton onPress={() => handleOpenEnquiry(p)} />
                          )}
                        </View>
                      )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: p.open ? '#E8F5E9' : '#FFEBEE' }]}>
                      <Text style={[styles.statusBadgeText, { color: p.open ? '#2E7D32' : '#C62828' }]}>
                        {p.open ? 'Open' : 'Closed'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.providerAddress} numberOfLines={1}>📍 {p.address}</Text>

                  {/* Meta stats footer row */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>⭐</Text>
                      <Text style={styles.metaBold}>{p.rating}</Text>
                      <Text style={styles.metaLabel}>({p.reviews})</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>🧭</Text>
                      <Text style={styles.metaText}>{p.distance} km</Text>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaIcon}>🕒</Text>
                      <Text style={styles.metaText}>{p.hours}</Text>
                    </View>
                  </View>

                  {/* Estimated Pricing & Duration banner */}
                  <View style={styles.estimateBanner}>
                    <View style={styles.estColumn}>
                      <Text style={styles.estLabel}>ESTIMATED PRICE</Text>
                      <Text style={styles.estValue}>₹{p.price}</Text>
                    </View>
                    <View style={styles.estDivider} />
                    <View style={styles.estColumn}>
                      <Text style={styles.estLabel}>ESTIMATED TIME</Text>
                      <Text style={styles.estValue}>{p.duration}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {list.length === 0 && (
            <View style={styles.emptyList}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No Providers Found</Text>
              <Text style={styles.emptyDesc}>Try adjusting your filters or select a different category.</Text>
            </View>
          )}

          {/* ── ENQUIRY MODAL SHEET ── */}
          <Modal visible={enquiryModalOpen} transparent animationType="slide">
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setEnquiryModalOpen(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Service Enquiry</Text>
                  <TouchableOpacity onPress={() => setEnquiryModalOpen(false)} style={styles.modalCloseBtn}>
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalSubtitle}>
                    Submit an enquiry to <Text style={{ fontWeight: '800', color: '#1E293B' }}>{enquiryProvider?.name}</Text>
                  </Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>YOUR NAME</Text>
                    <TextInput 
                      style={styles.textInput}
                      value={enquiryName}
                      onChangeText={setEnquiryName}
                      placeholder="Enter name"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                    <TextInput 
                      style={styles.textInput}
                      value={enquiryPhone}
                      onChangeText={setEnquiryPhone}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>VEHICLE MODEL</Text>
                    <TextInput 
                      style={styles.textInput}
                      value={enquiryVehicle}
                      onChangeText={setEnquiryVehicle}
                      placeholder="e.g. Nexon EV, Activa 6G"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ENQUIRY MESSAGE</Text>
                    <TextInput 
                      style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                      value={enquiryMessage}
                      onChangeText={setEnquiryMessage}
                      multiline
                      numberOfLines={3}
                      placeholder="Type your requirements..."
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.submitBtn} 
                    onPress={handleSubmitEnquiry}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.submitBtnText}>Submit Enquiry</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
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
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  filterBar: {
    paddingHorizontal: 20,
    gap: 8,
    height: 36,
  },
  filterBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'white',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
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
    gap: 16,
  },
  providerCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emergencyTag: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  emergencyTagText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
  },
  offerTag: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  offerTagText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
  },
  favOverlayButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favHeartEmoji: {
    fontSize: 16,
  },
  cardInfo: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  titleTextGroup: {
    flex: 1,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  verifiedBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  verifiedBadgeText: {
    color: '#2563EB',
    fontSize: 8,
    fontWeight: '800',
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
  providerAddress: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 12,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaBold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  metaLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  metaText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  estimateBanner: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  estColumn: {
    flex: 1,
    alignItems: 'center',
  },
  estLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  estValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  estDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    height: '100%',
  },
  emptyList: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '650',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
  },
  modalScroll: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '850',
  },
});
