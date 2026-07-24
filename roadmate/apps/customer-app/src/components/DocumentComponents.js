import React, { useState, useEffect } from 'react';
import { getDocumentStatus } from '../utils/expiryUtils';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Local icon imports
const docIcons = {
  puc: require('../../assets/document_images/puc_book.jpg'),
  rc: require('../../assets/document_images/rc_book.jpg'),
  'driving-license': require('../../assets/document_images/driving_license.jpg'),
  insurance: require('../../assets/document_images/insurance.jpg'),
  fitness: require('../../assets/document_images/rc_book.jpg'),
  permit: require('../../assets/document_images/driving_license.jpg'),
  pollution: require('../../assets/document_images/puc_book.jpg'),
  tax: require('../../assets/document_images/insurance.jpg'),
};

const docNames = {
  puc: 'PUC Certificate',
  rc: 'RC Book',
  'driving-license': 'Driving License',
  insurance: 'Insurance Policy',
  fitness: 'Fitness Certificate',
  permit: 'Permit Certificate',
  pollution: 'Pollution Certificate',
  tax: 'Tax Receipt',
};

// ── STATUS BADGE ──
export const StatusBadge = React.memo(function StatusBadge({ expiry }) {
  const statusInfo = getDocumentStatus(expiry);

  return (
    <View style={[styles.badgeContainer, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border }]}>
      <View style={[styles.badgeDot, { backgroundColor: statusInfo.color }]} />
      <Text style={[styles.badgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
    </View>
  );
});

// ── SEARCH BAR ──
export const SearchBar = React.memo(function SearchBar({ value, onChangeText, selectedFilter, onSelectFilter }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'valid', label: 'Valid 🟢' },
    { key: 'soon', label: 'Expires Soon 🟠' },
    { key: 'expired', label: 'Expired 🔴' },
  ];

  return (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Vehicle, Document or Reg No..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersScrollContent}
      >
        {filters.map((f) => {
          const isActive = selectedFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => onSelectFilter(f.key)}
              style={[
                styles.filterTab,
                isActive ? styles.filterTabActive : null
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterTabText,
                isActive ? styles.filterTabTextActive : null
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

// ── REMINDER BANNER ──
export const ReminderBanner = React.memo(function ReminderBanner({ reminders = [], onAction }) {
  if (reminders.length === 0) return null;

  return (
    <View style={styles.reminderContainer}>
      <Text style={styles.reminderHeader}>🔔 Document Alerts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reminderScrollContent}
        snapToInterval={width - 40}
        decelerationRate="fast"
      >
        {reminders.map((rem, idx) => {
          const isExpired = rem.status.toLowerCase().includes('expired');
          return (
            <View
              key={idx}
              style={[
                styles.reminderCard,
                isExpired ? styles.reminderExpiredCard : styles.reminderSoonCard
              ]}
            >
              <View style={styles.reminderIconWrapper}>
                <Text style={styles.reminderCardEmoji}>{isExpired ? '🚨' : '⚠️'}</Text>
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderCardTitle}>
                  {rem.label} {isExpired ? 'Expired' : 'Expires soon'}
                </Text>
                <Text style={styles.reminderCardDesc}>
                  {rem.vehicleName} · {rem.status}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.reminderActionBtn,
                  isExpired ? styles.reminderActionExpiredBtn : styles.reminderActionSoonBtn
                ]}
                onPress={() => onAction(rem.key, rem.vehicleId)}
                activeOpacity={0.7}
              >
                <Text style={styles.reminderActionText}>{isExpired ? 'Renew' : 'View'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

// ── DOCUMENT CARD ──
export const DocumentCard = React.memo(function DocumentCard({ doc, vehicleName, onOpen }) {
  const icon = docIcons[doc.key] || docIcons.rc;
  const docTitle = docNames[doc.key] || doc.label;
  const statusInfo = getDocumentStatus(doc.expiry);

  return (
    <TouchableOpacity
      style={styles.docCardContainer}
      onPress={() => onOpen(doc.key, doc.vehicleId)}
      activeOpacity={0.9}
    >
      <View style={styles.docCardHeader}>
        <View style={styles.docIconFrame}>
          <Image source={icon} style={styles.docCardIcon} resizeMode="cover" />
        </View>
        <StatusBadge expiry={doc.expiry} />
      </View>

      <View style={styles.docCardDetails}>
        <Text style={styles.docCardName} numberOfLines={1}>{docTitle}</Text>
        <Text style={styles.docCardVehicle} numberOfLines={1}>{vehicleName}</Text>

        <Text style={{ fontSize: 11, fontWeight: '750', color: statusInfo.color, marginTop: 4 }}>
          {statusInfo.subText}
        </Text>

        <View style={styles.docCardFooter}>
          <View>
            <Text style={styles.docDateLabel}>UPLOADED</Text>
            <Text style={styles.docDateValue}>{doc.uploadDate || '12 Jun 2025'}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.docDateLabel}>EXPIRY DATE</Text>
            <Text style={[styles.docDateValue, { color: statusInfo.color }]}>
              {doc.expiry}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.quickViewButton}
        onPress={() => onOpen(doc.key, doc.vehicleId)}
        activeOpacity={0.7}
      >
        <Text style={styles.quickViewText}>👁️ Quick View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

// ── UPLOAD DOCUMENT MODAL ──
export function UploadDocumentModal({ visible, onClose, vehicles = [], onAddDocument }) {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]?.id || '');
  const [selectedDocType, setSelectedDocType] = useState('puc');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadSource, setUploadSource] = useState(null); // 'camera' | 'gallery' | 'pdf' | null
  const [uploading, setUploading] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  // Scanner simulator states
  const [scanProgress, setScanProgress] = useState(0);

  const docTypes = [
    { key: 'rc', label: 'RC Book' },
    { key: 'insurance', label: 'Insurance Policy' },
    { key: 'driving-license', label: 'Driving License' },
    { key: 'puc', label: 'PUC Certificate' },
    { key: 'fitness', label: 'Fitness Certificate' },
    { key: 'permit', label: 'Permit Certificate' },
    { key: 'pollution', label: 'Pollution Certificate' },
    { key: 'tax', label: 'Tax Receipt' },
  ];

  // OCR Auto Fill Mock Data mapping
  const mockOCRData = {
    puc: {
      number: 'PUC/2026/MH19/88741',
      date: 'Feb 15, 2026',
      expiry: 'Feb 15, 2027',
      center: 'Express Emission Care, Jalgaon',
      authority: 'RTO Maharashtra'
    },
    insurance: {
      number: 'POL/INS/6678231',
      date: 'Jul 01, 2026',
      expiry: 'Jun 30, 2027',
      company: 'Royal Sundaram General Insurance',
      authority: 'IRDAI India'
    },
    rc: {
      number: 'RC/MH19/2025/1190',
      date: 'Mar 10, 2025',
      expiry: 'Mar 09, 2040',
      chassis: 'CHASSIS99812739182',
      authority: 'Ministry of Road Transport'
    },
    'driving-license': {
      number: 'DL-19202598371',
      date: 'Aug 14, 2025',
      expiry: 'Aug 13, 2045',
      class: 'MCWG, LMV',
      authority: 'MH-19 RTO Jalgaon'
    },
  };

  useEffect(() => {
    if (visible) {
      setSelectedVehicle(vehicles[0]?.id || '');
      setSelectedDocType('puc');
      setExpiryDate('');
      setUploadSource(null);
      setScannedData(null);
      setScanProgress(0);
    }
  }, [visible, vehicles]);

  // Simulate document scanner/capture countdown
  const startCameraScan = () => {
    setUploadSource('camera');
    setScanProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 34;
      if (current >= 100) {
        clearInterval(interval);
        setScanProgress(100);

        // Scan Success Fill
        const ocr = mockOCRData[selectedDocType] || {
          number: 'DOC/' + Math.floor(Math.random() * 900000 + 100000),
          date: 'Jul 19, 2026',
          expiry: 'Jul 19, 2027',
          authority: 'RTO Regional Authority'
        };
        setScannedData(ocr);
        setExpiryDate(ocr.expiry);
      } else {
        setScanProgress(current);
      }
    }, 800);
  };

  const handleGallerySelect = (imgName) => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadSource('selected');
      const ocr = mockOCRData[selectedDocType] || {
        number: 'DOC/' + Math.floor(Math.random() * 900000 + 100000),
        date: 'Jul 19, 2026',
        expiry: 'Jul 19, 2027',
        authority: 'Uploaded from Gallery'
      };
      setScannedData(ocr);
      setExpiryDate(ocr.expiry);
    }, 1000);
  };

  const handlePDFSelect = (pdfName) => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadSource('selected');
      const ocr = mockOCRData[selectedDocType] || {
        number: 'PDF/' + Math.floor(Math.random() * 900000 + 100000),
        date: 'Jul 19, 2026',
        expiry: 'Jul 19, 2027',
        authority: 'E-Document DigiLocker'
      };
      setScannedData(ocr);
      setExpiryDate(ocr.expiry);
    }, 1000);
  };

  const handleSave = () => {
    if (!selectedVehicle) {
      Alert.alert('Required', 'Please select a vehicle.');
      return;
    }
    if (!expiryDate) {
      Alert.alert('Required', 'Please enter or scan the Expiry Date.');
      return;
    }

    const docName = docNames[selectedDocType];
    const newDoc = {
      key: selectedDocType,
      label: docName,
      emoji: selectedDocType === 'puc' ? '🟢' : selectedDocType === 'rc' ? '🔵' : selectedDocType === 'driving-license' ? '🟣' : '🟡',
      status: 'Valid',
      expiry: expiryDate,
      uploadDate: 'Jul 19, 2026',
      verified: true,
      fields: [
        { l: 'Document Number', v: scannedData?.number || 'DOC/991273981' },
        { l: 'Authority', v: scannedData?.authority || 'Verified Portal' },
        { l: 'Issue Date', v: scannedData?.date || 'Jul 19, 2026' },
        { l: 'Expiry Date', v: expiryDate },
      ]
    };

    onAddDocument(selectedVehicle, selectedDocType, newDoc);
    Alert.alert('Success', `${docName} has been uploaded and verified successfully!`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Document</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
              <Text style={styles.closeModalText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Form Fields */}
            <Text style={styles.fieldHeading}>Select Vehicle</Text>
            <View style={styles.dropdownRow}>
              {vehicles.map((v) => {
                const isSelected = selectedVehicle === v.id;
                return (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => setSelectedVehicle(v.id)}
                    style={[styles.modalFilterTab, isSelected ? styles.modalFilterTabActive : null]}
                  >
                    <Text style={[styles.modalFilterTabText, isSelected ? styles.modalFilterTabTextActive : null]}>
                      {v.name} ({v.number})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldHeading}>Document Type</Text>
            <View style={styles.docTypeGrid}>
              {docTypes.map((type) => {
                const isSelected = selectedDocType === type.key;
                return (
                  <TouchableOpacity
                    key={type.key}
                    onPress={() => setSelectedDocType(type.key)}
                    style={[styles.docTypeBtn, isSelected ? styles.docTypeBtnActive : null]}
                  >
                    <Text style={[styles.docTypeBtnText, isSelected ? styles.docTypeBtnTextActive : null]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Simulated Select Sources */}
            {!uploadSource && !uploading && (
              <View style={styles.sourcePanel}>
                <Text style={styles.sourceHeading}>Choose Source File</Text>
                <View style={styles.sourceGrid}>
                  <TouchableOpacity style={styles.sourceBtn} onPress={startCameraScan} activeOpacity={0.8}>
                    <Text style={styles.sourceEmoji}>📷</Text>
                    <Text style={styles.sourceLabel}>Camera Scan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sourceBtn} onPress={() => handleGallerySelect('gallery_pick.png')} activeOpacity={0.8}>
                    <Text style={styles.sourceEmoji}>🖼️</Text>
                    <Text style={styles.sourceLabel}>Gallery Pick</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sourceBtn} onPress={() => handlePDFSelect('document_file.pdf')} activeOpacity={0.8}>
                    <Text style={styles.sourceEmoji}>📄</Text>
                    <Text style={styles.sourceLabel}>PDF Picker</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Camera Scanner Simulation */}
            {uploadSource === 'camera' && scanProgress < 100 && (
              <View style={styles.cameraBox}>
                <View style={styles.scanReticle} />
                <Text style={styles.cameraText}>Position Document inside the oval frame</Text>
                <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 10 }} />
                <Text style={styles.cameraProgress}>Scanning Document QR Code... {scanProgress}%</Text>
              </View>
            )}

            {/* Loading Spinner */}
            {uploading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Extracting document fields using OCR...</Text>
              </View>
            )}

            {/* Scanned/Uploaded Results */}
            {scannedData && (
              <View style={styles.successScanCard}>
                <Text style={styles.successScanHeading}>✅ Verified Scan Data</Text>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Extracted ID:</Text>
                  <Text style={styles.fieldVal}>{scannedData.number}</Text>
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Issue Date:</Text>
                  <Text style={styles.fieldVal}>{scannedData.date}</Text>
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Authority:</Text>
                  <Text style={styles.fieldVal}>{scannedData.authority}</Text>
                </View>

                <Text style={styles.fieldHeading}>Confirm Expiry Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="e.g. Dec 31, 2030"
                />

                <TouchableOpacity onPress={() => setUploadSource(null)} style={styles.rescanBtn}>
                  <Text style={styles.rescanBtnText}>Re-scan Document</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalFooterActions}>
            <TouchableOpacity onPress={onClose} style={[styles.modalActionBtn, styles.cancelModalBtn]}>
              <Text style={styles.cancelModalTextBtn}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.modalActionBtn, styles.saveModalBtn]} disabled={!scannedData}>
              <Text style={styles.saveModalTextBtn}>Save Document</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── STYLE SHEET ──
const styles = StyleSheet.create({
  // Status Badge
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },

  // Search Bar
  searchContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  filtersScroll: {
    marginTop: 10,
  },
  filtersScrollContent: {
    gap: 8,
    paddingRight: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  filterTabTextActive: {
    color: 'white',
  },

  // Reminder Banner
  reminderContainer: {
    marginBottom: 20,
  },
  reminderHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 2,
  },
  reminderScrollContent: {
    gap: 12,
  },
  reminderCard: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  reminderSoonCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  reminderExpiredCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  reminderIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderCardEmoji: {
    fontSize: 16,
  },
  reminderContent: {
    flex: 1,
  },
  reminderCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  reminderCardDesc: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  reminderActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  reminderActionSoonBtn: {
    backgroundColor: '#F59E0B',
  },
  reminderActionExpiredBtn: {
    backgroundColor: '#EF4444',
  },
  reminderActionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },

  // Document Card
  docCardContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  docCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  docIconFrame: {
    width: 44,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  docCardIcon: {
    width: '100%',
    height: '100%',
  },
  docCardDetails: {
    marginBottom: 12,
  },
  docCardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  docCardVehicle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  docCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  docDateLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  docDateValue: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '700',
    marginTop: 2,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  quickViewButton: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickViewText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },

  // Modal Overlay & Structure
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F9FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.9,
    minHeight: height * 0.75,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  closeModalBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '800',
  },
  modalScroll: {
    padding: 20,
  },
  fieldHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 10,
  },
  dropdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  modalFilterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
  },
  modalFilterTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  modalFilterTabText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  modalFilterTabTextActive: {
    color: 'white',
  },
  docTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  docTypeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
  },
  docTypeBtnActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#3B82F6',
  },
  docTypeBtnText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  docTypeBtnTextActive: {
    color: '#2563EB',
  },
  sourcePanel: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  sourceHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 14,
  },
  sourceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  sourceBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
  },
  sourceEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  sourceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },

  // Camera Simulator Box
  cameraBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 20,
  },
  scanReticle: {
    width: 140,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#22C55E',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  cameraText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
  cameraProgress: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
    marginTop: 6,
  },

  // Loading spinner
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 8,
  },

  // OCR Success
  successScanCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  successScanHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  fieldVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 6,
    backgroundColor: 'white',
  },
  rescanBtn: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  rescanBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },

  // Modal Footer
  modalFooterActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: 'white',
  },
  modalActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModalBtn: {
    backgroundColor: '#F3F4F6',
  },
  cancelModalTextBtn: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '700',
  },
  saveModalBtn: {
    backgroundColor: '#2563EB',
  },
  saveModalTextBtn: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
});
