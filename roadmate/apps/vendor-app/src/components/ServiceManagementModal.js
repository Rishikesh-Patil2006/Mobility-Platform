import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { validateTextLength, validateImageUrl } from '../services/vendorSecurityService';

const categoriesList = [
  'Garage',
  'Car Wash',
  'Towing',
  'PUC Center',
  'Denting & Painting',
  'Service Center',
  'Showroom',
];

const subcategoriesMap = {
  'Garage': ['General Repair', 'Engine Diagnostics', 'Brake Service', 'Electrical Work'],
  'Car Wash': ['Exterior Wash', 'Interior Detailing', 'Full Detailing', 'Ceramic Coating'],
  'Towing': ['Flatbed Towing', 'Hydraulic Towing', 'Accident Recovery', 'Breakdown Towing'],
  'PUC Center': ['Petrol PUC', 'Diesel PUC', 'CNG/LPG PUC'],
  'Denting & Painting': ['Scratch Removal', 'Panel Denting', 'Full Body Paint', 'Alloy Wheel Painting'],
  'Service Center': ['Scheduled Service', 'Warranty Service', 'Oil Change', 'Filter Replacement'],
  'Showroom': ['New Vehicles', 'Pre-Owned Vehicles', 'Spares & Accessories'],
};

export default function ServiceManagementModal({ visible, initialService, vendorId, mainCategory, onSave, onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(mainCategory || 'Garage');
  const [subcategory, setSubcategory] = useState('General Services');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [actualPrice, setActualPrice] = useState(''); // Service charges / inspection
  const [offerPrice, setOfferPrice] = useState('');
  const [duration, setDuration] = useState('30 Mins');
  const [bannerImage, setBannerImage] = useState('');
  const [status, setStatus] = useState('Visible');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialService) {
      setName(initialService.name || '');
      setCategory(initialService.category || mainCategory || 'Garage');
      setSubcategory(initialService.subcategory || 'General Services');
      setShortDescription(initialService.shortDescription || '');
      setDetailedDescription(initialService.detailedDescription || '');
      setStartingPrice(initialService.startingPrice ? String(initialService.startingPrice) : '');
      setActualPrice(initialService.actualPrice ? String(initialService.actualPrice) : '');
      setOfferPrice(initialService.offerPrice ? String(initialService.offerPrice) : '');
      setDuration(initialService.duration || '30 Mins');
      setBannerImage(initialService.bannerImage || '');
      setStatus(initialService.status || 'Visible');
    } else {
      setName('');
      setCategory(mainCategory || 'Garage');
      setSubcategory(subcategoriesMap[mainCategory]?.[0] || 'General Services');
      setShortDescription('');
      setDetailedDescription('');
      setStartingPrice('');
      setActualPrice('');
      setOfferPrice('');
      setDuration('30 Mins');
      setBannerImage('');
      setStatus('Visible');
    }
    setErrorMsg('');
  }, [initialService, visible, mainCategory]);

  const handleSave = async () => {
    setErrorMsg('');

    const nameCheck = validateTextLength(name, 'Service Name', 3, 100);
    if (!nameCheck.valid) return setErrorMsg(nameCheck.error);

    if (!startingPrice.trim() || isNaN(Number(startingPrice)) || Number(startingPrice) <= 0) {
      return setErrorMsg('Valid starting price (₹) is required.');
    }

    const descCheck = validateTextLength(shortDescription, 'Short description', 5, 500);
    if (!descCheck.valid) return setErrorMsg(descCheck.error);

    if (bannerImage.trim()) {
      const imgCheck = validateImageUrl(bannerImage);
      if (!imgCheck.valid) return setErrorMsg(imgCheck.error);
    }

    setSaving(true);
    try {
      await onSave({
        id: initialService ? initialService.id : undefined,
        vendorId: vendorId || 'vendor-1',
        name: name.trim(),
        category,
        subcategory,
        shortDescription: shortDescription.trim(),
        detailedDescription: detailedDescription.trim() || shortDescription.trim(),
        startingPrice: startingPrice.trim(),
        actualPrice: actualPrice.trim() || startingPrice.trim(),
        offerPrice: offerPrice.trim() || undefined,
        duration: duration.trim() || '30 Mins',
        bannerImage: bannerImage.trim() || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
        gallery: initialService ? initialService.gallery || [] : [],
        tags: [category, subcategory],
        status,
        isPopular: initialService ? initialService.isPopular : false,
        isFeatured: initialService ? initialService.isFeatured : false,
        isOffer: !!offerPrice.trim(),
      });
      onClose();
    } catch (e) {
      setErrorMsg('Failed to save service listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialService ? '📝 Edit Service Listing' : '＋ Add New Service Listing'}
          </Text>
          <Text style={styles.modalSub}>
            Configure service pricing, service charges, estimated time, and details.
          </Text>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Service Name */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Service Name *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Full Synthetic Engine Oil Change" />
            </View>

            {/* Category & Subcategory */}
            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Category *</Text>
                <TextInput style={[styles.input, { backgroundColor: '#E2E8F0' }]} value={category} editable={false} />
              </View>

              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Sub Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {(subcategoriesMap[category] || ['General Services']).map((sub) => (
                    <TouchableOpacity
                      key={sub}
                      onPress={() => setSubcategory(sub)}
                      style={[styles.subChip, subcategory === sub ? styles.subChipActive : null]}
                    >
                      <Text style={[styles.subChipText, subcategory === sub ? styles.subChipTextActive : null]}>
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Pricing, Service Charges & Offer Price */}
            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g. 499"
                  value={startingPrice}
                  onChangeText={setStartingPrice}
                />
              </View>

              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Service Charges (₹)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g. 99"
                  value={actualPrice}
                  onChangeText={setActualPrice}
                />
              </View>

              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Offer Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="e.g. 399"
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                />
              </View>
            </View>

            {/* Estimated Service Time & Status */}
            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Estimated Time *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {['15 Mins', '30 Mins', '45 Mins', '1 Hour', '2 Hours', '1 Day'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setDuration(t)}
                      style={[styles.subChip, duration === t ? styles.subChipActive : null]}
                    >
                      <Text style={[styles.subChipText, duration === t ? styles.subChipTextActive : null]}>
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Visibility Status *</Text>
                <View style={styles.statusToggleRow}>
                  {['Visible', 'Hidden', 'Draft'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      onPress={() => setStatus(st)}
                      style={[styles.statusToggleBtn, status === st ? styles.statusToggleBtnActive : null]}
                    >
                      <Text style={[styles.statusToggleText, status === st ? styles.statusToggleTextActive : null]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Short Description */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Short Summary *</Text>
              <TextInput
                style={styles.input}
                value={shortDescription}
                onChangeText={setShortDescription}
                placeholder="Brief 1-line overview of the service offering"
              />
            </View>

            {/* Detailed Description */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Detailed Scope of Work</Text>
              <TextInput
                style={[styles.input, { height: 70, textAlignVertical: 'top' }]}
                multiline
                value={detailedDescription}
                onChangeText={setDetailedDescription}
                placeholder="Detailed breakdown of multi-point checks, parts used, warranty info, etc."
              />
            </View>

            {/* Banner Image URL */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Banner Image URL</Text>
              <TextInput
                style={styles.input}
                value={bannerImage}
                onChangeText={setBannerImage}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>⚠️ {errorMsg}</Text> : null}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={saving} onPress={handleSave} style={styles.saveBtn}>
              {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveText}>Save Service Listing</Text>}
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 14,
  },
  formScroll: {
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chipRow: {
    gap: 6,
    paddingVertical: 2,
  },
  subChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  subChipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  subChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  subChipTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: 4,
  },
  statusToggleBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statusToggleBtnActive: {
    backgroundColor: '#1E3A8A',
  },
  statusToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  statusToggleTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.5,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '900',
  },
});
