import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Button, Micro, Body, BackButton, StepsBar, DisplayHeadline } from '../components';
import { api, ApiError } from '../lib/api';

type VerifiedUser = Awaited<ReturnType<typeof api.verifyOtp>>;

type Props = {
  phone: string;              // E.164, e.g. "+201001234567"
  onBack: () => void;
  onVerified: (result: VerifiedUser) => void;
};

const RESEND_SECONDS = 30;
const CODE_LENGTH = 6;

const maskPhone = (e164: string) => {
  // "+201001234567" → "+20 100 ••• 4567" — matches the design's privacy mask.
  const digits = e164.replace(/^\+20/, '');
  if (digits.length < 7) return e164;
  return `+20 ${digits.slice(0, 3)} ••• ${digits.slice(-4)}`;
};

const pad2 = (n: number) => n.toString().padStart(2, '0');

export const PhoneOTP: React.FC<Props> = ({ phone, onBack, onVerified }) => {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const verify = async (fullCode: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api.verifyOtp(phone, fullCode);
      onVerified(result);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error. Is the backend running?';
      setError(msg);
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const onChangeCode = (raw: string) => {
    const next = raw.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setError(null);
    setCode(next);
    if (next.length === CODE_LENGTH) verify(next);
  };

  const resend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await api.requestOtp(phone);
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error.';
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.bg.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <BackButton onPress={onBack} />
          <StepsBar total={4} current={1} />
          <Micro size="xs" color={color.text.muted}>2/4</Micro>
        </View>

        <Micro size="sm" color={color.gold[500]}>VERIFY</Micro>
        <DisplayHeadline
          lines={['ENTER THE', 'CODE.']}
          size={42}
          lineHeightRatio={0.95}
          letterSpacingEm={0.02}
          style={{ marginTop: 6 }}
        />
        <Body style={{ marginTop: 10, marginBottom: 18, fontSize: 13 }}>
          Sent a 6-digit code to{' '}
          <Text style={{ color: color.text.primary, fontWeight: '700' }}>{maskPhone(phone)}</Text>
        </Body>

        {/* Read-only phone summary with EDIT → goes back to PhoneEntry. */}
        <Pressable
          onPress={onBack}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: radius.md,
            backgroundColor: color.bg.surface,
            borderWidth: 1,
            borderColor: color.stroke.soft,
            marginBottom: 18,
            opacity: 0.6,
          }}
        >
          <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>🇪🇬 +20</Text>
          <Text
            style={{
              flex: 1,
              color: color.text.primary,
              fontSize: 14,
              fontFamily: fontFamily.mono,
            }}
          >
            {maskPhone(phone).replace('+20 ', '')}
          </Text>
          <Text style={{ color: color.gold[500], fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>
            EDIT
          </Text>
        </Pressable>

        <Micro size="sm" color={color.text.muted} style={{ marginBottom: 10 }}>
          ENTER 6-DIGIT CODE
        </Micro>

        {/* Hidden input captures all 6 digits; the row of visual cells below
            reflects its value. iOS autofills from the SMS via textContentType. */}
        <TextInput
          ref={hiddenInputRef}
          value={code}
          onChangeText={onChangeCode}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          autoFocus
          maxLength={CODE_LENGTH}
          caretHidden
          style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
        />
        <Pressable
          onPress={() => hiddenInputRef.current?.focus()}
          style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}
        >
          {Array.from({ length: CODE_LENGTH }).map((_, i) => {
            const digit = code[i];
            const filled = Boolean(digit);
            const active = i === code.length;
            const highlight = filled || active;
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1.5,
                  borderColor: highlight ? color.gold[500] : color.stroke.mid,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...(highlight ? shadow.glowGold : null),
                }}
              >
                <Text
                  style={{
                    color: color.text.primary,
                    fontSize: 26,
                    fontWeight: '800',
                    fontFamily: fontFamily.mono,
                  }}
                >
                  {digit ?? ''}
                </Text>
              </View>
            );
          })}
        </Pressable>

        {error ? (
          <Body size="sm" color={color.rose} style={{ marginBottom: 8 }}>{error}</Body>
        ) : null}

        <Pressable onPress={resend} disabled={secondsLeft > 0 || resending}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: color.teal,
                ...shadow.glowTeal,
              }}
            />
            <Micro size="xs" color={secondsLeft > 0 ? color.text.muted : color.gold[500]}>
              {secondsLeft > 0 ? `RESEND IN 00:${pad2(secondsLeft)}` : 'RESEND CODE'}
            </Micro>
          </View>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Button
          variant="gold"
          disabled={code.length !== CODE_LENGTH}
          loading={busy}
          onPress={() => verify(code)}
        >
          VERIFY →
        </Button>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PhoneOTP;
