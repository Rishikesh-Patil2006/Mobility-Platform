import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { executeGlobalSearch, defaultFilterState, toggleListingVisibility } from '../services/vendorGlobalSearchService';

const categories = ['All', 'Garage', 'Car Wash', 'Towing', 'PUC Center', 'Denting & Painting', 'Service Center', 'Showroom'];
const availabilities = ['All', 'Available', 'Busy', 'Closed', 'On Leave'];
const visibilityStatuses = ['All', 'Visible', 'Hidden', 'Pending Verification', 'Inactive'];
const subscriptionPlans = ['All', 'Gold', 'Silver', 'Basic'];
const ratingOptions = ['All', '5', '4+', '3+'];
const sortOptions = ['Recently Added', 'Recently Updated', 'Alphabetical (A-Z)', 'Alphabetical (Z-A)', 'Highest Rated', 'Most Viewed'];

export default function GlobalSearchModal({ visible, onClose, vendorProfile }) {
  const [filters, setFilters] = useState(defaultFilterState);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('All'); // All | Services | Tips | Reviews
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({ services: [], tips: [], reviews: [], totalCount: 0 });
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const runSearch = async (currentFilters) => {
    setLoading(true);
    const data = await executeGlobalSearch(currentFilters, vendorProfile);
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      runSearch(filters);
    }
  }, [visible, filters]);

  const updateFilter = (key, val) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilterState);
    triggerToast('Filters reset to default!');
  };

  const handleToggleVisibility = async (serviceId) => {
    await toggleListingVisibility(serviceId);
    triggerToast('Listing visibility updated & synced to Customer App!');
    runSearch(filters);
  };

  const getFilteredList = () => {
    if (activeResultTab === 'Services') return results.services;
    if (activeResultTab === 'Tips') return results.tips;
    if (activeResultTab === 'Reviews') return results.reviews;
    return [...results.services, ...results.tips, ...results.reviews];
  };

  const displayList = getFilteredList();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Bar */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>🔍 Global Search & Advanced Filters</Text>
              <Text style={styles.modalSub}>Instant search across services, tips, categories & reviews</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Toast Banner */}
          {toastMsg ? (
            <View style={styles.toast}>
              <Text style={styles.toastText}>✓ {toastMsg}</Text>
            </View>
          ) : null}

          {/* Main Search Input */}
          <View style={styles.searchBarRow}>
            <View style={styles.searchInputBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search services, categories, tips, reviews..."
                value={filters.query}
                onChangeText={(txt) => updateFilter('query', txt)}
              />
              {filters.query ? (
                <TouchableOpacity onPress={() => updateFilter('query', '')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => setShowFiltersPanel(!showFiltersPanel)}
              style={[styles.filterToggleBtn, showFiltersPanel ? styles.filterToggleBtnActive : null]}
            >
              <Text style={[styles.filterToggleText, showFiltersPanel ? styles.filterToggleTextActive : null]}>
                ⚙️ Filters {showFiltersPanel ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Expandable Advanced Filters Panel */}
          {showFiltersPanel && (
            <View style={styles.advancedFiltersCard}>
              <View style={styles.filtersHeaderRow}>
                <Text style={styles.filtersPanelTitle}>🎛️ Advanced Multi-Attribute Filters</Text>
                <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
                  <Text style={styles.resetBtnText}>🔄 Reset Filters</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                {/* Category Filter */}
                <Text style={styles.filterSectionLbl}>Business Category:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => updateFilter('category', cat)}
                      style={[styles.chip, filters.category === cat ? styles.chipActive : null]}
                    >
                      <Text style={[styles.chipText, filters.category === cat ? styles.chipTextActive : null]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Listing Visibility Status */}
                <Text style={styles.filterSectionLbl}>Listing Visibility Status:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {visibilityStatuses.map((st) => (
                    <TouchableOpacity
                      key={st}
                      onPress={() => updateFilter('serviceStatus', st)}
                      style={[styles.chip, filters.serviceStatus === st ? styles.chipActive : null]}
                    >
                      <Text style={[styles.chipText, filters.serviceStatus === st ? styles.chipTextActive : null]}>{st}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Availability Filter */}
                <Text style={styles.filterSectionLbl}>Workshop Availability:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {availabilities.map((av) => (
                    <TouchableOpacity
                      key={av}
                      onPress={() => updateFilter('availability', av)}
                      style={[styles.chip, filters.availability === av ? styles.chipActive : null]}
                    >
                      <Text style={[styles.chipText, filters.availability === av ? styles.chipTextActive : null]}>{av}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Rating Filter */}
                <Text style={styles.filterSectionLbl}>Customer Rating:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {ratingOptions.map((rt) => (
                    <TouchableOpacity
                      key={rt}
                      onPress={() => updateFilter('rating', rt)}
                      style={[styles.chip, filters.rating === rt ? styles.chipActive : null]}
                    >
                      <Text style={[styles.chipText, filters.rating === rt ? styles.chipTextActive : null]}>
                        {rt === 'All' ? 'All Ratings' : `${rt} ★`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Sort Option */}
                <Text style={styles.filterSectionLbl}>Sort Results By:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {sortOptions.map((so) => (
                    <TouchableOpacity
                      key={so}
                      onPress={() => updateFilter('sortBy', so)}
                      style={[styles.chip, filters.sortBy === so ? styles.chipActive : null]}
                    >
                      <Text style={[styles.chipText, filters.sortBy === so ? styles.chipTextActive : null]}>{so}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </ScrollView>
            </View>
          )}

          {/* Section Result Tabs */}
          <View style={styles.tabsRow}>
            {[
              { key: 'All', label: `All (${results.totalCount})` },
              { key: 'Services', label: `Services (${results.services.length})` },
              { key: 'Tips', label: `Tips (${results.tips.length})` },
              { key: 'Reviews', label: `Reviews (${results.reviews.length})` },
            ].map((tb) => {
              const active = activeResultTab === tb.key;
              return (
                <TouchableOpacity
                  key={tb.key}
                  onPress={() => setActiveResultTab(tb.key)}
                  style={[styles.tabItem, active ? styles.tabItemActive : null]}
                >
                  <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>{tb.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Search Results List */}
          {loading ? (
            <ActivityIndicator size="large" color="#1E3A8A" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {displayList.length > 0 ? (
                displayList.map((item) => {
                  const isService = item.itemType === 'service';
                  const isTip = item.itemType === 'tip';
                  const isReview = item.itemType === 'review';

                  return (
                    <View key={item.id} style={styles.resultCard}>
                      {/* Card Top Row */}
                      <View style={styles.resultHeaderRow}>
                        <View style={{ flex: 1 }}>
                          <View style={styles.typeBadgeRow}>
                            <View style={[styles.typeBadge, isService ? styles.badgeService : isTip ? styles.badgeTip : styles.badgeReview]}>
                              <Text style={styles.typeBadgeText}>
                                {isService ? '🔧 SERVICE' : isTip ? '🛠 ARTICLE TIP' : '⭐ REVIEW'}
                              </Text>
                            </View>

                            {isService && (
                              <View style={[styles.visBadge, item.status === 'Visible' ? styles.visVisible : styles.visHidden]}>
                                <Text style={styles.visText}>{item.status === 'Visible' ? '● Visible' : '🔒 Hidden'}</Text>
                              </View>
                            )}
                          </View>

                          <Text style={styles.itemTitle}>{item.name || item.title || item.customerName}</Text>
                          <Text style={styles.itemCategory}>{item.category || item.serviceName || 'General'}</Text>
                        </View>

                        {/* Visibility Toggle Button for Services */}
                        {isService && (
                          <TouchableOpacity
                            onPress={() => handleToggleVisibility(item.id)}
                            style={[styles.toggleBtn, item.status === 'Visible' ? styles.toggleBtnActive : styles.toggleBtnInactive]}
                          >
                            <Text style={styles.toggleBtnText}>
                              {item.status === 'Visible' ? '👁️ Visible' : '🔒 Hidden'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Description */}
                      <Text style={styles.itemDesc} numberOfLines={2}>
                        {item.shortDescription || item.reviewText || item.description}
                      </Text>

                      {/* Per-Listing Performance Insights Grid */}
                      {isService && (
                        <View style={styles.insightsBar}>
                          <View style={styles.insightItem}>
                            <Text style={styles.insightVal}>👁️ {item.views}</Text>
                            <Text style={styles.insightSub}>Views</Text>
                          </View>
                          <View style={styles.insightDivider} />
                          <View style={styles.insightItem}>
                            <Text style={styles.insightVal}>📞 {item.calls}</Text>
                            <Text style={styles.insightSub}>Calls</Text>
                          </View>
                          <View style={styles.insightDivider} />
                          <View style={styles.insightItem}>
                            <Text style={styles.insightVal}>💬 {item.whatsAppClicks}</Text>
                            <Text style={styles.insightSub}>WhatsApp</Text>
                          </View>
                          <View style={styles.insightDivider} />
                          <View style={styles.insightItem}>
                            <Text style={styles.insightVal}>🗺️ {item.directionClicks}</Text>
                            <Text style={styles.insightSub}>Directions</Text>
                          </View>
                          <View style={styles.insightDivider} />
                          <View style={styles.insightItem}>
                            <Text style={styles.insightVal}>📈 {item.ctr}</Text>
                            <Text style={styles.insightSub}>CTR</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>No services, tips, or reviews match your search and filter criteria.</Text>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '94%',
    height: '94%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
  },
  toastText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  searchBarRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  clearIcon: {
    fontSize: 12,
    color: '#94A3B8',
    paddingHorizontal: 4,
  },
  filterToggleBtn: {
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleBtnActive: {
    backgroundColor: '#1E3A8A',
  },
  filterToggleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  filterToggleTextActive: {
    color: 'white',
  },
  advancedFiltersCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  filtersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 6,
  },
  filtersPanelTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  resetBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resetBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
  },
  filterSectionLbl: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 6,
    marginBottom: 4,
  },
  chipScroll: {
    gap: 6,
  },
  chip: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  chipActive: {
    backgroundColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2.5,
    borderColor: '#1E3A8A',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#1E3A8A',
    fontWeight: '900',
  },
  resultCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  typeBadge: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeService: {
    backgroundColor: '#EFF6FF',
  },
  badgeTip: {
    backgroundColor: '#F0FDF4',
  },
  badgeReview: {
    backgroundColor: '#FEF3C7',
  },
  typeBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  visBadge: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  visVisible: {
    backgroundColor: '#DCFCE7',
  },
  visHidden: {
    backgroundColor: '#FEE2E2',
  },
  visText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#166534',
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  itemCategory: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleBtn: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#1E3A8A',
  },
  toggleBtnInactive: {
    backgroundColor: '#64748B',
  },
  toggleBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  itemDesc: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  insightsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  insightItem: {
    alignItems: 'center',
  },
  insightVal: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  insightSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  insightDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 30,
  },
});
