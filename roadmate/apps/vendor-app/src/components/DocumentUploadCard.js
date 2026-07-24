import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { uploadDocumentMock } from '../services/vendorDocumentService';

export default function DocumentUploadCard({
  label,
  docName,
  onUploadSuccess,
  onDelete,
  optional = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleDocumentPick = () => {
    setUploading(true);
    setProgress(0);
    setError('');

    const mockDocumentNames = ['udyam_certificate.pdf', 'gst_registration.pdf', 'shop_act_license.pdf', 'pan_card.jpg'];
    const selectedName = mockDocumentNames[Math.floor(Math.random() * mockDocumentNames.length)];
    const mockSize = 1.2 * 1024 * 1024;

    uploadDocumentMock(
      'file://local_documents/license.pdf',
      selectedName,
      selectedName,
      mockSize,
      (p) => setProgress(Math.round(p))
    )
      .then((res) => {
        setUploading(false);
        if (res.success) {
          onUploadSuccess && onUploadSuccess(res.fileName);
        } else {
          setError(res.error || 'Upload failed');
        }
      })
      .catch(() => {
        setUploading(false);
        setError('Unexpected error during document upload.');
      });
  };

  const isUploaded = !!docName;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, isUploaded ? styles.labelSuccess : null]}>
          {label} {optional ? '(Optional)' : ''}
        </Text>
        {isUploaded && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>✓ Uploaded</Text>
          </View>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isUploaded ? (
        <View style={styles.fileRow}>
          <View style={styles.fileDetails}>
            <Text style={styles.fileIcon}>📄</Text>
            <Text style={styles.fileNameText} numberOfLines={1}>
              {docName}
            </Text>
          </View>
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} activeOpacity={0.7}>
            <Text style={styles.deleteBtnText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      ) : uploading ? (
        <View style={styles.uploadingBox}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.uploadingText}>Uploading... {progress}%</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={handleDocumentPick} style={styles.uploadBox} activeOpacity={0.8}>
          <Text style={styles.uploadBoxIcon}>📤</Text>
          <Text style={styles.uploadBoxText}>Tap to select & upload document (PDF / JPG)</Text>
          <Text style={styles.uploadBoxSub}>Max file size: 5 MB</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  labelSuccess: {
    color: '#15803D',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginBottom: 6,
    fontWeight: '600',
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  fileIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  fileNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  uploadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 12,
  },
  uploadingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 8,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  uploadBoxIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  uploadBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  uploadBoxSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});
