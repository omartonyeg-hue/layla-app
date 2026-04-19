import React from 'react';
import { Pressable, Text } from 'react-native';
import { color, radius } from '../theme/tokens';

// Review-vibe chip — violet tinted when on, per the Community design. Separate
// from `Chip` because this one uses the violet community accent and shows a
// check prefix while the generic Chip uses gold/night.

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const VibeChip: React.FC<Props> = ({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: radius.pill,
      backgroundColor: selected ? 'rgba(139,63,255,0.18)' : 'rgba(255,255,255,0.04)',
      borderWidth: 1,
      borderColor: selected ? color.violet : color.stroke.soft,
      alignSelf: 'flex-start',
    }}
  >
    <Text
      style={{
        color: selected ? color.violet : color.text.secondary,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: selected ? '800' : '500',
      }}
    >
      {selected ? '✓ ' : ''}
      {label}
    </Text>
  </Pressable>
);

export default VibeChip;
