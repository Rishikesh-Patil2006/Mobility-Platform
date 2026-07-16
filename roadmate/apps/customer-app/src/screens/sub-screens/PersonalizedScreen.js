import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function PersonalizedScreen({ vehicles = [], onLogout, onOpenDoc }) {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Rushikesh Patil</Text>
            <Text style={styles.profileEmail}>rp6870888@gmail.com</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        {/* Document Action Alerts */}
        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>⚠️ Action Required</Text>
          <TouchableOpacity 
            onPress={() => onOpenDoc('puc', '2')} 
            style={styles.alertCard}
            activeOpacity={0.8}
          >
            <View style={styles.alertIconCircle}>
              <Text style={styles.alertEmoji}>💨</Text>
            </View>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertLabel}>PUC Expired</Text>
              <Text style={styles.alertSub}>Your Activa 6G PUC has expired. Tap to view details.</Text>
            </View>
            <Text style={styles.alertArrow}>❯</Text>
          </TouchableOpacity>
        </View>

        {/* My Registered Vehicles & Quick Document Access */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Registered Vehicles</Text>
          {vehicles.map((v, idx) => (
            <View key={v.id} style={[styles.vehicleRow, idx > 0 ? styles.borderTop : null]}>
              <View style={styles.vehicleHeader}>
                <View style={styles.vehicleIconBox}>
                  <Text style={styles.vehicleEmojiIcon}>
                    {v.type === 'car' ? '🚗' : v.type === 'ev' ? '⚡' : v.type === 'scooty' ? '🛵' : '🏍️'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.vehicleName}>{v.name}</Text>
                  <Text style={styles.vehicleNumber}>{v.number} · {v.fuel}</Text>
                </View>
              </View>

              {/* Connected documents quick launch row */}
              <View style={styles.docsQuickLaunchRow}>
                {[
                  { key: 'puc', label: 'PUC', em: '🟢' },
                  { key: 'rc', label: 'RC Book', em: '🔵' },
                  { key: 'driving-license', label: 'License', em: '🟣' },
                  { key: 'insurance', label: 'Insurance', em: '🟡' },
                ].map((doc) => (
                  <TouchableOpacity
                    key={doc.key}
                    onPress={() => onOpenDoc(doc.key, v.id)}
                    style={styles.docQuickPill}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.docPillEmoji}>{doc.em}</Text>
                    <Text style={styles.docPillText}>{doc.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Preferences Toggle Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingToggleRow}>
            <View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Get alerts for document renewals</Text>
            </View>
            <Switch
              value={pushNotif}
              onValueChange={setPushNotif}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={pushNotif ? '#2563EB' : '#F3F4F6'}
            />
          </View>

          <View style={[styles.settingToggleRow, styles.borderTop]}>
            <View>
              <Text style={styles.settingLabel}>Email Reminders</Text>
              <Text style={styles.settingDesc}>Receive statements on email</Text>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={emailAlerts ? '#2563EB' : '#F3F4F6'}
            />
          </View>

          <View style={[styles.settingToggleRow, styles.borderTop]}>
            <View>
              <Text style={styles.settingLabel}>Background Sync</Text>
              <Text style={styles.settingDesc}>Auto-sync docs with Parivahan daily</Text>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
              thumbColor={autoSync ? '#2563EB' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          {[
            { l: 'Call Customer Care', desc: 'Speak to our support team', action: () => {} },
            { l: 'Privacy Policy', desc: 'Read terms & privacy options', action: () => {} },
          ].map((item, idx) => (
            <TouchableOpacity 
              key={item.l} 
              style={[styles.supportRow, idx > 0 ? styles.borderTop : null]} 
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.supportLabel}>{item.l}</Text>
                <Text style={styles.supportDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.supportArrow}>❯</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Red Logout Button */}
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.88}>
          <Text style={styles.logoutButtonText}>🚪 Logout Session</Text>
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
    backgroundColor: '#2563EB',
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    color: 'rgba(219, 234, 254, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  alertSection: {
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  alertIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertEmoji: {
    fontSize: 18,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  alertSub: {
    fontSize: 11,
    color: '#D97706',
    marginTop: 2,
  },
  alertArrow: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
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
  vehicleRow: {
    paddingVertical: 14,
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  vehicleIconBox: {
    width: 38,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleEmojiIcon: {
    fontSize: 16,
  },
  vehicleName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  vehicleNumber: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  docsQuickLaunchRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  docQuickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  docPillEmoji: {
    fontSize: 9,
  },
  docPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  settingToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  settingDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  supportLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  supportDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  supportArrow: {
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
    fontWeight: '800',
  },
});
