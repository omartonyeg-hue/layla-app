import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius } from '../theme/tokens';
import { Avatar, Micro, Body, Button, BackButton, DisplayHeadline, VerifiedBadge } from '../components';
import { resolveGradient } from '../lib/gradients';
import { api, ApiError, type HostInboxRequest } from '../lib/api';

type Props = {
  token: string;
  onBack: () => void;
};

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${day} · ${time}`;
};

export const HostInbox: React.FC<Props> = ({ token, onBack }) => {
  const [requests, setRequests] = useState<HostInboxRequest[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const { requests } = await api.hostInbox(token);
      setRequests(requests);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const decide = async (req: HostInboxRequest, action: 'APPROVE' | 'DECLINE') => {
    if (decidingId) return;
    setDecidingId(req.id);
    try {
      await api.decidePartyRequest(token, req.partyId, req.id, action);
      // Optimistic remove from inbox.
      setRequests((prev) => prev?.filter((r) => r.id !== req.id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setDecidingId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.rose}>HOST · INBOX</Micro>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 4 }}>
          <DisplayHeadline lines={['REQUESTS.']} size={36} lineHeightRatio={1.0} letterSpacingEm={0.02} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={color.rose} onRefresh={() => { setRefreshing(true); load(); }} />}
          showsVerticalScrollIndicator={false}
        >
          {requests === null ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}><ActivityIndicator color={color.rose} /></View>
          ) : error ? (
            <View style={{ padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: color.rose, backgroundColor: color.bg.surface }}>
              <Body color={color.rose}>{error}</Body>
            </View>
          ) : requests.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center', gap: 6 }}>
              <Body color={color.text.muted}>No pending requests.</Body>
              <Micro size="xs" color={color.text.muted}>You'll see them here as guests apply.</Micro>
            </View>
          ) : (
            requests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                disabled={decidingId !== null}
                onApprove={() => decide(r, 'APPROVE')}
                onDecline={() => decide(r, 'DECLINE')}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const RequestCard: React.FC<{
  request: HostInboxRequest;
  disabled: boolean;
  onApprove: () => void;
  onDecline: () => void;
}> = ({ request, disabled, onApprove, onDecline }) => {
  const g = resolveGradient(request.party.gradient);
  return (
    <View
      style={{
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: color.stroke.gold,
      }}
    >
      <LinearGradient colors={g.colors} start={g.start} end={g.end} style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 22 }}>{request.party.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '900', letterSpacing: 0.5 }}>
            {request.party.title.toUpperCase()}
          </Text>
          <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 2 }}>
            {formatWhen(request.party.startsAt)} · {request.party.neighborhood.toUpperCase()}
          </Micro>
        </View>
      </LinearGradient>

      <View style={{ padding: 14, backgroundColor: color.bg.surface, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar
            name={request.requester.name ?? 'G'}
            color={request.requester.avatarColor ?? color.gold[500]}
            size={40}
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>
                {request.requester.name ?? 'Guest'}
              </Text>
              {request.requester.hostVerified ? <VerifiedBadge size={11} /> : null}
            </View>
            <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
              {request.requester.city ? `${request.requester.city.charAt(0) + request.requester.city.slice(1).toLowerCase()}` : 'LAYLA member'}
              {request.requester.vibes.length > 0 ? ` · ${request.requester.vibes.slice(0, 3).join(' · ')}` : ''}
            </Micro>
          </View>
        </View>

        {request.message ? (
          <View
            style={{
              padding: 10,
              borderRadius: radius.md,
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <Body size="sm" color={color.text.primary}>{request.message}</Body>
          </View>
        ) : (
          <Body size="sm">No intro message — just the profile.</Body>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Pressable
              disabled={disabled}
              onPress={onDecline}
              style={({ pressed }) => ({
                paddingVertical: 12,
                borderRadius: radius.md,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: color.stroke.mid,
                alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: color.text.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>DECLINE</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1.4 }}>
            <Button variant="night" disabled={disabled} onPress={onApprove}>APPROVE →</Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HostInbox;
