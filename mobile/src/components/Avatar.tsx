import React from 'react';
import { View, Text } from 'react-native';
import { color as tokens, fontFamily } from '../theme/tokens';

type Props = {
  name?: string;
  color?: string;
  size?: number;
  ring?: string;
};

export const Avatar: React.FC<Props> = ({
  name = 'L',
  color: bg = tokens.gold[500],
  size = 40,
  ring,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bg,
      alignItems: 'center',
      justifyContent: 'center',
      ...(ring ? { borderWidth: 2, borderColor: ring } : null),
    }}
  >
    <Text
      style={{
        color: tokens.text.inverse,
        fontFamily: fontFamily.display,
        fontSize: size * 0.42,
        fontWeight: '900',
      }}
    >
      {name[0]?.toUpperCase()}
    </Text>
  </View>
);

export default Avatar;
