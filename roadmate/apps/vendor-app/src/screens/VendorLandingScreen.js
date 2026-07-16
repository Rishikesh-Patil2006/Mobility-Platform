import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VendorLandingScreen({ navigation }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse central icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating ornamental circles
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Ornamental Background Circles */}
      <Animated.View style={[styles.circleOrnament1, { transform: [{ translateY: floatAnim }] }]} />
      <View style={styles.circleOrnament2} />

      <View style={styles.content}>
        {/* Pulsing Central Badge */}
        <Animated.View style={[styles.logoBadge, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.logoEmoji}>🏬</Text>
        </Animated.View>

        <Text style={styles.brandTitle}>RoadMate</Text>
        <Text style={styles.partnerTag}>PARTNER PORTAL</Text>

        <Text style={styles.tagline}>
          Grow your auto business online. Get local orders for repairs, washes, towing & PUC certificates.
        </Text>

        {/* Benefits List */}
        <View style={styles.benefitsGrid}>
          {[
            { em: '📈', t: 'More Customers' },
            { em: '💼', t: 'Manage Orders' },
            { em: '⚡', t: 'Instant Alerts' },
            { em: '⭐', t: 'Build Ratings' },
          ].map((b) => (
            <View key={b.t} style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>{b.em}</Text>
              <Text style={styles.benefitText}>{b.t}</Text>
            </View>
          ))}
        </View>

        {/* Login & Register Buttons */}
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('VendorLogin')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Login as Partner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('VendorRegister')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register My Business</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🤝 Joined by 10,000+ Indian service providers
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Premium Deep Royal Blue for Vendor Portal
  },
  circleOrnament1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circleOrnament2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 52,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  partnerTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 3,
    marginTop: 4,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: '#BFDBFE',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  benefitEmoji: {
    fontSize: 14,
  },
  benefitText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  buttonsWrapper: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  loginButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '800',
  },
  registerButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#93C5FD',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
});
