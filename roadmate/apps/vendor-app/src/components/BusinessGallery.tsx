import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { uploadImageMock } from '../services/vendorImageService';

interface BusinessGalleryProps {
  galleryUrls: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (index: number) => void;
}

export const BusinessGallery: React.FC<BusinessGalleryProps> = ({
  galleryUrls = [],
  onAddImage,
  onRemoveImage,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const pickImage = () => {
    setUploading(true);
    setProgress(0);
    setError('');

    // pick random gallery image name
    const mockImageNames = ['gallery_1.png', 'gallery_2.jpg', 'gallery_3.png'];
    const selectedName = mockImageNames[Math.floor(Math.random() * mockImageNames.length)];
    const mockSize = 1.8 * 1024 * 1024; // 1.8MB (valid size)

    uploadImageMock(
      'file://local_gallery/img.png',
      selectedName,
      mockSize,
      (p) => setProgress(Math.round(p))
    )
      .then((res) => {
        setUploading(false);
        if (res.success) {
          onAddImage(res.imageUrl);
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
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>🖼️ Workshop Gallery</Text>

      {galleryUrls.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
          {galleryUrls.map((url, idx) => (
            <View key={url + idx} style={styles.imageWrapper}>
              <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
              <TouchableOpacity onPress={() => onRemoveImage(idx)} style={styles.removeBtn} activeOpacity={0.7}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>No workshop photos uploaded yet.</Text>
      )}

      {uploading ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loaderText}>Uploading Image... {progress}%</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.addBtn} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>➕ Add Photo to Gallery</Text>
        </TouchableOpacity>
      )}

      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  scroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  removeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  removeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  loaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  addBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 10.5,
    color: '#DC2626',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
export default BusinessGallery;
