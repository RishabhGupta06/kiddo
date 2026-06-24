import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 30;

const COLORS = [
  '#FF1744', // Red
  '#F50057', // Pink
  '#D500F9', // Purple
  '#651FFF', // Indigo
  '#3D5AFE', // Blue
  '#00E5FF', // Cyan
  '#1DE9B6', // Teal
  '#00E676', // Green
  '#76FF03', // Light Green
  '#FFEA00', // Yellow
  '#FF9100', // Orange
  '#FF3D00', // Deep Orange
];

interface ConfettiProps {
  delay: number;
  startX: number;
  duration: number;
  color: string;
  size: number;
  shape: 'rect' | 'circle' | 'square';
}

const ConfettiParticle: React.FC<ConfettiProps> = ({ delay, startX, duration, color, size, shape }) => {
  const animatedY = useRef(new Animated.Value(-50)).current;
  const animatedX = useRef(new Animated.Value(startX)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;
  const animatedSwing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      animatedY.setValue(-50);
      animatedX.setValue(startX + (Math.random() * 80 - 40));
      animatedRotate.setValue(0);
      animatedSwing.setValue(0);

      Animated.parallel([
        Animated.timing(animatedY, {
          toValue: SCREEN_HEIGHT + 50,
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
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedSwing, {
              toValue: 1,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(animatedSwing, {
              toValue: -1,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(animatedSwing, {
              toValue: 0,
              duration: duration / 4,
              useNativeDriver: true,
            }),
          ]),
          { iterations: -1 }
        ),
      ]).start(() => {
        startAnimation();
      });
    };

    startAnimation();
  }, []);

  const rotation = animatedRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg'],
  });

  const swayX = animatedSwing.interpolate({
    inputRange: [-1, 1],
    outputRange: [-30, 30],
  });

  const isCircle = shape === 'circle';
  const isRect = shape === 'rect';

  const particleStyle = {
    width: size,
    height: isRect ? size * 0.5 : size,
    backgroundColor: color,
    borderRadius: isCircle ? size / 2 : 1,
    transform: [
      { translateY: animatedY },
      { translateX: Animated.add(animatedX, swayX) },
      { rotate: rotation },
    ],
  };

  return <Animated.View style={[styles.particle, particleStyle]} />;
};

export const ConfettiAnimation: React.FC = () => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
      const shapes: ('rect' | 'circle' | 'square')[] = ['rect', 'circle', 'square'];
      return {
        id: index,
        delay: index * 120,
        startX: Math.random() * (SCREEN_WIDTH - 20) + 10,
        duration: 3000 + Math.random() * 2000,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 8,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    })
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          delay={p.delay}
          startX={p.startX}
          duration={p.duration}
          color={p.color}
          size={p.size}
          shape={p.shape}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});

export default ConfettiAnimation;
