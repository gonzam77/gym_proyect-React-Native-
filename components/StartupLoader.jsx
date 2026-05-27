import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { colores } from '../styles/colores';

const StartupLoader = ({ message = 'Cargando tu rutina...' }) => {
  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    pulseLoop.start();
    spinLoop.start();

    return () => {
      pulseLoop.stop();
      spinLoop.stop();
    };
  }, [pulse, spin]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.55],
  });

  const spinRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }, { rotate: spinRotate }],
          },
        ]}
      />
      <View style={styles.card}>
        <Image source={require('../assets/img/logo1.png')} style={styles.logo} resizeMode='contain' />
        <ActivityIndicator size='large' color={colores.principal} style={styles.spinner} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.azulProfundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(70, 237, 52, 0.10)',
  },
  ring: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: 'rgba(0, 224, 255, 0.45)',
  },
  card: {
    width: '82%',
    maxWidth: 320,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 31, 51, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(68, 252, 225, 0.25)',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    color: colores.blanco,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default StartupLoader;
