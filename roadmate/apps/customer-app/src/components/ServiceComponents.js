// src/components/ServiceComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── SERVICE CATEGORY CARD ──
export const ServiceCategoryCard = React.memo(function ServiceCategoryCard({ cat, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.categoryCard}
      activeOpacity={0.9}
    >
      {/* Clean Top Image Area with vendor-count badge */}
      <View style={styles.categoryImageContainer}>
        <Image
          source={cat.image}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <View style={styles.vendorCountBadge}>
          <Text style={styles.vendorCountText}>{cat.count || 0} vendors</Text>
        </View>
      </View>

      {/* Service Name Below Image */}
      <View style={styles.categoryInfoBlock}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {cat.name}
        </Text>
      </View>
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
    fontSize: 17,
    fontWeight: '700',
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
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryImageContainer: {
    width: '100%',
    height: 110,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    backgroundColor: '#F3F4F6',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  vendorCountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  vendorCountText: {
    color: 'white',
    fontSize: 9.5,
    fontWeight: '700',
  },
  categoryInfoBlock: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  categoryName: {
    color: '#111827',
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'left',
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
    fontSize: 8.5,
    fontWeight: '700',
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
