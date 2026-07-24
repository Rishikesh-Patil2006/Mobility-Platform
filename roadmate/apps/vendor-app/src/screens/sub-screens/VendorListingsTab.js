import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Image, Alert, Dimensions } from 'react-native';
import { useVendorProfile } from '../../context/VendorProfileContext';
import {
  fetchServices,
  saveService,
  deleteService,
  duplicateService,
  toggleServiceVisibility,
} from '../../services/vendorServiceService';
import { syncFullVendorProfileToBackend } from '../../services/vendorListingService';

import { fetchBookings, updateBookingStatus } from '../../services/vendorBookingService';
import { fetchEnquiries } from '../../services/vendorEnquiryService';
import { fetchCustomerDirectory } from '../../services/vendorCustomerHistoryService';

import BookingCard from '../../components/BookingCard';
import EnquiryCard from '../../components/EnquiryCard';
import CustomerCard from '../../components/CustomerCard';
import CalendarView from '../../components/CalendarView';
import EmptyState from '../../components/EmptyState';
import ServiceManagementModal from '../../components/ServiceManagementModal';
import GlobalSearchModal from '../../components/GlobalSearchModal';

const { width } = Dimensions.get('window');

export default function VendorListingsTab() {
  const { profile } = useVendorProfile();

  // Primary Tab state: 'services' | 'bookings' | 'enquiries' | 'calendar' | 'customers'
  const [activeTab, setActiveTab] = useState('services');

  // Services Catalog states
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [searchService, setSearchService] = useState('');
  const [filterService, setFilterService] = useState('All Services');

  // Service Modals
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [detailServiceModal, setDetailServiceModal] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Other tabs data states
  const [bookings, setBookings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  const loadAllListingsData = async () => {
    setLoadingServices(true);
    try {
      const sList = await fetchServices(profile?.vendorId || 'vendor-1', profile?.mainCategory || 'Garage');
      const bList = await fetchBookings(profile?.vendorId || 'vendor-1');
      const eList = await fetchEnquiries(profile?.vendorId || 'vendor-1');
      const cList = await fetchCustomerDirectory();

      setServices(sList);
      setBookings(bList);
      setEnquiries(eList);
      setCustomers(cList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    loadAllListingsData();
  }, [profile]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Sync state to backend
  const triggerBackendSync = async (updatedServices) => {
    await syncFullVendorProfileToBackend({
      vendorId: profile?.vendorId || 'vendor-1',
      businessName: profile?.businessName || 'Speed Auto Garage',
      logo: profile?.logo || '',
      category: profile?.mainCategory || 'Garage',
      address: profile?.address || '',
      city: profile?.city || 'Jalgaon',
      rating: 4.8,
      reviewsCount: 42,
      verificationStatus: profile?.verificationStatus || 'Verified',
      subscriptionTier: 'Professional',
      premiumBadgeActive: true,
      services: updatedServices || services,
    });
  };

  // ── SERVICE CRUD ACTIONS ──
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (srv) => {
    setEditingService(srv);
    setServiceModalOpen(true);
  };

  const handleSaveService = async (serviceData) => {
    const saved = await saveService(serviceData);
    let nextServices;
    if (editingService) {
      nextServices = services.map((s) => (s.id === saved.id ? saved : s));
    } else {
      nextServices = [saved, ...services];
    }
    setServices(nextServices);
    triggerToast(editingService ? 'Service listing updated!' : 'New service created!');
    await triggerBackendSync(nextServices);
  };

  const handleDuplicateService = async (id) => {
    const dup = await duplicateService(id);
    if (dup) {
      const nextServices = [dup, ...services];
      setServices(nextServices);
      triggerToast(`Duplicated: ${dup.name}`);
      await triggerBackendSync(nextServices);
    }
  };

  const handleToggleVisibility = async (id) => {
    const updated = await toggleServiceVisibility(id);
    if (updated) {
      const nextServices = services.map((s) => (s.id === id ? updated : s));
      setServices(nextServices);
      triggerToast(`Visibility set to ${updated.status}`);
      await triggerBackendSync(nextServices);
    }
  };

  const handleDeleteService = (id, name) => {
    Alert.alert(
      'Delete Service Listing',
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Listing',
          style: 'destructive',
          onPress: async () => {
            await deleteService(id);
            const nextServices = services.filter((s) => s.id !== id);
            setServices(nextServices);
            triggerToast('Service listing deleted.');
            await triggerBackendSync(nextServices);
          },
        },
      ]
    );
  };

  // Filtering
  const filteredServices = services.filter((srv) => {
    const q = (searchService || '').toLowerCase();
    const matchesSearch =
      (srv.name || '').toLowerCase().includes(q) ||
      (srv.shortDescription || '').toLowerCase().includes(q) ||
      (srv.subcategory || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterService === 'All Services') return true;
    if (filterService === 'Visible') return srv.status === 'Visible';
    if (filterService === 'Hidden') return srv.status === 'Hidden';
    if (filterService === 'Draft') return srv.status === 'Draft';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services & Listings Management</Text>
        <Text style={styles.headerSubtitle}>Manage service catalog, pricing, charges, duration & bookings</Text>

        {/* Sub-tabs Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {[
            { key: 'services', label: `🔧 Services (${(services || []).length})` },
            { key: 'bookings', label: `📋 Bookings (${(bookings || []).length})` },
            { key: 'enquiries', label: `📩 Enquiries (${(enquiries || []).length})` },
            { key: 'calendar', label: '📅 Slot Calendar' },
            { key: 'customers', label: `👤 Directory (${(customers || []).length})` },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              style={[styles.tabBtn, activeTab === t.key ? styles.tabBtnActive : null]}
            >
              <Text style={[styles.tabText, activeTab === t.key ? styles.tabTextActive : null]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Toast Alert */}
      {toastMsg ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ {toastMsg}</Text>
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        {/* ── TAB 1: SERVICES CATALOG (PRIMARY) ── */}
        {activeTab === 'services' && (
          <View style={{ flex: 1 }}>
            <View style={styles.filterSection}>
              {/* Search Bar & Global Filter Button */}
              <View style={styles.searchBarRow}>
                <View style={styles.searchBox}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search service listings by name, subcategory..."
                    placeholderTextColor="#94A3B8"
                    value={searchService}
                    onChangeText={setSearchService}
                  />
                  {searchService ? (
                    <TouchableOpacity onPress={() => setSearchService('')}>
                      <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={() => setShowSearchModal(true)}
                  style={styles.globalSearchBtn}
                >
                  <Text style={styles.globalSearchBtnText}>⚙️ Advanced</Text>
                </TouchableOpacity>
              </View>

              {/* Status Filter Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {['All Services', 'Visible', 'Hidden', 'Draft'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFilterService(f)}
                    style={[styles.filterChip, filterService === f ? styles.filterChipActive : null]}
                  >
                    <Text style={[styles.filterChipText, filterService === f ? styles.filterChipTextActive : null]}>
                      {f}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
              {filteredServices.length > 0 ? (
                filteredServices.map((srv) => {
                  const isVisible = srv.status === 'Visible';
                  return (
                    <View key={srv.id} style={styles.serviceCard}>
                      <Image source={{ uri: srv.bannerImage }} style={styles.cardImage} resizeMode="cover" />

                      <View style={styles.cardContent}>
                        {/* Header Row */}
                        <View style={styles.cardHeaderRow}>
                          <View style={styles.catBadge}>
                            <Text style={styles.catBadgeText}>{srv.category} · {srv.subcategory}</Text>
                          </View>
                          <View style={[styles.statusBadge, isVisible ? styles.statusVisible : styles.statusHidden]}>
                            <Text style={[styles.statusBadgeText, isVisible ? styles.statusVisibleText : styles.statusHiddenText]}>
                              ● {srv.status}
                            </Text>
                          </View>
                        </View>

                        {/* Title & Summary */}
                        <Text style={styles.serviceTitle}>{srv.name}</Text>
                        <Text style={styles.serviceDesc} numberOfLines={2}>{srv.shortDescription}</Text>

                        {/* Pricing & Duration Matrix */}
                        <View style={styles.priceMatrix}>
                          <View style={styles.priceCol}>
                            <Text style={styles.priceLabel}>Base Price</Text>
                            <Text style={styles.priceVal}>₹{srv.startingPrice}</Text>
                          </View>

                          <View style={styles.priceCol}>
                            <Text style={styles.priceLabel}>Service Charges</Text>
                            <Text style={styles.priceVal}>₹{srv.actualPrice || srv.startingPrice}</Text>
                          </View>

                          {srv.offerPrice ? (
                            <View style={styles.priceCol}>
                              <Text style={styles.priceLabel}>Offer Price</Text>
                              <Text style={styles.offerPriceVal}>₹{srv.offerPrice}</Text>
                            </View>
                          ) : null}

                          <View style={styles.priceCol}>
                            <Text style={styles.priceLabel}>Est. Time</Text>
                            <Text style={styles.durationVal}>⏱️ {srv.duration}</Text>
                          </View>
                        </View>

                        {/* Action Buttons Row */}
                        <View style={styles.cardActionsRow}>
                          <TouchableOpacity onPress={() => setDetailServiceModal(srv)} style={styles.actionIconBtn}>
                            <Text style={styles.actionIconText}>👁️ View</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleOpenEditService(srv)} style={styles.actionIconBtn}>
                            <Text style={styles.actionIconText}>📝 Edit</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleDuplicateService(srv.id)} style={styles.actionIconBtn}>
                            <Text style={styles.actionIconText}>📄 Copy</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleToggleVisibility(srv.id)} style={styles.actionIconBtn}>
                            <Text style={styles.actionIconText}>{isVisible ? '🔒 Hide' : '👁️ Show'}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleDeleteService(srv.id, srv.name)} style={styles.deleteIconBtn}>
                            <Text style={styles.deleteIconText}>🗑️ Delete</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <EmptyState
                  title="No Service Listings Found"
                  description={searchService ? 'No listings match your search query.' : 'Tap the floating (+) button below to create your first service listing.'}
                />
              )}
            </ScrollView>

            {/* Floating Action Button (+) */}
            <TouchableOpacity onPress={handleOpenAddService} style={styles.fabBtn} activeOpacity={0.88}>
              <Text style={styles.fabIcon}>＋</Text>
              <Text style={styles.fabLabel}>Add Service</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── TAB 2: BOOKINGS ── */}
        {activeTab === 'bookings' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollPadding}>
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onPressDetails={() => {}} />
            ))}
          </ScrollView>
        )}

        {/* ── TAB 3: ENQUIRIES ── */}
        {activeTab === 'enquiries' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollPadding}>
            {enquiries.map((e) => (
              <EnquiryCard key={e.id} enquiry={e} onReply={() => {}} onDelete={() => {}} />
            ))}
          </ScrollView>
        )}

        {/* ── TAB 4: CALENDAR ── */}
        {activeTab === 'calendar' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollPadding}>
            <CalendarView bookings={bookings} />
          </ScrollView>
        )}

        {/* ── TAB 5: CUSTOMER DIRECTORY ── */}
        {activeTab === 'customers' && (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollPadding}>
            {customers.map((c) => (
              <CustomerCard key={c.customerId} customer={c} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Add / Edit Service Management Modal */}
      <ServiceManagementModal
        visible={serviceModalOpen}
        initialService={editingService}
        vendorId={profile?.vendorId || 'vendor-1'}
        mainCategory={profile?.mainCategory || 'Garage'}
        onSave={handleSaveService}
        onClose={() => setServiceModalOpen(false)}
      />

      {/* Service Details Preview Modal */}
      <Modal visible={!!detailServiceModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            {detailServiceModal && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: detailServiceModal.bannerImage }} style={styles.previewImage} resizeMode="cover" />
                <Text style={styles.previewTitle}>{detailServiceModal.name}</Text>
                <Text style={styles.previewCategory}>{detailServiceModal.category} · {detailServiceModal.subcategory}</Text>

                <View style={styles.previewPriceBox}>
                  <Text style={styles.previewPrice}>Starting Price: ₹{detailServiceModal.startingPrice}</Text>
                  <Text style={styles.previewCharges}>Service Charges: ₹{detailServiceModal.actualPrice}</Text>
                  {detailServiceModal.offerPrice ? <Text style={styles.previewOffer}>Offer Price: ₹{detailServiceModal.offerPrice}</Text> : null}
                  <Text style={styles.previewDuration}>⏱️ Est. Service Time: {detailServiceModal.duration}</Text>
                </View>

                <Text style={styles.previewLabel}>Short Summary:</Text>
                <Text style={styles.previewDesc}>{detailServiceModal.shortDescription}</Text>

                <Text style={[styles.previewLabel, { marginTop: 10 }]}>Detailed Scope of Work:</Text>
                <Text style={styles.previewDesc}>{detailServiceModal.detailedDescription}</Text>
              </ScrollView>
            )}

            <TouchableOpacity onPress={() => setDetailServiceModal(null)} style={styles.closePreviewBtn}>
              <Text style={styles.closePreviewText}>Close Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ── Global Search & Advanced Filters Modal ── */}
      <GlobalSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        vendorProfile={profile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  globalSearchBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  globalSearchBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  tabScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  tabBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabBtnActive: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BFDBFE',
  },
  tabTextActive: {
    color: '#1E3A8A',
  },
  filterSection: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  clearIcon: {
    fontSize: 13,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  filterScroll: {
    gap: 6,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  filterChipActive: {
    backgroundColor: '#1E3A8A',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  scrollPadding: {
    padding: 16,
    paddingBottom: 90,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusVisible: {
    backgroundColor: '#DCFCE7',
  },
  statusHidden: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusVisibleText: {
    color: '#166534',
  },
  statusHiddenText: {
    color: '#991B1B',
  },
  serviceTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  priceMatrix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  priceCol: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  priceVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  offerPriceVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#16A34A',
  },
  durationVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 8,
  },
  actionIconBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionIconText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#334155',
  },
  deleteIconBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteIconText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#EF4444',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 6,
  },
  fabLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '900',
  },
  toast: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  toastText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  previewCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  previewPriceBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 4,
    marginBottom: 12,
  },
  previewPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  previewCharges: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  previewOffer: {
    fontSize: 12,
    fontWeight: '900',
    color: '#16A34A',
  },
  previewDuration: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  previewLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  previewDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  closePreviewBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  closePreviewText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
