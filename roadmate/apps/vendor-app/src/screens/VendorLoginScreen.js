import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const preSavedEmails = [
  'speedauto@gmail.com',
  'crystalwash@gmail.com',
  'rescue247@gmail.com',
];

export default function VendorLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectEmail = (selected) => {
    setEmail(selected);
    setError('');
  };

  const handleGetOtp = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please choose or enter a valid email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email format.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('VendorOtp', { mode: 'login', email: trimmed });
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Vendor Login</Text>
            <Text style={styles.headerSubtitle}>Sign in to your Partner Portal</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Select Registered Email</Text>
        
        {/* Pre-saved emails grid */}
        <View style={styles.savedEmailsGrid}>
          {preSavedEmails.map((item) => {
            const active = email === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelectEmail(item)}
                style={[styles.savedEmailCard, active ? styles.savedEmailCardActive : null]}
                activeOpacity={0.7}
              >
                <View style={[styles.avatarBadge, { backgroundColor: active ? '#2563EB' : '#EFF6FF' }]}>
                  <Text style={[styles.avatarEmoji, { color: active ? 'white' : '#2563EB' }]}>✉️</Text>
                </View>
                <Text style={[styles.savedEmailText, active ? styles.savedEmailTextActive : null]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Input */}
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>Or enter email manually</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. yourname@business.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
          />
        </View>

        {/* Error message */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Get OTP Button */}
        <TouchableOpacity
          disabled={!email || loading}
          onPress={handleGetOtp}
          style={[styles.btn, email ? styles.btnEnabled : styles.btnDisabled]}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.btnText}>Send Verification OTP →</Text>
          )}
        </TouchableOpacity>
      </View>
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
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  savedEmailsGrid: {
    gap: 10,
    marginBottom: 24,
  },
  savedEmailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  savedEmailCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  avatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  savedEmailText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  savedEmailTextActive: {
    color: '#2563EB',
  },
  inputBox: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    fontSize: 14,
    color: '#111827',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  btnEnabled: {
    backgroundColor: '#1E3A8A',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
