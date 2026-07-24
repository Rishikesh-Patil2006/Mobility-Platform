import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { ServiceItem } from '../services/vendorServiceService';

interface ServiceCardProps {
  service: ServiceItem;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPreview: () => void;
  onToggleStatus: (newStatus: 'Visible' | 'Hidden') => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDuplicate,
  onDelete,
  onPreview,
  onToggleStatus,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = service.status === 'Visible';

  return (
    <View style={[styles.card, !isActive ? styles.cardInactive : null]}>
      {/* Service Banner Image */}
      <Image
        source={{ uri: service.bannerImage || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400' }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Badges Overlay */}
      <View style={styles.badgeContainer}>
        {service.isPopular && <Text style={[styles.badge, styles.popular]}>Popular</Text>}
        {service.isFeatured && <Text style={[styles.badge, styles.featured]}>Featured</Text>}
        {service.isOffer && <Text style={[styles.badge, styles.offer]}>Offer</Text>}
      </View>

      <View style={styles.content}>
        {/* Name and Action Trigger */}
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.menuTrigger} activeOpacity={0.7}>
            <Text style={styles.menuDots}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Categories / Subcategory */}
        <Text style={styles.categoryInfo}>
          {service.category} · <Text style={styles.subcategory}>{service.subcategory}</Text>
        </Text>

        <Text style={styles.shortDesc} numberOfLines={2}>
          {service.shortDescription}
        </Text>

        {/* Tags Row */}
        {service.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {service.tags.slice(0, 3).map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={styles.tagText}>#{t}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Pricing Row */}
        <View style={styles.footerRow}>
          <View style={styles.pricing}>
            {service.offerPrice ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceOffer}>₹{service.offerPrice}</Text>
                <Text style={styles.priceActual}>₹{service.actualPrice}</Text>
              </View>
            ) : (
              <Text style={styles.priceBase}>₹{service.actualPrice || service.startingPrice}</Text>
            )}
            <Text style={styles.duration}>⏱️ {service.duration}</Text>
          </View>

          {/* Visibility toggle switch */}
          <View style={styles.toggleRow}>
            <Text style={[styles.statusText, isActive ? styles.statusActive : styles.statusHidden]}>
              {service.status}
            </Text>
            <Switch
              value={isActive}
              onValueChange={(val) => onToggleStatus(val ? 'Visible' : 'Hidden')}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={isActive ? '#1E3A8A' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Action Menu Panel */}
        {menuOpen && (
          <View style={styles.menuOverlay}>
            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                onPreview();
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>👁️ Preview Service</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
              style={[styles.menuItem, styles.borderTop]}
            >
              <Text style={styles.menuItemText}>📝 Edit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                onDuplicate();
              }}
              style={[styles.menuItem, styles.borderTop]}
            >
              <Text style={styles.menuItemText}>👯 Duplicate Service</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMenuOpen(false);
                onDelete();
              }}
              style={[styles.menuItem, styles.borderTop, styles.deleteItem]}
            >
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>🗑️ Delete Listing</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  cardInactive: {
    opacity: 0.8,
    borderColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    fontSize: 9,
    fontWeight: '800',
    color: 'white',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  popular: {
    backgroundColor: '#F59E0B',
  },
  featured: {
    backgroundColor: '#8B5CF6',
  },
  offer: {
    backgroundColor: '#EF4444',
  },
  content: {
    padding: 16,
    position: 'relative',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    paddingRight: 12,
  },
  menuTrigger: {
    padding: 4,
  },
  menuDots: {
    fontSize: 13,
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  categoryInfo: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  subcategory: {
    color: '#2563EB',
  },
  shortDesc: {
    fontSize: 11.5,
    color: '#4B5563',
    lineHeight: 16,
    marginTop: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  tagText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 12,
  },
  pricing: {
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceOffer: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  priceActual: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  priceBase: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  duration: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusActive: {
    color: '#16A34A',
  },
  statusHidden: {
    color: '#DC2626',
  },

  // Menu Dropdown overlay
  menuOverlay: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 999,
    width: 160,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#374151',
  },
  deleteItem: {
    backgroundColor: '#FEF2F2',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
});
export default ServiceCard;
