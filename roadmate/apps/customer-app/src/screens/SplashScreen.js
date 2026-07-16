import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(15)).current;
  
  const roadDashesX = useRef(new Animated.Value(0)).current;
  const carX = useRef(new Animated.Value(-60)).current;
  
  const dot1Scale = useRef(new Animated.Value(0.8)).current;
  const dot1Opacity = useRef(new Animated.Value(0.25)).current;
  const dot2Scale = useRef(new Animated.Value(0.8)).current;
  const dot2Opacity = useRef(new Animated.Value(0.25)).current;
  const dot3Scale = useRef(new Animated.Value(0.8)).current;
  const dot3Opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    // 1. Logo Animation (fade in & spring/bounce scale)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Text Animation (slight delay)
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 550,
        delay: 450,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 550,
        delay: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Road dashes loop translation (Translates yellow dashed lines)
    Animated.loop(
      Animated.timing(roadDashesX, {
        toValue: -100,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 4. Car loop driving across the screen
    Animated.loop(
      Animated.timing(carX, {
        toValue: width + 60,
        duration: 2600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // 5. Staggered loading dots loop
    const createDotAnimation = (scaleVal, opacityVal, delayTime) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delayTime),
          Animated.parallel([
            Animated.timing(scaleVal, { toValue: 1.2, duration: 400, useNativeDriver: true }),
            Animated.timing(opacityVal, { toValue: 1, duration: 400, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scaleVal, { toValue: 0.8, duration: 400, useNativeDriver: true }),
            Animated.timing(opacityVal, { toValue: 0.25, duration: 400, useNativeDriver: true }),
          ]),
        ])
      );
    };

    createDotAnimation(dot1Scale, dot1Opacity, 0).start();
    createDotAnimation(dot2Scale, dot2Opacity, 220).start();
    createDotAnimation(dot3Scale, dot3Opacity, 440).start();

    // 6. Navigation Transition after 3.4 seconds
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background radial-like soft highlight overlay */}
      <View style={styles.radialGlow} />

      {/* Main Logo Container */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoBadge}>
          {/* Custom Route Line Path Icon drawn with Views */}
          <View style={styles.routeIconLineContainer}>
            <View style={styles.routeCircleOuter} />
            <View style={styles.routeLineHorizontal} />
            <View style={styles.routeCircleInner} />
          </View>
        </View>
        
        <Animated.Text style={[styles.title, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}>
          RoadMate
        </Animated.Text>
        
        <Animated.Text style={[styles.subtitle, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}>
          Your Smart Mobility Companion
        </Animated.Text>
      </Animated.View>

      {/* Staggered Loading Dots */}
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingDot, { opacity: dot1Opacity, transform: [{ scale: dot1Scale }] }]} />
        <Animated.View style={[styles.loadingDot, { opacity: dot2Opacity, transform: [{ scale: dot2Scale }] }]} />
        <Animated.View style={[styles.loadingDot, { opacity: dot3Opacity, transform: [{ scale: dot3Scale }] }]} />
      </View>

      {/* Animated road container */}
      <View style={styles.roadContainer}>
        {/* Asphalt roadbed */}
        <View style={styles.roadAsphalt} />

        {/* Dash lines */}
        <Animated.View style={[styles.dashesRow, { transform: [{ translateX: roadDashesX }] }]}>
          {[...Array(12)].map((_, i) => (
            <View key={i} style={styles.roadDash} />
          ))}
        </Animated.View>

        {/* Driving Car */}
        <Animated.View style={[styles.carWrapper, { transform: [{ translateX: carX }] }]}>
          <View style={styles.carBody}>
            {/* Windshield */}
            <View style={styles.carWindshield} />
            {/* Headlight and tires details */}
            <View style={styles.carWheelLeft} />
            <View style={styles.carWheelRight} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB', // Core Premium Blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
    zIndex: 10,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  routeIconLineContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeCircleOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    left: 4,
    bottom: 8,
  },
  routeLineHorizontal: {
    width: 28,
    height: 3,
    backgroundColor: 'white',
    position: 'absolute',
    transform: [{ rotate: '-35deg' }],
  },
  routeCircleInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    right: 4,
    top: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -1,
  },
  subtitle: {
    color: 'rgba(219, 234, 254, 0.9)',
    fontSize: 15,
    marginTop: 6,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 2,
  },
  roadContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  roadAsphalt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#1E3A5F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dashesRow: {
    position: 'absolute',
    bottom: 36,
    flexDirection: 'row',
    gap: 24,
    width: 1500,
  },
  roadDash: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F59E0B',
    opacity: 0.85,
  },
  carWrapper: {
    position: 'absolute',
    bottom: 46,
    width: 44,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carBody: {
    width: 40,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'white',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
  },
  carWindshield: {
    width: 14,
    height: 14,
    backgroundColor: '#2563EB',
    borderRadius: 3,
    position: 'absolute',
    right: 6,
    top: 5,
  },
  carWheelLeft: {
    width: 8,
    height: 4,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
    position: 'absolute',
    left: 6,
    bottom: -3,
  },
  carWheelRight: {
    width: 8,
    height: 4,
    backgroundColor: '#1E3A5F',
    borderRadius: 2,
    position: 'absolute',
    right: 6,
    bottom: -3,
  },
});

