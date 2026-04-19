import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline, SettingsButton } from '../components';
import { api, ApiError, type Subscription, type ProStats, type Drop } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  token: string;
  userName: string;
  onOpenDrops: () => void;
  onOpenSettings: () => void;
};

const HOLO = ['#D4A843', '#F0C96A', '#FF3D6B', '#8B3FFF'] as const;

const formatNextBill = (renewsAt: string) =>
  new Date(renewsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

const formatMemberSince = (startedAt: string) =>
  new Date(startedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

export const ProDashboard: React.FC<Props> = ({ token, userName, onOpenDrops, onOpenSettings }) => {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<ProStats | null>(null);
  const [nextDrop, setNextDrop] = useState<Drop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getMyPro(token),
      api.listDrops(token),
    ])
      .then(([{ subscription, stats }, { drops }]) => {
        setSub(subscription);
        setStats(stats);
        setNextDrop(drops[0] ?? null);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Network error'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading || !stats) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        {error ? <Body color={color.rose}>{error}</Body> : <ActivityIndicator color={color.gold[500]} />}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.teal}>● PRO · {sub?.status ?? 'INACTIVE'}</Micro>
            <DisplayHeadline
              lines={['YOUR PERKS']}
              size={36}
              lineHeightRatio={1.0}
              letterSpacingEm={0.02}
              style={{ marginTop: 4 }}
            />
          </View>
          <SettingsButton onPress={onOpenSettings} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 14 }} showsVerticalScrollIndicator={false}>
          {/* Holographic mini card */}
          {sub ? (
            <LinearGradient
              colors={HOLO}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: radius.lg, padding: 14, ...shadow.glowGold }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View>
                  <Micro size="xs" color={color.text.inverse}>MEMBER SINCE · {formatMemberSince(sub.startedAt)}</Micro>
                  <Text style={{ fontFamily: fontFamily.display, fontSize: 22, fontWeight: '900', color: color.text.inverse, marginTop: 4, letterSpacing: 1 }}>
                    {(userName || 'GUEST').toUpperCase()} · PRO
                  </Text>
                </View>
                <Text style={{ fontFamily: fontFamily.display, fontSize: 20, fontWeight: '900', color: color.text.inverse }}>L</Text>
              </View>
              <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(7,6,13,0.18)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Micro size="xs" color={color.text.inverse}>
                  NEXT BILL · {formatNextBill(sub.renewsAt)}
                </Micro>
                <Text style={{ color: color.text.inverse, fontSize: 13, fontWeight: '900', fontFamily: fontFamily.mono }}>
                  {sub.priceEgp} EGP
                </Text>
              </View>
            </LinearGradient>
          ) : null}

          {/* Stats grid */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Stat value={String(stats.dropsUnlocked)} label="DROPS UNLOCKED" color={color.gold[500]} />
            <Stat value={`${(stats.egpSaved / 1000).toFixed(1)}K`} label="EGP SAVED"      color={color.teal} />
            <Stat value={String(stats.linesSkipped)}  label="LINES SKIPPED" color={color.rose} />
          </View>

          {/* Quick actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ActionCard
              icon="🔥"
              title="Exclusive drops"
              subtitle={`${stats.dropsActive} LIVE NOW`}
              gradient={['#FF3D6B', '#8B3FFF']}
              onPress={onOpenDrops}
            />
            <ActionCard
              icon="🎁"
              title="Partner perks"
              subtitle={`${stats.activePerks} ACTIVE`}
              gradient={['#D4A843', '#F0C96A']}
            />
          </View>

          {/* Next drop preview */}
          {nextDrop ? (
            <View style={{ gap: 8 }}>
              <Micro size="sm" color={color.gold[500]}>NEXT DROP</Micro>
              <Pressable onPress={onOpenDrops}>
                <View
                  style={{
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
                  <LinearGradient
                    colors={resolveGradient(nextDrop.gradient).colors}
                    start={resolveGradient(nextDrop.gradient).start}
                    end={resolveGradient(nextDrop.gradient).end}
                    style={{ width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontSize: 20 }}>{nextDrop.emoji}</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                      {nextDrop.name}
                    </Text>
                    <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
                      {nextDrop.neighborhood.toUpperCase()} · {new Date(nextDrop.startsAt).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </Micro>
                  </View>
                  {nextDrop.feeEgp === 0 ? (
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
                    <Text style={{ color: color.gold[500], fontSize: 12, fontWeight: '800', fontFamily: fontFamily.mono }}>
                      {nextDrop.feeEgp} EGP
                    </Text>
                  )}
                </View>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Stat: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color: tint }) => (
  <View
    style={{
      flex: 1,
      padding: 12,
      borderRadius: radius.md,
      backgroundColor: color.bg.surface,
      borderWidth: 1,
      borderColor: color.stroke.soft,
      alignItems: 'flex-start',
    }}
  >
    <Text style={{ fontFamily: fontFamily.display, fontSize: 22, fontWeight: '900', color: tint, letterSpacing: 0.5 }}>
      {value}
    </Text>
    <Micro size="xs" color={color.text.muted} style={{ marginTop: 4 }}>{label}</Micro>
  </View>
);

const ActionCard: React.FC<{ icon: string; title: string; subtitle: string; gradient: readonly [string, string]; onPress?: () => void }> = ({ icon, title, subtitle, gradient: grad, onPress }) => {
  const Inner = (
    <LinearGradient
      colors={grad}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 14, borderRadius: radius.md, gap: 4, minHeight: 92 }}
    >
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '900', marginTop: 4 }}>{title}</Text>
      <Micro size="xs" color={color.text.primary}>{subtitle}</Micro>
    </LinearGradient>
  );
  return onPress ? <Pressable onPress={onPress} style={{ flex: 1 }}>{Inner}</Pressable> : <View style={{ flex: 1 }}>{Inner}</View>;
};

export default ProDashboard;
