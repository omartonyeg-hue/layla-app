import React from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, gradient, radius, fontFamily } from '../theme/tokens';

type Props = {
  selected?: boolean;
  accent?: 'gold' | 'night';
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

const CHIP_HEIGHT = 34;

export const Chip: React.FC<Props> = ({ selected, accent = 'gold', onPress, children, style }) => {
  const grad = accent === 'night' ? gradient.night : gradient.gold;
  const label = (
    <Text
      // Fixed lineHeight + vertically-centered frame guarantees no top/bottom
      // clipping. iOS was eating ascenders/descenders when we relied on natural
      // leading + overflow:hidden + alignSelf:flex-start all at once.
      style={{
        fontFamily: fontFamily.body,
        fontSize: 12,
        lineHeight: 14,
        fontWeight: selected ? '700' : '500',
        color: selected ? color.text.inverse : color.text.secondary,
        includeFontPadding: false as any, // Android-only guard
      }}
    >
      {children}
    </Text>
  );

  const frame: ViewStyle = {
    paddingHorizontal: 14,
    height: CHIP_HEIGHT,
    borderRadius: CHIP_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Pressable onPress={onPress} style={[{ alignSelf: 'flex-start' }, style]}>
      {selected ? (
        <LinearGradient
          colors={grad.colors}
          start={grad.start}
          end={grad.end}
          style={[frame, { overflow: 'hidden' }]}
        >
          {label}
        </LinearGradient>
      ) : (
        <View
          style={[
            frame,
            {
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderWidth: 1,
              borderColor: color.stroke.mid,
            },
          ]}
        >
          {label}
        </View>
      )}
    </Pressable>
  );
};

export default Chip;
