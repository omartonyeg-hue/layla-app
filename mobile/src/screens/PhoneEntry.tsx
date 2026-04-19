import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily } from '../theme/tokens';
import { Button, Micro, Body, BackButton, StepsBar, DisplayHeadline } from '../components';
import { api, ApiError } from '../lib/api';

type Props = {
  initialPhone?: string;
  onBack?: () => void;
  onCodeSent: (phone: string) => void;
};

export const PhoneEntry: React.FC<Props> = ({ initialPhone = '', onBack, onCodeSent }) => {
  const [local, setLocal] = useState(initialPhone);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Egypt mobile numbers are 10 digits (without leading 0) after +20.
  const isValid = /^\d{10}$/.test(local);

  const send = async () => {
    if (!isValid || busy) return;
    setBusy(true);
    setError(null);
    const e164 = `+20${local}`;
    try {
      await api.requestOtp(e164);
      onCodeSent(e164);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error. Is the backend running?';
      setError(msg);
    } finally {
      setBusy(false);
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
          <StepsBar total={4} current={0} />
          <Micro size="xs" color={color.text.muted}>1/4</Micro>
        </View>

        <Micro size="sm" color={color.gold[500]}>GET STARTED</Micro>
        <DisplayHeadline
          lines={['YOUR', 'NUMBER.']}
          size={42}
          lineHeightRatio={0.95}
          letterSpacingEm={0.02}
          style={{ marginTop: 6 }}
        />
        <Body style={{ marginTop: 10, marginBottom: 28 }}>
          We'll text you a 6-digit code to verify it's really you.
        </Body>

        <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>PHONE</Micro>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: radius.md,
            backgroundColor: color.bg.surface,
            borderWidth: 1.5,
            borderColor: error ? color.rose : color.gold[500],
          }}
        >
          <Text style={{ color: color.text.primary, fontSize: 15, fontWeight: '700' }}>🇪🇬 +20</Text>
          <TextInput
            value={local}
            onChangeText={(t) => {
              setError(null);
              setLocal(t.replace(/\D/g, '').slice(0, 10));
            }}
            placeholder="1001234567"
            placeholderTextColor={color.text.muted}
            keyboardType="phone-pad"
            autoFocus
            style={{
              flex: 1,
              color: color.text.primary,
              fontSize: 15,
              fontFamily: fontFamily.mono,
              padding: 0, // strip platform padding for tight alignment with prefix
            }}
          />
        </View>
        {error ? (
          <Body size="sm" color={color.rose} style={{ marginTop: 8 }}>{error}</Body>
        ) : null}

        <View style={{ flex: 1 }} />

        <Button variant="gold" disabled={!isValid} loading={busy} onPress={send}>
          SEND CODE →
        </Button>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PhoneEntry;
