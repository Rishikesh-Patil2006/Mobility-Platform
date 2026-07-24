import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { validateTextLength, validateImageUrl } from '../services/vendorSecurityService';

const tipCategories = [
  'Vehicle Care',
  'Maintenance Tips',
  'Seasonal Tips',
  'Fuel Saving',
  'Battery Care',
  'Tyre Care',
  'Engine Care',
  'Insurance Tips',
  'Driving Safety',
  'EV Tips',
  'Emergency Tips',
];

export default function TipManagementModal({ visible, initialTip, vendorId, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Vehicle Care');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedContent, setDetailedContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('Published');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialTip) {
      setTitle(initialTip.title || '');
      setCategory(initialTip.category || 'Vehicle Care');
      setThumbnailImage(initialTip.thumbnailImage || '');
      setCoverImage(initialTip.coverImage || '');
      setShortDescription(initialTip.shortDescription || '');
      setDetailedContent(initialTip.detailedContent || '');
      setTagsInput(initialTip.tags ? initialTip.tags.join(', ') : '');
      setStatus(initialTip.status || 'Published');
    } else {
      setTitle('');
      setCategory('Vehicle Care');
      setThumbnailImage('https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600');
      setCoverImage('');
      setShortDescription('');
      setDetailedContent('');
      setTagsInput('');
      setStatus('Published');
    }
    setErrorMsg('');
  }, [initialTip, visible]);

  const handleSave = async (saveAsStatus) => {
    setErrorMsg('');

    const titleCheck = validateTextLength(title, 'Article Title', 3, 120);
    if (!titleCheck.valid) return setErrorMsg(titleCheck.error);

    const shortCheck = validateTextLength(shortDescription, 'Short description', 5, 300);
    if (!shortCheck.valid) return setErrorMsg(shortCheck.error);

    const detailedCheck = validateTextLength(detailedContent, 'Detailed content', 10, 5000);
    if (!detailedCheck.valid) return setErrorMsg(detailedCheck.error);

    if (thumbnailImage.trim()) {
      const imgCheck = validateImageUrl(thumbnailImage);
      if (!imgCheck.valid) return setErrorMsg(imgCheck.error);
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setSaving(true);
    try {
      await onSave({
        id: initialTip ? initialTip.id : undefined,
        vendorId: vendorId || 'vendor-1',
        title: title.trim(),
        category,
        thumbnailImage: thumbnailImage.trim() || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
        coverImage: coverImage.trim() || undefined,
        shortDescription: shortDescription.trim(),
        detailedContent: detailedContent.trim(),
        tags: tagsArray.length > 0 ? tagsArray : [category],
        status: saveAsStatus || status,
      });
      onClose();
    } catch (e) {
      setErrorMsg('Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialTip ? '📝 Edit Maintenance Article' : '✍️ Publish New Article'}
          </Text>
          <Text style={styles.modalSub}>
            Create educational vehicle care content for RoadMate customers.
          </Text>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Article Title *</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. 10 Essential Checks Before Long Highway Trips" />
            </View>

            {/* Category Chips */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {tipCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[styles.catChip, category === cat ? styles.catChipActive : null]}
                  >
                    <Text style={[styles.catChipText, category === cat ? styles.catChipTextActive : null]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Short Description */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Short Summary *</Text>
              <TextInput
                style={styles.input}
                value={shortDescription}
                onChangeText={setShortDescription}
                placeholder="Brief 1-2 line summary displayed on article cards"
              />
            </View>

            {/* Detailed Content */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Detailed Article Content *</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                multiline
                value={detailedContent}
                onChangeText={setDetailedContent}
                placeholder="Full article content, guidelines, numbered steps, etc."
              />
            </View>

            {/* Thumbnail Image URL & Cover Image URL */}
            <View style={styles.row}>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Thumbnail Image URL *</Text>
                <TextInput style={styles.input} value={thumbnailImage} onChangeText={setThumbnailImage} placeholder="https://..." />
              </View>
              <View style={[styles.inputBox, { flex: 1 }]}>
                <Text style={styles.label}>Cover Image URL (Optional)</Text>
                <TextInput style={styles.input} value={coverImage} onChangeText={setCoverImage} placeholder="https://..." />
              </View>
            </View>

            {/* Tags Input */}
            <View style={styles.inputBox}>
              <Text style={styles.label}>Tags (Comma-separated)</Text>
              <TextInput style={styles.input} value={tagsInput} onChangeText={setTagsInput} placeholder="e.g. Mileage, Engine, Fuel, Safety" />
            </View>

            {errorMsg ? <Text style={styles.errorText}>⚠️ {errorMsg}</Text> : null}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={saving} onPress={() => handleSave('Draft')} style={styles.draftBtn}>
              <Text style={styles.draftText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={saving} onPress={() => handleSave('Published')} style={styles.publishBtn}>
              {saving ? <ActivityIndicator color="white" /> : <Text style={styles.publishText}>🚀 Publish Now</Text>}
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
  catChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  catChipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  catChipTextActive: {
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
    gap: 8,
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
    fontSize: 12,
    fontWeight: '700',
  },
  draftBtn: {
    flex: 1.2,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  draftText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '800',
  },
  publishBtn: {
    flex: 1.5,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  publishText: {
    color: 'white',
    fontSize: 12.5,
    fontWeight: '900',
  },
});
