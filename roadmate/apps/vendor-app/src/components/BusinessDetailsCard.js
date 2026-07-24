import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BusinessDetailsCard({
  profile,
  businessName,
  ownerName,
  yearsOfExperience,
  mainCategory,
  subcategory,
  businessDescription,
  onEdit,
}) {
  const bName = profile?.businessName || businessName || 'Speed Auto Garage';
  const oName = profile?.ownerName || ownerName || 'Rishikesh Patil';
  const exp = profile?.yearsOfExperience || yearsOfExperience || '8';
  const cat = profile?.mainCategory || mainCategory || 'Garage & Car Care';
  const sub = profile?.subcategory || subcategory || 'General Repair & Tune Up';
  const desc = profile?.businessDescription || businessDescription || 'Premier multi-brand vehicle service workshop equipped with modern hydraulic lifts and computerized engine diagnostic tools.';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>🏢 Business Particulars</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Business Name</Text>
        <Text style={styles.value}>{bName}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>Owner Name</Text>
        <Text style={styles.value}>{oName}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>Experience</Text>
        <Text style={styles.value}>{exp} Years</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>Main Category</Text>
        <Text style={styles.value}>{cat}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop]}>
        <Text style={styles.label}>Subcategory</Text>
        <Text style={styles.value}>{sub}</Text>
      </View>

      <View style={[styles.itemRow, styles.borderTop, { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <Text style={[styles.label, { marginBottom: 6 }]}>About Description</Text>
        <Text style={styles.descriptionText}>{desc}</Text>
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
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
});
