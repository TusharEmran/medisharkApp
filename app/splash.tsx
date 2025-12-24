import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from './theme/ThemeContext';
import { Colors } from '../constants/theme';

export default function SplashScreen({
  onFinish,
}: {
  onFinish?: () => void;
}) {
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(12)).current;

  const hideTimeout = useRef<number | null>(null);
  const splashRef = useRef<LottieView>(null);

  useEffect(() => {
    // Logo fade-in + scale
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      splashRef.current?.play(); // Start Lottie animation
    });

    // FIXED TOTAL SPLASH SCREEN TIME = 2.5 SECONDS
    hideTimeout.current = setTimeout(() => {
      // Fade in title
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Fade everything out
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(titleOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onFinish?.();
        });
      });
    }, 2500);

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>

      {/* ===== TOP LOGO ===== */}
      <Animated.Image
        source={require('../assets/images/medishark.png')}
        resizeMode="contain"
        style={[
          styles.logoTop,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] }
        ]}
      />

      {/* ===== CENTER SPLASH ===== */}
      <View style={styles.splashWrapper}>
        <LottieView
          ref={splashRef}
          source={require('../assets/animation/liquidSplash.json')}
          style={styles.splashAnimation}
          loop={false}
        />
      </View>

      {/* ===== BOTTOM TEXT ===== */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
            color: palette.surfaceDarkText,
          },
        ]}
      >
        MediShark
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: titleOpacity,
            color: palette.mutedText,
          },
        ]}
      >
        Smart medical learning companion
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoTop: {
    width: 180,
    height: 55,
    marginBottom: 20,
  },

  splashWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    marginBottom: 20,
  },

  splashAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 1,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.8,
  },
});
