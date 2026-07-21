import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Image, 
  Alert, 
  Modal, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { StatusBadge } from '../../components/DocumentComponents';

const { width, height } = Dimensions.get('window');

const docIcons = {
  puc: require('../../../assets/document_images/puc_book.jpg'),
  rc: require('../../../assets/document_images/rc_book.jpg'),
  'driving-license': require('../../../assets/document_images/driving_license.jpg'),
  insurance: require('../../../assets/document_images/insurance.jpg'),
  fitness: require('../../../assets/document_images/rc_book.jpg'),
  permit: require('../../../assets/document_images/driving_license.jpg'),
  pollution: require('../../../assets/document_images/puc_book.jpg'),
  tax: require('../../../assets/document_images/insurance.jpg'),
};

const docNames = {
  puc: 'PUC Certificate',
  rc: 'RC Book',
  insurance: 'Insurance Policy',
  fitness: 'Fitness Certificate',
  permit: 'Permit Certificate',
  pollution: 'Pollution Certificate',
  tax: 'Tax Receipt',
};

const docConfig = {
  puc: { emoji: '🍃', color: '#10B981', bg: '#ECFDF5', source: 'Parivahan Sewa' },
  rc: { emoji: '🪪', color: '#2563EB', bg: '#EFF6FF', source: 'DigiLocker' },
  insurance: { emoji: '🛡️', color: '#F59E0B', bg: '#FFFBEB', source: 'Insurance Bureau (IIB)' },
  fitness: { emoji: '🔴', color: '#EF4444', bg: '#FEF2F2', source: 'State Transport Office' },
  permit: { emoji: '🔵', color: '#2563EB', bg: '#EFF6FF', source: 'DigiLocker' },
  pollution: { emoji: '🍃', color: '#10B981', bg: '#ECFDF5', source: 'Parivahan Sewa' },
  tax: { emoji: '🟡', color: '#F59E0B', bg: '#FFFBEB', source: 'State Vahan Portal' },
};

export default function DocumentDetailScreen({ 
  docType, 
  vehicleId = '1', 
  documents = [], 
  onDeleteDocument, 
  onReplaceDocument, 
  onBack 
}) {
  const cfg = docConfig[docType] || docConfig.puc;
  const docTitle = docNames[docType] || 'Document';

  // Find dynamic details
  const detail = documents.find(d => d.key === docType && d.vehicleId === vehicleId);

  // States
  const [zoomVisible, setZoomVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Replace document states
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replaceSource, setReplaceSource] = useState(null); // 'camera' | 'gallery' | 'pdf'
  const [scanProgress, setScanProgress] = useState(0);
  const [replacing, setReplacing] = useState(false);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newScannedData, setNewScannedData] = useState(null);

  if (!detail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Document Not Found</Text>
        <Text style={styles.errorDesc}>This document has been removed or is not uploaded yet.</Text>
        <TouchableOpacity onPress={onBack} style={styles.errorBackBtn}>
          <Text style={styles.errorBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isExp = detail.status.toLowerCase().includes('expired');
  const isSoon = detail.status.toLowerCase().includes('soon');
  const docImage = docIcons[docType] || docIcons.rc;

  // Actions
  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      Alert.alert('Download Success', 'PDF document has been downloaded to your downloads folder.');
    }, 1200);
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      Alert.alert(
        'Share Document',
        'Choose platform to share verified document:',
        [
          { text: 'WhatsApp', onPress: () => Alert.alert('Shared', 'Document link shared via WhatsApp.') },
          { text: 'Email', onPress: () => Alert.alert('Shared', 'Document sent via Email.') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }, 500);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete your ${docTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDeleteDocument(vehicleId, docType);
            Alert.alert('Deleted', `${docTitle} has been deleted.`);
            onBack();
          } 
        }
      ]
    );
  };

  // Replace Document flows
  const triggerReplaceCamera = () => {
    setReplaceSource('camera');
    setScanProgress(0);
    let curr = 0;
    const interval = setInterval(() => {
      curr += 25;
      if (curr >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setNewScannedData({
          number: 'DOC/' + Math.floor(Math.random() * 900000 + 100000),
          date: 'Jul 19, 2026',
          expiry: 'Jul 19, 2027',
          authority: 'RTO Regional Authority (Replaced)'
        });
        setNewExpiryDate('Jul 19, 2027');
      } else {
        setScanProgress(curr);
      }
    }, 600);
  };

  const triggerReplaceGallery = () => {
    setReplacing(true);
    setTimeout(() => {
      setReplacing(false);
      setReplaceSource('selected');
      setNewScannedData({
        number: 'DOC/' + Math.floor(Math.random() * 900000 + 100000),
        date: 'Jul 19, 2026',
        expiry: 'Jul 19, 2028',
        authority: 'Gallery Upload'
      });
      setNewExpiryDate('Jul 19, 2028');
    }, 1000);
  };

  const triggerReplacePDF = () => {
    setReplacing(true);
    setTimeout(() => {
      setReplacing(false);
      setReplaceSource('selected');
      setNewScannedData({
        number: 'PDF/' + Math.floor(Math.random() * 900000 + 100000),
        date: 'Jul 19, 2026',
        expiry: 'Jul 19, 2029',
        authority: 'E-Portal Sync (PDF)'
      });
      setNewExpiryDate('Jul 19, 2029');
    }, 1000);
  };

  const saveReplacement = () => {
    if (!newExpiryDate) {
      Alert.alert('Required', 'Expiry Date is required.');
      return;
    }

    const updatedDoc = {
      ...detail,
      expiry: newExpiryDate,
      uploadDate: 'Jul 19, 2026',
      status: 'Valid',
      verified: true,
      fields: [
        { l: 'Document Number', v: newScannedData.number },
        { l: 'Authority', v: newScannedData.authority },
        { l: 'Issue Date', v: newScannedData.date },
        { l: 'Expiry Date', v: newExpiryDate },
        ...detail.fields.filter(f => f.l !== 'Document Number' && f.l !== 'Authority' && f.l !== 'Issue Date' && f.l !== 'Expiry Date')
      ]
    };

    onReplaceDocument(vehicleId, docType, updatedDoc);
    setReplaceModalOpen(false);
    setReplaceSource(null);
    setNewScannedData(null);
    Alert.alert('Success', `${docTitle} has been replaced successfully!`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cfg.color }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.docHeaderTitleRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>{cfg.emoji}</Text>
            </View>
            <Text style={styles.headerTitle}>{docTitle}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* Document Thumbnail Card (Tap to zoom) */}
        <TouchableOpacity 
          style={styles.imageCard} 
          onPress={() => setZoomVisible(true)}
          activeOpacity={0.9}
        >
          <Image source={docImage} style={styles.documentPreviewImage} resizeMode="cover" />
          <View style={styles.zoomIndicatorOverlay}>
            <Text style={styles.zoomEmoji}>🔍</Text>
            <Text style={styles.zoomLabel}>Tap to Expand Preview</Text>
          </View>
        </TouchableOpacity>

        {/* Status Alert Widget */}
        <View style={[
          styles.alertCard,
          { 
            backgroundColor: isExp ? '#FEF2F2' : isSoon ? '#FFFBEB' : '#F0FDF4',
            borderColor: isExp ? '#FECACA' : isSoon ? '#FDE68A' : '#BBF7D0'
          }
        ]}>
          <View style={[styles.alertDot, { backgroundColor: isExp ? '#EF4444' : isSoon ? '#F59E0B' : '#22C55E' }]} />
          <View style={styles.alertTextContent}>
            <Text style={[styles.alertLabel, { color: isExp ? '#EF4444' : isSoon ? '#D97706' : '#16A34A' }]}>
              {detail.status}
            </Text>
            <Text style={[styles.alertNote, { color: isExp ? '#EF4444' : isSoon ? '#D97706' : '#16A34A' }]}>
              {detail.note || `Valid until ${detail.expiry}`}
            </Text>
          </View>
        </View>

        {/* Document Details Key-Value Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>Document details</Text>
            <View style={[styles.expiryBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.expiryBadgeText, { color: cfg.color }]}>Exp: {detail.expiry}</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            {(() => {
              const fields = (detail.fields && detail.fields.length > 0) ? detail.fields : (
                docType === 'insurance' ? [
                  { l: 'Policy Provider', v: detail.provider || 'HDFC ERGO General Insurance' },
                  { l: 'Policy Number', v: detail.number },
                  { l: 'Coverage Type', v: detail.coverageType || 'Comprehensive Zero-Dep' },
                  { l: 'Expiry Date', v: detail.expiry },
                  { l: 'Status', v: detail.status || 'Active' }
                ] : docType === 'puc' ? [
                  { l: 'Certificate Number', v: detail.number },
                  { l: 'Issued Date', v: detail.issueDate || '2024-02-10' },
                  { l: 'Expiry Date', v: detail.expiry },
                  { l: 'Status', v: detail.status || 'Active' }
                ] : [
                  { l: 'Registration Number', v: detail.number },
                  { l: 'Vehicle Name', v: detail.vehicleName || 'Honda City' },
                  { l: 'Registration Date', v: detail.regDate || '2022-03-15' },
                  { l: 'Owner Name', v: detail.ownerName || 'Rushikesh Patil' },
                  { l: 'Status', v: detail.status || 'Active' }
                ]
              );
              return fields.map((f, i) => (
                <View key={i} style={[styles.fieldRow, i < fields.length - 1 ? styles.borderBottom : null]}>
                  <Text style={styles.fieldLabel}>{f.l}</Text>
                  <Text style={styles.fieldValue}>{f.v}</Text>
                </View>
              ));
            })()}
          </View>
        </View>

        {/* Verification Check Badge */}
        <View style={styles.verifiedBox}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.verifiedText}>Verified via {cfg.source}</Text>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Actions Panel ── */}
      <View style={styles.actionsPanel}>
        <View style={styles.buttonsRow}>
          {/* Download */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.downloadButton]} 
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <>
                <Text style={styles.actionEmoji}>📥</Text>
                <Text style={styles.downloadText}>Download</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.shareButton]} 
            onPress={handleShare}
            activeOpacity={0.7}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color="#16A34A" />
            ) : (
              <>
                <Text style={styles.actionEmoji}>✉️</Text>
                <Text style={styles.shareText}>Share</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Replace */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.replaceButton]} 
            onPress={() => setReplaceModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🔄</Text>
            <Text style={styles.replaceText}>Replace</Text>
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🗑️</Text>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.syncTimestampText}>
          Last synced · {detail.uploadDate || '25 Jun 2026'} via {cfg.source}
        </Text>
      </View>

      {/* ZOOM MODAL OVERLAY */}
      <Modal visible={zoomVisible} transparent animationType="fade">
        <View style={styles.zoomOverlay}>
          <TouchableOpacity style={styles.zoomCloseBtn} onPress={() => setZoomVisible(false)}>
            <Text style={styles.zoomCloseText}>✕ Close</Text>
          </TouchableOpacity>
          <Image source={docImage} style={styles.zoomedImage} resizeMode="contain" />
        </View>
      </Modal>

      {/* REPLACE DOCUMENT MODAL */}
      <Modal visible={replaceModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Replace {docTitle}</Text>
              <TouchableOpacity onPress={() => setReplaceModalOpen(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalHeadingText}>Select a new source document to scan/upload:</Text>

              {/* Source pickers */}
              {!replaceSource && !replacing && (
                <View style={styles.sourceGrid}>
                  <TouchableOpacity style={styles.sourceBtn} onPress={triggerReplaceCamera} activeOpacity={0.8}>
                    <Text style={styles.sourceEmoji}>📷</Text>
                    <Text style={styles.sourceLabel}>Camera Scan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sourceBtn} onPress={triggerReplaceGallery} activeOpacity={0.8}>
                    <Text style={styles.sourceEmoji}>🖼️</Text>
                    <Text style={styles.sourceLabel}>Gallery Picker</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sourceBtn} onPress={triggerReplacePDF} activeOpacity={0.8}>
                    <Text style={styles.sourceEmoji}>📄</Text>
                    <Text style={styles.sourceLabel}>PDF Document</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Camera Scanner Simulation */}
              {replaceSource === 'camera' && scanProgress < 100 && (
                <View style={styles.cameraBox}>
                  <View style={styles.scanReticle} />
                  <Text style={styles.cameraText}>Align Document layout in frame</Text>
                  <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 10 }} />
                  <Text style={styles.cameraProgress}>Scanning Document... {scanProgress}%</Text>
                </View>
              )}

              {/* Loader */}
              {replacing && (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text style={styles.loadingText}>Verifying OCR metadata...</Text>
                </View>
              )}

              {/* Scanned/Uploaded Results */}
              {newScannedData && (
                <View style={styles.successScanCard}>
                  <Text style={styles.successScanHeading}>✅ Verified Scan Data</Text>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Extracted ID:</Text>
                    <Text style={styles.fieldVal}>{newScannedData.number}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Issue Date:</Text>
                    <Text style={styles.fieldVal}>{newScannedData.date}</Text>
                  </View>
                  <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Authority:</Text>
                    <Text style={styles.fieldVal}>{newScannedData.authority}</Text>
                  </View>

                  <Text style={styles.modalHeadingText}>Confirm Expiry Date</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newExpiryDate}
                    onChangeText={setNewExpiryDate}
                    placeholder="e.g. Dec 31, 2030"
                  />
                  
                  <TouchableOpacity onPress={() => setReplaceSource(null)} style={styles.rescanBtn}>
                    <Text style={styles.rescanBtnText}>Re-scan Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <TouchableOpacity onPress={() => setReplaceModalOpen(false)} style={[styles.modalActionBtn, styles.cancelModalBtn]}>
                <Text style={styles.cancelModalTextBtn}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveReplacement} style={[styles.modalActionBtn, styles.saveModalBtn]} disabled={!newScannedData}>
                <Text style={styles.saveModalTextBtn}>Confirm Replace</Text>
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
    paddingTop: 54,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  docHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // Document image card
  imageCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  documentPreviewImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  zoomIndicatorOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  zoomEmoji: {
    fontSize: 14,
  },
  zoomLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },

  // Zoom Modal
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  zoomCloseText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },
  zoomedImage: {
    width: width * 0.9,
    height: height * 0.7,
  },

  // Alert widget
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertTextContent: {
    flex: 1,
  },
  alertLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  alertNote: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // Key-value Details
  detailsCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expiryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  expiryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  fieldsContainer: {
    paddingHorizontal: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 8,
  },
  fieldValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
    textAlign: 'right',
    maxWidth: '65%',
    flexShrink: 1,
  },

  // Verification log
  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  checkIcon: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 14,
  },
  verifiedText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
  },

  // Actions footer
  actionsPanel: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
    height: 60,
  },
  actionEmoji: {
    fontSize: 16,
  },
  downloadButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  downloadText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '800',
  },
  shareButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  shareText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: '800',
  },
  replaceButton: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  replaceText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
  },
  syncTimestampText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Missing error view
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBackBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  errorBackBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },

  // Modal styling (Replace modal)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F9FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.8,
    minHeight: height * 0.6,
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
    fontSize: 15,
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
  modalHeadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  sourceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  sourceBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 16,
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
