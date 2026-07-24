import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { validateEmail, validateMobileNumber, validateWhatsAppNumber, validatePassword } from '../services/vendorProfileService';
import CategorySelector from '../components/CategorySelector';

const { width } = Dimensions.get('window');

const categories = [
  'Garage',
  'Car Wash',
  'Towing',
  'PUC Center',
  'Denting & Painting',
  'Service Center',
  'Showroom',
];

export default function VendorRegisterScreen({ navigation }) {
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [experience, setExperience] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory] = useState('');
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid =
    businessName.trim().length > 2 &&
    name.trim().length > 2 &&
    email.trim().includes('@') &&
    mobile.trim().length === 10 &&
    whatsapp.trim().length === 10 &&
    experience.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword &&
    category;

  const handleRegister = () => {
    setError('');

    // Field-level validations
    const emailErr = validateEmail(email);
    if (emailErr) { return setError(emailErr); }

    const mobileErr = validateMobileNumber(mobile);
    if (mobileErr) { return setError(mobileErr); }

    const whatsappErr = validateWhatsAppNumber(whatsapp);
    if (whatsappErr) { return setError(whatsappErr); }

    const passwordErr = validatePassword(password, confirmPassword);
    if (passwordErr) { return setError(passwordErr); }

    if (isNaN(Number(experience)) || Number(experience) < 0) {
      return setError('Years of experience must be a valid number.');
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('VendorOtp', {
        mode: 'register',
        email: email.trim().toLowerCase(),
        name: name.trim(),
        mobile: mobile.trim(),
        whatsapp: whatsapp.trim(),
        businessName: businessName.trim(),
        experience: experience.trim(),
        password: password,
        category,
      });
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
            <Text style={styles.headerTitle}>Register Business</Text>
            <Text style={styles.headerSubtitle}>Start listing your services</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        <View style={styles.formCard}>
          {/* Business Name */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Speed Auto Garage"
              placeholderTextColor="#9CA3AF"
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          {/* Owner Name */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Address */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. partner@business.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Mobile Number */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={10}
              value={mobile}
              onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* WhatsApp Number */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>WhatsApp Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={10}
              value={whatsapp}
              onChangeText={(t) => setWhatsapp(t.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* Years of Experience */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Years of Experience *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={2}
              value={experience}
              onChangeText={(t) => setExperience(t.replace(/[^0-9]/g, ''))}
            />
          </View>

          {/* Password */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Interactive Category Selector */}
          <View style={styles.inputBox}>
            <Text style={styles.label}>Select Business Category *</Text>
            <CategorySelector
              selectedCategoryId={category}
              onSelectCategory={(cat) => setCategory(cat.id)}
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Submit */}
        <TouchableOpacity
          disabled={!isFormValid || loading}
          onPress={handleRegister}
          style={[styles.btn, isFormValid ? styles.btnEnabled : styles.btnDisabled]}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.btnText}>Proceed to Verify OTP →</Text>
          )}
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
  scrollBody: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  inputBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    color: '#111827',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  dropdownValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownChevron: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 180,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
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
