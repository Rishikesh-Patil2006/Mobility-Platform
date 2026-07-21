// roadmate/apps/customer-app/src/screens/sub-screens/DrivingLicenseScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import {
  getLicenses, addLicense, updateLicense, deleteLicense
} from '../../services/drivingLicenseService';
import {
  DrivingLicenseCard, LicenseFilterBar, LicenseSearchBar,
  LicenseEmptyState, LicenseStatusChip, RelationshipChip
} from '../../components/DrivingLicenseComponents';
import { filterDrivingLicenses, formatLicenseDate, calculateLicenseExpiry } from '../../utils/licenseUtils';

const RELATIONSHIPS = ['Self', 'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Other'];
const LICENSE_TYPES = ['LMV', 'MC', 'HMV', 'TRANS', 'LMV-TR', 'MCWG', 'Other'];

export default function DrivingLicenseScreen({ onBack }) {
  const [loading, setLoading]           = useState(false);
  const [licenses, setLicenses]         = useState([]);
  const [filter, setFilter]             = useState('All Licenses');
  const [search, setSearch]             = useState('');

  // Modal states
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [detailOpen, setDetailOpen]     = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [submitting, setSubmitting]     = useState(false);

  // Form
  const [formHolder, setFormHolder]         = useState('');
  const [formRelationship, setFormRelationship] = useState('Self');
  const [formLicenseNo, setFormLicenseNo]   = useState('');
  const [formLicenseType, setFormLicenseType] = useState('LMV');
  const [formIssueDate, setFormIssueDate]   = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formDOB, setFormDOB]               = useState('');
  const [formAddress, setFormAddress]       = useState('');
  const [formNotes, setFormNotes]           = useState('');
  const [formVehicleClasses, setFormVehicleClasses] = useState('');

  const loadLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLicenses();
      setLicenses(data);
    } catch (e) {
      Alert.alert('Error', 'Could not load licenses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadLicenses(); }, [loadLicenses]);

  const displayedLicenses = filterDrivingLicenses(licenses, filter, search);

  // Summary counts
  const activeCount     = licenses.filter(l => calculateLicenseExpiry(l.expiryDate).status === 'Valid').length;
  const expiringCount   = licenses.filter(l => {
    const s = calculateLicenseExpiry(l.expiryDate).status;
    return s === 'Expiring Soon' || s === 'Expires Tomorrow';
  }).length;
  const expiredCount    = licenses.filter(l => calculateLicenseExpiry(l.expiryDate).status === 'Expired').length;

  const openAddModal = () => {
    setEditingId(null);
    setFormHolder(''); setFormRelationship('Self');
    setFormLicenseNo(''); setFormLicenseType('LMV');
    setFormIssueDate(''); setFormExpiryDate('');
    setFormDOB(''); setFormAddress(''); setFormNotes('');
    setFormVehicleClasses('MC, LMV');
    setModalOpen(true);
  };

  const openEditModal = (lic) => {
    setEditingId(lic.id);
    setFormHolder(lic.holderName);
    setFormRelationship(lic.relationship);
    setFormLicenseNo(lic.licenseNumber);
    setFormLicenseType(lic.licenseType);
    setFormIssueDate(lic.issueDate);
    setFormExpiryDate(lic.expiryDate);
    setFormDOB(lic.dob || '');
    setFormAddress(lic.address || '');
    setFormNotes(lic.notes || '');
    setFormVehicleClasses((lic.vehicleClasses || []).join(', '));
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formHolder || !formLicenseNo || !formExpiryDate) {
      Alert.alert('Missing Fields', 'Please fill Holder Name, License Number, and Expiry Date.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        holderName:     formHolder.trim(),
        relationship:   formRelationship,
        licenseNumber:  formLicenseNo.trim().toUpperCase(),
        licenseType:    formLicenseType,
        issueDate:      formIssueDate,
        expiryDate:     formExpiryDate,
        dob:            formDOB,
        address:        formAddress,
        notes:          formNotes,
        vehicleClasses: formVehicleClasses.split(',').map(s => s.trim()).filter(Boolean),
        photo:          null,
      };
      if (editingId) {
        await updateLicense(editingId, payload);
        Alert.alert('Updated', 'License has been updated.');
      } else {
        await addLicense(payload);
        Alert.alert('Added', 'License has been saved.');
      }
      setModalOpen(false);
      loadLicenses();
    } catch (e) {
      Alert.alert('Error', 'Could not save license.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete License', 'Remove this driving license?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await deleteLicense(id); loadLicenses(); }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.headerTitle}>Driving Licenses</Text>
            <Text style={styles.headerSub}>{licenses.length} license{licenses.length !== 1 ? 's' : ''} · Family</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Summary strip */}
      {licenses.length > 0 && (
        <View style={styles.summaryStrip}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{activeCount}</Text>
            <Text style={[styles.summaryLbl, { color: '#10B981' }]}>Active</Text>
          </View>
          <View style={[styles.summaryItem, styles.summaryBorder]}>
            <Text style={styles.summaryNum}>{expiringCount}</Text>
            <Text style={[styles.summaryLbl, { color: '#D97706' }]}>Expiring</Text>
          </View>
          <View style={[styles.summaryItem, styles.summaryBorder]}>
            <Text style={styles.summaryNum}>{expiredCount}</Text>
            <Text style={[styles.summaryLbl, { color: '#EF4444' }]}>Expired</Text>
          </View>
          <View style={[styles.summaryItem, styles.summaryBorder]}>
            <Text style={styles.summaryNum}>{licenses.length}</Text>
            <Text style={[styles.summaryLbl, { color: '#2563EB' }]}>Total</Text>
          </View>
        </View>
      )}

      {/* Filters + Search */}
      <View style={styles.filtersArea}>
        <LicenseFilterBar selected={filter} onSelect={setFilter} />
        <LicenseSearchBar value={search} onChangeText={setSearch} />
      </View>

      {/* List */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loaderText}>Loading licenses...</Text>
          </View>
        ) : displayedLicenses.length === 0 ? (
          <LicenseEmptyState filter={filter} />
        ) : (
          displayedLicenses.map(lic => (
            <DrivingLicenseCard
              key={lic.id}
              license={lic}
              onView={(l) => { setSelectedLicense(l); setDetailOpen(true); }}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

      {/* ── ADD / EDIT MODAL ── */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? '✏️ Edit License' : '🪪 Add License'}</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Relationship selector */}
              <Text style={styles.inputLabel}>Relationship</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={{ gap: 8 }}>
                {RELATIONSHIPS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.relPill, formRelationship === r && styles.relPillActive]}
                    onPress={() => setFormRelationship(r)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.relPillText, formRelationship === r && { color: '#FFF' }]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Holder Name *</Text>
              <TextInput style={styles.input} placeholder="e.g. Rushikesh Patil" placeholderTextColor="#94A3B8" value={formHolder} onChangeText={setFormHolder} />

              <Text style={styles.inputLabel}>License Number *</Text>
              <TextInput style={styles.input} placeholder="e.g. MH1920220012345" placeholderTextColor="#94A3B8" autoCapitalize="characters" value={formLicenseNo} onChangeText={setFormLicenseNo} />

              <Text style={styles.inputLabel}>License Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }} contentContainerStyle={{ gap: 8 }}>
                {LICENSE_TYPES.map(t => (
                  <TouchableOpacity key={t} style={[styles.typePill, formLicenseType === t && styles.typePillActive]} onPress={() => setFormLicenseType(t)} activeOpacity={0.8}>
                    <Text style={[styles.typePillText, formLicenseType === t && { color: '#FFF' }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Vehicle Classes (comma-separated)</Text>
              <TextInput style={styles.input} placeholder="e.g. MC, LMV" placeholderTextColor="#94A3B8" value={formVehicleClasses} onChangeText={setFormVehicleClasses} />

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Issue Date *</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" value={formIssueDate} onChangeText={setFormIssueDate} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Expiry Date *</Text>
                  <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" value={formExpiryDate} onChangeText={setFormExpiryDate} />
                </View>
              </View>

              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" value={formDOB} onChangeText={setFormDOB} />

              <Text style={styles.inputLabel}>Address</Text>
              <TextInput style={styles.input} placeholder="City, State - PIN" placeholderTextColor="#94A3B8" value={formAddress} onChangeText={setFormAddress} />

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput style={[styles.input, styles.inputMultiline]} placeholder="Any additional notes..." placeholderTextColor="#94A3B8" multiline numberOfLines={3} value={formNotes} onChangeText={setFormNotes} />

              <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting} activeOpacity={0.85}>
                {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>{editingId ? 'Save Changes' : 'Add License'}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      <Modal visible={detailOpen} transparent animationType="fade" onRequestClose={() => setDetailOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>License Details</Text>
              <TouchableOpacity onPress={() => setDetailOpen(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity>
            </View>
            {selectedLicense && (() => {
              const expiry = calculateLicenseExpiry(selectedLicense.expiryDate);
              const initials = (selectedLicense.holderName || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Avatar + name */}
                  <View style={styles.detailAvatarBlock}>
                    <View style={[styles.detailAvatar, { backgroundColor: expiry.bgColor }]}>
                      <Text style={[styles.detailAvatarText, { color: expiry.color }]}>{initials}</Text>
                    </View>
                    <Text style={styles.detailHolderName}>{selectedLicense.holderName}</Text>
                    <RelationshipChip relationship={selectedLicense.relationship} />
                    <View style={{ marginTop: 8 }}>
                      <LicenseStatusChip expiryDate={selectedLicense.expiryDate} />
                    </View>
                  </View>

                  {[
                    { l: 'License Number',  v: selectedLicense.licenseNumber },
                    { l: 'License Type',    v: selectedLicense.licenseType },
                    { l: 'Vehicle Classes', v: (selectedLicense.vehicleClasses || []).join(', ') },
                    { l: 'Issue Date',      v: formatLicenseDate(selectedLicense.issueDate) },
                    { l: 'Expiry Date',     v: formatLicenseDate(selectedLicense.expiryDate) },
                    { l: 'Date of Birth',   v: selectedLicense.dob ? formatLicenseDate(selectedLicense.dob) : '—' },
                    { l: 'Address',         v: selectedLicense.address || '—' },
                    { l: 'Notes',           v: selectedLicense.notes || '—' },
                  ].map(row => (
                    <View key={row.l} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{row.l}</Text>
                      <Text style={styles.detailValue}>{row.v}</Text>
                    </View>
                  ))}
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─────────────── STYLES ───────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: { backgroundColor: '#1E293B', paddingTop: 54, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: '#FFFFFF' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  headerSub: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 1 },
  addBtn: { backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  // Summary strip
  summaryStrip: { backgroundColor: '#FFFFFF', flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryBorder: { borderLeftWidth: 1, borderLeftColor: '#F1F5F9' },
  summaryNum: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
  summaryLbl: { fontSize: 10, fontWeight: '700', marginTop: 2 },

  // Filters
  filtersArea: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 16, paddingBottom: 32 },
  loaderBox: { alignItems: 'center', paddingVertical: 60 },
  loaderText: { fontSize: 13, color: '#64748B', marginTop: 14, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  modalClose: { fontSize: 20, color: '#94A3B8', padding: 4 },

  // Form
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, fontSize: 14, color: '#1E293B', marginBottom: 14 },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row' },
  relPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  relPillActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  relPillText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  typePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  typePillActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  typePillText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  submitBtn: { backgroundColor: '#2563EB', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // Detail modal
  detailAvatarBlock: { alignItems: 'center', paddingVertical: 20, gap: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', marginBottom: 12 },
  detailAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  detailAvatarText: { fontSize: 24, fontWeight: '900' },
  detailHolderName: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', flex: 1 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1E293B', flex: 2, textAlign: 'right' },
});
