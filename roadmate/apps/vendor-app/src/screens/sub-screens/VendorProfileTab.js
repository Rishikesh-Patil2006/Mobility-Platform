import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useVendorProfile } from '../../context/VendorProfileContext';
import { validateBusinessDescription, validatePricing, validateWhatsAppNumber } from '../../services/vendorProfileService';

import VerificationBadge from '../../components/VerificationBadge';
import ProfileCompletionCard from '../../components/ProfileCompletionCard';
import BusinessDetailsCard from '../../components/BusinessDetailsCard';
import ContactInformationCard from '../../components/ContactInformationCard';
import DocumentUploadCard from '../../components/DocumentUploadCard';
import ImageUploadCard from '../../components/ImageUploadCard';
import AvailabilityStatusCard from '../../components/AvailabilityStatusCard';

// Phase 5 Reputation & Review Imports
import {
  fetchReviews,
  addOrEditReply,
  deleteReply as removeReplyService,
  calculateRatingDistribution,
} from '../../services/vendorReviewService';
import ReviewManagementModal from '../../components/ReviewManagementModal';
import NotificationCenterModal from '../../components/NotificationCenterModal';
import CommunicationCard from '../../components/CommunicationCard';
import { fetchCommunicationHistory } from '../../services/vendorCommunicationService';
import ShareCard from '../../components/ShareCard';
import BookingFilterBar from '../../components/BookingFilterBar';

// Phase 7 Settings & Account Management Imports
import { fetchBusinessSettings } from '../../services/vendorSettingsService';
import { fetchNotificationPreferences, updateNotificationPreferences } from '../../services/vendorNotificationService';
import { fetchAccountDetails, deleteVendorAccount } from '../../services/vendorAccountService';
import { fetchPreferences, updatePreferences, fetchPrivacySettings, updatePrivacySettings } from '../../services/vendorPreferenceService';

import NotificationToggle from '../../components/NotificationToggle';
import PrivacyCard from '../../components/PrivacyCard';
import PreferenceCard from '../../components/PreferenceCard';
import SupportCard from '../../components/SupportCard';
import AccountCard from '../../components/AccountCard';
import ConfirmationDialog from '../../components/ConfirmationDialog';

// Phase 8 Subscription & Super Admin Payment Integration Imports
import {
  subscriptionPlans,
  fetchSubscriptionDetails,
  fetchPaymentHistory,
  purchaseOrRenewPlan,
  toggleAutoRenewal,
  getSubscriptionExpiryAlert,
} from '../../services/vendorSubscriptionService';

import SubscriptionPaymentModal from '../../components/SubscriptionPaymentModal';
import PaymentHistoryModal from '../../components/PaymentHistoryModal';

// Manage Consolidated Imports
import { fetchServices, saveService, deleteService } from '../../services/vendorServiceService';
import { fetchOffers, saveOffer, deleteOffer } from '../../services/vendorOfferService';
import { fetchCoupons, saveCoupon, toggleCoupon, deleteCoupon } from '../../services/vendorCouponService';
import { fetchBanners, saveBanner, deleteBanner } from '../../services/vendorPromotionService';
import { fetchReferralDetails, getMarketingMetrics } from '../../services/vendorReferralService';

import ServiceCard from '../../components/ServiceCard';
import SearchBar from '../../components/SearchBar';
import FilterChip from '../../components/FilterChip';
import EmptyState from '../../components/EmptyState';
import OfferCard from '../../components/OfferCard';
import CouponCard from '../../components/CouponCard';
import PromotionBannerCard from '../../components/PromotionBannerCard';
import MarketingDashboardCard from '../../components/MarketingDashboardCard';
import ReferralCard from '../../components/ReferralCard';
import CampaignAnalyticsCard from '../../components/CampaignAnalyticsCard';

const subcategoriesMap = {
  'Garage': ['General Repair', 'Engine Diagnostics', 'Brake Service', 'Electrical Work'],
  'Car Wash': ['Exterior Wash', 'Interior Detailing', 'Full Detailing', 'Ceramic Coating'],
  'Towing': ['Flatbed Towing', 'Hydraulic Towing', 'Accident Recovery', 'Breakdown Towing'],
  'PUC Center': ['Petrol PUC', 'Diesel PUC', 'CNG/LPG PUC'],
  'Denting & Painting': ['Scratch Removal', 'Panel Denting', 'Full Body Paint', 'Alloy Wheel Painting'],
  'Service Center': ['Scheduled Service', 'Warranty Service', 'Oil Change', 'Filter Replacement'],
  'Showroom': ['New Vehicles', 'Pre-Owned Vehicles', 'Spares & Accessories'],
};

export default function VendorProfileTab({ onLogout, initialSegment = 'particulars', initialModal = null }) {
  const {
    profile,
    updateProfile,
    getCompletionPercentage,
    getMissingFields,
  } = useVendorProfile();

  // Top Segment Navigation State (Order: Business Particulars, Verification Vault, Availability, Subscription, Notifications, Privacy, Support, Account)
  const [activeSegment, setActiveSegment] = useState(initialSegment);

  // Modal display states
  const [activeModal, setActiveModal] = useState(initialModal);
  const [toastMsg, setToastMsg] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTargetPlan, setSelectedTargetPlan] = useState(null);

  useEffect(() => {
    if (initialSegment) setActiveSegment(initialSegment);
    if (initialModal !== undefined) setActiveModal(initialModal);
  }, [initialSegment, initialModal]);

  // Form states - Business Profile
  const [bizName, setBizName] = useState(profile?.businessName || '');
  const [owner, setOwner] = useState(profile?.ownerName || '');
  const [experience, setExperience] = useState(profile?.yearsOfExperience || '');
  const [description, setDescription] = useState(profile?.businessDescription || '');
  const [subCategory, setSubCategory] = useState(profile?.subcategory || '');
  const [subDropdown, setSubDropdown] = useState(false);

  const [whatsapp, setWhatsapp] = useState(profile?.whatsAppNumber || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || 'Jalgaon');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [pinCode, setPinCode] = useState(profile?.pinCode || '');

  const [startingPrice, setStartingPrice] = useState(profile?.startingPrice || '');
  const [inspectionCharges, setInspectionCharges] = useState(profile?.inspectionCharges || '');

  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Phase 5 Reviews State
  const [reviews, setReviews] = useState([]);
  const [commLogs, setCommLogs] = useState([]);
  const [searchReview, setSearchReview] = useState('');
  const [filterReview, setFilterReview] = useState('All');
  const [replyingReview, setReplyingReview] = useState(null);

  // Phase 7 Settings & Account States
  const [notificationPrefs, setNotificationPrefs] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [privacySettings, setPrivacySettings] = useState(null);

  // Phase 8 Subscription & Revenue States
  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [revenueMetrics, setRevenueMetrics] = useState(null);

  // Consolidated Manage States (Catalog & Marketing)
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [banners, setBanners] = useState([]);
  const [referralDetails, setReferralDetails] = useState(null);
  const [marketingMetrics, setMarketingMetrics] = useState(null);

  const [searchService, setSearchService] = useState('');
  const [filterService, setFilterService] = useState('All Services');

  // Service CRUD form
  const [selectedService, setSelectedService] = useState(null);
  const [serviceNameInput, setServiceNameInput] = useState('');
  const [servicePriceInput, setServicePriceInput] = useState('');
  const [serviceOfferPriceInput, setServiceOfferPriceInput] = useState('');
  const [serviceDescInput, setServiceDescInput] = useState('');

  // Offer CRUD form
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerDiscountType, setOfferDiscountType] = useState('Percentage');
  const [offerDiscountVal, setOfferDiscountVal] = useState('');
  const [offerMinOrder, setOfferMinOrder] = useState('');
  const [offerMaxDisc, setOfferMaxDisc] = useState('');

  // Coupon CRUD form
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponDiscountVal, setCouponDiscountVal] = useState('');

  // Banner CRUD form
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerType, setBannerType] = useState('Offer');
  const [bannerImageUri, setBannerImageUri] = useState('');

  // Subscription Modal states
  const [checkoutModalPlan, setCheckoutModalPlan] = useState(null);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);

  const loadAllData = async () => {
    try {
      const revs = (await fetchReviews(profile?.vendorId)) || [];
      const logs = (await fetchCommunicationHistory()) || [];
      setReviews(revs);
      setCommLogs(logs);

      const nPrefs = (await fetchNotificationPreferences()) || { reviews: true, listings: true, tips: true, subscription: true };
      const accDetails = (await fetchAccountDetails()) || { email: profile?.email || 'vendor@roadmate.in', phone: profile?.whatsAppNumber || '+91 98765 43210' };
      const prefs = (await fetchPreferences()) || { theme: 'Light', language: 'English' };
      const privSettings = (await fetchPrivacySettings()) || { profileVisible: true, showContactNumber: true };

      setNotificationPrefs(nPrefs);
      setAccountDetails(accDetails);
      setPreferences(prefs);
      setPrivacySettings(privSettings);

      const subData = (await fetchSubscriptionDetails()) || { planName: 'Gold Plan', status: 'Active' };
      const txList = (await fetchPaymentHistory()) || [];

      setPlans(subscriptionPlans || []);
      setCurrentSub(subData);
      setTransactions(txList);

      const sList = (await fetchServices(profile?.vendorId)) || [];
      const oList = (await fetchOffers(profile?.vendorId)) || [];
      const cList = (await fetchCoupons(profile?.vendorId)) || [];
      const bList = (await fetchBanners(profile?.vendorId)) || [];
      const rData = (await fetchReferralDetails()) || {};
      const mData = (await getMarketingMetrics()) || {};

      setServices(sList);
      setOffers(oList);
      setCoupons(cList);
      setBanners(bList);
      setReferralDetails(rData);
      setMarketingMetrics(mData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [profile]);

  const ratingMetrics = calculateRatingDistribution(reviews || []);
  const completionPercent = getCompletionPercentage ? getCompletionPercentage() : 95;
  const missingInfo = getMissingFields ? getMissingFields() : [];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // PROFILE EDIT ACTIONS
  const openEditModal = (type) => {
    setModalError('');
    if (type === 'details') {
      setBizName(profile?.businessName || '');
      setOwner(profile?.ownerName || '');
      setExperience(String(profile?.yearsOfExperience || ''));
      setDescription(profile?.businessDescription || '');
      setSubCategory(profile?.subcategory || '');
    } else if (type === 'contact') {
      setWhatsapp(profile?.whatsAppNumber || '');
      setAddress(profile?.address || '');
      setCity(profile?.city || 'Jalgaon');
      setState(profile?.state || 'Maharashtra');
      setPinCode(profile?.pinCode || '');
    } else if (type === 'pricing') {
      setStartingPrice(String(profile?.startingPrice || ''));
      setInspectionCharges(String(profile?.inspectionCharges || ''));
    }
    setActiveModal(type);
  };

  const handleSaveDetails = async () => {
    setModalError('');
    const descCheck = validateBusinessDescription(description);
    if (!descCheck.valid) return setModalError(descCheck.error || 'Invalid description');

    setSaving(true);
    await updateProfile({
      businessName: bizName,
      ownerName: owner,
      yearsOfExperience: Number(experience) || 0,
      businessDescription: description,
      subcategory: subCategory,
    });
    setSaving(false);
    setActiveModal(null);
    triggerToast('Business particulars updated!');
  };

  const handleSaveContact = async () => {
    setModalError('');
    const waCheck = validateWhatsAppNumber(whatsapp);
    if (!waCheck.valid) return setModalError(waCheck.error || 'Invalid phone number');

    setSaving(true);
    await updateProfile({
      whatsAppNumber: whatsapp,
      address,
      city,
      state,
      pinCode,
    });
    setSaving(false);
    setActiveModal(null);
    triggerToast('Contact & Address updated!');
  };

  const handleSavePricing = async () => {
    setModalError('');
    const pCheck = validatePricing({
      startingPrice: Number(startingPrice) || 0,
      inspectionCharges: Number(inspectionCharges) || 0,
    });
    if (!pCheck.valid) return setModalError(pCheck.error || 'Invalid pricing');

    setSaving(true);
    await updateProfile({
      startingPrice: Number(startingPrice) || 0,
      inspectionCharges: Number(inspectionCharges) || 0,
    });
    setSaving(false);
    setActiveModal(null);
    triggerToast('Base pricing updated!');
  };

  // Review Replies
  const handleSaveReply = async (replyText) => {
    if (!replyingReview) return;
    const res = await postVendorReply(replyingReview.id, replyText);
    if (res.success && res.data) {
      setReviews((prev) => prev.map((r) => (r.id === replyingReview.id ? res.data : r)));
      setReplyingReview(null);
      triggerToast('Vendor response posted!');
    }
  };

  const handleDeleteReply = async (reviewId) => {
    await deleteVendorReply(reviewId);
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, vendorReply: undefined } : r)));
    triggerToast('Response deleted.');
  };

  // Catalog Service CRUD
  const openCreateServiceModal = () => {
    setSelectedService(null);
    setServiceNameInput('');
    setServicePriceInput('');
    setServiceOfferPriceInput('');
    setServiceDescInput('');
    setActiveModal('create-service');
  };

  const openEditServiceModal = (srv) => {
    setSelectedService(srv);
    setServiceNameInput(srv.name);
    setServicePriceInput(String(srv.startingPrice));
    setServiceOfferPriceInput(srv.offerPrice ? String(srv.offerPrice) : '');
    setServiceDescInput(srv.shortDescription);
    setActiveModal('edit-service');
  };

  const handleSaveServiceForm = async () => {
    if (!serviceNameInput.trim()) return Alert.alert('Error', 'Service name is required.');
    const saved = await saveService({
      id: selectedService ? selectedService.id : undefined,
      vendorId: profile?.vendorId || 'vendor-1',
      name: serviceNameInput,
      subCategory: 'General',
      shortDescription: serviceDescInput,
      detailedDescription: serviceDescInput,
      startingPrice: Number(servicePriceInput) || 299,
      offerPrice: serviceOfferPriceInput ? Number(serviceOfferPriceInput) : undefined,
      duration: '30 Mins',
      bannerImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
      gallery: [],
      status: 'Visible',
    });

    if (selectedService) {
      setServices((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
    } else {
      setServices((prev) => [saved, ...prev]);
    }
    setActiveModal(null);
    triggerToast(selectedService ? 'Service updated!' : 'New service created!');
  };

  const handleDeleteServiceItem = (id) => {
    Alert.alert('Delete Service', 'Remove service from catalog?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteService(id);
          setServices((prev) => prev.filter((s) => s.id !== id));
          triggerToast('Service removed.');
        },
      },
    ]);
  };

  // Offers & Coupons CRUD
  const handleOpenCreateOffer = (existing) => {
    if (existing) {
      setEditingOfferId(existing.id);
      setOfferTitle(existing.title);
      setOfferDesc(existing.description);
      setOfferDiscountType(existing.discountType);
      setOfferDiscountVal(String(existing.discountValue));
      setOfferMinOrder(String(existing.minOrderAmount));
      setOfferMaxDisc(existing.maxDiscountAmount ? String(existing.maxDiscountAmount) : '');
    } else {
      setEditingOfferId(null);
      setOfferTitle('');
      setOfferDesc('');
      setOfferDiscountType('Percentage');
      setOfferDiscountVal('');
      setOfferMinOrder('');
      setOfferMaxDisc('');
    }
    setActiveModal('create-offer');
  };

  const handleSaveOfferForm = async () => {
    const res = await saveOffer({
      id: editingOfferId || undefined,
      title: offerTitle,
      description: offerDesc,
      discountType: offerDiscountType,
      discountValue: Number(offerDiscountVal) || 20,
      minOrderAmount: Number(offerMinOrder) || 499,
      maxDiscountAmount: offerMaxDisc ? Number(offerMaxDisc) : undefined,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      bannerUri: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600',
      status: 'Active',
    });

    if (res.data) {
      if (editingOfferId) {
        setOffers((prev) => prev.map((o) => (o.id === editingOfferId ? res.data : o)));
      } else {
        setOffers((prev) => [res.data, ...prev]);
      }
      setActiveModal(null);
      triggerToast('Offer campaign saved!');
    }
  };

  const handleDeleteOfferItem = (id) => {
    Alert.alert('Delete Offer', 'Remove offer campaign?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteOffer(id);
          setOffers((prev) => prev.filter((o) => o.id !== id));
          triggerToast('Offer removed.');
        },
      },
    ]);
  };

  const handleSaveCouponForm = async () => {
    const res = await saveCoupon({
      code: couponCode,
      description: couponDesc,
      discountValue: couponDiscountVal,
      validityDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      usageLimit: 100,
    });

    if (res.data) {
      setCoupons((prev) => [res.data, ...prev]);
      setActiveModal(null);
      setCouponCode('');
      setCouponDesc('');
      triggerToast('Coupon created!');
    }
  };

  const handleToggleCouponItem = async (id) => {
    await toggleCoupon(id);
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c)));
    triggerToast('Coupon status updated.');
  };

  const handleDeleteCouponItem = (id) => {
    Alert.alert('Delete Coupon', 'Remove coupon code?', [
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

  // Settings & Notifications
  const handleToggleNotification = async (key, val) => {
    if (!notificationPrefs) return;
    const updated = await updateNotificationPreferences({ [key]: val });
    setNotificationPrefs(updated);
    triggerToast('Notification setting saved.');
  };

  const handleUpdatePrivacy = async (key, val) => {
    if (!privacySettings) return;
    const updated = await updatePrivacySettings({ [key]: val });
    setPrivacySettings(updated);
    triggerToast('Privacy setting updated.');
  };

  const handleUpdatePreference = async (key, val) => {
    if (!preferences) return;
    const updated = await updatePreferences({ [key]: val });
    setPreferences(updated);
    triggerToast('Preference setting saved.');
  };

  const handleConfirmDeleteAccount = async () => {
    await deleteVendorAccount();
    setDeleteConfirmOpen(false);
    onLogout();
  };

  // Subscription Handlers
  const handleToggleAutoRenew = async () => {
    const res = await toggleAutoRenewal();
    setCurrentSub((prev) => (prev ? { ...prev, autoRenewal: res } : null));
    triggerToast(`Auto-renewal ${res ? 'enabled' : 'disabled'}.`);
  };

  const handleCancelSub = async () => {
    Alert.alert('Cancel Subscription', 'Are you sure you want to cancel plan auto-renewal?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel Plan',
        style: 'destructive',
        onPress: async () => {
          await cancelSubscription();
          setCurrentSub((prev) => (prev ? { ...prev, status: 'Pending Renewal', autoRenewal: false } : null));
          triggerToast('Subscription canceled.');
        },
      },
    ]);
  };

  const handleOpenCheckout = (plan) => {
    setSelectedTargetPlan(plan);
    setActiveModal('checkout');
  };

  const handleConfirmPayment = async (planId, promoCode, method) => {
    const res = await upgradeSubscription(profile?.vendorId || 'vendor-1', planId, promoCode);
    if (res.data) {
      setCurrentSub(res.data);
      const targetP = plans.find((p) => p.id === planId);
      const baseP = targetP ? targetP.price : 1499;

      const newTx = await recordPaymentTransaction({
        vendorId: profile?.vendorId || 'vendor-1',
        date: new Date().toISOString().split('T')[0],
        amount: Math.round(baseP * 1.18),
        paymentMethod: method || 'UPI',
        status: 'Success',
        referenceNumber: `${method || 'UPI'}/9012/${Date.now().toString().slice(-4)}`,
      });

      const newInv = await generateBillingInvoice(`${targetP?.name || 'Pro'} Plan (Monthly)`, baseP);

      setTransactions((prev) => [newTx, ...prev]);
      setInvoices((prev) => [newInv, ...prev]);
      setActiveModal(null);
      triggerToast(`Upgraded to ${res.data.planName} Plan!`);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = (searchReview || '').toLowerCase();
    const matchesSearch =
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.serviceName || '').toLowerCase().includes(q) ||
      (r.reviewText || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterReview === 'All') return true;
    if (filterReview === 'Replied') return !!r.vendorReply;
    if (filterReview === 'Not Replied') return !r.vendorReply;
    return true;
  });

  const filteredServices = services.filter((srv) => {
    const q = (searchService || '').toLowerCase();
    const matchesSearch =
      (srv.name || '').toLowerCase().includes(q) ||
      (srv.shortDescription || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterService === 'All Services') return true;
    if (filterService === 'Active') return srv.status === 'Visible';
    if (filterService === 'Inactive') return srv.status === 'Hidden';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Control Center</Text>
        <Text style={styles.headerSubtitle}>Centralized management hub for business, services, status & settings</Text>

        {/* Top Segmented Navigation Switch (Exact Section Order) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segmentedScroll}>
          {[
            { key: 'particulars', label: '📋 Business Particulars' },
            { key: 'vault', label: '🛡️ Verification Vault' },
            { key: 'availability', label: '⏱️ Availability' },
            { key: 'subscription', label: '💳 Subscription' },
            { key: 'notifications', label: '🔔 Notifications' },
            { key: 'privacy', label: '🔒 Privacy' },
            { key: 'support', label: '❓ Support' },
            { key: 'account', label: '🔑 Account' },
          ].map((seg) => (
            <TouchableOpacity
              key={seg.key}
              onPress={() => setActiveSegment(seg.key)}
              style={[styles.segmentBtn, activeSegment === seg.key ? styles.segmentBtnActive : null]}
            >
              <Text style={[styles.segmentText, activeSegment === seg.key ? styles.segmentTextActive : null]}>
                {seg.label}
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

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* ── SECTION 1: BUSINESS PARTICULARS ── */}
        {activeSegment === 'particulars' && (
          <View>
            <ProfileCompletionCard
              percentage={completionPercent}
              missingFields={missingInfo}
              onFixPress={() => openEditModal('details')}
            />

            <BusinessDetailsCard profile={profile} onEdit={() => openEditModal('details')} />
            <ContactInformationCard profile={profile} onEdit={() => openEditModal('contact')} />

            {/* Media Upload Card inside Business Particulars */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🖼️ Business Logo, Cover & Gallery</Text>
              <TouchableOpacity onPress={() => setActiveModal('media')} style={styles.menuRow} activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <Text style={styles.menuEmoji}>📸</Text>
                  <Text style={styles.menuLabel}>Upload Logo & Gallery Photos</Text>
                </View>
                <Text style={styles.menuArrow}>❯</Text>
              </TouchableOpacity>
            </View>

            {/* Services Catalog & Offers inside Business Particulars */}
            <View style={styles.actionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>🔧 Services Catalog ({(services || []).length})</Text>
              <TouchableOpacity onPress={openCreateServiceModal} style={styles.createBtn} activeOpacity={0.8}>
                <Text style={styles.createBtnText}>＋ Add Service</Text>
              </TouchableOpacity>
            </View>

            <SearchBar search={searchService} onChangeSearch={setSearchService} placeholder="Search catalog services..." />

            {(filteredServices || []).length > 0 ? (
              filteredServices.slice(0, 3).map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  onPressEdit={() => openEditServiceModal(srv)}
                  onPressDelete={() => handleDeleteServiceItem(srv.id)}
                  onPressPreview={() => {}}
                />
              ))
            ) : (
              <EmptyState title="No Services Listed" description="Click Add Service to add items to your workshop catalog." />
            )}

            <TouchableOpacity onPress={() => setActiveModal('reviews')} style={[styles.menuRow, styles.reviewsShortcutCard]} activeOpacity={0.8}>
              <View style={styles.menuLeft}>
                <Text style={styles.menuEmoji}>⭐</Text>
                <Text style={styles.menuLabel}>Customer Reviews ({(reviews || []).length}) & Rating Breakdown</Text>
              </View>
              <Text style={styles.menuArrow}>Open Hub ❯</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── SECTION 2: VERIFICATION VAULT ── */}
        {activeSegment === 'vault' && (
          <View>
            <View style={styles.statusBanner}>
              <Text style={styles.statusLabelText}>Official Verification Status:</Text>
              <VerificationBadge status={profile?.verificationStatus || 'APPROVED'} />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🛡️ Verification Documents (GST, PAN, Shop Act)</Text>
              <DocumentUploadCard
                label="Shop Establishment License *"
                docName={profile?.documents?.shopLicense}
                onUploadSuccess={(file) => updateProfile({ documents: { ...(profile?.documents || {}), shopLicense: file } })}
                onDelete={() => {
                  const copy = { ...(profile?.documents || {}) };
                  delete copy.shopLicense;
                  updateProfile({ documents: copy });
                }}
              />
            </View>
          </View>
        )}

        {/* ── SECTION 3: AVAILABILITY (SHARED REUSABLE COMPONENT) ── */}
        {activeSegment === 'availability' && (
          <View>
            <Text style={styles.sectionHeaderTitle}>⏱️ Workshop Availability Control</Text>
            <AvailabilityStatusCard />
          </View>
        )}

        {/* ── SECTION 4: SUBSCRIPTION MANAGEMENT ── */}
        {activeSegment === 'subscription' && (
          <View>
            <Text style={styles.sectionHeaderTitle}>💳 Subscription & Super Admin Payment Center</Text>

            {/* Expiry Alerts Banner */}
            {(() => {
              const alert = getSubscriptionExpiryAlert(currentSub?.remainingDays || 30);
              if (!alert) return null;
              const isCrit = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
              return (
                <View style={[styles.alertBanner, isCrit ? styles.alertBannerCrit : styles.alertBannerWarn]}>
                  <Text style={[styles.alertTitle, isCrit ? styles.alertTextCrit : styles.alertTextWarn]}>{alert.title}</Text>
                  <Text style={styles.alertMsg}>{alert.message}</Text>
                </View>
              );
            })()}

            {/* Current Active Plan Card */}
            {currentSub && (
              <View style={styles.subCard}>
                <View style={styles.subHeaderRow}>
                  <View style={styles.planBadgeContainer}>
                    <Text style={styles.planBadgeText}>
                      {currentSub.planName === 'Gold' ? '🥇 Gold Plan' : currentSub.planName === 'Silver' ? '🥈 Silver Plan' : '⚪ Basic Plan'}
                    </Text>
                  </View>
                  <View style={styles.subStatusBadge}>
                    <Text style={styles.subStatusText}>● {currentSub.status}</Text>
                  </View>
                </View>

                <View style={styles.subDetailsGrid}>
                  <View style={styles.subGridCol}>
                    <Text style={styles.subGridLbl}>Duration</Text>
                    <Text style={styles.subGridVal}>{currentSub.duration}</Text>
                  </View>

                  <View style={styles.subGridCol}>
                    <Text style={styles.subGridLbl}>Start Date</Text>
                    <Text style={styles.subGridVal}>{currentSub.startDate}</Text>
                  </View>

                  <View style={styles.subGridCol}>
                    <Text style={styles.subGridLbl}>Due Date</Text>
                    <Text style={styles.subGridVal}>{currentSub.dueDate}</Text>
                  </View>

                  <View style={styles.subGridCol}>
                    <Text style={styles.subGridLbl}>Remaining</Text>
                    <Text style={styles.subGridValHighlight}>{currentSub.remainingDays} Days</Text>
                  </View>
                </View>

                <View style={styles.autoRenewRow}>
                  <Text style={styles.autoRenewText}>Auto Renewal Status: {currentSub.autoRenewal ? 'Enabled' : 'Disabled'}</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      const next = await toggleAutoRenewal();
                      setCurrentSub((prev) => ({ ...prev, autoRenewal: next }));
                      triggerToast(next ? 'Auto-renewal enabled.' : 'Auto-renewal disabled.');
                    }}
                    style={styles.toggleBtn}
                  >
                    <Text style={styles.toggleBtnText}>{currentSub.autoRenewal ? 'Turn Off' : 'Turn On'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Main Action Buttons */}
                <View style={styles.subActionRow}>
                  <TouchableOpacity
                    onPress={() => {
                      const plan = subscriptionPlans.find((p) => p.name === currentSub.planName) || subscriptionPlans[1];
                      setCheckoutModalPlan(plan);
                    }}
                    style={styles.renewBtn}
                  >
                    <Text style={styles.renewText}>🔄 Renew Subscription</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      const gold = subscriptionPlans.find((p) => p.name === 'Gold');
                      setCheckoutModalPlan(gold);
                    }}
                    style={styles.upgradeBtn}
                  >
                    <Text style={styles.upgradeText}>🚀 Upgrade to Gold</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setPaymentHistoryOpen(true)} style={styles.historyBtn}>
                  <Text style={styles.historyText}>📜 View Payment History & Invoices ({(transactions || []).length})</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Three-Plan Comparison Matrix */}
            <Text style={styles.sectionHeaderTitle}>📊 Available Subscription Plans</Text>
            {subscriptionPlans.map((plan) => {
              const isCurrent = currentSub?.planName === plan.name;
              return (
                <View key={plan.id} style={[styles.planCard, isCurrent ? styles.planCardActive : null]}>
                  <View style={styles.planCardHeader}>
                    <View>
                      <Text style={styles.planNameTitle}>{plan.badgeEmoji} {plan.name} Plan</Text>
                      <Text style={styles.planTagline}>{plan.tagline}</Text>
                    </View>
                    <Text style={styles.planPriceText}>{plan.formattedPrice}</Text>
                  </View>

                  <View style={styles.planFeaturesList}>
                    {plan.features.map((feat, idx) => (
                      <View key={idx} style={styles.featureRow}>
                        <Text style={styles.checkIcon}>✓</Text>
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    disabled={isCurrent}
                    onPress={() => setCheckoutModalPlan(plan)}
                    style={[styles.selectPlanBtn, isCurrent ? styles.selectPlanBtnDisabled : null]}
                  >
                    <Text style={[styles.selectPlanText, isCurrent ? styles.selectPlanTextDisabled : null]}>
                      {isCurrent ? '✓ Current Active Plan' : `Select ${plan.name} Plan`}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* ── SECTION 5: NOTIFICATIONS ── */}
        {activeSegment === 'notifications' && notificationPrefs && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🔔 Listing Platform Notification Channels</Text>
            
            <TouchableOpacity
              onPress={() => setActiveModal('notificationCenter')}
              style={[styles.menuRow, styles.reviewsShortcutCard, { marginBottom: 14 }]}
              activeOpacity={0.8}
            >
              <View style={styles.menuLeft}>
                <Text style={styles.menuEmoji}>🔔</Text>
                <Text style={styles.menuLabel}>Open Notification & Activity Hub</Text>
              </View>
              <Text style={styles.menuArrow}>Open Hub ❯</Text>
            </TouchableOpacity>

            <NotificationToggle
              label="Customer Reviews"
              description="Alert when customer posts a review"
              icon="⭐"
              value={notificationPrefs.reviews !== false}
              onValueChange={(val) => handleToggleNotification('reviews', val)}
            />
            <NotificationToggle
              label="Listings & Services"
              description="Alert when listing status changes"
              icon="📋"
              value={notificationPrefs.listings !== false}
              onValueChange={(val) => handleToggleNotification('listings', val)}
            />
            <NotificationToggle
              label="Educational Tips & Care"
              description="Alert when tip is published or approved"
              icon="🛠️"
              value={notificationPrefs.tips !== false}
              onValueChange={(val) => handleToggleNotification('tips', val)}
            />
            <NotificationToggle
              label="Subscription Expiry Advisories"
              description="Annual plan renewal warnings"
              icon="💳"
              value={notificationPrefs.subscription !== false}
              onValueChange={(val) => handleToggleNotification('subscription', val)}
            />
          </View>
        )}

        {/* ── SECTION 6: PRIVACY ── */}
        {activeSegment === 'privacy' && privacySettings && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🔒 Customer Profile Visibility</Text>
            <PrivacyCard privacy={privacySettings} onUpdatePrivacy={handleUpdatePrivacy} />
          </View>
        )}

        {/* ── SECTION 7: SUPPORT ── */}
        {activeSegment === 'support' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>❓ Partner Support & FAQs</Text>
            <SupportCard />
          </View>
        )}

        {/* ── SECTION 8: ACCOUNT ── */}
        {activeSegment === 'account' && accountDetails && (
          <View style={{ gap: 16 }}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🔑 Credentials & Security</Text>
              <AccountCard
                account={accountDetails}
                onRefresh={loadAllData}
                onOpenDeleteConfirm={() => setDeleteConfirmOpen(true)}
              />
            </View>

            <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.88}>
              <Text style={styles.logoutButtonText}>🚪 Logout Partner Session</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Subscription Payment Checkout Modal */}
      <SubscriptionPaymentModal
        visible={!!checkoutModalPlan}
        selectedPlan={checkoutModalPlan}
        onConfirmPayment={async (planName, method) => {
          const res = await purchaseOrRenewPlan(planName, method);
          setCurrentSub(res.subscription);
          setTransactions((prev) => [res.payment, ...prev]);
          triggerToast(`Successfully subscribed to ${planName} Plan!`);
        }}
        onClose={() => setCheckoutModalPlan(null)}
      />

      {/* Payment History Modal */}
      <PaymentHistoryModal
        visible={paymentHistoryOpen}
        payments={transactions}
        onClose={() => setPaymentHistoryOpen(false)}
      />

      {/* Confirmation Dialog for Account Deletion */}
      <ConfirmationDialog
        visible={deleteConfirmOpen}
        title="Permanently Delete Account"
        description="This will permanently delete your partner account, listings, reviews, and wallet balance."
        confirmWord="DELETE"
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      {/* ── MODAL: CREATE / EDIT SERVICE ── */}
      <Modal visible={activeModal === 'create-service' || activeModal === 'edit-service'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedService ? 'Edit Service Listing' : 'Create New Service'}</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Service Name *</Text>
                <TextInput style={styles.input} value={serviceNameInput} onChangeText={setServiceNameInput} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Starting Price (₹) *</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={servicePriceInput} onChangeText={setServicePriceInput} />
                </View>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Offer Price (₹)</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={serviceOfferPriceInput} onChangeText={setServiceOfferPriceInput} />
                </View>
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Short Summary *</Text>
                <TextInput style={styles.input} value={serviceDescInput} onChangeText={setServiceDescInput} />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveServiceForm} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save Listing</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL: REVIEWS & REPUTATION HUB ── */}
      <ReviewManagementModal
        visible={activeModal === 'reviews'}
        reviews={reviews}
        ratingMetrics={ratingMetrics}
        onSaveReply={async (reviewId, replyText) => {
          const updated = await addOrEditReply(reviewId, replyText);
          if (updated) {
            setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
          }
        }}
        onDeleteReply={async (reviewId) => {
          const updated = await removeReplyService(reviewId);
          if (updated) {
            setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
          }
        }}
        onClose={() => setActiveModal(null)}
      />

      {/* ── MODAL: NOTIFICATION & ACTIVITY CENTER ── */}
      <NotificationCenterModal
        visible={activeModal === 'notificationCenter'}
        onClose={() => setActiveModal(null)}
      />

      {/* ── MODAL: EDIT DETAILS ── */}
      <Modal visible={activeModal === 'details'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Business Particulars</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Business Name *</Text>
                <TextInput style={styles.input} value={bizName} onChangeText={setBizName} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Owner Name *</Text>
                <TextInput style={styles.input} value={owner} onChangeText={setOwner} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Business Description *</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {modalError ? <Text style={styles.errorText}>⚠️ {modalError}</Text> : null}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={saving} onPress={handleSaveDetails} style={styles.saveBtn}>
                {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Save Particulars</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL: EDIT CONTACT ── */}
      <Modal visible={activeModal === 'contact'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Contact & Address</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>WhatsApp Number *</Text>
                <TextInput style={styles.input} keyboardType="phone-pad" value={whatsapp} onChangeText={setWhatsapp} />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Workshop Address *</Text>
                <TextInput style={styles.input} value={address} onChangeText={setAddress} />
              </View>

              {modalError ? <Text style={styles.errorText}>⚠️ {modalError}</Text> : null}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={saving} onPress={handleSaveContact} style={styles.saveBtn}>
                {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Save Contact</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL: MEDIA & GALLERY ── */}
      <Modal visible={activeModal === 'media'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <Text style={styles.modalTitle}>Manage Logo & Gallery Photos</Text>
            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <ImageUploadCard
                label="Business Logo (Square) *"
                imageUri={profile?.logo}
                onUploadSuccess={(url) => updateProfile({ logo: url })}
                onDelete={() => updateProfile({ logo: '' })}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={[styles.cancelBtn, { width: '100%' }]}>
                <Text style={styles.cancelText}>Close Photos</Text>
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
    marginBottom: 12,
  },
  segmentedScroll: {
    gap: 8,
    paddingVertical: 4,
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  statusLabelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#374151',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reviewsShortcutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuEmoji: {
    fontSize: 16,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
  },
  menuArrow: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '805',
  },
  toast: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  toastText: {
    color: 'white',
    fontSize: 12.5,
    fontWeight: '800',
  },
  actionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textTransform: 'uppercase',
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
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '850',
    color: '#111827',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  closeRoundBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeRoundText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  modalForm: {
    marginBottom: 20,
  },
  inputBox: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
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
  errorText: {
    color: '#EF4444',
    fontSize: 11.5,
    fontWeight: '600',
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
  alertBanner: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  alertBannerCrit: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  alertBannerWarn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 2,
  },
  alertTextCrit: {
    color: '#991B1B',
  },
  alertTextWarn: {
    color: '#92400E',
  },
  alertMsg: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  subCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planBadgeContainer: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  planBadgeText: {
    color: 'white',
    fontSize: 12.5,
    fontWeight: '900',
  },
  subStatusBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  subStatusText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  subDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  subGridCol: {
    width: '50%',
    paddingVertical: 4,
  },
  subGridLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  subGridVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  subGridValHighlight: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  autoRenewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
    marginBottom: 12,
  },
  autoRenewText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  toggleBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  toggleBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  subActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  renewBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  renewText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  upgradeBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  upgradeText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  historyBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  historyText: {
    color: '#334155',
    fontSize: 11.5,
    fontWeight: '800',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  planCardActive: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planNameTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  planTagline: {
    fontSize: 11,
    color: '#64748B',
  },
  planPriceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#16A34A',
  },
  planFeaturesList: {
    gap: 6,
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 13,
    marginRight: 6,
  },
  featureText: {
    fontSize: 11.5,
    color: '#334155',
  },
  selectPlanBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectPlanBtnDisabled: {
    backgroundColor: '#DCFCE7',
  },
  selectPlanText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  selectPlanTextDisabled: {
    color: '#166534',
    fontWeight: '900',
  },
});
