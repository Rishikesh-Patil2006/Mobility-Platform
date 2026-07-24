import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { OfferItem } from '../services/vendorOfferService';

interface OfferCardProps {
  offer: OfferItem;
  onEdit: (offer: OfferItem) => void;
  onDelete: (id: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onEdit, onDelete }) => {
  const getStatusColor = () => {
    switch (offer.status) {
      case 'Active':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'Upcoming':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'Expired':
        return { bg: '#FEE2E2', text: '#991B1B' };
      default:
        return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const st = getStatusColor();

  return (
    <View style={styles.card}>
      {/* Top Banner Image */}
      {offer.bannerUri ? (
        <Image source={{ uri: offer.bannerUri }} style={styles.bannerImage} resizeMode="cover" />
      ) : null}

      <View style={styles.body}>
        {/* Header Row with Discount Pill & Status */}
        <View style={styles.headerRow}>
          <View style={styles.discountPill}>
            <Text style={styles.discountText}>
              {offer.discountType === 'Percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <Text style={[styles.statusText, { color: st.text }]}>● {offer.status}</Text>
          </View>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{offer.title}</Text>
        <Text style={styles.desc}>{offer.description}</Text>

        {/* Requirements & Dates */}
        <View style={styles.metaBox}>
          <Text style={styles.metaLine}>
            🛒 Min Order: <Text style={styles.metaVal}>₹{offer.minOrderAmount}</Text>
            {offer.maxDiscountAmount ? ` · Max Off: ₹${offer.maxDiscountAmount}` : ''}
          </Text>
          <Text style={styles.metaLine}>
            📅 Valid: <Text style={styles.metaVal}>{offer.startDate} to {offer.endDate}</Text>
          </Text>
        </View>

        {/* Applicable Services */}
        <Text style={styles.servicesLabel}>Applicable Services:</Text>
        <View style={styles.servicesGrid}>
          {offer.applicableServices.map((srv) => (
            <View key={srv} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>🔧 {srv}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => onEdit(offer)} style={styles.editBtn}>
            <Text style={styles.editText}>✏️ Edit Offer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(offer.id)} style={styles.deleteBtn}>
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
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: 120,
  },
  body: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountPill: {
    backgroundColor: '#DC2626',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 10,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    gap: 4,
  },
  metaLine: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  metaVal: {
    fontWeight: '800',
    color: '#0F172A',
  },
  servicesLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  serviceTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
export default OfferCard;
