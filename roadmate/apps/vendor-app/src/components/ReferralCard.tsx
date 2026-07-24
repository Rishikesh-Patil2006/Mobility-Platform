import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ReferralDetails } from '../services/vendorReferralService';

interface ReferralCardProps {
  referral: ReferralDetails;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ referral }) => {
  const handleCopyCode = () => {
    Alert.alert('Referral Code Copied', `Copied code: ${referral.referralCode}`);
  };

  const handleShareReferral = () => {
    Alert.alert('Share Referral', `Join RoadMate using my referral code: ${referral.referralCode}`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎁 Partner Referral Program</Text>
      <Text style={styles.desc}>Invite fellow vendors or customer fleets to RoadMate and earn wallet rewards.</Text>

      <View style={styles.codeRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codeLbl}>Your Referral Code:</Text>
          <Text style={styles.codeVal}>{referral.referralCode}</Text>
        </View>

        <TouchableOpacity onPress={handleCopyCode} style={styles.copyBtn}>
          <Text style={styles.copyText}>📋 Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShareReferral} style={styles.shareBtn}>
          <Text style={styles.shareText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{referral.referralCount}</Text>
          <Text style={styles.statLbl}>Total Referrals</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statVal, { color: '#16A34A' }]}>₹{referral.rewardPoints}</Text>
          <Text style={styles.statLbl}>Reward Credits</Text>
        </View>
      </View>

      {/* History List */}
      <Text style={styles.historyTitle}>Recent Referral Activity:</Text>
      {referral.referralHistory.map((item) => (
        <View key={item.id} style={styles.historyRow}>
          <Text style={styles.custName}>👤 {item.customerName}</Text>
          <Text style={styles.joinedDate}>{item.joinedDate}</Text>
          <Text style={styles.rewardTag}>{item.rewardEarned}</Text>
        </View>
      ))}
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
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  desc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 8,
    marginBottom: 12,
  },
  codeBox: {
    flex: 1,
  },
  codeLbl: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '700',
  },
  codeVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  copyBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  copyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  shareBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  shareText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'white',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E3A8A',
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 1,
  },
  historyTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  custName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  joinedDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  rewardTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#16A34A',
  },
});
export default ReferralCard;
