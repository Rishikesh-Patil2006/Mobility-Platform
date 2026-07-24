import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';

interface ShareCardProps {
  businessName: string;
  businessAddress: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({
  businessName = 'Speed Auto Garage',
  businessAddress = 'Court Road, Jalgaon',
}) => {
  const [qrOpen, setQrOpen] = useState(false);

  const handleShareProfile = () => {
    Alert.alert('Share Business', `Sharing link for ${businessName}: https://roadmate.app/vendor/v-101`);
  };

  const handleCopyLink = () => {
    Alert.alert('Link Copied', 'Business profile link copied to clipboard!');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📢 Share & Grow Your Business</Text>
      <Text style={styles.desc}>Promote your workshop profile, share services, or generate a printable QR code for customer check-in.</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity onPress={handleShareProfile} style={[styles.btn, styles.shareBtn]}>
          <Text style={styles.shareText}>🔗 Share Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setQrOpen(true)} style={[styles.btn, styles.qrBtn]}>
          <Text style={styles.qrText}>📷 Business QR</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCopyLink} style={[styles.btn, styles.copyBtn]}>
          <Text style={styles.copyText}>📋 Copy Link</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Modal Preview */}
      <Modal visible={qrOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.qrModalTitle}>Workshop Check-In QR</Text>
            <Text style={styles.qrBizName}>{businessName}</Text>
            <Text style={styles.qrBizAddress}>{businessAddress}</Text>

            {/* Simulated QR Code Graphic Box */}
            <View style={styles.qrBox}>
              <View style={styles.qrCornerTL} />
              <View style={styles.qrCornerTR} />
              <View style={styles.qrCornerBL} />
              <Text style={styles.qrCenterText}>[ QR CODE ]</Text>
              <Text style={styles.qrSubText}>Scan to View Services & Book</Text>
            </View>

            <TouchableOpacity onPress={() => setQrOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  desc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareBtn: {
    backgroundColor: '#1E3A8A',
  },
  shareText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  qrBtn: {
    backgroundColor: '#8B5CF6',
  },
  qrText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
  },
  copyBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  copyText: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '800',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 340,
  },
  qrModalTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  qrBizName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  qrBizAddress: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 16,
  },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  qrCornerTL: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  qrCornerTR: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  qrCornerBL: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  qrCenterText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  qrSubText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 6,
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
});
export default ShareCard;
