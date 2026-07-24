import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import {
  getAvailabilityState,
  subscribeAvailability,
  setAvailableStatus,
  setBusyStatus,
  setClosedStatus,
  setOnLeaveStatus,
} from '../services/vendorAvailabilityService';

export default function AvailabilityStatusCard() {
  const [availState, setAvailState] = useState(getAvailabilityState());
  const [modalVisible, setModalVisible] = useState(false);

  // Selected status in modal
  const [selectedStatus, setSelectedStatus] = useState('Available');

  // Busy duration states
  const [busyPreset, setBusyPreset] = useState('30 Mins');
  const [customBusyMinutes, setCustomBusyMinutes] = useState('');

  // On Leave date states
  const [leaveStart, setLeaveStart] = useState(new Date().toISOString().split('T')[0]);
  const [leaveEnd, setLeaveEnd] = useState(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);

  // Confirmation state
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAvailability((newState) => {
      setAvailState(newState);
      setSelectedStatus(newState.status);
    });
    return () => unsubscribe();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Available':
        return { emoji: '🟢', bg: '#DCFCE7', text: '#166534', label: 'Available' };
      case 'Busy':
        return { emoji: '🟡', bg: '#FEF3C7', text: '#92400E', label: 'Busy' };
      case 'Closed':
        return { emoji: '🔴', bg: '#FEE2E2', text: '#991B1B', label: 'Closed' };
      case 'On Leave':
        return { emoji: '🟣', bg: '#F3E8FF', text: '#6B21A8', label: 'On Leave' };
      default:
        return { emoji: '🟢', bg: '#DCFCE7', text: '#166534', label: 'Available' };
    }
  };

  const currentConfig = getStatusConfig(availState.status);

  // Format remaining time text for Busy
  const getBusyRemainingText = () => {
    if (!availState.busyUntil) return '';
    const diff = Math.max(0, Math.ceil((availState.busyUntil - Date.now()) / 60000));
    return `Auto-reverts to Available in ${diff} min(s)`;
  };

  const handleOpenSelector = () => {
    setSelectedStatus(availState.status);
    setConfirming(false);
    setModalVisible(true);
  };

  const handleApplyStatusChange = async () => {
    setConfirming(false);
    setModalVisible(false);

    if (selectedStatus === 'Available') {
      await setAvailableStatus();
    } else if (selectedStatus === 'Busy') {
      let mins = 30;
      let label = busyPreset;

      if (busyPreset === '15 Mins') mins = 15;
      else if (busyPreset === '30 Mins') mins = 30;
      else if (busyPreset === '1 Hour') mins = 60;
      else if (busyPreset === '2 Hours') mins = 120;
      else if (busyPreset === 'Custom Time') {
        mins = Number(customBusyMinutes) || 45;
        label = `${mins} Mins`;
      }

      await setBusyStatus(label, mins);
    } else if (selectedStatus === 'Closed') {
      await setClosedStatus();
    } else if (selectedStatus === 'On Leave') {
      await setOnLeaveStatus(leaveStart, leaveEnd);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        onPress={handleOpenSelector}
        style={styles.cardHeader}
        activeOpacity={0.82}
      >
        <View style={styles.leftCol}>
          <Text style={styles.cardTitle}>Workshop Availability State</Text>
          <View style={[styles.statusBadge, { backgroundColor: currentConfig.bg }]}>
            <Text style={[styles.statusText, { color: currentConfig.text }]}>
              {currentConfig.emoji} {currentConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text style={styles.changeText}>Tap to Change ❯</Text>
        </View>
      </TouchableOpacity>

      {/* Context info banner */}
      {availState.status === 'Busy' && (
        <View style={styles.infoBannerBusy}>
          <Text style={styles.infoBannerText}>
            ⏱️ {availState.busyDurationLabel ? `Busy (${availState.busyDurationLabel})` : 'Busy'} · {getBusyRemainingText()}
          </Text>
        </View>
      )}

      {availState.status === 'On Leave' && (
        <View style={styles.infoBannerLeave}>
          <Text style={styles.infoBannerLeaveText}>
            🌴 On Leave: {availState.leaveStartDate} to {availState.leaveEndDate} · Auto-restores on return
          </Text>
        </View>
      )}

      {availState.status === 'Closed' && (
        <View style={styles.infoBannerClosed}>
          <Text style={styles.infoBannerClosedText}>
            🔒 Workshop Closed · Customer bookings paused
          </Text>
        </View>
      )}

      {/* Main Selector Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🚦 Manage Availability Status</Text>
            <Text style={styles.modalSub}>
              Changes apply instantly across Home, Profile & Customer App search results.
            </Text>

            {/* Status Options Grid */}
            <View style={styles.statusGrid}>
              {[
                { status: 'Available', emoji: '🟢', label: 'Available', desc: 'Open for all bookings & walk-ins' },
                { status: 'Busy', emoji: '🟡', label: 'Busy', desc: 'High load · Set auto-restore timer' },
                { status: 'Closed', emoji: '🔴', label: 'Closed', desc: 'Workshop closed today' },
                { status: 'On Leave', emoji: '🟣', label: 'On Leave', desc: 'Temporary leave · Set start & end date' },
              ].map((opt) => {
                const isSelected = selectedStatus === opt.status;
                return (
                  <TouchableOpacity
                    key={opt.status}
                    onPress={() => setSelectedStatus(opt.status)}
                    style={[styles.optCard, isSelected ? styles.optCardSelected : null]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optHeader}>
                      <Text style={styles.optTitle}>{opt.emoji} {opt.label}</Text>
                      {isSelected && <Text style={styles.selectedMark}>✓ Selected</Text>}
                    </View>
                    <Text style={styles.optDesc}>{opt.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Busy Duration Options */}
            {selectedStatus === 'Busy' && (
              <View style={styles.sectionSubBox}>
                <Text style={styles.sectionSubTitle}>How long will you be busy?</Text>
                <View style={styles.presetGrid}>
                  {['15 Mins', '30 Mins', '1 Hour', '2 Hours', 'Custom Time'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setBusyPreset(p)}
                      style={[styles.presetBtn, busyPreset === p ? styles.presetBtnActive : null]}
                    >
                      <Text style={[styles.presetText, busyPreset === p ? styles.presetTextActive : null]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {busyPreset === 'Custom Time' && (
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLbl}>Custom Minutes:</Text>
                    <TextInput
                      style={styles.numInput}
                      keyboardType="numeric"
                      placeholder="45"
                      value={customBusyMinutes}
                      onChangeText={setCustomBusyMinutes}
                    />
                  </View>
                )}
              </View>
            )}

            {/* On Leave Date Options */}
            {selectedStatus === 'On Leave' && (
              <View style={styles.sectionSubBox}>
                <Text style={styles.sectionSubTitle}>Select Leave Duration:</Text>
                <View style={styles.datesRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLbl}>Start Date:</Text>
                    <TextInput style={styles.dateInput} value={leaveStart} onChangeText={setLeaveStart} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLbl}>End Date:</Text>
                    <TextInput style={styles.dateInput} value={leaveEnd} onChangeText={setLeaveEnd} />
                  </View>
                </View>
              </View>
            )}

            {/* Modal Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setConfirming(true)} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Step Sub-Modal */}
      <Modal visible={confirming} animationType="fade" transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmContent}>
            <Text style={styles.confirmTitle}>Confirm Status Change</Text>
            <Text style={styles.confirmDesc}>
              Confirm setting workshop status to <Text style={styles.boldText}>{selectedStatus}</Text>?
              {selectedStatus === 'Busy' ? ` (Auto-restores to Available after ${busyPreset})` : ''}
              {selectedStatus === 'On Leave' ? ` (Auto-restores to Available on ${leaveEnd})` : ''}
            </Text>

            <View style={styles.confirmActionRow}>
              <TouchableOpacity onPress={() => setConfirming(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleApplyStatusChange} style={styles.saveBtn}>
                <Text style={styles.saveText}>Confirm & Sync</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCol: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '900',
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  infoBannerBusy: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  infoBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  infoBannerLeave: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  infoBannerLeaveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B21A8',
  },
  infoBannerClosed: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
  },
  infoBannerClosedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 14,
  },
  statusGrid: {
    gap: 8,
    marginBottom: 14,
  },
  optCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
  },
  optCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E3A8A',
  },
  optHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  optTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  selectedMark: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  optDesc: {
    fontSize: 10.5,
    color: '#64748B',
  },
  sectionSubBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  sectionSubTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  presetBtnActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  presetTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  inputLbl: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  numInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '800',
    width: 60,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.5,
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 12.5,
    fontWeight: '900',
  },

  // Confirm Modal
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
  boldText: {
    fontWeight: '900',
    color: '#1E3A8A',
  },
  confirmActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
