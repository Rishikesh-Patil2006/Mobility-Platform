import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Image, 
  ScrollView, 
  Switch, 
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

// Premium Avatar Mock Images for Gallery selection
const MOCK_AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
];

const MOCK_AVATAR_CAMERA = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
];

// ── 1. PROFILE HEADER ──
export function ProfileHeader({ 
  avatarUri, 
  name, 
  email, 
  phone, 
  onEditPress, 
  onUpdateAvatar 
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const initials = useMemo(() => {
    if (!name) return 'RP';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [name]);

  const startCameraCapture = () => {
    setCountdown(3);
    setCapturing(true);
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        const randomPic = MOCK_AVATAR_CAMERA[Math.floor(Math.random() * MOCK_AVATAR_CAMERA.length)];
        onUpdateAvatar(randomPic);
        setCapturing(false);
        setCameraOpen(false);
      }
    }, 800);
  };

  const handleSelectGallery = (url) => {
    onUpdateAvatar(url);
    setGalleryOpen(false);
  };

  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.avatarSection}>
        <TouchableOpacity 
          onPress={() => setPickerOpen(true)} 
          style={headerStyles.avatarWrapper}
          activeOpacity={0.85}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={headerStyles.avatarImage} />
          ) : (
            <View style={headerStyles.avatarFallback}>
              <Text style={headerStyles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <View style={headerStyles.editBadge}>
            <Text style={headerStyles.editBadgeIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <Text style={headerStyles.nameText}>{name}</Text>
        <Text style={headerStyles.contactText}>{email}  |  {phone}</Text>

        <TouchableOpacity 
          onPress={onEditPress} 
          style={headerStyles.editProfileBtn}
          activeOpacity={0.7}
        >
          <Text style={headerStyles.editProfileBtnText}>✏️ Edit Personal Details</Text>
        </TouchableOpacity>
      </View>

      {/* CHOOSE IMAGE SOURCE MODAL */}
      <Modal visible={pickerOpen} transparent animationType="fade">
        <TouchableOpacity 
          style={pickerStyles.overlay} 
          activeOpacity={1} 
          onPress={() => setPickerOpen(false)}
        >
          <View style={pickerStyles.card}>
            <Text style={pickerStyles.title}>Update Profile Picture</Text>
            
            <TouchableOpacity 
              onPress={() => { setPickerOpen(false); setCameraOpen(true); }}
              style={pickerStyles.option}
              activeOpacity={0.7}
            >
              <Text style={pickerStyles.optionIcon}>📷</Text>
              <Text style={pickerStyles.optionText}>Take Photo (Camera)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { setPickerOpen(false); setGalleryOpen(true); }}
              style={[pickerStyles.option, pickerStyles.borderTop]}
              activeOpacity={0.7}
            >
              <Text style={pickerStyles.optionIcon}>🖼️</Text>
              <Text style={pickerStyles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setPickerOpen(false)}
              style={pickerStyles.cancelBtn}
              activeOpacity={0.7}
            >
              <Text style={pickerStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* CAMERA SIMULATION */}
      <Modal visible={cameraOpen} transparent animationType="slide">
        <View style={cameraStyles.overlay}>
          <View style={cameraStyles.container}>
            <View style={cameraStyles.header}>
              <Text style={cameraStyles.headerTitle}>Take Selfie</Text>
              <TouchableOpacity onPress={() => setCameraOpen(false)} style={cameraStyles.closeBtn}>
                <Text style={cameraStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={cameraStyles.viewport}>
              {capturing ? (
                <View style={cameraStyles.capturingOverlay}>
                  <Text style={cameraStyles.countdownText}>{countdown}</Text>
                  <Text style={cameraStyles.capturingLabel}>Capturing premium photo...</Text>
                </View>
              ) : (
                <View style={cameraStyles.viewportContent}>
                  <View style={cameraStyles.reticle} />
                  <Text style={cameraStyles.viewportInstruction}>Center your face in the oval</Text>
                </View>
              )}
            </View>

            <View style={cameraStyles.actionRow}>
              <TouchableOpacity 
                disabled={capturing}
                onPress={startCameraCapture}
                style={cameraStyles.shutterBtn}
                activeOpacity={0.8}
              >
                <View style={cameraStyles.shutterBtnInner} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* GALLERY SIMULATION */}
      <Modal visible={galleryOpen} transparent animationType="slide">
        <View style={galleryStyles.overlay}>
          <View style={galleryStyles.container}>
            <View style={galleryStyles.header}>
              <Text style={galleryStyles.headerTitle}>Select Avatar</Text>
              <TouchableOpacity onPress={() => setGalleryOpen(false)} style={galleryStyles.closeBtn}>
                <Text style={galleryStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={galleryStyles.grid} showsVerticalScrollIndicator={false}>
              {MOCK_AVATAR_IMAGES.map((url) => {
                const isSelected = avatarUri === url;
                return (
                  <TouchableOpacity
                    key={url}
                    onPress={() => handleSelectGallery(url)}
                    style={galleryStyles.gridItem}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: url }} style={galleryStyles.gridImage} />
                    {isSelected && (
                      <View style={galleryStyles.selectedOverlay}>
                        <Text style={galleryStyles.checkEmoji}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── 2. PERSONAL INFO & INFOCARD ──
export function InfoCard({ 
  details, 
  isEditing, 
  onCancel, 
  onSave 
}) {
  const [formData, setFormData] = useState({ ...details });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setFormData({ ...details });
    setErrors({});
  }, [details, isEditing]);

  const validate = () => {
    const err = {};
    if (!formData.name || formData.name.trim().length < 3) {
      err.name = 'Full Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      err.name = 'Name should only contain letters';
    }

    if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/[\s+-]/g, '').slice(-10))) {
      err.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      err.email = 'Please enter a valid email address';
    }

    if (!formData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      err.dob = 'DOB must be in YYYY-MM-DD format';
    } else {
      const dobVal = new Date(formData.dob);
      if (isNaN(dobVal.getTime()) || dobVal > new Date()) {
        err.dob = 'DOB cannot be in the future or invalid';
      }
    }

    if (!formData.gender) {
      err.gender = 'Please select your gender';
    }

    if (!formData.address || formData.address.trim().length < 5) {
      err.address = 'Please enter a complete address (min 5 chars)';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isEditing) {
    const displayFields = [
      { l: 'Full Name', v: details.name, e: '👤' },
      { l: 'Mobile Number', v: details.phone, e: '📞' },
      { l: 'Email Address', v: details.email, e: '✉️' },
      { l: 'Date of Birth', v: details.dob, e: '📅' },
      { l: 'Gender', v: details.gender, e: '🚻' },
      { l: 'Address', v: details.address, e: '📍' },
    ];

    return (
      <View style={infoCardStyles.card}>
        <Text style={infoCardStyles.title}>Personal Information</Text>
        <View style={infoCardStyles.list}>
          {displayFields.map((f, i) => (
            <View key={f.l} style={[infoCardStyles.row, i > 0 ? infoCardStyles.borderTop : null]}>
              <View style={infoCardStyles.rowHeader}>
                <Text style={infoCardStyles.rowEmoji}>{f.e}</Text>
                <Text style={infoCardStyles.label}>{f.l}</Text>
              </View>
              <Text style={infoCardStyles.value} numberOfLines={2}>{f.v}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Editing Mode Form Layout
  return (
    <View style={[infoCardStyles.card, infoCardStyles.editingCard]}>
      <Text style={infoCardStyles.title}>Edit Personal Details</Text>
      
      {/* Full Name Input */}
      <View style={infoCardStyles.inputGroup}>
        <Text style={infoCardStyles.inputLabel}>Full Name</Text>
        <TextInput 
          style={[infoCardStyles.input, errors.name ? infoCardStyles.inputError : null]} 
          value={formData.name}
          onChangeText={(v) => setFormData({ ...formData, name: v })}
          placeholder="Enter full name"
          placeholderTextColor="#94A3B8"
        />
        {errors.name && <Text style={infoCardStyles.errorText}>{errors.name}</Text>}
      </View>

      {/* Mobile Input */}
      <View style={infoCardStyles.inputGroup}>
        <Text style={infoCardStyles.inputLabel}>Mobile Number</Text>
        <TextInput 
          style={[infoCardStyles.input, errors.phone ? infoCardStyles.inputError : null]} 
          value={formData.phone}
          onChangeText={(v) => setFormData({ ...formData, phone: v })}
          placeholder="10-digit mobile number"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={infoCardStyles.errorText}>{errors.phone}</Text>}
      </View>

      {/* Email Input */}
      <View style={infoCardStyles.inputGroup}>
        <Text style={infoCardStyles.inputLabel}>Email Address</Text>
        <TextInput 
          style={[infoCardStyles.input, errors.email ? infoCardStyles.inputError : null]} 
          value={formData.email}
          onChangeText={(v) => setFormData({ ...formData, email: v })}
          placeholder="example@email.com"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={infoCardStyles.errorText}>{errors.email}</Text>}
      </View>

      {/* DOB Input */}
      <View style={infoCardStyles.inputGroup}>
        <Text style={infoCardStyles.inputLabel}>Date of Birth (YYYY-MM-DD)</Text>
        <TextInput 
          style={[infoCardStyles.input, errors.dob ? infoCardStyles.inputError : null]} 
          value={formData.dob}
          onChangeText={(v) => setFormData({ ...formData, dob: v })}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#94A3B8"
        />
        {errors.dob && <Text style={infoCardStyles.errorText}>{errors.dob}</Text>}
      </View>

      {/* Gender Picker */}
      <View style={infoCardStyles.inputGroup}>
        <Text style={infoCardStyles.inputLabel}>Gender</Text>
        <View style={infoCardStyles.genderSelectorRow}>
          {['Male', 'Female', 'Other'].map((g) => {
            const isSel = formData.gender === g;
            return (
              <TouchableOpacity
                key={g}
                onPress={() => setFormData({ ...formData, gender: g })}
                style={[
                  infoCardStyles.genderButton,
                  isSel ? infoCardStyles.genderButtonSelected : null
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  infoCardStyles.genderText,
                  isSel ? infoCardStyles.genderTextSelected : null
                ]}>
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.gender && <Text style={infoCardStyles.errorText}>{errors.gender}</Text>}
      </View>

      {/* Address Input */}
      <View style={infoCardStyles.inputGroup}>
        <Text style={infoCardStyles.inputLabel}>Address</Text>
        <TextInput 
          style={[
            infoCardStyles.input, 
            infoCardStyles.textArea,
            errors.address ? infoCardStyles.inputError : null
          ]} 
          value={formData.address}
          onChangeText={(v) => setFormData({ ...formData, address: v })}
          placeholder="Enter address details"
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
        />
        {errors.address && <Text style={infoCardStyles.errorText}>{errors.address}</Text>}
      </View>

      {/* Actions */}
      <View style={infoCardStyles.actionRow}>
        <TouchableOpacity 
          onPress={onCancel}
          style={infoCardStyles.cancelBtn}
          activeOpacity={0.7}
        >
          <Text style={infoCardStyles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSave}
          style={infoCardStyles.saveBtn}
          activeOpacity={0.8}
        >
          <Text style={infoCardStyles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 3. SETTING ITEM ──
export function SettingItem({ 
  icon, 
  label, 
  description, 
  value, 
  onPress, 
  border = true 
}) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[settingStyles.container, border ? settingStyles.borderBottom : null]}
      activeOpacity={0.75}
    >
      <View style={settingStyles.leftCol}>
        {icon && (
          <View style={settingStyles.iconCircle}>
            <Text style={settingStyles.iconEmoji}>{icon}</Text>
          </View>
        )}
        <View style={settingStyles.textGroup}>
          <Text style={settingStyles.label}>{label}</Text>
          {description && <Text style={settingStyles.desc}>{description}</Text>}
        </View>
      </View>
      
      <View style={settingStyles.rightCol}>
        {value && <Text style={settingStyles.valueText}>{value}</Text>}
        <Text style={settingStyles.arrow}>❯</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── 4. TOGGLE CARD ──
export function ToggleCard({ 
  label, 
  description, 
  value, 
  onValueChange, 
  border = true 
}) {
  return (
    <View style={[toggleStyles.container, border ? toggleStyles.borderBottom : null]}>
      <View style={toggleStyles.textGroup}>
        <Text style={toggleStyles.label}>{label}</Text>
        {description && <Text style={toggleStyles.desc}>{description}</Text>}
      </View>
      <Switch 
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
        thumbColor={value ? '#2563EB' : '#F1F5F9'}
      />
    </View>
  );
}

// ── 5. LOGOUT DIALOG ──
export function LogoutDialog({ 
  visible, 
  onCancel, 
  onLogout 
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={logoutStyles.overlay}>
        <View style={logoutStyles.container}>
          <View style={logoutStyles.iconCircle}>
            <Text style={logoutStyles.icon}>🚪</Text>
          </View>
          <Text style={logoutStyles.title}>Logout</Text>
          <Text style={logoutStyles.message}>Are you sure you want to logout?</Text>
          
          <View style={logoutStyles.btnRow}>
            <TouchableOpacity 
              onPress={onCancel} 
              style={logoutStyles.cancelBtn}
              activeOpacity={0.7}
            >
              <Text style={logoutStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onLogout} 
              style={logoutStyles.logoutBtn}
              activeOpacity={0.8}
            >
              <Text style={logoutStyles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── STYLES ──

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#2563EB',
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    position: 'relative',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  editBadgeIcon: {
    fontSize: 13,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
  },
  contactText: {
    fontSize: 12,
    color: 'rgba(219, 234, 254, 0.85)',
    marginTop: 4,
    fontWeight: '600',
  },
  editProfileBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginTop: 16,
  },
  editProfileBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  cancelBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  cancelText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
});

const cameraStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewport: {
    height: 280,
    backgroundColor: 'black',
    margin: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewportContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  reticle: {
    width: 140,
    height: 190,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'white',
    opacity: 0.5,
    borderRadius: 70,
  },
  viewportInstruction: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 16,
    fontWeight: '600',
  },
  capturingOverlay: {
    alignItems: 'center',
  },
  countdownText: {
    color: '#EF4444',
    fontSize: 64,
    fontWeight: '900',
  },
  capturingLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  actionRow: {
    alignItems: 'center',
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterBtnInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EF4444',
  },
});

const galleryStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '30%',
    height: 94,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(37,99,235,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmoji: {
    color: 'white',
    fontWeight: '900',
    fontSize: 20,
  },
});

const infoCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  editingCard: {
    borderColor: '#93C5FD',
    backgroundColor: '#FDFEFF',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F8FAFC',
    paddingTop: 14,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowEmoji: {
    fontSize: 14,
    opacity: 0.8,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
    maxWidth: '55%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  genderSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  genderButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  genderText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  genderTextSelected: {
    color: '#2563EB',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
});

const settingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 14,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  desc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  arrow: {
    fontSize: 10,
    color: '#94A3B8',
  },
});

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  textGroup: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  desc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
});

const logoutStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
});
