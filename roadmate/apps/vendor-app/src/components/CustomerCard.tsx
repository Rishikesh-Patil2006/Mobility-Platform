import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomerHistoryProfile } from '../services/vendorCustomerHistoryService';
import QuickActionButtons from './QuickActionButtons';

interface CustomerCardProps {
  customer: CustomerHistoryProfile;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{customer.name[0]}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.contact}>{customer.mobile} · {customer.email}</Text>
          <Text style={styles.lastText}>Last interaction: {customer.lastInteraction}</Text>
        </View>
        <View style={styles.visitBadge}>
          <Text style={styles.visitCount}>{customer.visitCount}</Text>
          <Text style={styles.visitLbl}>Visits</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionLbl}>Registered Vehicles:</Text>
        <View style={styles.tagGrid}>
          {customer.vehicles.map((v) => (
            <View key={v} style={styles.tag}>
              <Text style={styles.tagText}>🚗 {v}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLbl}>Frequently Requested Services:</Text>
        <View style={styles.tagGrid}>
          {customer.frequentlyUsedServices.map((s) => (
            <View key={s} style={[styles.tag, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Text style={[styles.tagText, { color: '#1E3A8A' }]}>🔧 {s}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statLine}>Total Bookings: <Text style={styles.statVal}>{customer.previousBookingsCount}</Text></Text>
          <Text style={styles.statLine}>Total Enquiries: <Text style={styles.statVal}>{customer.previousEnquiriesCount}</Text></Text>
        </View>
      </View>

      <QuickActionButtons
        customerName={customer.name}
        customerMobile={customer.mobile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  contact: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    marginTop: 1,
  },
  lastText: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  visitBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  visitCount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  visitLbl: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  body: {
    marginBottom: 8,
  },
  sectionLbl: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 6,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
  },
  statLine: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  statVal: {
    fontWeight: '900',
    color: '#0F172A',
  },
});
export default CustomerCard;
