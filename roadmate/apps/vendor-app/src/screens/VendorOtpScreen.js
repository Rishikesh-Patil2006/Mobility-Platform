import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, ActivityIndicator, Dimensions } from 'react-native';
import { useVendorProfile } from '../context/VendorProfileContext';

const { width, height } = Dimensions.get('window');
const CORRECT_OTP = '123456';

export default function VendorOtpScreen({ route, navigation }) {
  const {
    mode = 'login',
    email = '',
    name = '',
    mobile = '',
    whatsapp = '',
    businessName = '',
    experience = '',
    password = '',
    category = '',
  } = route.params || {};

  const { signup, login: loginContext, profile } = useVendorProfile();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef([]);

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Shield floating loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Resend Timer countdown
    if (resendSeconds <= 0) return;
    const interval = setInterval(() => {
      setResendSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendSeconds]);

  const handleOtpChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const nextOtp = [...otp];
    nextOtp[index] = cleanText.slice(-1);
    setOtp(nextOtp);
    setError('');

    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextOtp.every((digit) => digit !== '') && cleanText) {
      verifyOtp(nextOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const nextOtp = [...otp];
      nextOtp[index - 1] = '';
      setOtp(nextOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(errorShake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const triggerConfetti = () => {
    confettiAnims.forEach((anim, i) => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 1500,
        delay: i * 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  const verifyOtp = (code) => {
    setVerifying(true);
    setError('');

    setTimeout(() => {
      setVerifying(false);
      if (code === CORRECT_OTP) {
        if (mode === 'register') {
          signup({
            businessName,
            ownerName: name,
            businessEmail: email,
            mobileNumber: mobile,
            whatsAppNumber: whatsapp,
            yearsOfExperience: experience,
            password: password,
            mainCategory: category,
          });
        } else {
          loginContext(email);
        }
        setSuccess(true);
        triggerConfetti();
        Animated.parallel([
          Animated.spring(successScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
          Animated.timing(successOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      } else {
        setError('Incorrect OTP. Try again.');
        setOtp(['', '', '', '', '', '']);
        shakeInputs();
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleRedirect = () => {
    if (mode === 'register') {
      navigation.replace('PendingApproval', { email, name, mobile, category, showOnboarding: true });
    } else {
      // Check pre-saved email statuses or the context profile loaded
      const isVerified = email === 'speedauto@gmail.com' || email === 'crystalwash@gmail.com' || email === 'rescue247@gmail.com';
      if (isVerified) {
        navigation.replace('Main');
      } else {
        navigation.replace('PendingApproval', { email, showOnboarding: false });
      }
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendSeconds(30);
    inputRefs.current[0]?.focus();
  };

  const displayEmail = email.length > 24 ? email.slice(0, 12) + '...' + email.slice(-8) : email;

  if (success) {
    return (
      <View style={styles.successContainer}>
        {confettiAnims.map((anim, i) => {
          const colors = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
          const leftOffset = 25 + i * 12;
          const fallingY = anim.interpolate({ inputRange: [0, 1], outputRange: [-40, height * 0.6] });
          const opacity = anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
          return (
            <Animated.View
              key={i}
              style={[styles.confettiDot, { left: `${leftOffset}%`, backgroundColor: colors[i % colors.length], opacity, transform: [{ translateY: fallingY }] }]}
            />
          );
        })}

        <Animated.View style={[styles.successCircle, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
          <Text style={styles.successCheck}>✓</Text>
        </Animated.View>

        <Animated.View style={[styles.successContent, { opacity: successOpacity }]}>
          <Text style={styles.successTitle}>Verified Successfully</Text>
          <Text style={styles.successSubtitle}>
            {mode === 'register' ? 'Let\'s complete your business profile now.' : 'Welcome back to RoadMate Partner.'}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.successButtonWrapper, { opacity: successOpacity }]}>
          <TouchableOpacity style={styles.dashboardButton} onPress={handleRedirect} activeOpacity={0.85}>
            <Text style={styles.dashboardButtonText}>Continue →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Verification</Text>
            <Text style={styles.headerSubtitle}>Confirm your identity</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.shieldBadge, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.shieldShape}>
            <Text style={styles.shieldCheckMark}>✓</Text>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Enter Verification Code</Text>
        <Text style={styles.sectionSubtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.emailHighlight}>{displayEmail}</Text>
        </Text>

        <Animated.View style={[styles.otpInputRow, { transform: [{ translateX: errorShake }] }]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.otpBox, error ? styles.otpBoxError : null, digit ? styles.otpBoxFilled : null]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        <Text style={styles.demoOtpHint}>
          Demo OTP: <Text style={styles.demoOtpBold}>123456</Text>
        </Text>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          disabled={otp.some((d) => !d) || verifying}
          onPress={() => verifyOtp(otp.join(''))}
          style={[styles.verifyButton, otp.every((d) => d !== '') ? styles.verifyButtonEnabled : styles.verifyButtonDisabled]}
          activeOpacity={0.88}
        >
          {verifying ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.verifyText}>Verify OTP →</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendInfo}>Didn't receive the code?</Text>
          {resendSeconds > 0 ? (
            <Text style={styles.resendCountdown}>Resend in {resendSeconds}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.securityFooter}>
          <Text style={styles.securityText}>🛡️ 256-bit encrypted · Data is secured</Text>
        </View>
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
    paddingTop: 50,
    paddingBottom: 24,
    backgroundColor: '#1E3A8A',
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
    alignItems: 'center',
  },
  shieldBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  shieldShape: {
    width: 36,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldCheckMark: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
  },
  emailHighlight: {
    color: '#2563EB',
    fontWeight: '700',
  },
  otpInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  otpBoxFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  otpBoxError: {
    borderColor: '#EF4444',
  },
  demoOtpHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  demoOtpBold: {
    fontWeight: '700',
    color: '#2563EB',
  },
  errorBanner: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  verifyButtonEnabled: {
    backgroundColor: '#1E3A8A',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  verifyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resendInfo: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  resendCountdown: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  resendLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },
  securityFooter: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  successCheck: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
  },
  successContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  successButtonWrapper: {
    width: '100%',
  },
  dashboardButton: {
    width: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
