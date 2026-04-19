import React from 'react';
import { Pressable, View, Text, ActivityIndicator, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, gradient, radius, fontFamily } from '../theme/tokens';

// Mirrors components.jsx `Button` — gold, night, valet, shine, outline, ghost.
// Press feedback compresses to 0.95 (matches web `active:scale-95`).

export type ButtonVariant = 'gold' | 'night' | 'valet' | 'shine' | 'outline' | 'ghost';

type Props = {
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  children: React.ReactNode;
};

const labelStyle = {
  fontFamily: fontFamily.body,
  fontSize: 14,
  fontWeight: '800' as const,
  letterSpacing: 14 * 0.15, // 0.15em at 14pt
  textTransform: 'uppercase' as const,
};

export const Button: React.FC<Props> = ({
  variant = 'gold',
  onPress,
  disabled,
  loading,
  full = true,
  icon,
  style,
  children,
}) => {
  const isDisabled = disabled || loading;
  // Variant → gradient token. The "shine" variant uses `goldShine` (3-stop
  // gold shimmer) but the variant key intentionally stays short.
  const gradByVariant: Partial<Record<ButtonVariant, (typeof gradient)[keyof typeof gradient]>> = {
    gold:  gradient.gold,
    night: gradient.night,
    valet: gradient.valet,
    shine: gradient.goldShine,
  };
  const grad = gradByVariant[variant] ?? null;

  const fgByVariant: Record<ButtonVariant, string> = {
    gold:    color.text.inverse,
    night:   color.text.primary,
    valet:   color.text.inverse,
    shine:   color.text.inverse,
    outline: color.gold[500],
    ghost:   color.text.primary,
  };
  const fg = isDisabled ? color.text.muted : fgByVariant[variant];

  const frameStyle: ViewStyle = {
    width: full ? '100%' : 'auto',
    borderRadius: radius.md,
    overflow: 'hidden',
  };

  const inner: ViewStyle = {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  };

  const solidBg: ViewStyle =
    isDisabled ? { backgroundColor: color.bg.surface, borderWidth: 1, borderColor: color.stroke.soft }
    : variant === 'outline' ? { backgroundColor: color.bg.base, borderWidth: 1, borderColor: color.gold[500] }
    : variant === 'ghost'   ? { backgroundColor: color.bg.surface, borderWidth: 1, borderColor: color.stroke.soft }
    : {};

  const body = loading
    ? <ActivityIndicator color={fg} />
    : <><Text style={[labelStyle, { color: fg }]}>{children}</Text>{icon}</>;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        frameStyle,
        { opacity: isDisabled ? 1 : pressed ? 0.9 : 1, transform: [{ scale: pressed && !isDisabled ? 0.95 : 1 }] },
        style,
      ]}
    >
      {grad && !isDisabled ? (
        <LinearGradient colors={grad.colors} start={grad.start} end={grad.end} style={inner}>
          {body}
        </LinearGradient>
      ) : (
        <View style={[inner, solidBg]}>{body}</View>
      )}
    </Pressable>
  );
};

export default Button;
