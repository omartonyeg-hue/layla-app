import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, gradient, shadow } from '../theme/tokens';
import {
  Button,
  Micro,
  Body,
  Tag,
  BackButton,
  StepsBar,
  DisplayHeadline,
} from '../components';
import { api, ApiError, type Role as RoleValue, type LaylaUser } from '../lib/api';

// Port of Claude Design Files/onboarding-v2.jsx lines 232–297.
// Role picker: guest / host / pro. Last step of onboarding.

type Props = {
  token: string;
  initial?: RoleValue | null;
  onBack: () => void;
  onChosen: (user: LaylaUser) => void;
};

type RoleDef = {
  id: RoleValue;
  name: string;
  desc: string;
  icon: string;
  grad: (typeof gradient)['gold' | 'night' | 'goldShine'];
  pro?: boolean;
  invertedIcon: boolean;
};

const ROLES: RoleDef[] = [
  {
    id: 'GUEST',
    name: 'I want to go out',
    desc: 'Discover events, join parties, book valet',
    icon: '🌙',
    grad: gradient.gold,
    invertedIcon: true,
  },
  {
    id: 'HOST',
    name: 'I want to host',
    desc: 'Throw private parties, curate your guest list',
    icon: '▲',
    grad: gradient.night,
    invertedIcon: false,
  },
  {
    id: 'PRO',
    name: "I'm a venue / DJ / promoter",
    desc: 'Sell tickets, promote events, grow your crowd',
    icon: '◆',
    grad: gradient.goldShine,
    pro: true,
    invertedIcon: true,
  },
];

export const Role: React.FC<Props> = ({ token, initial, onBack, onChosen }) => {
  const [selected, setSelected] = useState<RoleValue>(initial ?? 'GUEST');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { user } = await api.updateRole(token, selected);
      onChosen(user);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <BackButton onPress={onBack} />
          <StepsBar total={4} current={3} />
          <Micro size="xs" color={color.text.muted}>4/4</Micro>
        </View>

        <Micro size="sm" color={color.gold[500]}>ONE LAST THING</Micro>
        <DisplayHeadline
          lines={['WHAT BRINGS', 'YOU HERE?']}
          size={36}
          lineHeightRatio={0.95}
          letterSpacingEm={0.02}
          style={{ marginTop: 6, marginBottom: 6 }}
        />
        <Body style={{ marginBottom: 24 }}>You can switch later.</Body>

        <ScrollView contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
          {ROLES.map((r) => {
            const on = r.id === selected;
            return (
              <Pressable
                key={r.id}
                onPress={() => setSelected(r.id)}
                style={{
                  padding: 16,
                  borderRadius: radius.lg,
                  backgroundColor: on ? 'rgba(212,168,67,0.08)' : color.bg.surface,
                  borderWidth: 1.5,
                  borderColor: on ? color.gold[500] : color.stroke.soft,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <LinearGradient
                  colors={r.grad.colors}
                  start={r.grad.start}
                  end={r.grad.end}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(on ? shadow.glowGold : null),
                  }}
                >
                  <Text
                    style={{
                      color: r.invertedIcon ? color.text.inverse : color.text.primary,
                      fontSize: 22,
                      fontWeight: '900',
                    }}
                  >
                    {r.icon}
                  </Text>
                </LinearGradient>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>
                      {r.name}
                    </Text>
                    {r.pro ? <Tag>PRO</Tag> : null}
                  </View>
                  <Body size="sm" style={{ marginTop: 2 }}>{r.desc}</Body>
                </View>

                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 1.5,
                    borderColor: on ? color.gold[500] : color.stroke.mid,
                    backgroundColor: on ? color.gold[500] : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on ? (
                    <Text style={{ color: color.text.inverse, fontSize: 11, fontWeight: '900' }}>✓</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}

          {error ? (
            <Body size="sm" color={color.rose} style={{ marginTop: 8 }}>{error}</Body>
          ) : null}
        </ScrollView>

        <Button variant="gold" loading={busy} onPress={submit} style={{ marginTop: 20 }}>
          ENTER LAYLA →
        </Button>
      </SafeAreaView>
    </View>
  );
};

export default Role;
