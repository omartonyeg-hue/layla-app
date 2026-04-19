import React from 'react';
import { View, Text, Image } from 'react-native';
import { color as tokens, fontFamily } from '../theme/tokens';

// Renders a Cloudinary-backed avatar when `url` is set, otherwise falls
// back to the initial-on-color tile used elsewhere in the design system.

type Props = {
  name?: string;
  color?: string;
  size?: number;
  ring?: string;
  url?: string | null;
};

export const Avatar: React.FC<Props> = ({
  name = 'L',
  color: bg = tokens.gold[500],
  size = 40,
  ring,
  url,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...(ring ? { borderWidth: 2, borderColor: ring } : null),
    }}
  >
    {url ? (
      <Image source={{ uri: url }} style={{ width: size, height: size }} />
    ) : (
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
    )}
  </View>
);

export default Avatar;
