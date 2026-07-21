import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TextInput, 
  Alert, 
  Dimensions, 
  Image 
} from 'react-native';
import { 
  ProfileHeader, 
  InfoCard, 
  SettingItem, 
  ToggleCard, 
  LogoutDialog 
} from '../../components/ProfileComponents';
import { DrivingLicenseSummary } from '../../components/DrivingLicenseComponents';
import { getLicenses } from '../../services/drivingLicenseService';
import { providers } from '../../services/serviceMockData';
import { PremiumVehicleCard } from '../../components/VehicleComponents';

const { width, height } = Dimensions.get('window');

export default function PersonalizedScreen({ 
  vehicles = [], 
  onLogout, 
  onOpenDoc, 
  onOpenVehicle,
  savedProviderIds = [],
  toggleSaveProvider,
  onSelectProvider,
  onAddVehicle,
  onOpenDrivingLicense,
  isOffline = false,
  onToggleOffline
}) {
  // ── PROFILE PHOTO STATE ──
  const [avatarUri, setAvatarUri] = useState(null);

  // ── USER PERSONAL DETAILS STATE ──
  const [userDetails, setUserDetails] = useState({
    name: 'Rushikesh Patil',
    phone: '+91 98765 43210',
    email: 'rp6870888@gmail.com',
    dob: '1998-09-12',
    gender: 'Male',
    address: 'Jalgaon, Maharashtra'
  });
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // ── DRIVING LICENSES STATE (new multi-license module) ──
  const [allLicenses, setAllLicenses] = useState([]);
  useEffect(() => {
    getLicenses().then(setAllLicenses).catch(() => setAllLicenses([]));
  }, []);

  // ── LEGACY SINGLE LICENSE STATE (kept for backward compat with other components) ──
  const [licensePickerOpen, setLicensePickerOpen] = useState(false);
  const [licenseCameraOpen, setLicenseCameraOpen] = useState(false);
  const [licenseGalleryOpen, setLicenseGalleryOpen] = useState(false);
  const [licenseCapturing, setLicenseCapturing] = useState(false);
  const [licenseCountdown, setLicenseCountdown] = useState(0);

  // ── NOTIFICATION PREFERENCES STATE ──
  const [notifs, setNotifs] = useState({
    insurance: true,
    puc: true,
    rc: true,
    dl: true,
    bookings: true,
    promo: false
  });

  // ── SETTINGS MODALS STATE ──
  const [langModal, setLangModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const [themeModal, setThemeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('System');

  const [pwModal, setPwModal] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  const [permissionsModal, setPermissionsModal] = useState(false);
  const [perms, setPerms] = useState({
    camera: true,
    gallery: true,
    location: true,
    notifications: true
  });

  const [infoModal, setInfoModal] = useState(null); // null | 'privacy' | 'security' | 'terms' | 'policy'

  // ── SUPPORT MODALS STATE ──
  const [faqModal, setFaqModal] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState({});

  const [issueModal, setIssueModal] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [issueCategory, setIssueCategory] = useState('General Bug');

  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const [logoutVisible, setLogoutVisible] = useState(false);

  // ── COMPUTED SAVED SERVICES ──
  const savedVendors = providers.filter(p => savedProviderIds.includes(p.id));

  // ── DRIVING LICENSE SIMULATION HANDLERS ──
  const startLicenseCamera = () => {
    setLicenseCountdown(3);
    setLicenseCapturing(true);
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setLicenseCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        setLicenseInfo(prev => ({
          ...prev,
          status: 'Verified',
          expiryDate: 'Oct 24, 2045'
        }));
        setLicenseCapturing(false);
        setLicenseCameraOpen(false);
        Alert.alert('Upload Successful', 'Driving License has been captured and verified via OCR scan.');
      }
    }, 800);
  };

  const handleLicenseGallerySelect = () => {
    setLicenseGalleryOpen(false);
    setLicenseInfo(prev => ({
      ...prev,
      status: 'Verified',
      expiryDate: 'Nov 12, 2042'
    }));
    Alert.alert('Upload Successful', 'Driving License document uploaded and verified successfully.');
  };

  // ── PASSWORD VALIDATION ──
  const handleChangePasswordSubmit = () => {
    const errs = {};
    if (!passwords.old) {
      errs.old = 'Current password is required';
    }
    if (!passwords.new || passwords.new.length < 6) {
      errs.new = 'New password must be at least 6 characters';
    }
    if (passwords.new !== passwords.confirm) {
      errs.confirm = 'Confirm password does not match new password';
    }

    if (Object.keys(errs).length > 0) {
      setPwErrors(errs);
    } else {
      setPwModal(false);
      setPasswords({ old: '', new: '', confirm: '' });
      setPwErrors({});
      Alert.alert('Success', 'Password has been changed successfully.');
    }
  };

  const toggleFaq = (idx) => {
    setFaqExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const submitIssueReport = () => {
    if (!issueText.trim()) {
      Alert.alert('Error', 'Please describe the issue you are facing.');
      return;
    }
    setIssueModal(false);
    setIssueText('');
    Alert.alert('Ticket Submitted', 'Thank you for reporting this issue. Our support team will resolve it shortly.');
  };

  const submitFeedback = () => {
    setFeedbackModal(false);
    setFeedbackComment('');
    Alert.alert('Thank You', 'Your feedback helps us make Roadmate better!');
  };

  return (
    <View style={styles.container}>
      {/* ── PROFILE HEADER ── */}
      <ProfileHeader 
        avatarUri={avatarUri}
        name={userDetails.name}
        email={userDetails.email}
        phone={userDetails.phone}
        onEditPress={() => setIsEditingDetails(true)}
        onUpdateAvatar={(uri) => setAvatarUri(uri)}
      />

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* ── PERSONAL INFORMATION INFOCARD ── */}
        <InfoCard 
          details={userDetails}
          isEditing={isEditingDetails}
          onCancel={() => setIsEditingDetails(false)}
          onSave={(updated) => {
            setUserDetails(updated);
            setIsEditingDetails(false);
          }}
        />

        {/* ── MY VEHICLES STATS CARD ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <TouchableOpacity onPress={onAddVehicle} activeOpacity={0.6}>
              <Text style={styles.headerActionLink}>+ Add Vehicle</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{vehicles.length}</Text>
              <Text style={styles.statLabel}>Total Vehicles</Text>
            </View>
            <View style={[styles.statBox, styles.borderLeft]}>
              <Text style={styles.statNumber}>
                {vehicles.filter(v => v.status === 'Active' || !v.status).length}
              </Text>
              <Text style={styles.statLabel}>Active Vehicles</Text>
            </View>
          </View>

          {/* Quick list of vehicles */}
          {vehicles.length > 0 ? (
            <View style={{ marginTop: 12 }}>
              {vehicles.map((v) => (
                <PremiumVehicleCard
                  key={v.id}
                  vehicle={v}
                  onPress={() => onOpenVehicle && onOpenVehicle(v.id)}
                  onOpenDoc={(docKey) => onOpenDoc && onOpenDoc(docKey, v.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyVehiclesBox}>
              <Text style={styles.emptyText}>No registered vehicles found.</Text>
            </View>
          )}
        </View>

        {/* ── DRIVING LICENSES SUMMARY (new multi-license module) ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Driving Licenses</Text>
          <DrivingLicenseSummary
            licenses={allLicenses}
            onTap={() => onOpenDrivingLicense && onOpenDrivingLicense()}
          />
        </View>

        {/* ── SAVED SERVICES SECTION ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Saved Services</Text>
          {savedVendors.length > 0 ? (
            <View style={styles.savedServicesList}>
              {savedVendors.map((vendor) => (
                <View key={vendor.id} style={styles.savedServiceCard}>
                  <View style={styles.savedServiceTop}>
                    <View style={styles.savedServiceLeft}>
                      <View style={styles.savedServiceImgFrame}>
                        <Text style={styles.savedServiceEmoji}>
                          {vendor.category === 'Car Wash' ? '🫧' : vendor.category === 'Towing' ? '🛻' : '🔧'}
                        </Text>
                      </View>
                      <View style={styles.savedServiceTextGroup}>
                        <Text style={styles.savedServiceName} numberOfLines={1}>{vendor.name}</Text>
                        <Text style={styles.savedServiceSub}>{vendor.category} · {vendor.distance} km</Text>
                        <Text style={styles.savedServiceRating}>⭐ {vendor.rating} ({vendor.reviews} reviews)</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => toggleSaveProvider(vendor.id)}
                      style={styles.savedServiceRemoveBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.savedServiceRemoveText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                    onPress={() => onSelectProvider(vendor)}
                    style={styles.savedServiceDetailBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.savedServiceDetailBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySavedBox}>
              <Text style={styles.emptySavedEmoji}>⭐</Text>
              <Text style={styles.emptySavedText}>No saved services yet</Text>
              <Text style={styles.emptySavedSub}>Your bookmarked providers will appear here for quick access.</Text>
            </View>
          )}
        </View>

        {/* ── NOTIFICATION SETTINGS ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <ToggleCard 
            label="Insurance Reminders"
            description="Alerts before insurance policy expiry"
            value={notifs.insurance}
            onValueChange={(v) => setNotifs({ ...notifs, insurance: v })}
          />

          <ToggleCard 
            label="PUC Reminders"
            description="Alerts before PUC certificate validity ends"
            value={notifs.puc}
            onValueChange={(v) => setNotifs({ ...notifs, puc: v })}
          />

          <ToggleCard 
            label="RC Renewal Reminders"
            description="Registration validity expiry updates"
            value={notifs.rc}
            onValueChange={(v) => setNotifs({ ...notifs, rc: v })}
          />

          <ToggleCard 
            label="Driving License Renewal"
            description="Alerts for driving license expiration"
            value={notifs.dl}
            onValueChange={(v) => setNotifs({ ...notifs, dl: v })}
          />

          <ToggleCard 
            label="Booking Updates"
            description="Real-time progress updates on active requests"
            value={notifs.bookings}
            onValueChange={(v) => setNotifs({ ...notifs, bookings: v })}
          />

          <ToggleCard 
            label="Promotional Notifications"
            description="Exclusive discounts, tips, and service updates"
            value={notifs.promo}
            onValueChange={(v) => setNotifs({ ...notifs, promo: v })}
            border={false}
          />
        </View>

        {/* ── APP SETTINGS PANEL ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <SettingItem 
            icon="🌐"
            label="Language"
            description="Change preferred display language"
            value={currentLang}
            onPress={() => setLangModal(true)}
          />

          <SettingItem 
            icon="🎨"
            label="Theme Selection"
            description="Choose app appearance"
            value={currentTheme}
            onPress={() => setThemeModal(true)}
          />

          <SettingItem 
            icon="🔑"
            label="Change Password"
            description="Update account password credentials"
            onPress={() => setPwModal(true)}
          />

          <SettingItem 
            icon="🛡️"
            label="Privacy Options"
            description="Manage data sharing preferences"
            onPress={() => setInfoModal('privacy')}
          />

          <SettingItem 
            icon="🔒"
            label="Security & Sync"
            description="Parivahan/DigiLocker sync logs"
            onPress={() => setInfoModal('security')}
          />

          <SettingItem 
            icon="🔐"
            label="App Permissions"
            description="Manage system permissions"
            onPress={() => setPermissionsModal(true)}
          />

          <SettingItem 
            icon="📜"
            label="Terms & Conditions"
            description="Review terms of service use"
            onPress={() => setInfoModal('terms')}
          />

          <SettingItem 
            icon="🛡️"
            label="Privacy Policy"
            description="Review customer data policy"
            onPress={() => setInfoModal('policy')}
            border={false}
          />
        </View>

        {/* ── SUPPORT & FEEDBACK DESK ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Help & Support Desk</Text>

          <SettingItem 
            icon="❓"
            label="Frequently Asked Questions"
            description="Quick answers to common questions"
            onPress={() => setFaqModal(true)}
          />

          <SettingItem 
            icon="📞"
            label="Contact Support"
            description="Speak directly to our support agents"
            onPress={() => {
              Alert.alert('Contact Support', 'Speak to our support team:\n\n📞 +1 (800) 123-4567\n✉️ support@roadmate.com', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Call Now', onPress: () => Alert.alert('Dialing Support', 'Connecting call to customer care...') }
              ]);
            }}
          />

          <SettingItem 
            icon="⚠️"
            label="Report a Technical Bug"
            description="Let us know if you face app issues"
            onPress={() => setIssueModal(true)}
          />

          <SettingItem 
            icon="⭐"
            label="App Feedback"
            description="Help us improve with ratings & comments"
            onPress={() => setFeedbackModal(true)}
            border={false}
          />
        </View>

        {/* ── LOGOUT SESSION TRIGGER ── */}
        <TouchableOpacity 
          onPress={() => setLogoutVisible(true)} 
          style={styles.logoutButton} 
          activeOpacity={0.88}
        >
          <Text style={styles.logoutButtonText}>🚪 Logout Session</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ────────────────── MODALS & SHEET SIMULATIONS ────────────────── */}

      {/* CHOOSE IMAGE SOURCE FOR DRIVING LICENSE */}
      <Modal visible={licensePickerOpen} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setLicensePickerOpen(false)}
        >
          <View style={styles.bottomSheetCard}>
            <Text style={styles.modalHeaderTitle}>Upload Driving License</Text>
            
            <TouchableOpacity 
              onPress={() => { setLicensePickerOpen(false); setLicenseCameraOpen(true); }}
              style={styles.modalSheetOption}
              activeOpacity={0.7}
            >
              <Text style={styles.modalSheetOptionIcon}>📷</Text>
              <Text style={styles.modalSheetOptionText}>Take Photo (Camera)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { setLicensePickerOpen(false); setLicenseGalleryOpen(true); }}
              style={[styles.modalSheetOption, styles.borderTop]}
              activeOpacity={0.7}
            >
              <Text style={styles.modalSheetOptionIcon}>🖼️</Text>
              <Text style={styles.modalSheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setLicensePickerOpen(false)}
              style={styles.modalSheetCancelBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.modalSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* LICENSE CAMERA SIMULATION */}
      <Modal visible={licenseCameraOpen} transparent animationType="slide">
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraContainer}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraHeaderTitle}>Scan Driving License</Text>
              <TouchableOpacity onPress={() => setLicenseCameraOpen(false)} style={styles.cameraCloseBtn}>
                <Text style={styles.cameraCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cameraViewport}>
              {licenseCapturing ? (
                <View style={styles.cameraCapturingOverlay}>
                  <Text style={styles.cameraCountdownText}>{licenseCountdown}</Text>
                  <Text style={styles.cameraCapturingLabel}>Processing document details...</Text>
                </View>
              ) : (
                <View style={styles.cameraViewportContent}>
                  <View style={styles.cameraReticle} />
                  <Text style={styles.cameraViewportInstruction}>Align Driving License inside the guide box</Text>
                </View>
              )}
            </View>

            <View style={styles.cameraActionRow}>
              <TouchableOpacity 
                disabled={licenseCapturing}
                onPress={startLicenseCamera}
                style={styles.cameraShutterBtn}
                activeOpacity={0.8}
              >
                <View style={styles.cameraShutterBtnInner} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* LICENSE GALLERY SIMULATION */}
      <Modal visible={licenseGalleryOpen} transparent animationType="slide">
        <View style={styles.galleryOverlay}>
          <View style={styles.galleryContainer}>
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryHeaderTitle}>Select License File</Text>
              <TouchableOpacity onPress={() => setLicenseGalleryOpen(false)} style={styles.galleryCloseBtn}>
                <Text style={styles.galleryCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.galleryGrid}>
              <TouchableOpacity 
                onPress={handleLicenseGallerySelect}
                style={styles.galleryGridItem}
                activeOpacity={0.85}
              >
                <Image 
                  source={require('../../../assets/vehicle_placeholder.png')} 
                  style={styles.galleryGridImage} 
                />
                <View style={styles.galleryItemOverlay}>
                  <Text style={styles.galleryItemText}>License_Copy.jpg</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* LANGUAGE SELECTION MODAL */}
      <Modal visible={langModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Language</Text>
            {['English', 'Hindi (हिंदी)', 'Marathi (मराठी)'].map((l) => {
              const cleanVal = l.split(' ')[0];
              const isSel = currentLang === cleanVal;
              return (
                <TouchableOpacity
                  key={l}
                  onPress={() => {
                    setCurrentLang(cleanVal);
                    setLangModal(false);
                  }}
                  style={styles.modalOptionRow}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, isSel ? styles.modalOptionTextSelected : null]}>{l}</Text>
                  {isSel && <Text style={styles.modalOptionCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* THEME SELECTION MODAL */}
      <Modal visible={themeModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setThemeModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose Appearance Theme</Text>
            {['Light Mode', 'Dark Mode', 'System Default'].map((t) => {
              const cleanVal = t.split(' ')[0];
              const isSel = currentTheme === cleanVal;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => {
                    setCurrentTheme(cleanVal);
                    setThemeModal(false);
                  }}
                  style={styles.modalOptionRow}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptionText, isSel ? styles.modalOptionTextSelected : null]}>{t}</Text>
                  {isSel && <Text style={styles.modalOptionCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={pwModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: '85%', maxWidth: 340 }]}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Current Password</Text>
              <TextInput
                style={[styles.modalInput, pwErrors.old ? styles.modalInputError : null]}
                placeholder="Enter current password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={passwords.old}
                onChangeText={(v) => setPasswords({ ...passwords, old: v })}
              />
              {pwErrors.old && <Text style={styles.modalInputErrorText}>{pwErrors.old}</Text>}
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>New Password</Text>
              <TextInput
                style={[styles.modalInput, pwErrors.new ? styles.modalInputError : null]}
                placeholder="At least 6 characters"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={passwords.new}
                onChangeText={(v) => setPasswords({ ...passwords, new: v })}
              />
              {pwErrors.new && <Text style={styles.modalInputErrorText}>{pwErrors.new}</Text>}
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Confirm New Password</Text>
              <TextInput
                style={[styles.modalInput, pwErrors.confirm ? styles.modalInputError : null]}
                placeholder="Re-enter new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={passwords.confirm}
                onChangeText={(v) => setPasswords({ ...passwords, confirm: v })}
              />
              {pwErrors.confirm && <Text style={styles.modalInputErrorText}>{pwErrors.confirm}</Text>}
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => { setPwModal(false); setPwErrors({}); }} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePasswordSubmit} style={styles.modalSubmitBtn}>
                <Text style={styles.modalSubmitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* APP PERMISSIONS MODAL */}
      <Modal visible={permissionsModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setPermissionsModal(false)}>
          <View style={[styles.modalCard, { width: '85%' }]}>
            <Text style={styles.modalTitle}>App Permissions</Text>
            
            <ToggleCard 
              label="Camera Access"
              description="Used to capture vehicle and profile photos"
              value={perms.camera}
              onValueChange={(v) => setPerms({ ...perms, camera: v })}
            />

            <ToggleCard 
              label="Photo Gallery"
              description="Used to upload documentation files"
              value={perms.gallery}
              onValueChange={(v) => setPerms({ ...perms, gallery: v })}
            />

            <ToggleCard 
              label="Location Services"
              description="Used to find nearby garages & centers"
              value={perms.location}
              onValueChange={(v) => setPerms({ ...perms, location: v })}
            />

            <ToggleCard 
              label="Push Notifications"
              description="Used to receive renewal alerts"
              value={perms.notifications}
              onValueChange={(v) => setPerms({ ...perms, notifications: v })}
              border={true}
            />

            <ToggleCard 
              label="Simulate Offline Mode"
              description="Test network disconnection & retry alert widgets"
              value={isOffline}
              onValueChange={onToggleOffline}
              border={false}
            />

            <TouchableOpacity 
              onPress={() => setPermissionsModal(false)} 
              style={styles.permissionsDoneBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.permissionsDoneBtnText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* LEGAL & STATS INFO MODALS */}
      <Modal visible={infoModal !== null} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setInfoModal(null)}>
          <View style={[styles.modalCard, { width: '85%', maxHeight: '70%' }]}>
            <Text style={styles.modalTitle}>
              {infoModal === 'privacy' && 'Privacy Settings'}
              {infoModal === 'security' && 'Security & Parivahan'}
              {infoModal === 'terms' && 'Terms & Conditions'}
              {infoModal === 'policy' && 'Privacy Policy'}
            </Text>

            <ScrollView style={styles.modalInfoScroll} showsVerticalScrollIndicator={false}>
              {infoModal === 'privacy' && (
                <Text style={styles.modalInfoText}>
                  Your data security is our top priority. We do not sell or trade your personal information or document records to third-party brokers. All document verification is directly processed through secure Govt APIs (Parivahan and DigiLocker) with local secure tokens. Toggling background sync options limits daily background queries.
                </Text>
              )}
              {infoModal === 'security' && (
                <Text style={styles.modalInfoText}>
                  Encryption Protocols: All data transmitted is protected under TLS 1.3 protocol. Document files are stored with AES-256 server-side encryption.{"\n\n"}
                  Parivahan Sync Status: Connected{"\n"}
                  DigiLocker Token: Active{"\n"}
                  Last Security Scan: Today, 11:32 AM (0 Issues Found)
                </Text>
              )}
              {infoModal === 'terms' && (
                <Text style={styles.modalInfoText}>
                  1. Acceptance of Terms: By registering and managing vehicles on the Roadmate platform, you agree to these service conditions.{"\n\n"}
                  2. User Accounts: You are responsible for keeping passwords and account inputs secure.{"\n\n"}
                  3. Verification accuracy: OCR scanning and govt sync are provided "as-is" matching public database registries. Users are advised to crosscheck physical papers.
                </Text>
              )}
              {infoModal === 'policy' && (
                <Text style={styles.modalInfoText}>
                  Roadmate Technologies is committed to maintaining privacy. We only collect details essential to vehicle management, navigation, and matching nearby servicing providers. Access to Location, Camera, and Files is optional and requested dynamically on usage. You can retract permissions at any time.
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity onPress={() => setInfoModal(null)} style={styles.permissionsDoneBtn}>
              <Text style={styles.permissionsDoneBtnText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* FAQ ACCORDION MODAL */}
      <Modal visible={faqModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.faqModalCard}>
            <View style={styles.faqModalHeader}>
              <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
              <TouchableOpacity onPress={() => setFaqModal(false)} style={styles.faqCloseBtn}>
                <Text style={styles.faqCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.faqScroll} showsVerticalScrollIndicator={false}>
              {[
                { q: 'How do I add a new vehicle?', a: 'Go to the Home tab and click on the "+" card at the end of the vehicle slider, or tap "+ Add Vehicle" in the Profile screen.' },
                { q: 'What does the "Verified" status mean?', a: 'It means your document details have been retrieved from the government Parivahan or DigiLocker database.' },
                { q: 'Can I store multiple driving licenses?', a: 'Currently, the app stores one primary driving license associated with the registered phone account.' },
                { q: 'How do I cancel a service booking?', a: 'Go to the Services tab, navigate to Booking History, select the active booking and press "Cancel Booking".' },
              ].map((faq, idx) => {
                const isOpen = faqExpanded[idx];
                return (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => toggleFaq(idx)} 
                    style={styles.faqItem}
                    activeOpacity={0.8}
                  >
                    <View style={styles.faqItemHeader}>
                      <Text style={styles.faqQuestion}>{faq.q}</Text>
                      <Text style={styles.faqArrow}>{isOpen ? '▲' : '▼'}</Text>
                    </View>
                    {isOpen && (
                      <View style={styles.faqAnswerBox}>
                        <Text style={styles.faqAnswerText}>{faq.a}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* REPORT ISSUE MODAL */}
      <Modal visible={issueModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: '85%' }]}>
            <Text style={styles.modalTitle}>Report a Technical Bug</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Issue Category</Text>
              <View style={styles.issueCatRow}>
                {['General Bug', 'OCR Scan', 'Booking Fail'].map((cat) => {
                  const isSel = issueCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setIssueCategory(cat)}
                      style={[styles.issueCatBtn, isSel ? styles.issueCatBtnSel : null]}
                    >
                      <Text style={[styles.issueCatText, isSel ? styles.issueCatTextSel : null]}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Describe the Bug</Text>
              <TextInput
                style={[styles.modalInput, { minHeight: 74, textAlignVertical: 'top' }]}
                placeholder="What went wrong? E.g. screen froze during verification"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={issueText}
                onChangeText={setIssueText}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => setIssueModal(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitIssueReport} style={styles.modalSubmitBtn}>
                <Text style={styles.modalSubmitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* APP FEEDBACK MODAL */}
      <Modal visible={feedbackModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: '85%' }]}>
            <Text style={styles.modalTitle}>App Feedback</Text>
            <Text style={styles.feedbackSub}>Rate your experience with Roadmate</Text>
            
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
                  <Text style={[styles.starEmoji, feedbackRating >= star ? styles.starEmojiActive : null]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Write Review (Optional)</Text>
              <TextInput
                style={[styles.modalInput, { minHeight: 64, textAlignVertical: 'top' }]}
                placeholder="Tell us what we can improve..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
                value={feedbackComment}
                onChangeText={setFeedbackComment}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => setFeedbackModal(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitFeedback} style={styles.modalSubmitBtn}>
                <Text style={styles.modalSubmitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* LOGOUT DIALOG MODAL */}
      <LogoutDialog 
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onLogout={() => {
          setLogoutVisible(false);
          onLogout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  headerActionLink: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFF2F5',
    paddingVertical: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  miniVehicleList: {
    gap: 8,
  },
  miniVehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EFF2F5',
    borderRadius: 12,
  },
  miniVehicleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniVehicleIcon: {
    fontSize: 18,
  },
  miniVehicleName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  miniVehicleNum: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  miniVehicleArrow: {
    fontSize: 10,
    color: '#94A3B8',
  },
  emptyVehiclesBox: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  dlDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EFF2F5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  dlDetailsLeft: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  dlEmoji: {
    fontSize: 26,
  },
  dlNumberLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dlNumberVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 1,
  },
  dlExpiryText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  dlStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dlVerifiedBg: {
    backgroundColor: '#F0FDF4',
  },
  dlValidBg: {
    backgroundColor: '#EFF6FF',
  },
  dlStatusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dlVerifiedText: {
    color: '#16A34A',
  },
  dlValidText: {
    color: '#2563EB',
  },
  dlActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dlActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  dlActionBtnIcon: {
    fontSize: 12,
  },
  dlActionView: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  dlActionBtnTextView: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  dlActionReplace: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  dlActionBtnTextReplace: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  dlActionUpload: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  dlActionBtnTextUpload: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },
  savedServicesList: {
    gap: 10,
  },
  savedServiceCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EFF2F5',
    borderRadius: 16,
    padding: 12,
  },
  savedServiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  savedServiceLeft: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  savedServiceImgFrame: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedServiceEmoji: {
    fontSize: 20,
  },
  savedServiceTextGroup: {
    flex: 1,
    paddingRight: 8,
  },
  savedServiceName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  savedServiceSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  savedServiceRating: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '700',
    marginTop: 3,
  },
  savedServiceRemoveBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  savedServiceRemoveText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: 'bold',
  },
  savedServiceDetailBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  savedServiceDetailBtnText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },
  emptySavedBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySavedEmoji: {
    fontSize: 32,
    color: '#CBD5E1',
    marginBottom: 8,
  },
  emptySavedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  emptySavedSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
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
    fontWeight: '800',
  },
  // Dialog Overlays
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  modalOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },
  modalOptionCheck: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 14,
  },
  modalInputGroup: {
    marginBottom: 14,
    width: '100%',
  },
  modalInputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    backgroundColor: '#F8FAFC',
  },
  modalInputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  modalInputErrorText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flex: 1.5,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  permissionsDoneBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
  },
  permissionsDoneBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  modalInfoScroll: {
    maxHeight: 200,
    marginBottom: 8,
  },
  modalInfoText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  // FAQ Modal Specifics
  faqModalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    maxHeight: '80%',
    paddingBottom: 32,
    paddingTop: 12,
  },
  faqModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqCloseText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  faqScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  faqItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EFF2F5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  faqItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    paddingRight: 12,
  },
  faqArrow: {
    fontSize: 10,
    color: '#94A3B8',
  },
  faqAnswerBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 10,
  },
  faqAnswerText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  // Issue Modal Specifics
  issueCatRow: {
    flexDirection: 'row',
    gap: 8,
  },
  issueCatBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  issueCatBtnSel: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  issueCatText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  issueCatTextSel: {
    color: '#2563EB',
  },
  // Feedback stars Specifics
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
  },
  starEmoji: {
    fontSize: 32,
    color: '#E2E8F0',
  },
  starEmojiActive: {
    color: '#F59E0B',
  },
  feedbackSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: -8,
  },
  // Bottom Sheet Picker Dialog
  bottomSheetCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  modalSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  modalSheetOptionIcon: {
    fontSize: 20,
  },
  modalSheetOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  modalSheetCancelBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  modalSheetCancelText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  // Camera simulation
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  cameraHeaderTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  cameraCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCloseText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraViewport: {
    height: 200,
    backgroundColor: 'black',
    margin: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraViewportContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cameraReticle: {
    width: 240,
    height: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'white',
    opacity: 0.5,
    borderRadius: 12,
  },
  cameraViewportInstruction: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 12,
    fontWeight: '600',
  },
  cameraCapturingOverlay: {
    alignItems: 'center',
  },
  cameraCountdownText: {
    color: '#EF4444',
    fontSize: 48,
    fontWeight: '900',
  },
  cameraCapturingLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  cameraActionRow: {
    alignItems: 'center',
  },
  cameraShutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraShutterBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EF4444',
  },
  // Gallery Simulation
  galleryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  galleryContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '60%',
    paddingBottom: 32,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  galleryHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  galleryCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryCloseText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  galleryGrid: {
    padding: 24,
    alignItems: 'center',
  },
  galleryGridItem: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  galleryGridImage: {
    width: '100%',
    height: '100%',
  },
  galleryItemOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  galleryItemText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});
