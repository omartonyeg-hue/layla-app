import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { color, shadow } from '../theme/tokens';

// Display + interactive 5-star rating. Tap a star in interactive mode to set.
// Half-stars not supported — matches design.

type Props = {
  value: number;          // 0–5
  onChange?: (next: number) => void;
  size?: number;
  inactiveColor?: string;
};

export const StarRating: React.FC<Props> = ({
  value,
  onChange,
  size = 28,
  inactiveColor = color.stroke.mid,
}) => {
  const interactive = Boolean(onChange);
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= Math.round(value);
        const star = (
          <Text
            style={{
              fontSize: size,
              color: on ? color.gold[500] : inactiveColor,
              ...(on ? { textShadowColor: 'rgba(212,168,67,0.5)', textShadowRadius: 6 } : null),
            }}
          >
            ★
          </Text>
        );
        return interactive ? (
          <Pressable key={n} onPress={() => onChange?.(n)} hitSlop={6}>{star}</Pressable>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
};

export default StarRating;
