import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';

export type BusinessActiveStatus =
  | 'Available'
  | 'Busy'
  | 'Closed'
  | 'On Leave'
  | 'Emergency Service Only';

interface StatusOption {
  status: BusinessActiveStatus;
  emoji: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

const statusOptions: StatusOption[] = [
  {
    status: 'Available',
    emoji: '🟢',
    badgeBg: '#DCFCE7',
    badgeText: '#166534',
    description: 'Workshop open for all customer bookings, walk-ins, and online enquiries.',
  },
  {
    status: 'Busy',
    emoji: '🟡',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    description: 'High slot load. New customer bookings may experience slot delays.',
  },
  {
    status: 'Closed',
    emoji: '🔴',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    description: 'Workshop closed today. Online bookings disabled until reopened.',
  },
  {
    status: 'On Leave',
    emoji: '🟣',
    badgeBg: '#F3E8FF',
    badgeText: '#6B21A8',
    description: 'Vendor away on temporary leave. Only emergency helpline active.',
  },
  {
    status: 'Emergency Service Only',
    emoji: '⚡',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    description: 'Accepting roadside assistance, towing, and emergency breakdown calls only.',
  },
];

interface StatusSelectorModalProps {
  visible: boolean;
  currentStatus: BusinessActiveStatus;
  onSelectStatus: (newStatus: BusinessActiveStatus) => void;
  onClose: () => void;
}

export const StatusSelectorModal: React.FC<StatusSelectorModalProps> = ({
  visible,
  currentStatus,
  onSelectStatus,
  onClose,
}) => {
  const [selected, setSelected] = useState<BusinessActiveStatus>(currentStatus);
  const [confirmingStatus, setConfirmingStatus] = useState<BusinessActiveStatus | null>(null);

  const handleChoose = (status: BusinessActiveStatus) => {
    setSelected(status);
    setConfirmingStatus(status);
  };

  const handleConfirmSave = () => {
    if (confirmingStatus) {
      onSelectStatus(confirmingStatus);
      setConfirmingStatus(null);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>🚦 Manage Active Business Status</Text>
          <Text style={styles.sub}>
            Select your workshop availability state. Changes sync instantly with customer app search results.
          </Text>

          <View style={styles.list}>
            {statusOptions.map((opt) => {
              const isSelected = selected === opt.status;

              return (
                <TouchableOpacity
                  key={opt.status}
                  onPress={() => handleChoose(opt.status)}
                  style={[styles.statusOptionCard, isSelected ? styles.statusOptionCardSelected : null]}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionHeader}>
                    <View style={[styles.badge, { backgroundColor: opt.badgeBg }]}>
                      <Text style={[styles.badgeLabel, { color: opt.badgeText }]}>
                        {opt.emoji} {opt.status}
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.checkMark}>✓ Active</Text>}
                  </View>
                  <Text style={styles.optionDesc}>{opt.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmation Sub-Modal */}
      <Modal visible={!!confirmingStatus} animationType="fade" transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContent}>
            <Text style={styles.confirmTitle}>Confirm Status Change</Text>
            <Text style={styles.confirmDesc}>
              Are you sure you want to change workshop active status to{' '}
              <Text style={styles.confirmBold}>{confirmingStatus}</Text>?
            </Text>

            <View style={styles.confirmBtnRow}>
              <TouchableOpacity onPress={() => setConfirmingStatus(null)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmSave} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  sub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 16,
  },
  list: {
    gap: 10,
    marginBottom: 16,
  },
  statusOptionCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
  },
  statusOptionCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A8A',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeLabel: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  checkMark: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  optionDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#475569',
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Confirmation modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  confirmTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  confirmDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 16,
  },
  confirmBold: {
    fontWeight: '900',
    color: '#1E3A8A',
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
  },
});
export default StatusSelectorModal;
