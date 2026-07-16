import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Custom Mini Icons using Views for standard portability without external icon libs
const MiniFileText = () => (
  <View style={styles.miniIconBox}>
    <View style={[styles.miniLine, { width: 14 }]} />
    <View style={[styles.miniLine, { width: 10 }]} />
  </View>
);

const MiniMapPin = () => (
  <View style={styles.miniIconBox}>
    <View style={styles.pinCircle} />
    <View style={styles.pinPoint} />
  </View>
);

const MiniCar = () => (
  <View style={styles.miniIconBox}>
    <View style={styles.miniCarTop} />
    <View style={styles.miniCarBottom} />
  </View>
);

const MiniNavigation = () => (
  <View style={[styles.miniIconBox, { transform: [{ rotate: '45deg' }] }]}>
    <View style={styles.arrowTriangle} />
  </View>
);

export default function WelcomeScreen({ navigation }) {
  // Animation hooks for the 4 floating cards
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;
  
  // Pulsing scale for the central badge
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Utility to build a continuous loop float animation
    const runFloat = (animVal, toVal, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animVal, {
            toValue: toVal,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animVal, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Staggered float durations to feel organic
    runFloat(floatAnim1, -8, 1500).start();
    runFloat(floatAnim2, -6, 1750).start();
    runFloat(floatAnim3, -7, 1400).start();
    runFloat(floatAnim4, -9, 2000).start();

    // Pulse animation for the central route logo badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.06,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1.0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGoogleLogin = () => {
    navigation.navigate('OtpVerification', { mode: 'google', email: 'rushikesh@google.com' });
  };

  const handleEmailLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {/* Floating Cards Canvas */}
        <View style={styles.canvasContainer}>
          {/* Card 1: RC Book (Top Left) */}
          <Animated.View style={[
            styles.floatingCard, 
            { 
              backgroundColor: '#EFF6FF', 
              borderColor: '#DBEAFE', 
              top: 10, 
              left: 20,
              transform: [{ translateY: floatAnim1 }]
            }
          ]}>
            <View style={[styles.cardIconCircle, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
              <MiniFileText />
            </View>
            <Text style={[styles.cardLabel, { color: '#2563EB' }]}>RC Book</Text>
          </Animated.View>

          {/* Card 2: Services (Top Right) */}
          <Animated.View style={[
            styles.floatingCard, 
            { 
              backgroundColor: '#F0FDF4', 
              borderColor: '#BBF7D0', 
              top: 25, 
              right: 20,
              transform: [{ translateY: floatAnim2 }]
            }
          ]}>
            <View style={[styles.cardIconCircle, { backgroundColor: 'rgba(22, 163, 74, 0.1)' }]}>
              <MiniMapPin />
            </View>
            <Text style={[styles.cardLabel, { color: '#16A34A' }]}>Services</Text>
          </Animated.View>

          {/* Card 3: Vehicle (Bottom Left) */}
          <Animated.View style={[
            styles.floatingCard, 
            { 
              backgroundColor: '#FFF7ED', 
              borderColor: '#FED7AA', 
              bottom: 25, 
              left: 25,
              transform: [{ translateY: floatAnim3 }]
            }
          ]}>
            <View style={[styles.cardIconCircle, { backgroundColor: 'rgba(234, 88, 12, 0.1)' }]}>
              <MiniCar />
            </View>
            <Text style={[styles.cardLabel, { color: '#EA580C' }]}>Vehicle</Text>
          </Animated.View>

          {/* Card 4: Navigate (Bottom Right) */}
          <Animated.View style={[
            styles.floatingCard, 
            { 
              backgroundColor: '#FDF4FF', 
              borderColor: '#E9D5FF', 
              bottom: 10, 
              right: 25,
              transform: [{ translateY: floatAnim4 }]
            }
          ]}>
            <View style={[styles.cardIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.1)' }]}>
              <MiniNavigation />
            </View>
            <Text style={[styles.cardLabel, { color: '#9333EA' }]}>Navigate</Text>
          </Animated.View>

          {/* Central Pulsing Route Badge */}
          <Animated.View style={[styles.pulseLogoWrapper, { transform: [{ scale: pulseScale }] }]}>
            <View style={styles.centerLogoCircle}>
              {/* Simple route path logo drawn using small views */}
              <View style={styles.routeIconLineContainer}>
                <View style={styles.routeCircleOuter} />
                <View style={styles.routeLineHorizontal} />
                <View style={styles.routeCircleInner} />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Branding Typography */}
        <Text style={styles.h1}>
          Manage Your Vehicle {'\n'}
          <Text style={styles.highlightText}>Smarter</Text>
        </Text>

        <Text style={styles.paragraph}>
          All your vehicle documents, nearby services, and navigation tools in one platform.
        </Text>

        {/* Benefits Grid */}
        <View style={styles.benefitsGrid}>
          {[
            'Vehicle Management',
            'Verified Documents',
            'Nearby Services',
            'Map Navigation'
          ].map((text) => (
            <View key={text} style={styles.benefitBadge}>
              <View style={styles.checkIcon}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={styles.benefitText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Auth Action Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} activeOpacity={0.88}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin} activeOpacity={0.85}>
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>

        <Text style={styles.footerTerms}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  canvasContainer: {
    width: 270,
    height: 220,
    position: 'relative',
    marginBottom: 20,
  },
  floatingCard: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 90,
    // Soft drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  pulseLogoWrapper: {
    position: 'absolute',
    top: 78,
    left: 103,
  },
  centerLogoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  routeIconLineContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeCircleOuter: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    left: 2,
    bottom: 5,
  },
  routeLineHorizontal: {
    width: 20,
    height: 2.5,
    backgroundColor: 'white',
    position: 'absolute',
    transform: [{ rotate: '-35deg' }],
  },
  routeCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    right: 2,
    top: 5,
  },
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 34,
  },
  highlightText: {
    color: '#2563EB',
  },
  paragraph: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  benefitsGrid: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  benefitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '47%',
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  checkMark: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 36,
    gap: 12,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 15,
    elevation: 5,
  },
  googleG: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 8,
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  emailButton: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  footerTerms: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  miniIconBox: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniLine: {
    height: 2,
    backgroundColor: '#2563EB',
    marginVertical: 1.5,
    borderRadius: 1,
  },
  pinCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  pinPoint: {
    width: 3,
    height: 3,
    backgroundColor: '#16A34A',
    borderRadius: 1.5,
    marginTop: 1,
  },
  miniCarTop: {
    width: 10,
    height: 5,
    backgroundColor: '#EA580C',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  miniCarBottom: {
    width: 14,
    height: 5,
    backgroundColor: '#EA580C',
    borderRadius: 1,
    marginTop: 1,
  },
  arrowTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#9333EA',
  },
});
