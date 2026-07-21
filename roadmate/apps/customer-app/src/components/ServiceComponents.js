// src/components/ServiceComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── SERVICE CATEGORY CARD ──
export const ServiceCategoryCard = React.memo(function ServiceCategoryCard({ cat, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.categoryCard}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={cat.image}
        style={styles.categoryImage}
        imageStyle={styles.categoryImageStyle}
      >
        <View style={styles.gradientOverlay}>
          {/* Top Vendor Count Badge */}
          <View style={styles.vendorCountBadge}>
            <Text style={styles.vendorCountText}>{cat.count || 0} vendors</Text>
          </View>

          {/* Bottom Title Area */}
          <View style={styles.categoryInfoBlock}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.miniEmojiCircle, { backgroundColor: cat.bg || '#EFF6FF' }]}>
                <Text style={styles.miniEmoji}>{cat.emoji || '🔧'}</Text>
              </View>
              <Text style={styles.categoryName} numberOfLines={1}>
                {cat.name}
              </Text>
            </View>
            {cat.description ? (
              <Text style={styles.categoryDesc} numberOfLines={2}>
                {cat.description}
              </Text>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
});

// ── CATEGORY SECTION ──
export const CategorySection = React.memo(function CategorySection({ title, items, onSelectCategory }) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.categoriesGrid}>
        {items.map((cat) => (
          <ServiceCategoryCard
            key={cat.id}
            cat={cat}
            onPress={() => onSelectCategory(cat.id)}
          />
        ))}
      </View>
    </View>
  );
});

// ── AVAILABILITY BADGE ──
export const AvailabilityBadge = React.memo(function AvailabilityBadge({ status }) {
  const statusStyles = {
    Available: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    Busy: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    Unavailable: { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' }
  };

  const current = statusStyles[status] || statusStyles.Available;

  return (
    <View style={[styles.badgeContainer, { backgroundColor: current.bg, borderColor: current.border }]}>
      <View style={[styles.badgeDot, { backgroundColor: current.color }]} />
      <Text style={[styles.badgeText, { color: current.color }]}>{status}</Text>
    </View>
  );
});

// ── ENQUIRY BUTTON ──
export const EnquiryButton = React.memo(function EnquiryButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.enquireBtn}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.enquireBtnText}>Enquire</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '850',
    color: '#111827',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: width > 600 ? 'flex-start' : 'space-between',
  },
  categoryCard: {
    width: width > 600 ? 180 : (width - 44) / 2,
    height: 135,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  categoryImageStyle: {
    resizeMode: 'cover',
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 12,
    justifyContent: 'space-between',
  },
  vendorCountBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  vendorCountText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
  },
  categoryInfoBlock: {
    gap: 4,
  },
  miniEmojiCircle: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniEmoji: {
    fontSize: 13,
  },
  categoryName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  categoryDesc: {
    color: '#E2E8F0',
    fontSize: 9,
    fontWeight: '600',
    lineHeight: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  enquireBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  enquireBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
});
