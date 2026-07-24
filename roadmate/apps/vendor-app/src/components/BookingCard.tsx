import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookingItem } from '../services/vendorBookingService';
import BookingStatusBadge from './BookingStatusBadge';
import QuickActionButtons from './QuickActionButtons';

interface BookingCardProps {
  booking: BookingItem;
  onPressDetails: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkInProgress?: () => void;
  onMarkCompleted?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPressDetails,
  onAccept,
  onReject,
  onMarkInProgress,
  onMarkCompleted,
}) => {
  const isPending = booking.bookingStatus === 'Pending';
  const isAccepted = booking.bookingStatus === 'Accepted' || booking.bookingStatus === 'Confirmed';
  const isInProgress = booking.bookingStatus === 'In Progress';

  return (
    <View style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.idBlock}>
          <Text style={styles.idText}>#{booking.id}</Text>
          <Text style={styles.dateText}>📅 {booking.bookingDate} · ⏱️ {booking.bookingTime}</Text>
        </View>
        <BookingStatusBadge status={booking.bookingStatus} />
      </View>

      {/* Customer & Service Core Block */}
      <TouchableOpacity onPress={onPressDetails} activeOpacity={0.7} style={styles.middleBlock}>
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{booking.customerName[0]}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.name}>{booking.customerName}</Text>
            <Text style={styles.vehicle}>🚗 {booking.vehicleName} ({booking.vehicleNumber})</Text>
          </View>
          <View style={styles.amountBlock}>
            <Text style={styles.amount}>₹{booking.amount}</Text>
            <Text style={styles.paymentStatus}>{booking.paymentStatus}</Text>
          </View>
        </View>

        <View style={styles.serviceBox}>
          <Text style={styles.serviceLabel}>Service Requested:</Text>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
        </View>

        {booking.notes ? (
          <Text style={styles.notesText} numberOfLines={1}>
            💬 Notes: {booking.notes}
          </Text>
        ) : null}
      </TouchableOpacity>

      {/* Quick Customer Contact Triggers */}
      <QuickActionButtons
        customerName={booking.customerName}
        customerMobile={booking.customerMobile}
        address={booking.address}
        bookingId={booking.id}
        serviceName={booking.serviceName}
      />

      {/* Primary Lifecycle Status Action Bar */}
      <View style={styles.actionsRow}>
        {isPending && (
          <>
            <TouchableOpacity onPress={onAccept} style={[styles.actionBtn, styles.acceptBtn]}>
              <Text style={styles.actionBtnText}>✓ Accept Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onReject} style={[styles.actionBtn, styles.rejectBtn]}>
              <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>✕ Reject</Text>
            </TouchableOpacity>
          </>
        )}

        {isAccepted && (
          <TouchableOpacity onPress={onMarkInProgress} style={[styles.actionBtn, styles.progressBtn]}>
            <Text style={styles.actionBtnText}>⚙️ Mark In Progress</Text>
          </TouchableOpacity>
        )}

        {isInProgress && (
          <TouchableOpacity onPress={onMarkCompleted} style={[styles.actionBtn, styles.completeBtn]}>
            <Text style={styles.actionBtnText}>🎉 Mark Completed & Delivered</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onPressDetails} style={styles.detailsBtn}>
          <Text style={styles.detailsBtnText}>View Details →</Text>
        </TouchableOpacity>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  idBlock: {
    gap: 2,
  },
  idText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  middleBlock: {
    marginBottom: 8,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  customerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  vehicle: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    marginTop: 1,
  },
  amountBlock: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  paymentStatus: {
    fontSize: 9.5,
    color: '#16A34A',
    fontWeight: '800',
  },
  serviceBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  serviceLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  serviceName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 1,
  },
  notesText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingTop: 10,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#1E3A8A',
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  progressBtn: {
    backgroundColor: '#0284C7',
  },
  completeBtn: {
    backgroundColor: '#16A34A',
    flex: 1,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  detailsBtn: {
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  detailsBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2563EB',
  },
});
export default BookingCard;
