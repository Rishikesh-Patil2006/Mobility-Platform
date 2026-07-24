import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, FlatList, Modal, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { calculateExpiryStatus } from '../utils/vehicleHubUtils';

const { width } = Dimensions.get('window');

// ── 1. PROGRESS STEPPER ──
export function ProgressStepper({ currentStep = 1 }) {
  const steps = ['Details', 'Images', 'Documents', 'Confirm'];

  return (
    <View style={stepperStyles.container}>
      <View style={stepperStyles.stepperRow}>
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <React.Fragment key={step}>
              {/* Connector line */}
              {idx > 0 && (
                <View 
                  style={[
                    stepperStyles.connector, 
                    currentStep >= stepNum ? stepperStyles.connectorActive : null
                  ]} 
                />
              )}

              {/* Step circle */}
              <View style={stepperStyles.stepItem}>
                <View 
                  style={[
                    stepperStyles.circle,
                    isActive ? stepperStyles.circleActive : null,
                    isCompleted ? stepperStyles.circleCompleted : null
                  ]}
                >
                  {isCompleted ? (
                    <Text style={stepperStyles.circleText}>✓</Text>
                  ) : (
                    <Text style={[stepperStyles.circleText, isActive ? stepperStyles.circleTextActive : null]}>
                      {stepNum}
                    </Text>
                  )}
                </View>
                <Text 
                  style={[
                    stepperStyles.label, 
                    isActive ? stepperStyles.labelActive : null,
                    isCompleted ? stepperStyles.labelCompleted : null
                  ]}
                >
                  {step}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 2,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  circleActive: {
    borderColor: '#2563EB',
    backgroundColor: 'white',
  },
  circleCompleted: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  circleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  circleTextActive: {
    color: '#2563EB',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  labelActive: {
    color: '#1E293B',
    fontWeight: '700',
  },
  labelCompleted: {
    color: '#2563EB',
  },
  connector: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
    marginTop: -16,
    marginHorizontal: -12,
    zIndex: 1,
  },
  connectorActive: {
    backgroundColor: '#93C5FD',
  },
});


// ── 2. SEARCHABLE BRAND DROPDOWN ──
const BRAND_OPTIONS = [
  'Honda', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Mahindra', 
  'Toyota', 'Kia', 'MG', 'BYD', 'Hero', 'Honda Motorcycle', 
  'TVS', 'Royal Enfield', 'Bajaj', 'Yamaha', 'Suzuki', 'Other'
];

export function BrandDropdown({ selectedValue, onValueChange }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return BRAND_OPTIONS;
    return BRAND_OPTIONS.filter(b => b.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <View style={dropdownStyles.container}>
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        style={dropdownStyles.trigger}
        activeOpacity={0.7}
      >
        <Text style={[dropdownStyles.triggerValue, !selectedValue ? dropdownStyles.placeholder : null]}>
          {selectedValue || 'Select Vehicle Brand'}
        </Text>
        <Text style={dropdownStyles.chevron}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={dropdownStyles.dropdownCard}>
          <TextInput
            style={dropdownStyles.searchInput}
            placeholder="Search brand (e.g. Honda, Tata)..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filteredBrands}
            keyExtractor={(item) => item}
            style={dropdownStyles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onValueChange(item);
                  setIsOpen(false);
                  setSearch('');
                }}
                style={[
                  dropdownStyles.item,
                  selectedValue === item ? dropdownStyles.itemSelected : null
                ]}
              >
                <Text style={[
                  dropdownStyles.itemText,
                  selectedValue === item ? dropdownStyles.itemTextSelected : null
                ]}>
                  {item}
                </Text>
                {selectedValue === item && <Text style={dropdownStyles.checkmark}>✓</Text>}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={dropdownStyles.empty}>
                <Text style={dropdownStyles.emptyText}>No matching brands</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const dropdownStyles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  triggerValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  placeholder: {
    color: '#94A3B8',
  },
  chevron: {
    fontSize: 11,
    color: '#64748B',
  },
  dropdownCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginTop: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    maxHeight: 250,
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 8,
  },
  list: {
    maxHeight: 180,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  itemSelected: {
    backgroundColor: '#EFF6FF',
  },
  itemText: {
    fontSize: 14,
    color: '#334155',
  },
  itemTextSelected: {
    color: '#2563EB',
    fontWeight: '700',
  },
  checkmark: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 12,
  },
  empty: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});


// ── 3. IMAGE UPLOAD & SIMULATION ──
const MOCK_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=60',
];

const MOCK_CAMERA_SUBJECTS = [
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=60',
];

export function ImageUploader({ images = [], onChange }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleAddFromGallery = (url) => {
    if (images.includes(url)) return;
    onChange([...images, url]);
  };

  const handleRemove = (url) => {
    onChange(images.filter(img => img !== url));
  };

  const handleMakeCover = (url) => {
    const remaining = images.filter(img => img !== url);
    onChange([url, ...remaining]);
  };

  const startCameraCapture = () => {
    setCountdown(3);
    setCapturing(true);
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer === 0) {
        clearInterval(interval);
        const randomSubject = MOCK_CAMERA_SUBJECTS[Math.floor(Math.random() * MOCK_CAMERA_SUBJECTS.length)];
        onChange([...images, randomSubject]);
        setCapturing(false);
        setCameraOpen(false);
      }
    }, 800);
  };

  return (
    <View style={uploadStyles.container}>
      <Text style={uploadStyles.label}>Vehicle Images</Text>
      
      <View style={uploadStyles.triggerRow}>
        <TouchableOpacity 
          onPress={() => setCameraOpen(true)}
          style={uploadStyles.triggerBtn}
          activeOpacity={0.7}
        >
          <Text style={uploadStyles.triggerBtnIcon}>📷</Text>
          <Text style={uploadStyles.triggerBtnText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setGalleryOpen(true)}
          style={[uploadStyles.triggerBtn, uploadStyles.triggerBtnOutline]}
          activeOpacity={0.7}
        >
          <Text style={uploadStyles.triggerBtnIconOutline}>🖼️</Text>
          <Text style={uploadStyles.triggerBtnTextOutline}>Gallery</Text>
        </TouchableOpacity>
      </View>

      {images.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={uploadStyles.listContainer}>
          {images.map((img, index) => {
            const isCover = index === 0;
            return (
              <View key={img} style={uploadStyles.thumbnailBox}>
                <Image source={{ uri: img }} style={uploadStyles.thumbnail} />
                
                {isCover && (
                  <View style={uploadStyles.coverBadge}>
                    <Text style={uploadStyles.coverBadgeText}>Cover</Text>
                  </View>
                )}

                {!isCover && (
                  <TouchableOpacity 
                    onPress={() => handleMakeCover(img)}
                    style={uploadStyles.makeCoverBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={uploadStyles.makeCoverBtnText}>Make Cover</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  onPress={() => handleRemove(img)}
                  style={uploadStyles.removeBtn}
                  activeOpacity={0.8}
                >
                  <Text style={uploadStyles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={uploadStyles.emptyBox}>
          <Text style={uploadStyles.emptyEmoji}>📸</Text>
          <Text style={uploadStyles.emptyText}>No images uploaded yet</Text>
          <Text style={uploadStyles.emptySub}>Add photos to make your vehicle card premium</Text>
        </View>
      )}

      {/* CAMERA MODAL SIMULATION */}
      <Modal visible={cameraOpen} transparent animationType="slide">
        <View style={cameraStyles.overlay}>
          <View style={cameraStyles.container}>
            <View style={cameraStyles.header}>
              <Text style={cameraStyles.headerTitle}>Live Camera</Text>
              <TouchableOpacity onPress={() => setCameraOpen(false)} style={cameraStyles.closeBtn}>
                <Text style={cameraStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={cameraStyles.viewport}>
              {capturing ? (
                <View style={cameraStyles.capturingOverlay}>
                  <Text style={cameraStyles.countdownText}>{countdown}</Text>
                  <Text style={cameraStyles.capturingLabel}>Capturing vehicle details...</Text>
                </View>
              ) : (
                <View style={cameraStyles.viewportContent}>
                  <View style={cameraStyles.reticle} />
                  <Text style={cameraStyles.viewportInstruction}>Align vehicle inside grid</Text>
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

      {/* GALLERY MODAL SIMULATION */}
      <Modal visible={galleryOpen} transparent animationType="slide">
        <View style={galleryStyles.overlay}>
          <View style={galleryStyles.container}>
            <View style={galleryStyles.header}>
              <Text style={galleryStyles.headerTitle}>Select Photos</Text>
              <TouchableOpacity onPress={() => setGalleryOpen(false)} style={galleryStyles.closeBtn}>
                <Text style={galleryStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={galleryStyles.grid} showsVerticalScrollIndicator={false}>
              {MOCK_GALLERY_IMAGES.map((url) => {
                const isSelected = images.includes(url);
                return (
                  <TouchableOpacity
                    key={url}
                    onPress={() => handleAddFromGallery(url)}
                    style={galleryStyles.gridItem}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: url }} style={galleryStyles.gridImage} />
                    {isSelected && (
                      <View style={galleryStyles.selectedOverlay}>
                        <Text style={galleryStyles.checkEmoji}>✓ Selected</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <TouchableOpacity 
              onPress={() => setGalleryOpen(false)}
              style={galleryStyles.doneBtn}
            >
              <Text style={galleryStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const uploadStyles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  triggerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  triggerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    gap: 8,
  },
  triggerBtnOutline: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  triggerBtnIcon: {
    fontSize: 16,
  },
  triggerBtnIconOutline: {
    fontSize: 16,
  },
  triggerBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  triggerBtnTextOutline: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  thumbnailBox: {
    width: 100,
    height: 100,
    borderRadius: 14,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  makeCoverBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  makeCoverBtnText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '700',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  emptySub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
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
    height: 250,
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
    width: 120,
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'white',
    opacity: 0.5,
    borderRadius: 60,
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
    maxHeight: '80%',
    paddingBottom: 24,
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
    padding: 10,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
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
    backgroundColor: 'rgba(37,99,235,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkEmoji: {
    color: 'white',
    fontWeight: '800',
    fontSize: 13,
  },
  doneBtn: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  doneBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});


// ── 4. COLOR-CODED ALERT BADGES ──
export function VehicleAlertBadge({ docName, expiryDateStr, onPress }) {
  if (!expiryDateStr || expiryDateStr === 'Lifetime') return null;

  const getStatusDetails = () => {
    const cleanDateStr = expiryDateStr.replace(/,/g, '');
    const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const parts = cleanDateStr.split(' ');
    
    let diffDays = 15;

    if (parts.length >= 3) {
      const monthIndex = months[parts[0]];
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (monthIndex !== undefined && !isNaN(day) && !isNaN(year)) {
        const expiryDate = new Date(year, monthIndex, day);
        const today = new Date();
        expiryDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffTime = expiryDate.getTime() - today.getTime();
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    if (diffDays < 0) {
      return {
        label: `⚠ ${docName} Expired`,
        color: '#EF4444',
        bg: '#FEF2F2',
        border: '#FECACA'
      };
    }
    if (diffDays === 0) {
      return {
        label: `⚠ ${docName} expires today`,
        color: '#EF4444',
        bg: '#FEF2F2',
        border: '#FECACA'
      };
    }
    if (diffDays === 1) {
      return {
        label: `⚠ ${docName} expires tomorrow`,
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A'
      };
    }
    if (diffDays <= 7) {
      return {
        label: `⚠ ${docName} expires next week`,
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A'
      };
    }
    if (diffDays <= 15) {
      return {
        label: `⚠ ${docName} expires in ${diffDays} days`,
        color: '#D97706',
        bg: '#FFFBEB',
        border: '#FDE68A'
      };
    }
    return {
      label: `✓ ${docName} Valid`,
      color: '#16A34A',
      bg: '#F0FDF4',
      border: '#BBF7D0'
    };
  };

  const status = getStatusDetails();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        badgeStyles.badge, 
        { backgroundColor: status.bg, borderColor: status.border }
      ]}
      activeOpacity={0.7}
    >
      <Text style={[badgeStyles.text, { color: status.color }]}>{status.label}</Text>
    </TouchableOpacity>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  text: {
    fontSize: 9.5,
    fontWeight: '700',
  },
});


// ── 5. PREMIUM VEHICLE CARD ──
const docsByVehicleId = {
  '1': [
    { key: 'puc', label: 'PUC', expiry: 'Dec 31, 2025' },
    { key: 'rc', label: 'RC Book', expiry: 'Lifetime' },
    { key: 'driving-license', label: 'Driving License', expiry: 'Sep 11, 2040' },
    { key: 'insurance', label: 'Insurance', expiry: 'Jun 25, 2026' },
  ],
  '2': [
    { key: 'puc', label: 'PUC', expiry: 'Jan 10, 2025' },
    { key: 'rc', label: 'RC Book', expiry: 'Lifetime' },
    { key: 'driving-license', label: 'Driving License', expiry: 'Sep 11, 2040' },
    { key: 'insurance', label: 'Insurance', expiry: 'Nov 30, 2026' },
  ],
  '3': [
    { key: 'puc', label: 'PUC', expiry: 'Feb 28, 2026' },
    { key: 'rc', label: 'RC Book', expiry: 'Lifetime' },
    { key: 'driving-license', label: 'Driving License', expiry: 'Sep 11, 2040' },
    { key: 'insurance', label: 'Insurance', expiry: 'Mar 15, 2027' },
  ],
};

export function PremiumVehicleCard({ vehicle, onPress, onOpenDoc }) {
  const coverImage = vehicle.images && vehicle.images.length > 0
    ? { uri: vehicle.images[0] }
    : vehicle.image
      ? (typeof vehicle.image === 'string' ? { uri: vehicle.image } : vehicle.image)
      : require('../../assets/vehicle_placeholder.png');

  const docAlerts = docsByVehicleId[vehicle.id] || [
    { key: 'puc', label: 'PUC', expiry: vehicle.pucExpiry || 'Dec 31, 2026' },
    { key: 'rc', label: 'RC Book', expiry: vehicle.rcExpiry || 'Lifetime' },
    { key: 'driving-license', label: 'Driving License', expiry: vehicle.dlExpiry || 'Sep 11, 2040' },
    { key: 'insurance', label: 'Insurance', expiry: vehicle.insuranceExpiry || 'Jun 25, 2026' },
  ];

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={cardStyles.card}
      activeOpacity={0.9}
    >
      <View style={cardStyles.mediaContainer}>
        <Image source={coverImage} style={cardStyles.cover} resizeMode="cover" />
        <View style={cardStyles.statusTag}>
          <Text style={cardStyles.statusTagText}>● {vehicle.status || 'Active'}</Text>
        </View>
      </View>

      <View style={cardStyles.infoBlock}>
        <View style={cardStyles.nameRow}>
          <Text style={cardStyles.name}>{vehicle.name}</Text>
          <Text style={cardStyles.year}>{vehicle.year || '2022'}</Text>
        </View>
        <Text style={cardStyles.number}>{vehicle.number}</Text>

        <View style={cardStyles.specsGrid}>
          <View style={cardStyles.specBadge}>
            <Text style={cardStyles.specLabel}>Brand</Text>
            <Text style={cardStyles.specVal}>{vehicle.brand}</Text>
          </View>
          <View style={cardStyles.specBadge}>
            <Text style={cardStyles.specLabel}>Model</Text>
            <Text style={cardStyles.specVal}>{vehicle.model}</Text>
          </View>
          <View style={cardStyles.specBadge}>
            <Text style={cardStyles.specLabel}>Fuel</Text>
            <Text style={cardStyles.specVal}>{vehicle.fuel}</Text>
          </View>
        </View>

        <View style={cardStyles.alertsContainer}>
          {docAlerts.map((alert) => (
            <VehicleAlertBadge
              key={alert.key}
              docName={alert.label}
              expiryDateStr={alert.expiry}
              onPress={() => onOpenDoc(alert.key, vehicle.id)}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  mediaContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  statusTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#10B981',
  },
  infoBlock: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  year: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  number: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  specsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  specBadge: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#EFF2F5',
  },
  specLabel: {
    fontSize: 9.5,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  specVal: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
    marginTop: 2,
  },
  alertsContainer: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 4,
    gap: 2,
  },
});


// ── 6. VEHICLE IMAGE CAROUSEL ──
export function VehicleImageCarousel({ images = [] }) {
  const [active, setActive] = useState(0);

  const listImages = images.length > 0 
    ? images.map(img => typeof img === 'string' ? { uri: img } : img)
    : [require('../../assets/vehicle_placeholder.png')];

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== active) {
      setActive(slide);
    }
  };

  return (
    <View style={carouselStyles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={carouselStyles.scroll}
      >
        {listImages.map((img, idx) => (
          <Image key={idx} source={img} style={carouselStyles.image} resizeMode="cover" />
        ))}
      </ScrollView>

      {listImages.length > 1 && (
        <View style={carouselStyles.pagination}>
          {listImages.map((_, idx) => (
            <View 
              key={idx} 
              style={[
                carouselStyles.dot,
                active === idx ? carouselStyles.dotActive : null
              ]} 
            />
          ))}
        </View>
      )}
    </View>
  );
}

const carouselStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  scroll: {
    width: width,
    height: '100%',
  },
  image: {
    width: width,
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    width: 14,
    backgroundColor: 'white',
  },
});


// ── REUSABLE VEHICLE MANAGEMENT FLOW COMPONENTS ──
import { getFuelBadgeColor, getVehicleCategory } from '../utils/vehicleUtils';

// ── 7. VEHICLE FILTER ──
export function VehicleFilter({ selectedOption, onSelectOption }) {
  const options = ['All Vehicles', '2 Wheeler', '4 Wheeler'];
  return (
    <View style={filterStyles.container}>
      {options.map((opt) => {
        const active = selectedOption === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelectOption(opt)}
            style={[filterStyles.pill, active ? filterStyles.pillActive : null]}
            activeOpacity={0.8}
          >
            <Text style={[filterStyles.pillText, active ? filterStyles.pillTextActive : null]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  pillActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  pillTextActive: {
    color: '#1E293B',
    fontWeight: '800',
  },
});

// ── 8. FUEL BADGE ──
export function FuelBadge({ fuelType }) {
  const colors = getFuelBadgeColor(fuelType);
  return (
    <View style={[fuelBadgeStyles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[fuelBadgeStyles.badgeText, { color: colors.text }]}>{fuelType}</Text>
    </View>
  );
}

// ── 9. VEHICLE BADGE ──
export function VehicleBadge({ type }) {
  const label = getVehicleCategory(type);
  const isFour = label === '4 Wheeler';
  return (
    <View style={[fuelBadgeStyles.badge, { backgroundColor: isFour ? '#EFF6FF' : '#F5F3FF', borderColor: isFour ? '#BFDBFE' : '#DDD6FE' }]}>
      <Text style={[fuelBadgeStyles.badgeText, { color: isFour ? '#2563EB' : '#7C3AED' }]}>{label}</Text>
    </View>
  );
}

const fuelBadgeStyles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

// ── 10. VEHICLE CARD ──
export function VehicleCard({ vehicle, onPress, children }) {
  if (!vehicle) return null;
  const isFour = getVehicleCategory(vehicle.type) === '4 Wheeler';

  return (
    <TouchableOpacity onPress={onPress} style={newCardStyles.container} activeOpacity={0.9}>
      <View style={newCardStyles.headerRow}>
        <View style={newCardStyles.titleBlock}>
          <Text style={newCardStyles.name} numberOfLines={1}>{vehicle.name}</Text>
          <Text style={newCardStyles.number}>{vehicle.number.toUpperCase()}</Text>
        </View>
        <View style={newCardStyles.badgeCol}>
          <FuelBadge fuelType={vehicle.fuel} />
        </View>
      </View>

      <View style={newCardStyles.bodyRow}>
        <Image 
          source={vehicle.images && vehicle.images.length > 0 ? { uri: vehicle.images[0] } : require('../../assets/vehicle_placeholder.png')} 
          style={newCardStyles.image} 
          resizeMode="cover"
        />
        <View style={newCardStyles.specCol}>
          <Text style={newCardStyles.specText}>Category: {isFour ? '🚗 4 Wheeler' : '🛵 2 Wheeler'}</Text>
          <Text style={newCardStyles.specText}>Status: {vehicle.status || 'Active'}</Text>
          {vehicle.transmission ? <Text style={newCardStyles.specText}>Transmission: {vehicle.transmission}</Text> : null}
        </View>
      </View>

      {children && <View style={newCardStyles.children}>{children}</View>}
    </TouchableOpacity>
  );
}

const newCardStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  titleBlock: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '850',
    color: '#1E293B',
  },
  number: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  badgeCol: {
    flexDirection: 'row',
    gap: 6,
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  specCol: {
    flex: 1,
    gap: 4,
  },
  specText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '650',
  },
  children: {
    marginTop: 10,
  },
});

// ── 11. VEHICLE DETAIL ROW ──
export function VehicleDetailRow({ label, value, isBold = false }) {
  return (
    <View style={rowStyles.container}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, isBold ? rowStyles.bold : null]}>{value || 'N/A'}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  value: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '750',
  },
  bold: {
    fontWeight: '850',
  },
});

// ── 12. VEHICLE SECTION ──
export function VehicleSection({ title, children }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '850',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
});

// ── 13. VEHICLE OVERVIEW CARD ──
export function VehicleOverviewCard({ vehicle }) {
  if (!vehicle) return null;
  const currentYear = new Date().getFullYear();
  const vehicleAge = vehicle.age || (vehicle.year ? `${currentYear - parseInt(vehicle.year)} Years` : 'N/A');
  return (
    <VehicleSection title="Vehicle Overview">
      <VehicleDetailRow label="Registration Number" value={vehicle.number.toUpperCase()} isBold />
      <VehicleDetailRow label="Manufacturer" value={vehicle.brandName || vehicle.brand} />
      <VehicleDetailRow label="Model" value={vehicle.model} />
      {vehicle.variant ? <VehicleDetailRow label="Variant" value={vehicle.variant} /> : null}
      <VehicleDetailRow label="Vehicle Category" value={getVehicleCategory(vehicle.type)} />
      <VehicleDetailRow label="Fuel Type" value={vehicle.fuel} />
      <VehicleDetailRow label="Color" value={vehicle.color || 'N/A'} />
      <VehicleDetailRow label="Manufacturing Year" value={vehicle.year} />
      <VehicleDetailRow label="Vehicle Age" value={vehicleAge} />
      <VehicleDetailRow label="Owner Name" value={vehicle.ownerName || 'Rushikesh Patil'} />
      {vehicle.regDate ? <VehicleDetailRow label="Registration Date" value={vehicle.regDate} /> : null}
    </VehicleSection>
  );
}

// ── 14. VEHICLE STATUS CARD ──
export function VehicleStatusCard({ status }) {
  if (!status) return null;

  const renderStatusItem = (label, val) => {
    const isOk = (val || '').toLowerCase() === 'active' || (val || '').toLowerCase() === 'valid';
    return (
      <View key={label} style={statusCardStyles.item}>
        <Text style={statusCardStyles.itemLabel}>{label}</Text>
        <View style={[statusCardStyles.badge, { backgroundColor: isOk ? '#ECFDF5' : '#FEF2F2', borderColor: isOk ? '#A7F3D0' : '#FECACA' }]}>
          <Text style={[statusCardStyles.badgeText, { color: isOk ? '#059669' : '#DC2626' }]}>
            {val || 'Expired'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <VehicleSection title="Vehicle Status Checks">
      <View style={statusCardStyles.grid}>
        {renderStatusItem('RC Status', status.rcStatus)}
        {renderStatusItem('Insurance', status.insuranceStatus)}
        {renderStatusItem('PUC Status', status.pucStatus)}
        {status.fitnessStatus ? renderStatusItem('Fitness', status.fitnessStatus) : null}
      </View>
    </VehicleSection>
  );
}

const statusCardStyles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

// ── 15. VEHICLE QUICK ACTION CARD ──
export function VehicleQuickActionCard({ label, emoji, color, bg, border, onPress }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[actionCardStyles.card, { backgroundColor: bg, borderColor: border }]}
      activeOpacity={0.8}
    >
      <Text style={actionCardStyles.emoji}>{emoji}</Text>
      <Text style={[actionCardStyles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const actionCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});

// ── 16. VEHICLE INFO LOADER ──
export function VehicleInfoLoader({ text = 'Fetching Vehicle Details...' }) {
  return (
    <View style={loaderStyles.container}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={loaderStyles.text}>{text}</Text>
    </View>
  );
}

const loaderStyles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    fontSize: 13,
    fontWeight: '750',
    color: '#64748B',
    textAlign: 'center',
  },
});

// ── 17. VEHICLE REVIEW CARD ──
export function VehicleReviewCard({ brand, model, number, type, fuel, customBrandName, customModel, customFuel, customYear, year, customTransmission, images, vahanData, variant, color }) {
  const displayBrand = brand === 'Other' ? customBrandName : brand;
  const displayModel = brand === 'Other' ? customModel : model;
  const displayFuel = brand === 'Other' ? customFuel : fuel;
  const displayYear = brand === 'Other' ? customYear : year;

  return (
    <View style={reviewStyles.container}>
      <Image 
        source={images.length > 0 ? { uri: images[0] } : require('../../assets/vehicle_placeholder.png')} 
        style={reviewStyles.image}
        resizeMode="cover"
      />
      
      <View style={reviewStyles.recap}>
        <Text style={reviewStyles.title}>Worksheet Specifications</Text>
        <VehicleDetailRow label="Vehicle Category" value={getVehicleCategory(type)} />
        <VehicleDetailRow label="Registration Number" value={number.toUpperCase()} isBold />
        <VehicleDetailRow label="Brand / Manufacturer" value={displayBrand} />
        <VehicleDetailRow label="Model" value={displayModel} />
        {variant ? <VehicleDetailRow label="Variant" value={variant} /> : null}
        <VehicleDetailRow label="Fuel Type" value={displayFuel} />
        {color ? <VehicleDetailRow label="Colour" value={color} /> : null}
        <VehicleDetailRow label="Manufacturing Year" value={displayYear} />
        {brand === 'Other' && customTransmission ? (
          <VehicleDetailRow label="Transmission" value={customTransmission} />
        ) : null}
      </View>

      {vahanData && (
        <View style={reviewStyles.vahanBox}>
          <Text style={reviewStyles.vahanTitle}>✓ Fetched VAHAN Information</Text>
          <VehicleDetailRow label="Registered Owner" value={vahanData.ownerName} />
          <VehicleDetailRow label="Registration Date" value={vahanData.regDate} />
          <VehicleDetailRow label="Engine Number" value={vahanData.engineNumber} />
          <VehicleDetailRow label="Chassis Number" value={vahanData.chassisNumber} />
          <VehicleDetailRow label="RC Status" value={vahanData.rcStatus} />
        </View>
      )}
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  container: {
    gap: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  recap: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 14,
  },
  title: {
    fontSize: 11,
    fontWeight: '850',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  vahanBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    padding: 14,
  },
  vahanTitle: {
    fontSize: 12,
    fontWeight: '850',
    color: '#16A34A',
    marginBottom: 8,
  },
});

// ── 18. VEHICLE FILTER DROPDOWN ──
export function VehicleFilterDropdown({ selectedOption, onSelectOption, vehicles = [], darkTheme = false }) {
  const [open, setOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null); // null | '2w' | '4w'

  const twoWheelers = (vehicles || []).filter(v => getVehicleCategory(v.type) === '2 Wheeler');
  const fourWheelers = (vehicles || []).filter(v => getVehicleCategory(v.type) === '4 Wheeler');

  useEffect(() => {
    if (selectedOption === '2 Wheelers' || selectedOption === 'All 2 Wheelers' || twoWheelers.some(v => v.id === selectedOption || v.number === selectedOption)) {
      setExpandedCat('2w');
    } else if (selectedOption === '4 Wheelers' || selectedOption === 'All 4 Wheelers' || fourWheelers.some(v => v.id === selectedOption || v.number === selectedOption)) {
      setExpandedCat('4w');
    }
  }, [selectedOption, vehicles]);

  let labelText = 'Filter';
  if (!selectedOption || selectedOption === 'All Vehicles') {
    labelText = 'All Vehicles';
  } else if (selectedOption === '2 Wheelers' || selectedOption === '2 Wheeler' || selectedOption === 'All 2 Wheelers') {
    labelText = '2 Wheelers';
  } else if (selectedOption === '4 Wheelers' || selectedOption === '4 Wheeler' || selectedOption === 'All 4 Wheelers') {
    labelText = '4 Wheelers';
  } else {
    const matchedV = (vehicles || []).find(v => v.id === selectedOption || v.number === selectedOption);
    labelText = matchedV ? (matchedV.number || matchedV.name) : selectedOption;
  }

  return (
    <View style={filterDropdownStyles.wrapper}>
      <TouchableOpacity 
        style={[
          filterDropdownStyles.trigger, 
          darkTheme ? filterDropdownStyles.triggerDark : filterDropdownStyles.triggerLight
        ]} 
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
      >
        <Text style={[
          filterDropdownStyles.triggerText, 
          darkTheme ? filterDropdownStyles.triggerTextDark : filterDropdownStyles.triggerTextLight
        ]}>
          {labelText} ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity 
          style={filterDropdownStyles.overlay} 
          activeOpacity={1} 
          onPress={() => setOpen(false)}
        >
          <View style={filterDropdownStyles.menu} onStartShouldSetResponder={() => true}>
            <Text style={filterDropdownStyles.titleHeader}>Select Vehicle Filter</Text>

            {/* 1. ALL VEHICLES OPTION */}
            <TouchableOpacity
              style={[filterDropdownStyles.item, (!selectedOption || selectedOption === 'All Vehicles') && filterDropdownStyles.itemSelected]}
              onPress={() => {
                onSelectOption('All Vehicles');
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[filterDropdownStyles.itemText, (!selectedOption || selectedOption === 'All Vehicles') && filterDropdownStyles.itemTextSelected]}>
                🚗 All Vehicles
              </Text>
              {(!selectedOption || selectedOption === 'All Vehicles') && <Text style={filterDropdownStyles.checkIcon}>✓</Text>}
            </TouchableOpacity>

            {/* 2. 2 WHEELERS EXPANDABLE CATEGORY */}
            <TouchableOpacity
              style={[
                filterDropdownStyles.groupHeaderClickable,
                (selectedOption === '2 Wheelers' || selectedOption === 'All 2 Wheelers' || twoWheelers.some(v => v.id === selectedOption)) && filterDropdownStyles.itemSelected
              ]}
              onPress={() => setExpandedCat(prev => (prev === '2w' ? null : '2w'))}
              activeOpacity={0.75}
            >
              <Text style={filterDropdownStyles.groupTitle}>🛵 2 WHEELERS</Text>
              <Text style={filterDropdownStyles.chevronIcon}>{expandedCat === '2w' ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedCat === '2w' && (
              <View style={filterDropdownStyles.subDropdownContainer}>
                <TouchableOpacity
                  style={[filterDropdownStyles.item, filterDropdownStyles.subItem, (selectedOption === '2 Wheelers' || selectedOption === 'All 2 Wheelers') && filterDropdownStyles.itemSelected]}
                  onPress={() => {
                    onSelectOption('2 Wheelers');
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[filterDropdownStyles.itemText, (selectedOption === '2 Wheelers' || selectedOption === 'All 2 Wheelers') && filterDropdownStyles.itemTextSelected]}>
                    • All 2 Wheelers
                  </Text>
                  {(selectedOption === '2 Wheelers' || selectedOption === 'All 2 Wheelers') && <Text style={filterDropdownStyles.checkIcon}>✓</Text>}
                </TouchableOpacity>

                {twoWheelers.map((v) => {
                  const isSelected = selectedOption === v.id || selectedOption === v.number;
                  return (
                    <TouchableOpacity
                      key={`2w-${v.id}`}
                      style={[filterDropdownStyles.item, filterDropdownStyles.indivItem, isSelected && filterDropdownStyles.itemSelected]}
                      onPress={() => {
                        onSelectOption(v.id);
                        setOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[filterDropdownStyles.indivNumber, isSelected && filterDropdownStyles.itemTextSelected]}>
                          {v.number || v.name}
                        </Text>
                        <Text style={filterDropdownStyles.indivName}>{v.name}</Text>
                      </View>
                      {isSelected && <Text style={filterDropdownStyles.checkIcon}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* 3. 4 WHEELERS EXPANDABLE CATEGORY */}
            <TouchableOpacity
              style={[
                filterDropdownStyles.groupHeaderClickable,
                (selectedOption === '4 Wheelers' || selectedOption === 'All 4 Wheelers' || fourWheelers.some(v => v.id === selectedOption)) && filterDropdownStyles.itemSelected
              ]}
              onPress={() => setExpandedCat(prev => (prev === '4w' ? null : '4w'))}
              activeOpacity={0.75}
            >
              <Text style={filterDropdownStyles.groupTitle}>🚙 4 WHEELERS</Text>
              <Text style={filterDropdownStyles.chevronIcon}>{expandedCat === '4w' ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedCat === '4w' && (
              <View style={filterDropdownStyles.subDropdownContainer}>
                <TouchableOpacity
                  style={[filterDropdownStyles.item, filterDropdownStyles.subItem, (selectedOption === '4 Wheelers' || selectedOption === 'All 4 Wheelers') && filterDropdownStyles.itemSelected]}
                  onPress={() => {
                    onSelectOption('4 Wheelers');
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[filterDropdownStyles.itemText, (selectedOption === '4 Wheelers' || selectedOption === 'All 4 Wheelers') && filterDropdownStyles.itemTextSelected]}>
                    • All 4 Wheelers
                  </Text>
                  {(selectedOption === '4 Wheelers' || selectedOption === 'All 4 Wheelers') && <Text style={filterDropdownStyles.checkIcon}>✓</Text>}
                </TouchableOpacity>

                {fourWheelers.map((v) => {
                  const isSelected = selectedOption === v.id || selectedOption === v.number;
                  return (
                    <TouchableOpacity
                      key={`4w-${v.id}`}
                      style={[filterDropdownStyles.item, filterDropdownStyles.indivItem, isSelected && filterDropdownStyles.itemSelected]}
                      onPress={() => {
                        onSelectOption(v.id);
                        setOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[filterDropdownStyles.indivNumber, isSelected && filterDropdownStyles.itemTextSelected]}>
                          {v.number || v.name}
                        </Text>
                        <Text style={filterDropdownStyles.indivName}>{v.name}</Text>
                      </View>
                      {isSelected && <Text style={filterDropdownStyles.checkIcon}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const filterDropdownStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  trigger: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 85,
  },
  triggerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  triggerDark: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  triggerText: {
    fontSize: 11,
    fontWeight: '800',
  },
  triggerTextLight: {
    color: 'white',
  },
  triggerTextDark: {
    color: '#475569',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menu: {
    width: 260,
    maxHeight: 480,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  titleHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 4,
  },
  groupHeader: {
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 10,
  },
  groupHeaderClickable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 2,
    backgroundColor: '#F8FAFC',
  },
  subDropdownContainer: {
    paddingLeft: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
    marginLeft: 10,
    marginBottom: 6,
    marginTop: 2,
  },
  chevronIcon: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  subItem: {
    paddingLeft: 16,
  },
  indivItem: {
    paddingLeft: 22,
  },
  itemSelected: {
    backgroundColor: '#EFF6FF',
  },
  itemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  indivNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  indivName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  itemTextSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },
  checkIcon: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

// ── 19. VEHICLE TRACKER CARD ──
export function VehicleTrackerCard({ title, subtitle, value, icon, onPress, color = '#2563EB', bg = '#EFF6FF', border = '#BFDBFE' }) {
  return (
    <TouchableOpacity 
      style={[trackerCardStyles.card, { backgroundColor: bg, borderColor: border }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={trackerCardStyles.header}>
        <Text style={trackerCardStyles.icon}>{icon}</Text>
        <Text style={[trackerCardStyles.badgeText, { color }]}>{value}</Text>
      </View>
      <Text style={trackerCardStyles.title}>{title}</Text>
      <Text style={trackerCardStyles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const trackerCardStyles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
});

// ── 20. VEHICLE TRACKER GRID ──
export function VehicleTrackerGrid({ children }) {
  return <View style={gridStyles.container}>{children}</View>;
}

const gridStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
});

// ── 21. VEHICLE VALUE CARD ──
export function VehicleValueCard({ value, age, date }) {
  return (
    <View style={valueCardStyles.card}>
      <Text style={valueCardStyles.label}>Estimated Market Value</Text>
      <Text style={valueCardStyles.val}>{value}</Text>
      <View style={valueCardStyles.metaRow}>
        <Text style={valueCardStyles.metaText}>Vehicle Age: {age} Years</Text>
        <Text style={valueCardStyles.metaText}>Updated: {date}</Text>
      </View>
    </View>
  );
}

const valueCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1E3FAA',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1E3FAA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  val: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '700',
  },
});

// ── 22. VEHICLE PRICE CARD ──
export function VehiclePriceCard({ lowestPrice, highestPrice }) {
  return (
    <View style={priceCardStyles.card}>
      <Text style={priceCardStyles.title}>Market Price Range</Text>
      <View style={priceCardStyles.row}>
        <View style={priceCardStyles.block}>
          <Text style={priceCardStyles.blockLabel}>Lowest Estimate</Text>
          <Text style={[priceCardStyles.blockValue, { color: '#EF4444' }]}>{lowestPrice}</Text>
        </View>
        <View style={priceCardStyles.divider} />
        <View style={priceCardStyles.block}>
          <Text style={priceCardStyles.blockLabel}>Highest Estimate</Text>
          <Text style={[priceCardStyles.blockValue, { color: '#22C55E' }]}>{highestPrice}</Text>
        </View>
      </View>
    </View>
  );
}

const priceCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: '850',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  block: {
    alignItems: 'center',
    flex: 1,
  },
  blockLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  blockValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
});

// ── 23. VEHICLE TREND CARD ──
export function VehicleTrendCard({ priceTrend = [] }) {
  return (
    <View style={trendCardStyles.card}>
      <Text style={trendCardStyles.title}>Value Depreciation Trend</Text>
      {priceTrend.length === 0 ? (
        <Text style={trendCardStyles.emptyText}>No historical price data.</Text>
      ) : (
        priceTrend.map((item, index) => (
          <View key={item.year} style={trendCardStyles.row}>
            <View style={trendCardStyles.timeline}>
              <View style={trendCardStyles.dot} />
              {index < priceTrend.length - 1 && <View style={trendCardStyles.line} />}
            </View>
            <View style={trendCardStyles.content}>
              <Text style={trendCardStyles.year}>{item.year}</Text>
              <Text style={trendCardStyles.value}>
                ₹{(item.value / 100000).toFixed(2)}L Est.
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const trendCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: '850',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    height: 48,
  },
  timeline: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  year: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
});

// ── 24. VEHICLE INFO SECTION ──
export function VehicleInfoSection({ vahanData }) {
  if (!vahanData) return null;
  return (
    <View style={infoSectionStyles.container}>
      <VehicleDetailRow label="RC Registration Status" value={vahanData.rcStatus || 'Active'} isBold />
      <VehicleDetailRow label="Registered Owner Name" value={vahanData.ownerName} />
      <VehicleDetailRow label="Registration Authority (RTO)" value={vahanData.registrationAuthority || 'Jalgaon RTO, MH'} />
      <VehicleDetailRow label="Registration Date" value={vahanData.regDate} />
      <VehicleDetailRow label="Engine Number" value={vahanData.engineNumber} />
      <VehicleDetailRow label="Chassis Number" value={vahanData.chassisNumber} />
      <VehicleDetailRow label="Vehicle Class" value={vahanData.vehicleClass || 'Motor Car (LMV)'} />
      <VehicleDetailRow label="Seating Capacity" value={vahanData.seatingCapacity || '5 Seats'} />
      <VehicleDetailRow label="Insurance Company" value={vahanData.insuranceCompany || 'Bajaj Allianz'} />
      <VehicleDetailRow label="PUC Policy Expiry" value={vahanData.pucExpiry || 'Dec 31, 2025'} />
    </View>
  );
}

const infoSectionStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginVertical: 8,
  },
});

// ── 25. VEHICLE SPECIFICATION CARD ──
export function VehicleSpecificationCard({ title, children }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <View style={specCardStyles.card}>
      <TouchableOpacity 
        style={specCardStyles.header} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={specCardStyles.title}>{title}</Text>
        <Text style={specCardStyles.toggle}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && <View style={specCardStyles.content}>{children}</View>}
    </View>
  );
}

const specCardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  toggle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
  },
  content: {
    padding: 14,
  },
});

// ── 26. CHALLAN CARD ──
export function ChallanCard({ violation, amount, status, date, location, onViewDetails, vehicleName, vehicleNumber }) {
  return (
    <View style={challanStyles.card}>
      <View style={challanStyles.header}>
        <Text style={challanStyles.violation} numberOfLines={1}>{violation}</Text>
        <PenaltyStatusChip status={status} />
      </View>
      
      {vehicleName ? (
        <Text style={{ fontSize: 11, color: '#2563EB', fontWeight: '700', marginBottom: 6 }}>
          🚗 {vehicleName} ({vehicleNumber})
        </Text>
      ) : null}

      <View style={challanStyles.detailsRow}>
        <Text style={challanStyles.metaText}>📅 {date}</Text>
        <Text style={challanStyles.amount}>₹{amount}</Text>
      </View>

      <Text style={challanStyles.location} numberOfLines={1}>📍 {location}</Text>
      
      <TouchableOpacity 
        style={challanStyles.btn} 
        onPress={onViewDetails}
        activeOpacity={0.7}
      >
        <Text style={challanStyles.btnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const challanStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  violation: {
    fontSize: 14,
    fontWeight: '850',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EF4444',
  },
  location: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
});

// ── 27. PENALTY STATUS CHIP ──
export function PenaltyStatusChip({ status }) {
  const isPaid = status === 'Paid';
  return (
    <View 
      style={[
        statusChipStyles.chip, 
        { 
          backgroundColor: isPaid ? '#EFF6FF' : '#FEF2F2',
          borderColor: isPaid ? '#BFDBFE' : '#FECACA'
        }
      ]}
    >
      <Text style={[statusChipStyles.text, { color: isPaid ? '#2563EB' : '#EF4444' }]}>
        {status}
      </Text>
    </View>
  );
}

const statusChipStyles = StyleSheet.create({
  chip: {
    paddingVertical: 3.5,
    paddingHorizontal: 8.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  text: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export { VehicleInfoSection as VehicleInformationCard };

export function VehicleDocumentCard({ document, onViewDetails, onRenew }) {
  if (!document) return null;

  const getDocIconAndColor = (type) => {
    switch (type) {
      case 'insurance':
        return {
          icon: '🛡️',
          label: 'Insurance',
          bg: '#EFF6FF',
          border: '#BFDBFE',
          color: '#2563EB'
        };
      case 'puc':
        return {
          icon: '🍃',
          label: 'PUC Certificate',
          bg: '#ECFDF5',
          border: '#A7F3D0',
          color: '#059669'
        };
      case 'rc':
      default:
        return {
          icon: '📄',
          label: 'RC Book',
          bg: '#F5F3FF',
          border: '#DDD6FE',
          color: '#7C3AED'
        };
    }
  };

  const info = getDocIconAndColor(document.key || document.type);
  const status = calculateExpiryStatus(document.expiry);

  let remainingDaysText = '';
  if (status.daysLeft < 0) {
    remainingDaysText = 'Expired';
  } else if (document.expiry === 'Lifetime' || document.expiry === 'Lifetime Validity') {
    remainingDaysText = 'Lifetime Validity';
  } else {
    remainingDaysText = `${status.daysLeft} days remaining`;
  }

  const handleRenew = () => {
    if (onRenew) {
      onRenew(document);
    } else {
      Alert.alert('Renew Document', `Redirecting to partner portal to renew your ${document.label || info.label}...`);
    }
  };

  return (
    <View style={docStyles.card}>
      <View style={docStyles.mainRow}>
        <View style={[docStyles.iconBox, { backgroundColor: info.bg, borderColor: info.border }]}>
          <Text style={{ fontSize: 20 }}>{info.icon}</Text>
        </View>
        <View style={docStyles.middleCol}>
          <Text style={docStyles.title}>{document.label || info.label}</Text>
          <Text style={docStyles.expiry}>Exp: {document.expiry}</Text>
          <Text style={[docStyles.remaining, status.daysLeft < 0 ? { color: '#EF4444' } : status.daysLeft <= 30 ? { color: '#D97706' } : null]}>
            {remainingDaysText}
          </Text>
        </View>
        <View style={[docStyles.statusChip, { backgroundColor: status.bg, borderColor: status.border }]}>
          <View style={[docStyles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[docStyles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={docStyles.btnRow}>
        <TouchableOpacity 
          onPress={() => onViewDetails && onViewDetails(document)}
          style={[docStyles.actionBtn, docStyles.viewBtn]}
          activeOpacity={0.7}
        >
          <Text style={docStyles.viewBtnText}>👁️ View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleRenew}
          style={[docStyles.actionBtn, docStyles.renewBtn]}
          activeOpacity={0.7}
        >
          <Text style={docStyles.renewBtnText}>🔄 Renew Document</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const docStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCol: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  expiry: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  remaining: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 2,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  renewBtn: {
    backgroundColor: '#2563EB',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  renewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
});

