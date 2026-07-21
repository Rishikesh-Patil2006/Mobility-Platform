// roadmate/apps/customer-app/src/screens/sub-screens/ProviderDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions, Image, Modal, TextInput, Alert } from 'react-native';
import { getCategoryTheme, subscribeToAvailability } from '../../services/serviceMockData';
import { AvailabilityBadge } from '../../components/ServiceComponents';
import { BusinessVerificationCard } from '../../components/VendorVerificationComponents';

const { width, height } = Dimensions.get('window');

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export default function ProviderDetailsScreen({ provider, category, vehicles, onBack, onNavigate, savedProviderIds, toggleSaveProvider }) {
  if (!provider) return null;

  const theme = getCategoryTheme(category);
  const isSaved = savedProviderIds.includes(provider.id);

  // Availability state & subscriber
  const [localAvailability, setLocalAvailability] = useState(provider.availability);

  React.useEffect(() => {
    setLocalAvailability(provider.availability); // Reset if provider changes
    const unsubscribe = subscribeToAvailability((providerId, newStatus) => {
      if (providerId === provider.id) {
        setLocalAvailability(newStatus);
      }
    });
    return unsubscribe;
  }, [provider.id, provider.availability]);

  // Enquiry states
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState('Rushikesh Patil');
  const [enquiryPhone, setEnquiryPhone] = useState('+91 98765 43210');
  const [enquiryVehicle, setEnquiryVehicle] = useState(vehicles[0]?.name || 'Nexon EV');
  const [enquiryMessage, setEnquiryMessage] = useState('I want to enquire about oil change and general service slot.');

  const handleSubmitEnquiry = () => {
    Alert.alert(
      "Enquiry Submitted",
      `Your enquiry for ${provider.name} has been sent successfully. The vendor will contact you shortly.`,
      [{ text: "OK", onPress: () => setEnquiryModalOpen(false) }]
    );
  };

  // Booking states
  const [bookingVisible, setBookingVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0] || null);
  const [selectedServices, setSelectedServices] = useState([provider.services[0]] || []);
  const [selectedDate, setSelectedDate] = useState('Today'); // Today | Tomorrow | Day After
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Call & WhatsApp triggers
  const handleCall = () => {
    Linking.openURL(`tel:${provider.phone}`).catch(() => {
      Alert.alert('Error', 'Unable to initiate call. Phone dialer not supported on this device.');
    });
  };

  const handleWhatsApp = () => {
    const formattedPhone = provider.phone.replace(/[^0-9]/g, '');
    const message = `Hello ${provider.name}, I found your workshop on Roadmate and would like to inquire about services.`;
    const url = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      // Fallback to web link if whatsapp app is not installed
      const webUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      Linking.openURL(webUrl).catch(() => {
        Alert.alert('Error', 'Unable to open WhatsApp.');
      });
    });
  };

  const toggleSelectService = (srv) => {
    if (selectedServices.find(s => s.name === srv.name)) {
      if (selectedServices.length === 1) {
        Alert.alert('Notice', 'Please select at least one service to book.');
        return;
      }
      setSelectedServices(prev => prev.filter(s => s.name !== srv.name));
    } else {
      setSelectedServices(prev => [...prev, srv]);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedVehicle) {
      Alert.alert('Error', 'Please register a vehicle before creating a booking.');
      return;
    }
    // Simulate booking save
    setBookingSuccess(true);
  };

  const handleCloseBookingFlow = () => {
    setBookingSuccess(false);
    setBookingVisible(false);
    setNotes('');
  };

  const calculateTotal = () => {
    return selectedServices.reduce((acc, curr) => acc + curr.price, 0);
  };

  const nextThreeDays = [
    { label: 'Today', date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
    { label: 'Tomorrow', date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
    { label: 'Day After', date: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) },
  ];

  return (
    <View style={styles.container}>
      {/* Cover Image Hero Section */}
      <View style={styles.heroSection}>
        <Image source={theme.image} style={styles.heroImage} />
        
        {/* Decorative Gradient Overlay */}
        <View style={styles.heroGradient} />

        {/* Floating Headers */}
        <View style={styles.headerFloatingRow}>
          <TouchableOpacity onPress={onBack} style={styles.floatingButton} activeOpacity={0.7}>
            <Text style={styles.floatArrow}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleSaveProvider(provider.id)} style={styles.floatingButton} activeOpacity={0.7}>
            <Text style={styles.floatHeart}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Pill Badge Overlay */}
        <View style={styles.categoryBadgeOverlay}>
          <View style={[styles.categoryPill, { backgroundColor: theme.color }]}>
            <Text style={styles.categoryPillText}>{theme.icon} {category}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Main Details Overlay Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View style={styles.titleRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {provider.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedBadgeText}>🛡 Verified Business</Text>
                    </View>
                  )}
                  {provider.category === 'Garage' && localAvailability && (
                    <AvailabilityBadge status={localAvailability} />
                  )}
                </View>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: provider.open ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, { color: provider.open ? '#2E7D32' : '#C62828' }]}>
                {provider.open ? '● Open Now' : '● Closed'}
              </Text>
            </View>
          </View>

          {/* Rating stars */}
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={[styles.starIcon, { color: i < Math.floor(provider.rating) ? '#F59E0B' : '#E5E7EB' }]}>★</Text>
            ))}
            <Text style={styles.ratingVal}>{provider.rating}</Text>
            <Text style={styles.reviewsCount}>({provider.reviews} reviews)</Text>
          </View>

          {/* Business description */}
          <Text style={styles.descriptionText}>{provider.description}</Text>

          {/* Core Info list */}
          <View style={styles.infoLinesList}>
            <View style={styles.infoLine}>
              <Text style={styles.infoLineEmoji}>📍</Text>
              <Text style={styles.infoLineText}>{provider.address}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLineEmoji}>🧭</Text>
              <Text style={styles.infoLineText}>{provider.distance} km away from your location</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLineEmoji}>🕒</Text>
              <Text style={styles.infoLineText}>{provider.hours} (Mon – Sun)</Text>
            </View>
          </View>
        </View>

        {provider.verified && (
          <BusinessVerificationCard provider={provider} />
        )}

        {/* Contact Actions Row */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleCall} style={styles.callButton} activeOpacity={0.85}>
            <Text style={styles.actionButtonText}>📞 Call Provider</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappButton} activeOpacity={0.85}>
            <Text style={styles.actionButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* MapMyIndia Navigation Placeholder */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🗺️ Location & Navigation</Text>
          <View style={styles.mapStub}>
            <View style={styles.mapStubGrid}>
              <View style={styles.mapStubLine} />
              <View style={styles.mapStubDot} />
            </View>
            <View style={styles.mapDetailsOverlay}>
              <Text style={styles.mapEngineText}>MapMyIndia Engine</Text>
              <TouchableOpacity onPress={() => onNavigate(provider)} style={styles.viewMapBtn}>
                <Text style={styles.viewMapBtnText}>Start Turn-by-Turn GPS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Available checklist services */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Services Offered & Pricing</Text>
          <View style={styles.servicesList}>
            {provider.services.map((s) => (
              <View key={s.name} style={styles.serviceItemRow}>
                <View style={styles.serviceItemInfo}>
                  <Text style={styles.serviceItemDot}>•</Text>
                  <Text style={styles.serviceItemName}>{s.name}</Text>
                </View>
                <Text style={styles.serviceItemPrice}>₹{s.price}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        {provider.reviewsList && provider.reviewsList.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>User Reviews ({provider.reviewsList.length})</Text>
            {provider.reviewsList.map((r, i) => (
              <View key={r.name} style={[styles.reviewRow, i > 0 ? styles.borderTop : null]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerAvatarText}>{r.name[0]}</Text>
                  </View>
                  <View style={styles.reviewerMeta}>
                    <Text style={styles.reviewerName}>{r.name}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {[...Array(5)].map((_, idx) => (
                      <Text key={idx} style={[styles.miniStar, { color: idx < r.rating ? '#F59E0B' : '#E5E7EB' }]}>★</Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Fixed Footer Booking Button ── */}
      <View style={styles.bookingFooter}>
        <View style={styles.pricingSummaryCol}>
          <Text style={styles.estLabel}>ESTIMATED STARTING</Text>
          <Text style={styles.estValue}>₹{provider.price}</Text>
        </View>
        {provider.category === 'Garage' && localAvailability === 'Unavailable' ? (
          <TouchableOpacity
            onPress={() => setEnquiryModalOpen(true)}
            style={[styles.bookBtn, { backgroundColor: '#EF4444' }]}
            activeOpacity={0.88}
          >
            <Text style={styles.bookBtnText}>Enquire Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setBookingVisible(true)}
            style={[styles.bookBtn, { backgroundColor: theme.color }]}
            activeOpacity={0.88}
          >
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Booking Modal Flow ── */}
      <Modal
        visible={bookingVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            
            {/* Header pull line */}
            <View style={styles.modalPullHandle} />

            {/* Success screen */}
            {bookingSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Text style={styles.successIcon}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successDesc}>
                  Your appointment with {provider.name} has been successfully scheduled. Details have been sync'd to your Profile tab.
                </Text>

                <View style={styles.successDetailsBox}>
                  <Text style={styles.successDetailText}>🚗 Vehicle: {selectedVehicle?.name} ({selectedVehicle?.number})</Text>
                  <Text style={styles.successDetailText}>📅 Date: {selectedDate}</Text>
                  <Text style={styles.successDetailText}>🕒 Time: {selectedTimeSlot}</Text>
                  <Text style={styles.successDetailText}>💰 Total Est. Amount: ₹{calculateTotal()}</Text>
                </View>

                <TouchableOpacity onPress={handleCloseBookingFlow} style={styles.dismissSuccessBtn}>
                  <Text style={styles.dismissSuccessText}>Back to Services</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContentPadding}>
                <View style={styles.modalHeaderRow}>
                  <View>
                    <Text style={styles.modalHeaderTitle}>Confirm Booking</Text>
                    <Text style={styles.modalHeaderSubtitle}>{provider.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setBookingVisible(false)} style={styles.modalCloseBtn}>
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* 1. Pick Services */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Select Service Checklist</Text>
                  <View style={styles.modalChecklistGrid}>
                    {provider.services.map((s) => {
                      const checked = selectedServices.some(item => item.name === s.name);
                      return (
                        <TouchableOpacity
                          key={s.name}
                          onPress={() => toggleSelectService(s)}
                          style={[styles.modalCheckItem, checked ? styles.modalCheckItemActive : null]}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.modalCheckBox, checked ? styles.modalCheckBoxActive : null]}>
                            {checked && <Text style={styles.modalCheckmark}>✓</Text>}
                          </View>
                          <Text style={[styles.modalCheckText, checked ? styles.modalCheckTextActive : null]}>
                            {s.name} (₹{s.price})
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 2. Choose Vehicle */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Select Registered Vehicle</Text>
                  {vehicles.length === 0 ? (
                    <View style={styles.noVehiclesBox}>
                      <Text style={styles.noVehiclesText}>No vehicles registered. Please add a vehicle first.</Text>
                    </View>
                  ) : (
                    <View style={styles.vehiclesListRow}>
                      {vehicles.map((v) => {
                        const active = selectedVehicle?.id === v.id;
                        return (
                          <TouchableOpacity
                            key={v.id}
                            onPress={() => setSelectedVehicle(v)}
                            style={[styles.vehiclePill, active ? styles.vehiclePillActive : null]}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.vehiclePillText, active ? styles.vehiclePillTextActive : null]}>
                              {v.name}
                            </Text>
                            <Text style={[styles.vehicleNumberText, active ? styles.vehicleNumberTextActive : null]}>
                              {v.number}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* 3. Choose Date */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Schedule Date</Text>
                  <View style={styles.dateSelectionRow}>
                    {nextThreeDays.map((day) => {
                      const active = selectedDate === day.label;
                      return (
                        <TouchableOpacity
                          key={day.label}
                          onPress={() => setSelectedDate(day.label)}
                          style={[styles.dateCard, active ? styles.dateCardActive : null]}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.dateCardLabel, active ? styles.dateCardLabelActive : null]}>
                            {day.label}
                          </Text>
                          <Text style={[styles.dateCardValue, active ? styles.dateCardValueActive : null]}>
                            {day.date}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Choose Time Slots */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Select Preferred Time Slot</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsScroll}>
                    {timeSlots.map((slot) => {
                      const active = selectedTimeSlot === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          onPress={() => setSelectedTimeSlot(slot)}
                          style={[styles.slotBadge, active ? styles.slotBadgeActive : null]}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.slotBadgeText, active ? styles.slotBadgeTextActive : null]}>
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 5. Additional Instructions */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Special Instructions / Notes</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Enter any vehicle symptoms, requests, or instructions..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>

                {/* 6. Pricing Review & Submit */}
                <View style={styles.pricingSummaryBox}>
                  <View style={styles.summaryTotalRow}>
                    <Text style={styles.summaryTotalLabel}>Estimated Total Amount:</Text>
                    <Text style={styles.summaryTotalValue}>₹{calculateTotal()}</Text>
                  </View>
                  <Text style={styles.summaryTaxText}>Final service charge subject to workshop physical inspection.</Text>
                </View>

                <TouchableOpacity
                  onPress={handleConfirmBooking}
                  style={styles.modalSubmitBtn}
                  activeOpacity={0.88}
                >
                  <Text style={styles.modalSubmitBtnText}>Confirm Booking Appointment</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ── ENQUIRY MODAL SHEET ── */}
      <Modal visible={enquiryModalOpen} transparent animationType="slide" onRequestClose={() => setEnquiryModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBody, { maxHeight: '80%' }]}>
            <View style={styles.modalPullHandle} />
            
            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalHeaderTitle}>Service Enquiry</Text>
                <Text style={styles.modalHeaderSubtitle}>Submit enquiry to {provider.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setEnquiryModalOpen(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContentPadding}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>YOUR NAME</Text>
                <TextInput 
                  style={styles.notesInput}
                  value={enquiryName}
                  onChangeText={setEnquiryName}
                  placeholder="Enter name"
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>PHONE NUMBER</Text>
                <TextInput 
                  style={styles.notesInput}
                  value={enquiryPhone}
                  onChangeText={setEnquiryPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>VEHICLE MODEL</Text>
                <TextInput 
                  style={styles.notesInput}
                  value={enquiryVehicle}
                  onChangeText={setEnquiryVehicle}
                  placeholder="e.g. Nexon EV, Activa 6G"
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>ENQUIRY MESSAGE</Text>
                <TextInput 
                  style={[styles.notesInput, { minHeight: 80 }]}
                  value={enquiryMessage}
                  onChangeText={setEnquiryMessage}
                  multiline
                  numberOfLines={3}
                  placeholder="Type your requirements..."
                />
              </View>

              <TouchableOpacity 
                style={styles.modalSubmitBtn} 
                onPress={handleSubmitEnquiry}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSubmitBtnText}>Submit Enquiry</Text>
              </TouchableOpacity>
            </ScrollView>
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
  heroSection: {
    height: 220,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerFloatingRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatingButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  floatArrow: {
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatHeart: {
    fontSize: 18,
  },
  categoryBadgeOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Padding for booking footer
  },
  detailsCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '850',
    color: '#111827',
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  verifiedBadgeText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '800',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  starIcon: {
    fontSize: 18,
    marginRight: 2,
  },
  ratingVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 6,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoLinesList: {
    gap: 10,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 14,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLineEmoji: {
    fontSize: 14,
  },
  infoLineText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '650',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
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
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  mapStub: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapStubGrid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8F4E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapStubLine: {
    width: '100%',
    height: 12,
    backgroundColor: '#CBD5E1',
    position: 'absolute',
    transform: [{ rotate: '25deg' }],
  },
  mapStubDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: 'white',
  },
  mapDetailsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapEngineText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
  },
  viewMapBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewMapBtnText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
  },
  servicesList: {
    gap: 12,
  },
  serviceItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  serviceItemDot: {
    color: '#94A3B8',
    fontSize: 16,
  },
  serviceItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  serviceItemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  reviewRow: {
    paddingVertical: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerAvatarText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  reviewerMeta: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  reviewDate: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 1,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  miniStar: {
    fontSize: 12,
    marginRight: 1,
  },
  reviewComment: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '600',
  },
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  pricingSummaryCol: {
    gap: 2,
  },
  estLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  estValue: {
    fontSize: 18,
    fontWeight: '850',
    color: '#1E293B',
  },
  bookBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  bookBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalBody: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.85,
    minHeight: height * 0.5,
  },
  modalPullHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalContentPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '850',
    color: '#0F172A',
  },
  modalHeaderSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  modalChecklistGrid: {
    gap: 8,
  },
  modalCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  modalCheckItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  modalCheckBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCheckBoxActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  modalCheckmark: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  modalCheckText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  modalCheckTextActive: {
    color: '#1E40AF',
  },
  noVehiclesBox: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
  },
  noVehiclesText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  vehiclesListRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vehiclePill: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  vehiclePillActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  vehiclePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  vehiclePillTextActive: {
    color: '#1E40AF',
  },
  vehicleNumberText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  vehicleNumberTextActive: {
    color: '#60A5FA',
  },
  dateSelectionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dateCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  dateCardLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
  },
  dateCardLabelActive: {
    color: '#60A5FA',
  },
  dateCardValue: {
    fontSize: 13,
    fontWeight: '850',
    color: '#475569',
    marginTop: 4,
  },
  dateCardValueActive: {
    color: '#1E40AF',
  },
  slotsScroll: {
    gap: 8,
  },
  slotBadge: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  slotBadgeActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  slotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  slotBadgeTextActive: {
    color: '#1E40AF',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: '#1E293B',
    textAlignVertical: 'top',
    height: 60,
    fontWeight: '600',
  },
  pricingSummaryBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 4,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '850',
    color: '#0F172A',
  },
  summaryTaxText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  modalSubmitBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },

  // Success Overlay Styles
  successContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 350,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  successIcon: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '850',
    color: '#0F172A',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  successDetailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 24,
  },
  successDetailText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '750',
  },
  dismissSuccessBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissSuccessText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
});
