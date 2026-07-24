import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PromotionBannerItem } from '../services/vendorPromotionService';

interface PromotionBannerCardProps {
  banner: PromotionBannerItem;
  onDelete: (id: string) => void;
}

export const PromotionBannerCard: React.FC<PromotionBannerCardProps> = ({ banner, onDelete }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: banner.imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>🖼️ {banner.bannerType} Banner</Text>
        </View>
        <Text style={styles.title}>{banner.title}</Text>
        <Text style={styles.schedule}>📅 Visibility: {banner.scheduleVisibility}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.clicks}>👁️ {banner.clickCount} Banner Clicks</Text>
          <TouchableOpacity onPress={() => onDelete(banner.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 110,
  },
  body: {
    padding: 12,
  },
  typeBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1E3A8A',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  schedule: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 6,
  },
  clicks: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  deleteBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  deleteText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
});
export default PromotionBannerCard;
