import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import Svg, { Polyline, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { color, gradient, fontFamily, radius } from '../theme/tokens';
import { Micro } from './Text';

// VerifiedBadge — teal → gold check disc. Signature trust mark.
export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 14 }) => {
  const g = gradient.valet;
  return (
    <LinearGradient
      colors={g.colors}
      start={g.start}
      end={g.end}
      style={{
        width: size + 4,
        height: size + 4,
        borderRadius: (size + 4) / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size - 4} height={size - 4} viewBox="0 0 24 24">
        <Polyline
          points="20 6 9 17 4 12"
          stroke={color.text.inverse}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </LinearGradient>
  );
};

// CrownBadge — Pro membership pill.
export const CrownBadge: React.FC<{ size?: number }> = ({ size = 14 }) => {
  const g = gradient.gold;
  return (
    <LinearGradient
      colors={g.colors}
      start={g.start}
      end={g.end}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
      }}
    >
      <Svg width={size - 4} height={size - 4} viewBox="0 0 24 24">
        <Path
          d="M2 20h20v-2H2v2zm1.15-4h17.7l1.15-9-5 3-5-6-5 6-5-3 1.15 9z"
          fill={color.text.inverse}
        />
      </Svg>
      <Text
        style={{
          color: color.text.inverse,
          fontSize: size - 5,
          fontWeight: '900',
          letterSpacing: (size - 5) * 0.15,
          fontFamily: fontFamily.mono,
        }}
      >
        PRO
      </Text>
    </LinearGradient>
  );
};

// LockedPill — LOCKED · PHASE N marker.
export const LockedPill: React.FC<{ phase: number | string; tintColor?: string }> = ({
  phase,
  tintColor = color.rose,
}) => {
  const style: ViewStyle = {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: tintColor + '1A',
    borderWidth: 1,
    borderColor: tintColor + '4D',
  };
  return (
    <View style={style}>
      <Micro size="sm" color={tintColor}>LOCKED · PHASE {phase}</Micro>
    </View>
  );
};
