import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius } from '../theme/tokens';
import { Micro, Body, EventCard, DisplayHeadline, Chip } from '../components';
import { api, ApiError, type EventWithTiers } from '../lib/api';

type Props = {
  token: string;
  userName: string;
  ticketCount: number;
  onOpenEvent: (event: EventWithTiers) => void;
  onOpenTickets: () => void;
  onOpenSettings: () => void;
};

// City filter chips — static for now; future work wires to api query param.
const CITIES = ['All', 'Cairo', 'Sahel', 'Gouna'] as const;

export const EventsList: React.FC<Props> = ({ token, ticketCount, onOpenEvent, onOpenTickets, onOpenSettings }) => {
  const [events, setEvents] = useState<EventWithTiers[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<typeof CITIES[number]>('All');

  const load = async () => {
    setError(null);
    try {
      const { events } = await api.listEvents(token);
      setEvents(events);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = cityFilter === 'All'
    ? events
    : events.filter((e) => e.city === cityFilter.toUpperCase());

  const featured = filtered.find((e) => e.featured);
  const rest = filtered.filter((e) => e.id !== featured?.id);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>📍 TONIGHT IN EGYPT</Micro>
            <DisplayHeadline
              lines={['DISCOVER']}
              size={40}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 4 }}
            />
          </View>
          {/* Settings entry — Edit profile, Host inbox, Create party, Sign out. */}
          <Pressable
            onPress={onOpenSettings}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: color.bg.surface,
              borderWidth: 1, borderColor: color.stroke.soft,
              alignItems: 'center', justifyContent: 'center',
              marginRight: 10,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.secondary, fontSize: 16 }}>⚙</Text>
          </Pressable>
          {/* Tickets badge — matches the "shows '2'" counter in the design spec. */}
          <Pressable
            onPress={onOpenTickets}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: ticketCount > 0 ? 'rgba(212,168,67,0.12)' : color.bg.surface,
              borderWidth: 1,
              borderColor: ticketCount > 0 ? color.stroke.gold : color.stroke.soft,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 18 }}>🎫</Text>
            {ticketCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  minWidth: 18,
                  height: 18,
                  paddingHorizontal: 4,
                  borderRadius: 9,
                  backgroundColor: color.rose,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: color.bg.base,
                }}
              >
                <Text style={{ color: color.text.primary, fontSize: 10, fontWeight: '900' }}>
                  {ticketCount > 9 ? '9+' : String(ticketCount)}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* City filter chips — horizontal scroll row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingBottom: 12 }}
        >
          {CITIES.map((c) => (
            <Chip key={c} selected={cityFilter === c} onPress={() => setCityFilter(c)}>
              {c}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, gap: 14 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={color.gold[500]}
            onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {loading ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <ActivityIndicator color={color.gold[500]} />
            </View>
          ) : error ? (
            <View
              style={{
                padding: 16,
                borderRadius: radius.md,
                backgroundColor: color.bg.surface,
                borderWidth: 1,
                borderColor: color.rose,
              }}
            >
              <Micro size="sm" color={color.rose}>ERROR</Micro>
              <Body size="sm" color={color.text.primary} style={{ marginTop: 4 }}>{error}</Body>
              <Pressable onPress={load} style={{ marginTop: 10 }}>
                <Text style={{ color: color.gold[500], fontSize: 13, fontWeight: '700' }}>Try again</Text>
              </Pressable>
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Body color={color.text.muted}>No events in {cityFilter} right now.</Body>
            </View>
          ) : (
            <>
              {featured ? <EventCard event={featured} featured onPress={() => onOpenEvent(featured)} /> : null}
              {rest.length > 0 ? (
                <Micro size="sm" color={color.text.muted} style={{ marginTop: 6 }}>THIS WEEK</Micro>
              ) : null}
              {rest.map((e) => (
                <EventCard key={e.id} event={e} onPress={() => onOpenEvent(e)} />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default EventsList;
