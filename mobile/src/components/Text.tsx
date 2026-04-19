import React from 'react';
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { color } from '../theme/tokens';
import { resolveType } from '../theme/typography';

// Display / Micro / Body — RN equivalents of the <div>-based text primitives
// in components.jsx. Gradient text on RN requires masking, so the `gradient`
// prop is accepted but deferred to a dedicated GradientText component later.

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type BaseProps = TextProps & { color?: string; style?: TextStyle };

export const Display: React.FC<BaseProps & { size?: Exclude<Size, never> }> = ({
  size = 'md', color: c = color.text.primary, style, children, ...rest
}) => (
  <RNText style={[resolveType(`display-${size}` as const), { color: c }, style]} {...rest}>
    {children}
  </RNText>
);

export const Title: React.FC<BaseProps & { size?: 'md' | 'lg' }> = ({
  size = 'md', color: c = color.text.primary, style, children, ...rest
}) => (
  <RNText style={[resolveType(`title-${size}` as const), { color: c }, style]} {...rest}>
    {children}
  </RNText>
);

export const Body: React.FC<BaseProps & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md', color: c = color.text.secondary, style, children, ...rest
}) => (
  <RNText style={[resolveType(`body-${size}` as const), { color: c }, style]} {...rest}>
    {children}
  </RNText>
);

export const Micro: React.FC<BaseProps & { size?: Size }> = ({
  size = 'md', color: c = color.text.muted, style, children, ...rest
}) => (
  <RNText style={[resolveType(`micro-${size}` as const), { color: c }, style]} {...rest}>
    {children}
  </RNText>
);

export const Caption: React.FC<BaseProps> = ({
  color: c = color.text.muted, style, children, ...rest
}) => (
  <RNText style={[resolveType('caption'), { color: c }, style]} {...rest}>
    {children}
  </RNText>
);
