import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, Button, BackButton, DisplayHeadline, HostCard, Avatar } from '../components';
import { api, ApiError, type PartyDetail, type PartyRequest, type LaylaUser } from '../lib/api';

type Props = {
  token: string;
  party: PartyDetail;
  me: LaylaUser;
  onClose: () => void;
  onSent: (request: PartyRequest) => void;
};

const MAX_MESSAGE = 240;

export const RequestJoin: React.FC<Props> = ({ token, party, me, onClose, onSent }) => {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { request } = await api.requestToJoin(token, party.id, message);
      onSent(request);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
      setBusy(false);
    }
  };

  const firstName = party.host.name?.split(' ')[0] ?? 'the host';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.bg.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: color.bg.surface,
              borderWidth: 1, borderColor: color.stroke.soft,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>×</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
        </View>

        <Micro size="sm" color={color.rose}>REQUEST TO JOIN</Micro>
        <DisplayHeadline
          lines={[`INTRO YOURSELF`, `TO ${firstName.toUpperCase()}.`]}
          size={32}
          lineHeightRatio={0.95}
          letterSpacingEm={0.02}
          style={{ marginTop: 6, marginBottom: 18 }}
        />

        <HostCard host={party.host} responseTime="~12 min" />

        {/* Profile preview — what the host will see */}
        <View style={{ marginTop: 20 }}>
          <Micro size="xs" color={color.text.muted}>SHE'LL SEE</Micro>
          <View
            style={{
              marginTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <Avatar name={me.name ?? 'U'} color={color.gold[500]} size={40} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>{me.name ?? 'You'}</Text>
              <Body size="sm" style={{ marginTop: 2 }}>
                {me.city ? `${me.city.charAt(0) + me.city.slice(1).toLowerCase()} · ` : ''}
                {me.vibes.slice(0, 3).join(' · ') || 'LAYLA member'}
              </Body>
            </View>
          </View>
        </View>

        {/* Message field */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Micro size="xs" color={color.text.muted}>YOUR MESSAGE · OPTIONAL</Micro>
            <Micro size="xs" color={message.length > MAX_MESSAGE * 0.9 ? color.rose : color.text.muted}>
              {message.length}/{MAX_MESSAGE}
            </Micro>
          </View>
          <TextInput
            value={message}
            onChangeText={(t) => setMessage(t.slice(0, MAX_MESSAGE))}
            placeholder={`Love your vibe! First time at one of your parties — promise to respect the rules 🌙`}
            placeholderTextColor={color.text.muted}
            multiline
            style={{
              marginTop: 8,
              minHeight: 120,
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1.5,
              borderColor: message.length > 0 ? color.rose : color.stroke.soft,
              color: color.text.primary,
              fontSize: 14,
              fontFamily: fontFamily.body,
              textAlignVertical: 'top',
            }}
          />
        </View>

        {error ? <Body size="sm" color={color.rose} style={{ marginTop: 10 }}>{error}</Body> : null}

        <View style={{ flex: 1 }} />

        <Body size="sm" style={{ marginBottom: 12, textAlign: 'center' }}>
          Host approves each guest manually.
        </Body>
        <Button variant="night" loading={busy} onPress={send}>
          SEND REQUEST →
        </Button>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RequestJoin;
