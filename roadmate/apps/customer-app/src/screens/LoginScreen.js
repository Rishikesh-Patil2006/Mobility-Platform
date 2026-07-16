import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';

const savedAccounts = [
  { email: 'rp6870888@gmail.com', name: 'Rushikesh Patil', avatar: '👤' },
  { email: 'rushikesh.work@gmail.com', name: 'Rushikesh (Work)', avatar: '💼' },
  { email: 'rp@yahoo.in', name: 'Rushikesh Yahoo', avatar: '🅨' },
];

export default function LoginScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping float animation for the Mail envelope badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      navigation.navigate('OtpVerification', { mode: 'email', email: selected });
    }, 900);
  };

  return (
    <View style={styles.container}>
      {/* Header with blue gradient style */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Choose Email</Text>
            <Text style={styles.headerSubtitle}>Select account to continue</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Animated Mail Icon Badge */}
        <Animated.View style={[styles.mailBadge, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.mailEnvelope}>
            <View style={styles.mailEnvelopeFlap} />
            <View style={styles.mailEnvelopeLines} />
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Which account?</Text>
        <Text style={styles.sectionSubtitle}>
          An OTP will be sent to the selected email address.
        </Text>

        {/* Accounts List */}
        <View style={styles.listContainer}>
          {savedAccounts.map((acc) => {
            const isSelected = selected === acc.email;
            return (
              <TouchableOpacity
                key={acc.email}
                onPress={() => setSelected(acc.email)}
                activeOpacity={0.85}
                style={[
                  styles.accountCard,
                  isSelected ? styles.accountCardSelected : null,
                ]}
              >
                {/* Avatar */}
                <View style={[styles.avatarBox, isSelected ? styles.avatarBoxSelected : null]}>
                  <Text style={styles.avatarText}>{acc.avatar}</Text>
                </View>

                {/* Details */}
                <View style={styles.accountDetails}>
                  <Text style={styles.accountName}>{acc.name}</Text>
                  <Text style={styles.accountEmail} numberOfLines={1}>{acc.email}</Text>
                </View>

                {/* Checkbox circle indicator */}
                <View style={[styles.checkCircle, isSelected ? styles.checkCircleSelected : null]}>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Another Email */}
        <TouchableOpacity style={styles.addEmailButton} activeOpacity={0.7}>
          <Text style={styles.addEmailText}>+ Use a different email address</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          disabled={!selected || sending}
          onPress={handleContinue}
          style={[
            styles.continueButton,
            selected ? styles.continueButtonEnabled : styles.continueButtonDisabled,
          ]}
          activeOpacity={0.88}
        >
          {sending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={[styles.continueText, selected ? styles.continueTextEnabled : null]}>
              Send OTP →
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          🔒 OTP expires in 5 minutes
        </Text>
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
    paddingTop: 50,
    paddingBottom: 24,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(219, 234, 254, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  mailBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  mailEnvelope: {
    width: 30,
    height: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mailEnvelopeFlap: {
    width: 22,
    height: 11,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#2563EB',
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    position: 'absolute',
    top: 0,
  },
  mailEnvelopeLines: {
    width: 14,
    height: 2,
    backgroundColor: '#2563EB',
    position: 'absolute',
    bottom: 4,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  listContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  accountCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  accountCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarBoxSelected: {
    backgroundColor: '#DBEAFE',
  },
  avatarText: {
    fontSize: 20,
  },
  accountDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  accountEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkMark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addEmailButton: {
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#BFDBFE',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginBottom: 24,
  },
  addEmailText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  continueButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonEnabled: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  continueTextEnabled: {
    color: 'white',
  },
  securityNote: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
