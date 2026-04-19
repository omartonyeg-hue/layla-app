import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { color, radius } from '../theme/tokens';

type Props = {
  padding?: number;
  accent?: string;
  style?: ViewStyle;
  children: React.ReactNode;
};

export const Card: React.FC<Props> = ({ padding = 16, accent, style, children }) => (
  <View
    style={[
      {
        backgroundColor: color.bg.surface,
        borderWidth: 1,
        borderColor: accent ?? color.stroke.soft,
        borderRadius: radius.lg,
        padding,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export default Card;
