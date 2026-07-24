import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { uploadImageMock } from '../services/vendorImageService';

interface ServiceImageGalleryProps {
  bannerImage: string;
  gallery: string[];
  onChangeBanner: (url: string) => void;
  onAddGalleryImage: (url: string) => void;
  onRemoveGalleryImage: (index: number) => void;
}

export const ServiceImageGallery: React.FC<ServiceImageGalleryProps> = ({
  bannerImage,
  gallery = [],
  onChangeBanner,
  onAddGalleryImage,
  onRemoveGalleryImage,
}) => {
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const pickImage = (type: 'banner' | 'gallery') => {
    if (type === 'banner') setUploadingBanner(true);
    else setUploadingGallery(true);
    setProgress(0);
    setError('');

    // Pick simulated assets
    const names = ['service_banner.png', 'service_detailing.jpg', 'service_wash.jpg'];
    const selName = names[Math.floor(Math.random() * names.length)];
    const size = 1.4 * 1024 * 1024; // 1.4MB

    uploadImageMock(
      'file://local/service_img.png',
      selName,
      size,
      (p) => setProgress(Math.round(p))
    )
      .then((res) => {
        setUploadingBanner(false);
        setUploadingGallery(false);
        if (res.success) {
          if (type === 'banner') onChangeBanner(res.imageUrl);
          else onAddGalleryImage(res.imageUrl);
        } else {
          setError(res.error || 'Upload failed');
        }
      })
      .catch(() => {
        setUploadingBanner(false);
        setUploadingGallery(false);
        setError('Unexpected error during image upload.');
      });
  };

  return (
    <View style={styles.container}>
      {/* Banner Upload Box */}
      <Text style={styles.sectionLabel}>Service Cover Banner *</Text>
      {bannerImage ? (
        <View style={styles.bannerContainer}>
          <Image source={{ uri: bannerImage }} style={styles.bannerImage} resizeMode="cover" />
          <TouchableOpacity onPress={() => pickImage('banner')} style={styles.replaceBannerBtn} activeOpacity={0.7}>
            <Text style={styles.replaceText}>🔄 Change Banner</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          disabled={uploadingBanner}
          onPress={() => pickImage('banner')}
          style={[styles.uploadBox, styles.bannerUploadBox]}
          activeOpacity={0.7}
        >
          {uploadingBanner ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loaderText}>Uploading Cover... {progress}%</Text>
            </View>
          ) : (
            <Text style={styles.uploadBtnText}>📸 Upload Cover Banner</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Gallery Slideshow */}
      <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Service Gallery (Multiple Photos)</Text>
      {gallery.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
          {gallery.map((url, idx) => (
            <View key={url + idx} style={styles.imageWrapper}>
              <Image source={{ uri: url }} style={styles.thumb} resizeMode="cover" />
              <TouchableOpacity onPress={() => onRemoveGalleryImage(idx)} style={styles.removeBtn} activeOpacity={0.7}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {uploadingGallery ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.loaderText}>Uploading Gallery Image... {progress}%</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => pickImage('gallery')} style={styles.addBtn} activeOpacity={0.7}>
          <Text style={styles.addBtnText}>＋ Add Image to Service Gallery</Text>
        </TouchableOpacity>
      )}

      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  bannerContainer: {
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
  replaceBannerBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  replaceText: {
    color: 'white',
    fontSize: 10.5,
    fontWeight: '700',
  },
  uploadBox: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerUploadBox: {
    height: 100,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    width: '100%',
  },
  loaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  uploadBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  scroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  removeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  removeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
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
export default ServiceImageGallery;
