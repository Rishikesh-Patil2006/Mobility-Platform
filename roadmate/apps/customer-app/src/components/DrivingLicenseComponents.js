// roadmate/apps/customer-app/src/components/DrivingLicenseComponents.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { calculateLicenseExpiry, formatLicenseDate } from '../utils/licenseUtils';

const { width } = Dimensions.get('window');

const RELATIONSHIP_COLORS = {
  'Self':    { color: '#2563EB', bg: '#EFF6FF' },
  'Father':  { color: '#7C3AED', bg: '#F5F3FF' },
  'Mother':  { color: '#DB2777', bg: '#FDF2F8' },
  'Brother': { color: '#059669', bg: '#ECFDF5' },
  'Sister':  { color: '#D97706', bg: '#FFFBEB' },
  'Spouse':  { color: '#DC2626', bg: '#FEF2F2' },
  'Other':   { color: '#64748B', bg: '#F8FAFC' },
};

const getRelColor = (rel) => RELATIONSHIP_COLORS[rel] || RELATIONSHIP_COLORS['Other'];

// ── LICENSE STATUS CHIP ──
export const LicenseStatusChip = React.memo(function LicenseStatusChip({ expiryDate, compact = false }) {
  const expiry = calculateLicenseExpiry(expiryDate);
  return (
    <View style={[styles.statusChip, { backgroundColor: expiry.bgColor }, compact && styles.statusChipCompact]}>
      <Text style={[styles.statusChipText, { color: expiry.color }, compact && styles.statusChipTextCompact]}>
        {compact ? expiry.status : expiry.label}
      </Text>
    </View>
  );
});

// ── RELATIONSHIP CHIP ──
export const RelationshipChip = React.memo(function RelationshipChip({ relationship }) {
  const cfg = getRelColor(relationship);
  return (
    <View style={[styles.relChip, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.relChipText, { color: cfg.color }]}>{relationship}</Text>
    </View>
  );
});

// ── DRIVING LICENSE CARD ──
export const DrivingLicenseCard = React.memo(function DrivingLicenseCard({ license, onView, onEdit, onDelete }) {
  if (!license) return null;
  const expiry = calculateLicenseExpiry(license.expiryDate);
  const relCfg = getRelColor(license.relationship);
  const initials = (license.holderName || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <View style={[styles.licenseCard, { borderLeftColor: expiry.color }]}>
      {/* Card Header */}
      <View style={styles.licenseHeader}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: relCfg.bg }]}>
          <Text style={[styles.avatarText, { color: relCfg.color }]}>{initials}</Text>
        </View>

        {/* Info block */}
        <View style={styles.licenseInfo}>
          <View style={styles.licenseNameRow}>
            <Text style={styles.licenseHolderName} numberOfLines={1}>{license.holderName}</Text>
            <RelationshipChip relationship={license.relationship} />
          </View>
          <Text style={styles.licenseNumber}>🪪 {license.licenseNumber}</Text>
          <Text style={styles.licenseType}>🚗 {(license.vehicleClasses || [license.licenseType]).join(', ')}</Text>
        </View>
      </View>

      {/* Dates row */}
      <View style={styles.licenseDatesRow}>
        <View style={styles.licenseDateBox}>
          <Text style={styles.licenseDateLabel}>ISSUED</Text>
          <Text style={styles.licenseDateValue}>{formatLicenseDate(license.issueDate)}</Text>
        </View>
        <View style={[styles.licenseDateBox, styles.licenseDateBorder]}>
          <Text style={styles.licenseDateLabel}>EXPIRES</Text>
          <Text style={[styles.licenseDateValue, { color: expiry.color }]}>
            {formatLicenseDate(license.expiryDate)}
          </Text>
        </View>
        <View style={[styles.licenseDateBox, styles.licenseDateBorder]}>
          <Text style={styles.licenseDateLabel}>STATUS</Text>
          <LicenseStatusChip expiryDate={license.expiryDate} compact />
        </View>
      </View>

      {/* Alert banner for expiring/expired */}
      {(expiry.status !== 'Valid') && (
        <View style={[styles.alertBanner, { backgroundColor: expiry.bgColor }]}>
          <Text style={[styles.alertBannerText, { color: expiry.color }]}>
            ⚠️ {expiry.label}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.licenseActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onView && onView(license)} activeOpacity={0.7}>
          <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>👁️ View</Text>
        </TouchableOpacity>
        <View style={styles.actionRight}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit && onEdit(license)} activeOpacity={0.7}>
            <Text style={[styles.actionBtnText, { color: '#475569' }]}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete && onDelete(license.id)} activeOpacity={0.7}>
            <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// ── DRIVING LICENSE SUMMARY (for Profile page) ──
export const DrivingLicenseSummary = React.memo(function DrivingLicenseSummary({ licenses = [], onTap }) {
  const activeCount      = licenses.filter(l => calculateLicenseExpiry(l.expiryDate).status === 'Valid').length;
  const expiringSoon     = licenses.filter(l => {
    const s = calculateLicenseExpiry(l.expiryDate).status;
    return s === 'Expiring Soon' || s === 'Expires Tomorrow';
  }).length;
  const expiredCount     = licenses.filter(l => calculateLicenseExpiry(l.expiryDate).status === 'Expired').length;

  return (
    <TouchableOpacity style={styles.summaryCard} onPress={onTap} activeOpacity={0.85}>
      <View style={styles.summaryLeft}>
        <Text style={styles.summaryEmoji}>🪪</Text>
        <View>
          <Text style={styles.summaryTitle}>Driving Licenses</Text>
          <Text style={styles.summarySubtitle}>{licenses.length} license{licenses.length !== 1 ? 's' : ''} · Tap to View</Text>
        </View>
      </View>
      <View style={styles.summaryStats}>
        {activeCount > 0 && (
          <View style={[styles.summaryStat, { backgroundColor: '#ECFDF5' }]}>
            <Text style={[styles.summaryStatNum, { color: '#059669' }]}>{activeCount}</Text>
            <Text style={[styles.summaryStatLabel, { color: '#059669' }]}>Active</Text>
          </View>
        )}
        {expiringSoon > 0 && (
          <View style={[styles.summaryStat, { backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.summaryStatNum, { color: '#D97706' }]}>{expiringSoon}</Text>
            <Text style={[styles.summaryStatLabel, { color: '#D97706' }]}>Expiring</Text>
          </View>
        )}
        {expiredCount > 0 && (
          <View style={[styles.summaryStat, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.summaryStatNum, { color: '#EF4444' }]}>{expiredCount}</Text>
            <Text style={[styles.summaryStatLabel, { color: '#EF4444' }]}>Expired</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

// ── LICENSE FILTER PILLS ──
export const LicenseFilterBar = React.memo(function LicenseFilterBar({ selected, onSelect }) {
  const options = ['All Licenses', 'Active', 'Expiring Soon', 'Expired'];
  const colorMap = {
    'All Licenses':   '#2563EB',
    'Active':         '#10B981',
    'Expiring Soon':  '#D97706',
    'Expired':        '#EF4444',
  };
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
      {options.map(opt => {
        const isActive = selected === opt || (!selected && opt === 'All Licenses');
        const clr = colorMap[opt];
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.filterPill, isActive && { backgroundColor: clr, borderColor: clr }]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterPillText, isActive && { color: '#FFFFFF' }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
});

// ── LICENSE SEARCH BAR ──
export const LicenseSearchBar = React.memo(function LicenseSearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, relationship or license no..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={styles.searchClear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

// ── EMPTY STATE ──
export const LicenseEmptyState = React.memo(function LicenseEmptyState({ filter }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🪪</Text>
      <Text style={styles.emptyTitle}>
        {filter && filter !== 'All Licenses' ? `No ${filter} Licenses` : 'No Driving Licenses'}
      </Text>
      <Text style={styles.emptySub}>
        {filter && filter !== 'All Licenses'
          ? 'Try a different filter to see licenses.'
          : 'Tap "+ Add License" to add your first driving license.'}
      </Text>
    </View>
  );
});

// ── FAVORITE CARD (for Favorites screen) ──
export const FavoriteCard = React.memo(function FavoriteCard({ item, onRemove }) {
  if (!item) return null;

  const CATEGORY_ICONS = {
    'Fuel Station':   '⛽',
    'Garage':         '🔧',
    'Accessories':    '🛍️',
    'Vehicle Dealer': '🚗',
    'Tyre Shop':      '⚫',
    'Washing':        '🚿',
    'Insurance':      '🛡️',
  };
  const icon = CATEGORY_ICONS[item.category] || '📍';

  return (
    <View style={styles.favoriteCard}>
      <View style={styles.favHeader}>
        <View style={styles.favIconCircle}>
          <Text style={styles.favIcon}>{icon}</Text>
        </View>
        <View style={styles.favInfo}>
          <Text style={styles.favName} numberOfLines={1}>{item.providerName}</Text>
          <Text style={styles.favCategory}>{item.category}{item.subcategory ? ` · ${item.subcategory}` : ''}</Text>
          {item.address && <Text style={styles.favAddress} numberOfLines={1}>📍 {item.address}</Text>}
        </View>
        {item.rating && (
          <View style={styles.favRating}>
            <Text style={styles.favRatingText}>⭐ {item.rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.favFooter}>
        <Text style={styles.favSavedDate}>Saved {item.savedAt}</Text>
        <TouchableOpacity onPress={() => onRemove && onRemove(item.providerId)} activeOpacity={0.8}>
          <Text style={styles.favRemoveText}>Remove ❤️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ─────────────── STYLES ───────────────
const styles = StyleSheet.create({
  // License Card
  licenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  licenseHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '900' },
  licenseInfo: { flex: 1 },
  licenseNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  licenseHolderName: { fontSize: 15, fontWeight: '800', color: '#1E293B', flex: 1 },
  licenseNumber: { fontSize: 12, color: '#475569', fontWeight: '600', marginBottom: 2 },
  licenseType: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  // Dates row
  licenseDatesRow: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, marginBottom: 10 },
  licenseDateBox: { flex: 1, alignItems: 'center' },
  licenseDateBorder: { borderLeftWidth: 1, borderLeftColor: '#E2E8F0' },
  licenseDateLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  licenseDateValue: { fontSize: 11, fontWeight: '700', color: '#1E293B' },

  // Alert banner
  alertBanner: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 10 },
  alertBannerText: { fontSize: 12, fontWeight: '700' },

  // Action buttons
  licenseActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 10 },
  actionBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  actionBtnText: { fontSize: 12, fontWeight: '700' },
  actionRight: { flexDirection: 'row', gap: 4 },

  // Status chip
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusChipCompact: { paddingHorizontal: 6, paddingVertical: 2 },
  statusChipText: { fontSize: 11, fontWeight: '700' },
  statusChipTextCompact: { fontSize: 9, fontWeight: '800' },

  // Relationship chip
  relChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  relChipText: { fontSize: 11, fontWeight: '700' },

  // Summary card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFF6FF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryEmoji: { fontSize: 28 },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  summarySubtitle: { fontSize: 11, color: '#64748B', fontWeight: '500', marginTop: 2 },
  summaryStats: { flexDirection: 'row', gap: 6 },
  summaryStat: { alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  summaryStatNum: { fontSize: 16, fontWeight: '900' },
  summaryStatLabel: { fontSize: 8, fontWeight: '700', marginTop: 1 },

  // Filter pills
  filterScroll: { marginBottom: 12 },
  filterScrollContent: { gap: 8, paddingRight: 16 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  filterPillText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  // Search bar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, height: 46, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 13, color: '#1E293B', fontWeight: '500' },
  searchClear: { fontSize: 14, color: '#94A3B8', padding: 4 },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  // Favorite card
  favoriteCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  favHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  favIconCircle: { width: 44, height: 44, backgroundColor: '#EFF6FF', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  favIcon: { fontSize: 20 },
  favInfo: { flex: 1 },
  favName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  favCategory: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2 },
  favAddress: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  favRating: { backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  favRatingText: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  favFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F8FAFC', paddingTop: 8 },
  favSavedDate: { fontSize: 11, color: '#94A3B8' },
  favRemoveText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },
});
