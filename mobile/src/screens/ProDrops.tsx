import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Micro, Body, BackButton, DisplayHeadline } from '../components';
import { api, ApiError, type Drop } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  token: string;
  onBack: () => void;
};

const TAG_COLOR: Record<Drop['tag'], string> = {
  LIVE:      color.teal,
  LIMITED:   color.rose,
  EXCLUSIVE: color.violet,
};

const padN = (n: number) => String(n).padStart(2, '0');

const buildCountdown = (iso: string) => {
  const ms = Math.max(0, new Date(iso).getTime() - Date.now());
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return [
    [padN(days),  'D'],
    [padN(hours), 'H'],
    [padN(mins),  'M'],
  ] as const;
};

export const ProDrops: React.FC<Props> = ({ token, onBack }) => {
  const [drops, setDrops] = useState<Drop[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    api.listDrops(token)
      .then(({ drops }) => setDrops(drops))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Network error'));
  }, [token]);

  // Tick the countdown every minute.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  void now;

  const next = drops?.[0];
  const liveCount = drops?.filter((d) => d.tag === 'LIVE').length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.rose}>🔥 DROPS · PRO ONLY</Micro>
          </View>
          {liveCount > 0 ? (
            <View
              style={{
                paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill,
                backgroundColor: 'rgba(0,229,200,0.12)',
                borderWidth: 1, borderColor: color.teal,
              }}
            >
              <Text style={{ color: color.teal, fontSize: 10, fontWeight: '900', letterSpacing: 1 }}>
                {liveCount} LIVE
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 6 }}>
          <DisplayHeadline
            lines={['EXCLUSIVE']}
            size={40}
            lineHeightRatio={1.0}
            letterSpacingEm={0.03}
          />
        </View>

        {/* Countdown to next drop */}
        {next ? (
          <View
            style={{
              marginHorizontal: 20, marginTop: 14,
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <Micro size="xs" color={color.text.muted}>
              NEXT DROP REVEAL · {new Date(next.startsAt).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
              {' · '}
              {new Date(next.startsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Micro>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
              {buildCountdown(next.startsAt).map(([n, l]) => (
                <View key={l}>
                  <Text style={{ fontFamily: fontFamily.mono, color: color.gold[500], fontSize: 28, fontWeight: '900', letterSpacing: 1 }}>
                    {n}
                  </Text>
                  <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>{l}</Micro>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, paddingTop: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
          {drops === null ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}><ActivityIndicator color={color.rose} /></View>
          ) : error ? (
            <Body color={color.rose}>{error}</Body>
          ) : drops.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Body color={color.text.muted}>No drops live yet — sit tight.</Body>
            </View>
          ) : (
            drops.map((d) => <DropCard key={d.id} drop={d} />)
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const DropCard: React.FC<{ drop: Drop }> = ({ drop }) => {
  const g = resolveGradient(drop.gradient);
  const filledPct = Math.min(100, Math.round((drop.taken / drop.capacity) * 100));
  const tagTint = TAG_COLOR[drop.tag];

  return (
    <View
      style={{
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: color.stroke.gold,
        ...shadow.card,
      }}
    >
      <LinearGradient colors={g.colors} start={g.start} end={g.end} style={{ height: 140, padding: 14, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              paddingHorizontal: 8, paddingVertical: 4,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(7,6,13,0.72)',
              borderWidth: 1, borderColor: tagTint,
              flexDirection: 'row', alignItems: 'center', gap: 4,
            }}
          >
            {drop.tag === 'LIVE' ? (
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tagTint }} />
            ) : null}
            <Text style={{ color: tagTint, fontSize: 10, fontWeight: '900', letterSpacing: 1 }}>{drop.tag}</Text>
          </View>
          <Text style={{ fontSize: 28 }}>{drop.emoji}</Text>
        </View>
        <View>
          <Text style={{ color: color.text.primary, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 }}>
            {drop.name.toUpperCase()}
          </Text>
          <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 2 }}>
            {drop.host.toUpperCase()} · {drop.neighborhood.toUpperCase()}
          </Micro>
        </View>
      </LinearGradient>

      <View style={{ padding: 14, backgroundColor: color.bg.surface, gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: color.text.primary, fontSize: 12, fontWeight: '700' }}>
            {drop.taken}/{drop.capacity} SPOTS
          </Text>
          {drop.feeEgp === 0 ? (
            <View
              style={{
                paddingHorizontal: 8, paddingVertical: 4,
                borderRadius: 4, backgroundColor: color.teal,
              }}
            >
              <Text style={{ color: color.text.inverse, fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>
                FREE FOR PRO
              </Text>
            </View>
          ) : (
            <Text style={{ color: color.gold[500], fontSize: 13, fontWeight: '900', fontFamily: fontFamily.mono }}>
              {drop.feeEgp.toLocaleString()} EGP
            </Text>
          )}
        </View>
        {/* Capacity bar */}
        <View style={{ height: 4, borderRadius: 2, backgroundColor: color.stroke.soft, overflow: 'hidden' }}>
          <View style={{ width: `${filledPct}%`, height: '100%', backgroundColor: tagTint }} />
        </View>
      </View>
    </View>
  );
};

export default ProDrops;
