import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius } from '../theme/tokens';
import { Micro, Body, Chip, DisplayHeadline, PartyCard, SettingsButton } from '../components';
import { api, ApiError, type PartyListItem } from '../lib/api';

type Props = {
  token: string;
  onOpenParty: (party: PartyListItem) => void;
  onOpenSettings: () => void;
};

const FILTERS = ['All', 'Tonight', 'This Week', 'Hosted by friends'] as const;
type Filter = (typeof FILTERS)[number];

const isTonight = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

const isThisWeek = (iso: string) => {
  const d = new Date(iso).getTime();
  const now = Date.now();
  return d >= now && d <= now + 7 * 24 * 60 * 60 * 1000;
};

export const PartiesFeed: React.FC<Props> = ({ token, onOpenParty, onOpenSettings }) => {
  const [parties, setParties] = useState<PartyListItem[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('All');

  const load = async () => {
    setError(null);
    try {
      const { parties } = await api.listParties(token);
      setParties(parties);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = (parties ?? []).filter((p) => {
    if (filter === 'Tonight') return isTonight(p.startsAt);
    if (filter === 'This Week') return isThisWeek(p.startsAt);
    if (filter === 'Hosted by friends') return false; // friend graph not in this phase
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.rose}>● INVITE-ONLY · CAIRO</Micro>
            <DisplayHeadline
              lines={['PARTIES']}
              size={40}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 4 }}
            />
          </View>
          <SettingsButton onPress={onOpenSettings} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingBottom: 12 }}
        >
          {FILTERS.map((f) => (
            <Chip key={f} accent="night" selected={filter === f} onPress={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 14 }}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={color.rose}
            onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {parties === null ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}><ActivityIndicator color={color.rose} /></View>
          ) : error ? (
            <View style={{ padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: color.rose, backgroundColor: color.bg.surface }}>
              <Body color={color.rose}>{error}</Body>
              <Pressable onPress={load} style={{ marginTop: 8 }}>
                <Text style={{ color: color.gold[500], fontSize: 13, fontWeight: '700' }}>Try again</Text>
              </Pressable>
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Body color={color.text.muted}>No parties match {filter.toLowerCase()}.</Body>
            </View>
          ) : (
            filtered.map((p) => <PartyCard key={p.id} party={p} onPress={() => onOpenParty(p)} />)
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PartiesFeed;
