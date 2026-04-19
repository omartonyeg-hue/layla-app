import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, gradient, fontFamily, shadow } from '../theme/tokens';

// Concentric pulsing teal rings around the gold "L" chip. Drives the FINDING
// state on the valet flow.

type Props = { size?: number };

const RING_DELAYS = [0, 600, 1200, 1800];
const RING_DURATION = 2400;

export const RadarPulse: React.FC<Props> = ({ size = 280 }) => {
  const animations = useRef(RING_DELAYS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loops = animations.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(RING_DELAYS[i]!),
          Animated.timing(value, {
            toValue: 1,
            duration: RING_DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [animations]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {animations.map((value, i) => {
        const scale = value.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1.0] });
        const opacity = value.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.0, 0.5, 0.0] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 2,
              borderColor: color.teal,
              transform: [{ scale }],
              opacity,
            }}
          />
        );
      })}

      {/* Center gold "L" chip */}
      <LinearGradient
        colors={gradient.gold.colors}
        start={gradient.gold.start}
        end={gradient.gold.end}
        style={{
          width: 56, height: 56, borderRadius: 14,
          alignItems: 'center', justifyContent: 'center',
          ...shadow.glowGold,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.display,
            fontSize: 28,
            fontWeight: '900',
            color: color.text.inverse,
            letterSpacing: 1,
          }}
        >
          L
        </Text>
      </LinearGradient>
    </View>
  );
};

export default RadarPulse;
