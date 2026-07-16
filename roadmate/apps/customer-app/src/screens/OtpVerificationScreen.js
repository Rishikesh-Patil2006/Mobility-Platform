import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Easing, ActivityIndicator, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const CORRECT_OTP = '123456';

export default function OtpVerificationScreen({ route, navigation }) {
  // Extract parameters with defaults for safety
  const { mode = 'email', email = 'rushikesh@google.com' } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  // Refs for the text inputs
  const inputRefs = useRef([]);

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  
  // Confetti animation triggers
  const confettiAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

  // Float Shield Badge Loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
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

  // Resend timer countdown
  useEffect(() => {
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

    // Shift focus forward
    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 boxes are filled
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
    const anims = confettiAnims.map((anim, i) => {
      anim.setValue(0);
      return Animated.timing(anim, {
        toValue: 1,
        duration: 1500,
        delay: i * 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      });
    });
    Animated.parallel(anims).start();
  };

  const verifyOtp = (code) => {
    setVerifying(true);
    setError('');
    
    setTimeout(() => {
      setVerifying(false);
      if (code === CORRECT_OTP) {
        setSuccess(true);
        triggerConfetti();
        // Scale/fade success badge
        Animated.parallel([
          Animated.spring(successScale, {
            toValue: 1,
            friction: 6,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(successOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start();
      } else {
        setError('Incorrect OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        shakeInputs();
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendSeconds(30);
    inputRefs.current[0]?.focus();
  };

  // Safe display for long emails
  const displayEmail = email.length > 24 ? email.slice(0, 12) + '...' + email.slice(-8) : email;

  // Back navigation direction
  const handleBack = () => {
    if (mode === 'email') {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Welcome');
    }
  };

  // Renders the Success Screen View inside the same page to maintain stack requirements
  if (success) {
    return (
      <View style={styles.successContainer}>
        {/* Falling Confetti Dots */}
        {confettiAnims.map((anim, i) => {
          const colors = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
          const leftOffset = 25 + i * 13;
          const fallingY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, height * 0.6],
          });
          const opacity = anim.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [1, 1, 0],
          });
          const rotate = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.confettiDot,
                {
                  left: `${leftOffset}%`,
                  backgroundColor: colors[i % colors.length],
                  opacity,
                  transform: [{ translateY: fallingY }, { rotate }],
                },
              ]}
            />
          );
        })}

        {/* Pulsing check circle */}
        <Animated.View style={[styles.successCircle, { opacity: successOpacity, transform: [{ scale: successScale }] }]}>
          <Text style={styles.successCheck}>✓</Text>
        </Animated.View>

        <Animated.View style={[styles.successContent, { opacity: successOpacity }]}>
          <Text style={styles.successTitle}>Welcome to RoadMate</Text>
          <Text style={styles.successSubtitle}>
            You're all set! Your smart mobility companion is ready.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.successButtonWrapper, { opacity: successOpacity }]}>
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => navigation.replace('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.dashboardButtonText}>Go To Dashboard →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>OTP Verification</Text>
            <Text style={styles.headerSubtitle}>
              {mode === 'google' ? 'via Google Account' : 'via Email'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Floating Shield Badge */}
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

        {/* OTP Input Boxes */}
        <Animated.View style={[styles.otpInputRow, { transform: [{ translateX: errorShake }] }]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpBox,
                error ? styles.otpBoxError : null,
                digit ? styles.otpBoxFilled : null,
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              showsVerticalScrollIndicator={false}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        <Text style={styles.demoOtpHint}>
          Demo OTP: <Text style={styles.demoOtpBold}>123456</Text>
        </Text>

        {/* Error Message banner */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Verify Button */}
        <TouchableOpacity
          disabled={otp.some((d) => !d) || verifying}
          onPress={() => verifyOtp(otp.join(''))}
          style={[
            styles.verifyButton,
            otp.every((d) => d !== '') ? styles.verifyButtonEnabled : styles.verifyButtonDisabled,
          ]}
          activeOpacity={0.88}
        >
          {verifying ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.verifyText}>Verify OTP →</Text>
          )}
        </TouchableOpacity>

        {/* Resend Action */}
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

        {/* Encryption badge at bottom */}
        <View style={styles.securityFooter}>
          <Text style={styles.securityText}>🛡️ 256-bit encrypted · Your data is safe</Text>
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
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  shieldShape: {
    width: 36,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#2563EB',
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
    textAlign: 'center',
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
    justifyContent: 'center',
    gap: 8,
    width: '100%',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
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
  // Success states classes
  successContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    position: 'relative',
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
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
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
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 5,
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

