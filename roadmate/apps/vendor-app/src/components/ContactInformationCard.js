import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ContactInformationCard({
  profile,
  email,
  mobile,
  whatsapp,
  address,
  city,
  state,
  pinCode,
  location,
  onEdit,
}) {
  const em = profile?.businessEmail || email || 'speedauto@gmail.com';
  const mob = profile?.mobileNumber || mobile || '9876543210';
  const wa = profile?.whatsAppNumber || whatsapp || '9876543210';
  const addr = profile?.address || address || 'Plot 42, MIDC Industrial Area';
  const ct = profile?.city || city || 'Jalgaon';
  const st = profile?.state || state || 'Maharashtra';
  const pin = profile?.pinCode || pinCode || '425001';
  const loc = profile?.locationCoordinates ? `${profile.locationCoordinates.latitude}, ${profile.locationCoordinates.longitude}` : location || '21.0077° N, 75.5626° E';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>📞 Contact & Address</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.value}>{em}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>+91 {mob}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>WhatsApp Number</Text>
        <Text style={styles.value}>+91 {wa}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>Address</Text>
        <Text style={[styles.value, styles.addressText]}>
          {addr}, {ct}, {st} - {pin}
        </Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>GPS Coordinates</Text>
        <View style={styles.gpsContainer}>
          <Text style={styles.gpsText}>📍 {loc}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  editBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  addressText: {
    maxWidth: '60%',
    textAlign: 'right',
  },
  gpsContainer: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
});
