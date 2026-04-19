import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { color, fontFamily } from '../theme/tokens';

type Props = {
  bg?: string;
  fg?: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export const Tag: React.FC<Props> = ({
  bg = color.gold[500],
  fg = color.text.inverse,
  children,
  style,
}) => (
  <View
    style={[
      { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, backgroundColor: bg, alignSelf: 'flex-start' },
      style,
    ]}
  >
    <Text
      style={{
        color: fg,
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 9 * 0.15,
        textTransform: 'uppercase',
        fontFamily: fontFamily.body,
      }}
    >
      {children}
    </Text>
  </View>
);

export default Tag;
