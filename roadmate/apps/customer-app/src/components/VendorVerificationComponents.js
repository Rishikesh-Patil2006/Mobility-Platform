// roadmate/apps/customer-app/src/components/VendorVerificationComponents.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ── VERIFIED BADGE ──
export const VerifiedBadge = React.memo(function VerifiedBadge() {
  return (
    <View style={styles.verifiedBadge}>
      <Text style={styles.verifiedBadgeText}>🛡 Verified Business</Text>
    </View>
  );
});

// ── VERIFICATION STATUS CHIP ──
export const VerificationStatusChip = React.memo(function VerificationStatusChip({ status }) {
  const statusColors = {
    Verified: { text: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    Pending: { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    Rejected: { text: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
    Suspended: { text: '#4B5563', bg: '#F3F4F6', border: '#E5E7EB' }
  };
  const current = statusColors[status] || statusColors.Verified;

  return (
    <View style={[styles.statusChip, { backgroundColor: current.bg, borderColor: current.border }]}>
      <Text style={[styles.statusChipText, { color: current.text }]}>{status}</Text>
    </View>
  );
});

// ── BUSINESS VERIFICATION CARD ──
export const BusinessVerificationCard = React.memo(function BusinessVerificationCard({ provider }) {
  if (!provider) return null;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>🛡 Business Verification</Text>
      <View style={styles.detailsBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Verification Status</Text>
          <VerificationStatusChip status="Verified" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Verified Using</Text>
          <Text style={styles.infoValue}>Udyam Registration</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Business Since</Text>
          <Text style={styles.infoValue}>2019</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Verification Date</Text>
          <Text style={styles.infoValue}>Jan 15, 2026</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Business Category</Text>
          <Text style={styles.infoValue}>{provider.category}</Text>
        </View>
      </View>
      <Text style={styles.privacyNote}>
        Privacy Protected: Full Udyam numbers, GSTIN, and personal PAN data are securely verified and never exposed to the public.
      </Text>
    </View>
  );
});

// ── BUSINESS PROFILE CARD ──
export const BusinessProfileCard = React.memo(function BusinessProfileCard({ provider }) {
  if (!provider) return null;

  return (
    <View style={styles.sectionCard}>
      <View style={styles.profileHeader}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>{provider.name[0]}</Text>
        </View>
        <View style={styles.profileMeta}>
          <Text style={styles.profileName}>{provider.name}</Text>
          <Text style={styles.profileCategory}>{provider.category} · Est. 2019</Text>
        </View>
      </View>
      <View style={styles.profileBadgeRow}>
        <VerifiedBadge />
      </View>
      <Text style={styles.profileDesc}>{provider.description}</Text>
      <View style={styles.profileInfoList}>
        <Text style={styles.profileInfoText}>📍 {provider.address}</Text>
        <Text style={styles.profileInfoText}>🕒 {provider.hours}</Text>
      </View>
    </View>
  );
});

// ── BUSINESS INFO CARD ──
export const BusinessInfoCard = React.memo(function BusinessInfoCard({ provider }) {
  if (!provider) return null;

  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>Business Profile Summary</Text>
      <Text style={styles.infoCardVal}>Name: {provider.name}</Text>
      <Text style={styles.infoCardVal}>Category: {provider.category}</Text>
      <Text style={styles.infoCardVal}>Timings: {provider.hours}</Text>
      <View style={{ marginTop: 8 }}>
        <VerifiedBadge />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  verifiedBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  verifiedBadgeText: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '850',
  },
  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '850',
    color: '#111827',
    marginBottom: 12,
  },
  detailsBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '800',
  },
  privacyNote: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    lineHeight: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '850',
    color: '#2563EB',
  },
  profileMeta: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '850',
    color: '#1E293B',
  },
  profileCategory: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  profileBadgeRow: {
    marginBottom: 12,
  },
  profileDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  profileInfoList: {
    gap: 6,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  profileInfoText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '750',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '850',
    color: '#1E293B',
    marginBottom: 6,
  },
  infoCardVal: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '650',
    marginTop: 2,
  },
});
