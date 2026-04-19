import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, BackButton, DisplayHeadline } from '../components';
import { api, ApiError, type TicketDetail } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  token: string;
  onBack: () => void;
  onOpenTicket: (ticket: TicketDetail) => void;
};

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${weekday} · ${day} · ${time}`;
};

export const MyTickets: React.FC<Props> = ({ token, onBack, onOpenTicket }) => {
  const [tickets, setTickets] = useState<TicketDetail[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const { tickets } = await api.listMyTickets(token);
      setTickets(tickets);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }} />
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <Micro size="sm" color={color.gold[500]}>🎫 YOUR TICKETS</Micro>
          <DisplayHeadline
            lines={['ENTRY LIST.']}
            size={36}
            lineHeightRatio={1.0}
            letterSpacingEm={0.02}
            style={{ marginTop: 4 }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={color.gold[500]} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {tickets === null ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}><ActivityIndicator color={color.gold[500]} /></View>
          ) : error ? (
            <View style={{ padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: color.rose, backgroundColor: color.bg.surface }}>
              <Body color={color.rose}>{error}</Body>
            </View>
          ) : tickets.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Body color={color.text.muted}>No tickets yet. Browse events to grab one.</Body>
            </View>
          ) : (
            tickets.map((t) => {
              const g = resolveGradient(t.event.gradient ?? 'sunset');
              return (
                <Pressable
                  key={t.id}
                  onPress={() => onOpenTicket(t)}
                  style={({ pressed }) => [
                    {
                      borderRadius: radius.lg,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: color.stroke.gold,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <LinearGradient colors={g.colors} start={g.start} end={g.end} style={{ padding: 14 }}>
                    <Text numberOfLines={2} style={{ color: color.text.primary, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 }}>
                      {t.event.name.toUpperCase()}
                    </Text>
                    <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 4 }}>
                      {formatWhen(t.event.startsAt)} · {t.event.venue.toUpperCase()}
                    </Micro>
                  </LinearGradient>
                  <View style={{ flexDirection: 'row', padding: 12, backgroundColor: color.bg.surface, alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <Micro size="xs" color={color.text.muted}>TIER</Micro>
                      <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                        {t.tier.name.toUpperCase()} · {t.tier.priceEgp.toLocaleString()} EGP
                      </Text>
                    </View>
                    <View>
                      <Micro size="xs" color={color.text.muted}>ORDER</Micro>
                      <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '700', marginTop: 2, fontFamily: fontFamily.mono }}>
                        {t.orderRef}
                      </Text>
                    </View>
                    <Text style={{ color: color.gold[500], fontSize: 18 }}>›</Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default MyTickets;
