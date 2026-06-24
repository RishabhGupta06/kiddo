import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUBBLE_COUNT = 15;
const RIPPLE_COUNT = 4;

interface BubbleProps {
  delay: number;
  startX: number;
  duration: number;
}

const WaterBubble: React.FC<BubbleProps> = ({ delay, startX, duration }) => {
  const animatedY = useRef(new Animated.Value(SCREEN_HEIGHT + 50)).current;
  const animatedX = useRef(new Animated.Value(startX)).current;
  const animatedScale = useRef(new Animated.Value(0.3)).current;
  const animatedOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const startAnimation = () => {
      animatedY.setValue(SCREEN_HEIGHT + 50);
      animatedX.setValue(startX);
      animatedScale.setValue(0.3 + Math.random() * 0.4);
      animatedOpacity.setValue(0.7);

      Animated.parallel([
        Animated.timing(animatedY, {
          toValue: -50,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(animatedX, {
            toValue: startX + 30,
            duration: duration / 3,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedX, {
            toValue: startX - 30,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(animatedX, {
            toValue: startX,
            duration: duration / 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animatedOpacity, {
            toValue: 0.8,
            duration: duration * 0.8,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        startAnimation();
      });
    };

    startAnimation();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          opacity: animatedOpacity,
          transform: [
            { translateY: animatedY },
            { translateX: animatedX },
            { scale: animatedScale },
          ],
        },
      ]}
    >
      <Svg width="24" height="24" viewBox="0 0 24 24">
        {/* Cute shiny water droplet */}
        <Path
          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
          fill="rgba(41, 182, 246, 0.4)"
          stroke="#0288D1"
          strokeWidth="1.5"
        />
        {/* Highlight */}
        <Circle cx="9" cy="11" r="2.5" fill="#FFFFFF" opacity="0.6" />
      </Svg>
    </Animated.View>
  );
};

interface RippleProps {
  delay: number;
}

const WaterRipple: React.FC<RippleProps> = ({ delay }) => {
  const animatedScale = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const position = useRef({
    x: Math.random() * (SCREEN_WIDTH - 100) + 50,
    y: Math.random() * (SCREEN_HEIGHT - 200) + 100,
  });

  useEffect(() => {
    const runRipple = () => {
      position.current = {
        x: Math.random() * (SCREEN_WIDTH - 100) + 50,
        y: Math.random() * (SCREEN_HEIGHT - 200) + 100,
      };
      animatedScale.setValue(0);
      animatedOpacity.setValue(0.6);

      Animated.parallel([
        Animated.timing(animatedScale, {
          toValue: 2.5,
          duration: 2500,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 2500,
          delay: delay,
          useNativeDriver: true,
        }),
      ]).start(() => {
        runRipple();
      });
    };

    runRipple();
  }, []);

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          left: position.current.x,
          top: position.current.y,
          opacity: animatedOpacity,
          transform: [{ scale: animatedScale }],
        },
      ]}
    >
      <Svg width="60" height="60" viewBox="0 0 60 60">
        <Circle cx="30" cy="30" r="28" stroke="rgba(2, 136, 209, 0.5)" strokeWidth="1.5" fill="none" />
        <Circle cx="30" cy="30" r="20" stroke="rgba(2, 136, 209, 0.3)" strokeWidth="1" fill="none" />
      </Svg>
    </Animated.View>
  );
};

export const WaterSplashAnimation: React.FC = () => {
  const bubbles = useRef(
    Array.from({ length: BUBBLE_COUNT }).map((_, index) => ({
      id: index,
      delay: index * 350,
      startX: Math.random() * (SCREEN_WIDTH - 40) + 20,
      duration: 4000 + Math.random() * 2000,
    }))
  ).current;

  const ripples = useRef(
    Array.from({ length: RIPPLE_COUNT }).map((_, index) => ({
      id: index,
      delay: index * 900,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {ripples.map((r) => (
        <WaterRipple key={`ripple-${r.id}`} delay={r.delay} />
      ))}
      {bubbles.map((b) => (
        <WaterBubble key={`bubble-${b.id}`} delay={b.delay} startX={b.startX} duration={b.duration} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  ripple: {
    position: 'absolute',
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
  },
});

export default WaterSplashAnimation;
