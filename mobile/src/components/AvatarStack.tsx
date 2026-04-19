import React from 'react';
import { View, Text } from 'react-native';
import { color } from '../theme/tokens';

// Overlapping anonymous guest avatars — each is a solid color chip with no
// initials, matching the "anon stack" pattern in the design. Privacy by default.

type Props = {
  count: number;          // total approved guests
  cap: number;            // max — shown as N/CAP
  max?: number;           // avatars rendered before the "+N" pill
  size?: number;
};

const PALETTE = [
  '#D4A843', '#FF3D6B', '#8B3FFF', '#00E5C8',
  '#F0C96A', '#FFB547', '#FF6B9D', '#6B88FF',
];

export const AvatarStack: React.FC<Props> = ({ count, cap, max = 6, size = 28 }) => {
  const avatars = Array.from({ length: Math.min(count, max) }).map((_, i) => ({
    color: PALETTE[i % PALETTE.length]!,
  }));
  const overflow = Math.max(0, count - max);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        {avatars.map((a, i) => (
          <View
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: a.color,
              borderWidth: 2,
              borderColor: color.bg.surface,
              marginLeft: i === 0 ? 0 : -size * 0.35,
            }}
          />
        ))}
        {overflow > 0 ? (
          <View
            style={{
              minWidth: size,
              height: size,
              paddingHorizontal: 6,
              borderRadius: size / 2,
              backgroundColor: color.bg.surface,
              borderWidth: 2,
              borderColor: color.stroke.mid,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -size * 0.35,
            }}
          >
            <Text style={{ color: color.text.primary, fontSize: 11, fontWeight: '800' }}>+{overflow}</Text>
          </View>
        ) : null}
      </View>
      <Text style={{ color: color.text.secondary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
        {count}/{cap}
      </Text>
    </View>
  );
};

export default AvatarStack;
