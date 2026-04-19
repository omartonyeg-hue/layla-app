import React from 'react';
import { Pressable, Text } from 'react-native';
import { color } from '../theme/tokens';

type Props = { onPress?: () => void };

export const BackButton: React.FC<Props> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
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
    <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>‹</Text>
  </Pressable>
);

export default BackButton;
