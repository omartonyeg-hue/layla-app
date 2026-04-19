import React from 'react';
import { Pressable, Text } from 'react-native';
import { color } from '../theme/tokens';

// Identical 36×36 ⚙ button used in every feed header. Single source so the
// "open settings" affordance feels like the same surface across tabs.

type Props = { onPress: () => void };

export const SettingsButton: React.FC<Props> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={6}
    style={({ pressed }) => ({
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: color.bg.surface,
      borderWidth: 1,
      borderColor: color.stroke.soft,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: pressed ? 0.7 : 1,
    })}
  >
    <Text style={{ color: color.text.secondary, fontSize: 16 }}>⚙</Text>
  </Pressable>
);

export default SettingsButton;
