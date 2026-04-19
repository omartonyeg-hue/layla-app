import React from 'react';
import { View, TextInput, type TextInputProps, type ViewStyle } from 'react-native';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body } from './Text';

type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  hint?: string;
  mono?: boolean;
  invalid?: boolean;
  style?: ViewStyle;
};

export const Input: React.FC<Props> = ({ label, hint, mono, invalid, style, ...rest }) => (
  <View style={[{ gap: 8, width: '100%' }, style]}>
    {label ? <Micro size="md" color={color.text.muted}>{label}</Micro> : null}
    <TextInput
      placeholderTextColor={color.text.muted}
      {...rest}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: radius.md,
        backgroundColor: color.bg.surface,
        borderWidth: 1,
        borderColor: invalid ? color.rose : color.stroke.gold,
        color: color.text.primary,
        fontSize: 15,
        fontFamily: mono ? fontFamily.mono : fontFamily.body,
      }}
    />
    {hint ? <Body size="sm" color={color.text.muted}>{hint}</Body> : null}
  </View>
);

export default Input;
