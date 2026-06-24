import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 15;

interface PencilParticleProps {
  delay: number;
  startX: number;
  duration: number;
}

const PencilParticle: React.FC<PencilParticleProps> = ({ delay, startX, duration }) => {
  const animatedY = useRef(new Animated.Value(-100)).current;
  const animatedX = useRef(new Animated.Value(startX)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset values
      animatedY.setValue(-100);
      animatedX.setValue(startX + (Math.random() * 60 - 30));
      animatedRotate.setValue(0);

      // Create falling, rotation, and minor horizontal sway
      Animated.parallel([
        Animated.timing(animatedY, {
          toValue: SCREEN_HEIGHT + 100,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedRotate, {
          toValue: 1,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(animatedX, {
            toValue: startX + 40,
            duration: duration / 2,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedX, {
            toValue: startX - 40,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Loop again with a fresh delay
        startAnimation();
      });
    };

    startAnimation();
  }, []);

  const rotation = animatedRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const isYellow = Math.random() > 0.5;
  const pencilColor = isYellow ? '#FFD54F' : '#29B6F6';
  const tipColor = '#FF8A80';

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateY: animatedY },
            { translateX: animatedX },
            { rotate: rotation },
          ],
        },
      ]}
    >
      <Svg width="16" height="48" viewBox="0 0 16 48">
        {/* Pencil body */}
        <Rect x="4" y="8" width="8" height="30" fill={pencilColor} rx="1" />
        {/* Pencil tip */}
        <Path d="M4 8 L8 0 L12 8 Z" fill="#E0E0E0" />
        <Path d="M6 4 L8 0 L10 4 Z" fill="#424242" />
        {/* Eraser */}
        <Rect x="4" y="38" width="8" height="6" fill={tipColor} rx="1" />
        <Rect x="4" y="36" width="8" height="2" fill="#B0BEC5" />
      </Svg>
    </Animated.View>
  );
};

export const FallingPencilsAnimation: React.FC = () => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }).map((_, index) => ({
      id: index,
      delay: index * 400,
      startX: Math.random() * (SCREEN_WIDTH - 40) + 10,
      duration: 3500 + Math.random() * 2000,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <PencilParticle key={p.id} delay={p.delay} startX={p.startX} duration={p.duration} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 24,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default FallingPencilsAnimation;
