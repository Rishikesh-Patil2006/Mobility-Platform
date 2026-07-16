import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function VendorProfileTab({ onLogout }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Partner Profile</Text>
        <Text style={styles.headerSubtitle}>View and manage business settings</Text>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>🏬</Text>
            </View>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>Speed Auto Garage</Text>
              <Text style={styles.shopCategory}>Garage & Recovery</Text>
            </View>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Owner Name</Text>
              <Text style={styles.detailValue}>Rushikesh Patil</Text>
            </View>
            <View style={[styles.detailRow, styles.borderTop]}>
              <Text style={styles.detailLabel}>Mobile Number</Text>
              <Text style={styles.detailValue}>+91 98765 43210</Text>
            </View>
            <View style={[styles.detailRow, styles.borderTop]}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>speedauto@gmail.com</Text>
            </View>
            <View style={[styles.detailRow, styles.borderTop]}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>Jalgaon, MH</Text>
            </View>
          </View>
        </View>

        {/* Business Settings Quick Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {[
            { label: 'Edit Business Profile', desc: 'Photos, descriptions, social handles', icon: '📝' },
            { label: 'Document Vault', desc: 'GST, PAN, Aadhaar verified links', icon: '🛡️' },
            { label: 'Notifications', desc: 'Lead alerts, sounds, soundboard', icon: '🔔' },
          ].map((item, idx) => (
            <TouchableOpacity 
              key={item.label} 
              style={[styles.menuRow, idx > 0 ? styles.borderTop : null]} 
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuEmoji}>{item.icon}</Text>
                </View>
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>❯</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>
          {[
            { label: 'Partner Care Hotline', desc: 'Talk to partner helpline', icon: '📞' },
            { label: 'Help & Knowledge Center', desc: 'Read guides and tutorials', icon: '❓' },
          ].map((item, idx) => (
            <TouchableOpacity 
              key={item.label} 
              style={[styles.menuRow, idx > 0 ? styles.borderTop : null]} 
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuEmoji}>{item.icon}</Text>
                </View>
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>❯</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Red Logout Button */}
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.88}>
          <Text style={styles.logoutButtonText}>🚪 Logout Partner Session</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 20,
  },
  headerSubtitle: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
    paddingHorizontal: 20,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  avatarText: {
    fontSize: 26,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  shopCategory: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  detailsList: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '800',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuEmoji: {
    fontSize: 15,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  menuDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '805',
  },
});
