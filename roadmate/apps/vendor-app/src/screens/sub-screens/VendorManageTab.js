import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Dimensions, Switch, Alert } from 'react-native';
import { useVendorProfile } from '../../context/VendorProfileContext';
import { fetchServices, saveService, deleteService } from '../../services/vendorServiceService';
import { getCategoryById } from '../../services/vendorCategoryService';
import { syncServicesForCustomerApp } from '../../services/vendorListingService';

import SearchBar from '../../components/SearchBar';
import FilterChip from '../../components/FilterChip';
import ServiceCard from '../../components/ServiceCard';
import EmptyState from '../../components/EmptyState';
import ServiceImageGallery from '../../components/ServiceImageGallery';
import ServicePriceCard from '../../components/ServicePriceCard';

// Phase 6 Marketing & Growth Imports
import { fetchOffers, saveOffer, deleteOffer } from '../../services/vendorOfferService';
import { fetchCoupons, saveCoupon, toggleCoupon, deleteCoupon } from '../../services/vendorCouponService';
import { fetchBanners, saveBanner, deleteBanner } from '../../services/vendorPromotionService';
import { fetchReferralDetails, getMarketingMetrics } from '../../services/vendorReferralService';

import OfferCard from '../../components/OfferCard';
import CouponCard from '../../components/CouponCard';
import PromotionBannerCard from '../../components/PromotionBannerCard';
import MarketingDashboardCard from '../../components/MarketingDashboardCard';
import ReferralCard from '../../components/ReferralCard';
import CampaignAnalyticsCard from '../../components/CampaignAnalyticsCard';
import BookingFilterBar from '../../components/BookingFilterBar';

const { width } = Dimensions.get('window');

const durations = ['15 Mins', '30 Mins', '45 Mins', '1 Hour', '2 Hours', '3 Hours', '1 Day', '2 Days'];

export default function VendorManageTab() {
  const { profile } = useVendorProfile();

  // Top Segment state
  const [activeSegment, setActiveSegment] = useState('catalog'); // 'catalog' | 'offers' | 'coupons' | 'banners' | 'analytics'

  // ── CATALOG STATES ──
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Services');
  const [sortBy, setSortBy] = useState('Newest');

  // Service Modal CRUD
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | 'preview' | 'create-offer' | 'create-coupon' | 'create-banner' | null
  const [selectedService, setSelectedService] = useState(null);

  // Form states - Service
  const [serviceName, setServiceName] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subDropdown, setSubDropdown] = useState(false);
  const [shortDesc, setShortDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [duration, setDuration] = useState('30 Mins');
  const [durationDropdown, setDurationDropdown] = useState(false);
  const [warranty, setWarranty] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('Visible');
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // ── PHASE 6 MARKETING STATES ──
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [referralDetails, setReferralDetails] = useState(null);
  const [marketingMetrics, setMarketingMetrics] = useState(null);

  const [marketingFilter, setMarketingFilter] = useState('All');

  // Form states - Offer
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [offerDiscountVal, setOfferDiscountVal] = useState('');
  const [offerMinOrder, setOfferMinOrder] = useState('');
  const [offerMaxDisc, setOfferMaxDisc] = useState('');
  const [offerStartDate, setOfferStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [offerEndDate, setOfferEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [offerBannerUri, setOfferBannerUri] = useState('');
  const [editingOfferId, setEditingOfferId] = useState(null);

  // Form states - Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponDiscountVal, setCouponDiscountVal] = useState('');
  const [couponValidity, setCouponValidity] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [couponUsageLimit, setCouponUsageLimit] = useState('100');

  // Form states - Banner
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerType, setBannerType] = useState('Offer');
  const [bannerImageUri, setBannerImageUri] = useState('');
  const [bannerSchedule, setBannerSchedule] = useState('Active · Valid 30 days');

  const categoryObj = getCategoryById(profile?.mainCategory || 'Garage');
  const subcategoriesList = categoryObj ? categoryObj.subcategories : [];

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await fetchServices(profile?.vendorId);
      setServices(data);
      await syncServicesForCustomerApp(profile?.vendorId, data);

      const oList = await fetchOffers(profile?.vendorId);
      const cList = await fetchCoupons(profile?.vendorId);
      const bList = await fetchBanners(profile?.vendorId);
      const rData = await fetchReferralDetails();
      const mData = await getMarketingMetrics();

      setOffers(oList);
      setCoupons(cList);
      setBanners(bList);
      setReferralDetails(rData);
      setMarketingMetrics(mData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [profile]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // ── CATALOG ACTIONS ──
  const openCreateModal = () => {
    setFormError('');
    setSelectedService(null);
    setServiceName('');
    setSubCategory(subcategoriesList[0] || 'General');
    setShortDesc('');
    setDetailedDesc('');
    setStartingPrice('');
    setActualPrice('');
    setOfferPrice('');
    setDuration('30 Mins');
    setWarranty('');
    setBannerImage('');
    setGallery([]);
    setTagsInput('');
    setStatus('Visible');
    setIsPopular(false);
    setIsFeatured(false);
    setIsOffer(false);
    setActiveModal('create');
  };

  const openEditModal = (service) => {
    setFormError('');
    setSelectedService(service);
    setServiceName(service.name);
    setSubCategory(service.subCategory);
    setShortDesc(service.shortDescription);
    setDetailedDesc(service.detailedDescription);
    setStartingPrice(String(service.startingPrice));
    setActualPrice(service.actualPrice ? String(service.actualPrice) : '');
    setOfferPrice(service.offerPrice ? String(service.offerPrice) : '');
    setDuration(service.duration);
    setWarranty(service.warranty || '');
    setBannerImage(service.bannerImage);
    setGallery(service.gallery || []);
    setTagsInput(service.tags ? service.tags.join(', ') : '');
    setStatus(service.status);
    setIsPopular(service.isPopular || false);
    setIsFeatured(service.isFeatured || false);
    setIsOffer(service.isOffer || false);
    setActiveModal('edit');
  };

  const handleSaveService = async () => {
    setFormError('');
    if (!serviceName.trim()) return setFormError('Service name is required.');
    if (!startingPrice || isNaN(Number(startingPrice)) || Number(startingPrice) <= 0) {
      return setFormError('Starting price must be a valid positive number.');
    }

    setSaving(true);
    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      id: selectedService ? selectedService.id : undefined,
      vendorId: profile?.vendorId || 'vendor-1',
      name: serviceName,
      subCategory,
      shortDescription: shortDesc,
      detailedDescription: detailedDesc,
      startingPrice: Number(startingPrice),
      actualPrice: actualPrice ? Number(actualPrice) : undefined,
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      duration,
      warranty,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
      gallery: gallery.length > 0 ? gallery : ['https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600'],
      tags: tagsArray,
      status,
      isPopular,
      isFeatured,
      isOffer,
    };

    const saved = await saveService(payload);
    let updatedList = [];
    if (selectedService) {
      updatedList = services.map((s) => (s.id === saved.id ? saved : s));
    } else {
      updatedList = [saved, ...services];
    }
    setServices(updatedList);
    await syncServicesForCustomerApp(profile?.vendorId, updatedList);

    setSaving(false);
    setActiveModal(null);
    triggerToast(selectedService ? 'Service updated!' : 'New service created!');
  };

  const handleDeleteServiceItem = (serviceId) => {
    Alert.alert('Delete Service', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteService(serviceId);
          const next = services.filter((s) => s.id !== serviceId);
          setServices(next);
          await syncServicesForCustomerApp(profile?.vendorId, next);
          triggerToast('Service deleted.');
        },
      },
    ]);
  };

  // ── PHASE 6 MARKETING ACTIONS ──
  const handleOpenCreateOffer = (existing) => {
    if (existing) {
      setEditingOfferId(existing.id);
      setOfferTitle(existing.title);
      setOfferDesc(existing.description);
      setOfferDiscountType(existing.discountType);
      setOfferDiscountVal(String(existing.discountValue));
      setOfferMinOrder(String(existing.minOrderAmount));
      setOfferMaxDisc(existing.maxDiscountAmount ? String(existing.maxDiscountAmount) : '');
      setOfferStartDate(existing.startDate);
      setOfferEndDate(existing.endDate);
      setOfferBannerUri(existing.bannerUri || '');
    } else {
      setEditingOfferId(null);
      setOfferTitle('');
      setOfferDesc('');
      setOfferDiscountType('Percentage');
      setOfferDiscountVal('');
      setOfferMinOrder('');
      setOfferMaxDisc('');
      setOfferStartDate(new Date().toISOString().split('T')[0]);
      setOfferEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
      setOfferBannerUri('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600');
    }
    setActiveModal('create-offer');
  };

  const handleSaveOfferForm = async () => {
    const res = await saveOffer({
      id: editingOfferId || undefined,
      title: offerTitle,
      description: offerDesc,
      discountType: offerDiscountType,
      discountValue: Number(offerDiscountVal),
      minOrderAmount: Number(offerMinOrder),
      maxDiscountAmount: offerMaxDisc ? Number(offerMaxDisc) : undefined,
      startDate: offerStartDate,
      endDate: offerEndDate,
      bannerUri: offerBannerUri || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
      status: 'Active',
    });

    if (!res.success) return Alert.alert('Error', res.error || 'Failed to save offer.');
    if (res.data) {
      if (editingOfferId) {
        setOffers((prev) => prev.map((o) => (o.id === editingOfferId ? res.data : o)));
      } else {
        setOffers((prev) => [res.data, ...prev]);
      }
      setActiveModal(null);
      triggerToast('Offer campaign saved successfully!');
    }
  };

  const handleDeleteOfferItem = (id) => {
    Alert.alert('Delete Offer', 'Are you sure you want to remove this offer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteOffer(id);
          setOffers((prev) => prev.filter((o) => o.id !== id));
          triggerToast('Offer deleted.');
        },
      },
    ]);
  };

  const handleSaveCouponForm = async () => {
    const res = await saveCoupon({
      code: couponCode,
      description: couponDesc,
      discountValue: couponDiscountVal,
      validityDate: couponValidity,
      usageLimit: Number(couponUsageLimit) || 100,
    });

    if (!res.success) return Alert.alert('Error', res.error || 'Failed to save coupon.');
    if (res.data) {
      setCoupons((prev) => [res.data, ...prev]);
      setActiveModal(null);
      setCouponCode('');
      setCouponDesc('');
      setCouponDiscountVal('');
      triggerToast('Coupon code created successfully!');
    }
  };

  const handleToggleCouponItem = async (id) => {
    await toggleCoupon(id);
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
    triggerToast('Coupon status updated.');
  };

  const handleDeleteCouponItem = (id) => {
    Alert.alert('Delete Coupon', 'Are you sure you want to remove this coupon code?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCoupon(id);
          setCoupons((prev) => prev.filter((c) => c.id !== id));
          triggerToast('Coupon deleted.');
        },
      },
    ]);
  };

  const handleSaveBannerForm = async () => {
    if (!bannerTitle.trim()) return Alert.alert('Error', 'Banner title is required.');
    const res = await saveBanner({
      title: bannerTitle,
      bannerType,
      imageUri: bannerImageUri || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
      scheduleVisibility: bannerSchedule,
    });

    if (res.data) {
      setBanners((prev) => [res.data, ...prev]);
      setActiveModal(null);
      setBannerTitle('');
      triggerToast('Promotional banner uploaded!');
    }
  };

  const handleDeleteBannerItem = (id) => {
    Alert.alert('Delete Banner', 'Are you sure you want to delete this banner?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBanner(id);
          setBanners((prev) => prev.filter((b) => b.id !== id));
          triggerToast('Banner deleted.');
        },
      },
    ]);
  };

  // ── FILTERING LOGIC ──
  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.shortDescription.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'All Services') return true;
    if (activeFilter === 'Active') return srv.status === 'Visible';
    if (activeFilter === 'Inactive') return srv.status === 'Hidden';
    if (activeFilter === 'Draft') return srv.status === 'Draft';
    return true;
  });

  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (marketingFilter === 'All') return true;
    return o.status === marketingFilter;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catalog & Marketing Hub</Text>
        <Text style={styles.headerSubtitle}>Manage catalog services, offers, coupons & banners</Text>

        {/* Top Segment Switch Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentedScroll}>
          <TouchableOpacity
            onPress={() => setActiveSegment('catalog')}
            style={[styles.segmentBtn, activeSegment === 'catalog' ? styles.segmentBtnActive : null]}
          >
            <Text style={[styles.segmentText, activeSegment === 'catalog' ? styles.segmentTextActive : null]}>
              🔧 Services ({services.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSegment('offers')}
            style={[styles.segmentBtn, activeSegment === 'offers' ? styles.segmentBtnActive : null]}
          >
            <Text style={[styles.segmentText, activeSegment === 'offers' ? styles.segmentTextActive : null]}>
              🎯 Offers ({offers.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSegment('coupons')}
            style={[styles.segmentBtn, activeSegment === 'coupons' ? styles.segmentBtnActive : null]}
          >
            <Text style={[styles.segmentText, activeSegment === 'coupons' ? styles.segmentTextActive : null]}>
              🎟️ Coupons ({coupons.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSegment('banners')}
            style={[styles.segmentBtn, activeSegment === 'banners' ? styles.segmentBtnActive : null]}
          >
            <Text style={[styles.segmentText, activeSegment === 'banners' ? styles.segmentTextActive : null]}>
              🖼️ Banners ({banners.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveSegment('analytics')}
            style={[styles.segmentBtn, activeSegment === 'analytics' ? styles.segmentBtnActive : null]}
          >
            <Text style={[styles.segmentText, activeSegment === 'analytics' ? styles.segmentTextActive : null]}>
              📊 Growth & Referrals
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Toast Alert */}
      {toastMsg ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ {toastMsg}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* ── SEGMENT 1: SERVICES CATALOG ── */}
        {activeSegment === 'catalog' && (
          <View>
            <SearchBar search={search} onChangeSearch={setSearch} placeholder="Search services catalog..." />

            <View style={styles.filterRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['All Services', 'Active', 'Inactive', 'Draft'].map((f) => (
                  <FilterChip
                    key={f}
                    label={f}
                    active={activeFilter === f}
                    onPress={() => setActiveFilter(f)}
                  />
                ))}
              </ScrollView>

              <TouchableOpacity onPress={openCreateModal} style={styles.createBtn} activeOpacity={0.8}>
                <Text style={styles.createBtnText}>＋ Create Service</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#1E3A8A" style={{ marginVertical: 40 }} />
            ) : filteredServices.length > 0 ? (
              filteredServices.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  onPressEdit={() => openEditModal(srv)}
                  onPressDelete={() => handleDeleteServiceItem(srv.id)}
                  onPressPreview={() => {
                    setSelectedService(srv);
                    setActiveModal('preview');
                  }}
                />
              ))
            ) : (
              <EmptyState
                title="No Services Found"
                description={search ? 'No services match your search.' : 'Click Create Service to list your workshop offerings.'}
              />
            )}
          </View>
        )}

        {/* ── SEGMENT 2: OFFERS & DISCOUNTS ── */}
        {activeSegment === 'offers' && (
          <View>
            <View style={styles.actionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>🎯 Promotional Campaigns</Text>
              <TouchableOpacity onPress={() => handleOpenCreateOffer(null)} style={styles.createBtn}>
                <Text style={styles.createBtnText}>＋ Create Offer</Text>
              </TouchableOpacity>
            </View>

            <BookingFilterBar
              search={search}
              onChangeSearch={setSearch}
              activeFilter={marketingFilter}
              onSelectFilter={setMarketingFilter}
              filters={['All', 'Active', 'Upcoming', 'Expired', 'Draft']}
            />

            {filteredOffers.length > 0 ? (
              filteredOffers.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  onEdit={(item) => handleOpenCreateOffer(item)}
                  onDelete={handleDeleteOfferItem}
                />
              ))
            ) : (
              <EmptyState title="No Offers Active" description="Create promotional discounts to attract more customers." />
            )}
          </View>
        )}

        {/* ── SEGMENT 3: COUPON CODES ── */}
        {activeSegment === 'coupons' && (
          <View>
            <View style={styles.actionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>🎟️ Coupon Codes</Text>
              <TouchableOpacity onPress={() => setActiveModal('create-coupon')} style={styles.createBtn}>
                <Text style={styles.createBtnText}>＋ Create Coupon</Text>
              </TouchableOpacity>
            </View>

            {coupons.length > 0 ? (
              coupons.map((c) => (
                <CouponCard
                  key={c.id}
                  coupon={c}
                  onToggle={handleToggleCouponItem}
                  onDelete={handleDeleteCouponItem}
                />
              ))
            ) : (
              <EmptyState title="No Coupons Found" description="Create discount coupon codes for checkout promo." />
            )}
          </View>
        )}

        {/* ── SEGMENT 4: PROMOTIONAL BANNERS ── */}
        {activeSegment === 'banners' && (
          <View>
            <View style={styles.actionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>🖼️ Promotional Banners</Text>
              <TouchableOpacity onPress={() => setActiveModal('create-banner')} style={styles.createBtn}>
                <Text style={styles.createBtnText}>＋ Upload Banner</Text>
              </TouchableOpacity>
            </View>

            {banners.length > 0 ? (
              banners.map((b) => (
                <PromotionBannerCard key={b.id} banner={b} onDelete={handleDeleteBannerItem} />
              ))
            ) : (
              <EmptyState title="No Banners Uploaded" description="Upload seasonal or festival banners for customer app display." />
            )}
          </View>
        )}

        {/* ── SEGMENT 5: MARKETING DASHBOARD & REFERRALS ── */}
        {activeSegment === 'analytics' && (
          <View>
            {marketingMetrics && <MarketingDashboardCard metrics={marketingMetrics} />}
            {marketingMetrics && <CampaignAnalyticsCard metrics={marketingMetrics} />}
            {referralDetails && <ReferralCard referral={referralDetails} />}
          </View>
        )}
      </ScrollView>

      {/* ── MODAL A: CREATE/EDIT OFFER ── */}
      <Modal visible={activeModal === 'create-offer'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingOfferId ? 'Edit Offer Campaign' : 'Create New Offer'}</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Offer Title *</Text>
                <TextInput style={styles.input} placeholder="e.g. Monsoon Special Wash 25% Off" value={offerTitle} onChangeText={setOfferTitle} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Description *</Text>
                <TextInput style={[styles.input, { height: 60 }]} multiline placeholder="Offer terms and highlights..." value={offerDesc} onChangeText={setOfferDesc} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Discount Type *</Text>
                  <TouchableOpacity onPress={() => setOfferDiscountType(offerDiscountType === 'Percentage' ? 'Flat' : 'Percentage')} style={styles.dropdownTrigger}>
                    <Text style={styles.dropdownValue}>{offerDiscountType}</Text>
                    <Text style={styles.dropdownChevron}>▼</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Value ({offerDiscountType === 'Percentage' ? '%' : '₹'}) *</Text>
                  <TextInput style={styles.input} keyboardType="numeric" placeholder="25" value={offerDiscountVal} onChangeText={setOfferDiscountVal} />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Min Order (₹)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" placeholder="499" value={offerMinOrder} onChangeText={setOfferMinOrder} />
                </View>

                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Max Off (₹)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" placeholder="300" value={offerMaxDisc} onChangeText={setOfferMaxDisc} />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Start Date</Text>
                  <TextInput style={styles.input} value={offerStartDate} onChangeText={setOfferStartDate} />
                </View>

                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>End Date</Text>
                  <TextInput style={styles.input} value={offerEndDate} onChangeText={setOfferEndDate} />
                </View>
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Banner Image URL</Text>
                <TextInput style={styles.input} value={offerBannerUri} onChangeText={setOfferBannerUri} />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveOfferForm} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL B: CREATE COUPON ── */}
      <Modal visible={activeModal === 'create-coupon'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Coupon Code</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Coupon Code (e.g. ROAD500) *</Text>
                <TextInput style={styles.input} placeholder="ROAD500" value={couponCode} onChangeText={setCouponCode} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Discount String (e.g. ₹500 Off or 20% Off) *</Text>
                <TextInput style={styles.input} placeholder="₹500 Off" value={couponDiscountVal} onChangeText={setCouponDiscountVal} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input} placeholder="Save ₹500 instantly..." value={couponDesc} onChangeText={setCouponDesc} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Usage Limit</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={couponUsageLimit} onChangeText={setCouponUsageLimit} />
                </View>

                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Validity Date</Text>
                  <TextInput style={styles.input} value={couponValidity} onChangeText={setCouponValidity} />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveCouponForm} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save Coupon</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL C: UPLOAD BANNER ── */}
      <Modal visible={activeModal === 'create-banner'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Promotional Banner</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Banner Title *</Text>
                <TextInput style={styles.input} placeholder="Monsoon Breakdown Protection" value={bannerTitle} onChangeText={setBannerTitle} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Banner Image URL *</Text>
                <TextInput style={styles.input} value={bannerImageUri} onChangeText={setBannerImageUri} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Visibility Schedule</Text>
                <TextInput style={styles.input} value={bannerSchedule} onChangeText={setBannerSchedule} />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveBannerForm} style={styles.saveBtn}>
                <Text style={styles.saveText}>Upload Banner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL D: SERVICE CRUD MODAL ── */}
      <Modal visible={activeModal === 'create' || activeModal === 'edit'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedService ? 'Edit Service Listing' : 'Create New Service'}</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Service Name *</Text>
                <TextInput style={styles.input} value={serviceName} onChangeText={setServiceName} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Starting Price (₹) *</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={startingPrice} onChangeText={setStartingPrice} />
                </View>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Offer Price (₹)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={offerPrice} onChangeText={setOfferPrice} />
                </View>
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Short Summary *</Text>
                <TextInput style={styles.input} value={shortDesc} onChangeText={setShortDesc} />
              </View>

              {formError ? <Text style={styles.errorText}>⚠️ {formError}</Text> : null}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={saving} onPress={handleSaveService} style={styles.saveBtn}>
                {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Save Listing</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 20,
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
  },
  segmentedScroll: {
    gap: 8,
    paddingVertical: 4,
    marginTop: 14,
  },
  segmentBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  segmentBtnActive: {
    backgroundColor: 'white',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BFDBFE',
  },
  segmentTextActive: {
    color: '#1E3A8A',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  toast: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  toastText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  actionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  createBtnText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalForm: {
    marginBottom: 16,
  },
  inputBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    fontSize: 13,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  dropdownValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  dropdownChevron: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
});
