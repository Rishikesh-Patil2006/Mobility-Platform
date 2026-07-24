import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function PaymentHistoryModal({ visible, payments, onClose }) {
  const handleDownloadInvoice = (invNo) => {
    Alert.alert('Download Invoice', `Downloading GST Tax Invoice ${invNo} for Super Admin payment records...`, [{ text: 'OK' }]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>📜 Payment & Subscription History</Text>
              <Text style={styles.modalSub}>Past transaction history paid to Super Admin</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {payments && payments.length > 0 ? (
              payments.map((p) => (
                <View key={p.id} style={styles.paymentCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{p.planName} Plan</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>● {p.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardInfoRow}>
                    <View>
                      <Text style={styles.amountText}>₹{p.amount}</Text>
                      <Text style={styles.dateText}>Paid on {p.date}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.txnText}>ID: {p.txnId}</Text>
                      <Text style={styles.recipientText}>Recipient: {p.recipient || 'Super Admin'}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooterRow}>
                    <Text style={styles.invoiceText}>Invoice: {p.invoiceNo}</Text>
                    <TouchableOpacity onPress={() => handleDownloadInvoice(p.invoiceNo)} style={styles.downloadBtn}>
                      <Text style={styles.downloadText}>📥 Download Invoice</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No past payment transactions recorded.</Text>
            )}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
            <Text style={styles.closeModalText}>Close Payment History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  scrollBody: {
    marginBottom: 12,
  },
  paymentCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planBadge: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  planBadgeText: {
    color: 'white',
    fontSize: 10.5,
    fontWeight: '800',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '800',
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  dateText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  txnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  recipientText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 8,
  },
  invoiceText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  downloadBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 20,
  },
  closeModalBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
