import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { uploadImageMock } from '../services/vendorImageService';

interface ImageUploadCardProps {
  label: string;
  imageUri?: string;
  onUploadSuccess: (url: string) => void;
  onDelete: () => void;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  label,
  imageUri,
  onUploadSuccess,
  onDelete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const pickAndUploadImage = () => {
    // Simulator trigger
    setUploading(true);
    setProgress(0);
    setError('');

    // Pick random image name/size to simulate upload rules
    const mockImageNames = ['business_logo.png', 'partner_owner.jpg', 'cover_photo.png'];
    const selectedName = mockImageNames[Math.floor(Math.random() * mockImageNames.length)];
    const mockSize = 2.5 * 1024 * 1024; // 2.5MB (valid size)

    uploadImageMock(
      'file://local_uri/tmp.png',
      selectedName,
      mockSize,
      (p) => setProgress(Math.round(p))
    )
      .then((res) => {
        setUploading(false);
        if (res.success) {
          onUploadSuccess(res.imageUrl);
        } else {
          setError(res.error || 'Upload failed');
        }
      })
      .catch((e) => {
        setUploading(false);
        setError('Unexpected error during image upload.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          <View style={styles.overlayActions}>
            <TouchableOpacity onPress={pickAndUploadImage} style={styles.miniBtn} activeOpacity={0.7}>
              <Text style={styles.miniBtnText}>🔄 Replace</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={[styles.miniBtn, styles.deleteBtn]} activeOpacity={0.7}>
              <Text style={styles.miniBtnText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          disabled={uploading}
          onPress={pickAndUploadImage}
          style={[styles.uploadBox, error ? styles.uploadBoxError : null]}
          activeOpacity={0.7}
        >
          {uploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.uploadText}>Uploading {progress}%</Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Select & Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  uploadBox: {
    height: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBoxError: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadIcon: {
    fontSize: 18,
  },
  uploadText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  previewContainer: {
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  preview: {
    width: 100,
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  overlayActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  miniBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  miniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  errorText: {
    fontSize: 10.5,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 4,
  },
});
export default ImageUploadCard;
