import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EnquiryItem, EnquiryStatus } from '../services/vendorEnquiryService';
import BookingStatusBadge from './BookingStatusBadge';
import QuickActionButtons from './QuickActionButtons';

interface EnquiryCardProps {
  enquiry: EnquiryItem;
  onUpdateStatus: (newStatus: EnquiryStatus) => void;
  onDelete: () => void;
}

export const EnquiryCard: React.FC<EnquiryCardProps> = ({
  enquiry,
  onUpdateStatus,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.id}>#{enquiry.id}</Text>
          <Text style={styles.time}>🕒 {enquiry.dateTime}</Text>
        </View>
        <BookingStatusBadge status={enquiry.status} />
      </View>

      <View style={styles.body}>
        <View style={styles.customerRow}>
          <Text style={styles.name}>{enquiry.customerName}</Text>
          <Text style={styles.phone}>{enquiry.customerMobile}</Text>
        </View>

        <View style={styles.serviceBox}>
          <Text style={styles.serviceLbl}>Requested Service:</Text>
          <Text style={styles.serviceVal}>{enquiry.requestedService}</Text>
        </View>

        <Text style={styles.msgTitle}>Customer Enquiry Message:</Text>
        <Text style={styles.msgText}>"{enquiry.message}"</Text>

        {enquiry.quotationAmount ? (
          <View style={styles.quoteBox}>
            <Text style={styles.quoteLbl}>Quotation Amount Sent:</Text>
            <Text style={styles.quoteVal}>₹{enquiry.quotationAmount}</Text>
          </View>
        ) : null}

        {enquiry.notes ? <Text style={styles.notes}>📝 Notes: {enquiry.notes}</Text> : null}
      </View>

      {/* Customer Quick Contact Triggers */}
      <QuickActionButtons
        customerName={enquiry.customerName}
        customerMobile={enquiry.customerMobile}
        serviceName={enquiry.requestedService}
      />

      {/* Enquiry Status Action Bar */}
      <View style={styles.actionBar}>
        <Text style={styles.actionLbl}>Update Status:</Text>
        <View style={styles.statusChips}>
          {(['New', 'Contacted', 'Quotation Sent', 'Converted', 'Closed'] as EnquiryStatus[]).map((st) => {
            const active = enquiry.status === st;
            return (
              <TouchableOpacity
                key={st}
                onPress={() => onUpdateStatus(st)}
                style={[styles.chip, active ? styles.chipActive : null]}
              >
                <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{st}</Text>
              </TouchableOpacity>
            );
          })}
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
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  id: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  time: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  body: {
    marginBottom: 8,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  phone: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  serviceBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  serviceLbl: {
    fontSize: 10,
    color: '#1E3A8A',
    fontWeight: '700',
  },
  serviceVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 1,
  },
  msgTitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 2,
  },
  msgText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  quoteLbl: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '700',
  },
  quoteVal: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '900',
  },
  notes: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  actionBar: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionLbl: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: 'white',
  },
});
export default EnquiryCard;
