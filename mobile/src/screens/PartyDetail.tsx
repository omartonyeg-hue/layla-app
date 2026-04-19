import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius } from '../theme/tokens';
import { Micro, Body, Button, BackButton, Tag, HostCard, AvatarStack } from '../components';
import { api, ApiError, type PartyDetail as PartyDetailType, type PartyRequest } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  token: string;
  partyId: string;
  initial?: PartyDetailType;
  onBack: () => void;
  onRequestJoin: (party: PartyDetailType) => void;
  onAlreadyApproved: (party: PartyDetailType) => void;
};

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${weekday} · ${day} · ${time}`;
};

export const PartyDetail: React.FC<Props> = ({ token, partyId, initial, onBack, onRequestJoin, onAlreadyApproved }) => {
  const [party, setParty] = useState<PartyDetailType | null>(initial ?? null);
  const [myRequest, setMyRequest] = useState<PartyRequest | null>(null);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);
  // Read insets directly instead of nesting SafeAreaView inside the absolute-
  // positioned hero — SafeAreaView sometimes returns 0 on first render, which
  // put the STRICT DOOR tag behind the iPhone status bar on re-mount.
  const insets = useSafeAreaInsets();

  const load = async () => {
    try {
      const { party, myRequest } = await api.getParty(token, partyId);
      setParty(party);
      setMyRequest(myRequest);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [partyId]);

  if (loading || !party) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        {error ? <Body color={color.rose}>{error}</Body> : <ActivityIndicator color={color.rose} />}
      </View>
    );
  }

  const g = resolveGradient(party.gradient);
  const { width } = Dimensions.get('window');
  const heroHeight = 240;

  const ctaLabel =
    myRequest?.status === 'APPROVED' ? 'VIEW YOUR ACCESS →'
    : myRequest?.status === 'PENDING' ? 'REQUEST SENT · WAITING'
    : 'REQUEST TO JOIN →';
  const ctaDisabled = myRequest?.status === 'PENDING';

  const handleCta = () => {
    if (myRequest?.status === 'APPROVED') onAlreadyApproved(party);
    else if (!myRequest || myRequest.status === 'DECLINED') onRequestJoin(party);
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ height: heroHeight, width }}>
          <LinearGradient colors={g.colors} start={g.start} end={g.end} style={{ flex: 1 }} />
          <LinearGradient
            colors={['rgba(7,6,13,0.45)', 'transparent', 'rgba(7,6,13,0.7)']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View
            style={{
              position: 'absolute',
              top: insets.top,
              left: 0,
              right: 0,
              paddingHorizontal: 16,
              paddingTop: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <BackButton onPress={onBack} />
            <View style={{ flex: 1 }} />
            {party.tag ? (
              <Tag bg={color.rose} fg={color.text.primary}>{party.tag}</Tag>
            ) : null}
          </View>

          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
            <Text style={{ fontSize: 48, marginBottom: 4 }}>{party.emoji}</Text>
            <Text style={{ color: color.text.primary, fontSize: 26, fontWeight: '900', letterSpacing: 0.5 }}>
              {party.title.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 20, gap: 16 }}>
          {/* Host */}
          <HostCard host={party.host} responseTime="~12 min" />

          {/* Meta rows */}
          <View style={{ gap: 10 }}>
            <MetaRow icon="📅" label={formatWhen(party.startsAt)} />
            <MetaRow
              icon="📍"
              label={
                party.address
                  ? `${party.address}${party.doorDetail ? ' · ' + party.doorDetail : ''} · ${party.neighborhood}`
                  : `${party.neighborhood} · address unlocks on approval`
              }
              locked={!party.address}
            />
            <MetaRow icon="🎧" label={`${party.theme.toLowerCase()} · ${party.emoji}`} />
          </View>

          {/* Guest stack */}
          <View style={{ padding: 14, borderRadius: radius.md, backgroundColor: color.bg.surface, borderWidth: 1, borderColor: color.stroke.soft }}>
            <Micro size="xs" color={color.text.muted}>GUESTS APPROVED</Micro>
            <View style={{ marginTop: 10 }}>
              <AvatarStack count={party.approvedCount} cap={party.cap} />
            </View>
            <Body size="sm" style={{ marginTop: 10 }}>
              Host approves each guest manually.
            </Body>
          </View>

          {/* Rules */}
          {party.rules.length > 0 ? (
            <View>
              <Micro size="sm" color={color.rose}>HOUSE RULES</Micro>
              <View style={{ gap: 8, marginTop: 10 }}>
                {party.rules.map((r, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={{ color: color.rose, fontSize: 12, fontWeight: '900', letterSpacing: 1, width: 18 }}>
                      {String(i + 1).padStart(2, '0')}
                    </Text>
                    <Body size="sm" color={color.text.primary} style={{ flex: 1 }}>{r}</Body>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0, right: 0, bottom: 0,
          paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32,
          backgroundColor: color.bg.base,
          borderTopWidth: 1,
          borderTopColor: color.stroke.soft,
        }}
      >
        <Button variant="night" disabled={ctaDisabled} onPress={handleCta}>
          {ctaLabel}
        </Button>
      </View>
    </View>
  );
};

const MetaRow: React.FC<{ icon: string; label: string; locked?: boolean }> = ({ icon, label, locked }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 10,
      borderRadius: radius.md,
      borderWidth: locked ? 1 : 0,
      borderStyle: locked ? 'dashed' : 'solid',
      borderColor: locked ? color.rose : 'transparent',
      backgroundColor: locked ? 'rgba(255,61,107,0.05)' : 'transparent',
    }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: locked ? 'rgba(255,61,107,0.12)' : 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: locked ? 'rgba(255,61,107,0.3)' : color.stroke.soft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 16 }}>{locked ? '🔒' : icon}</Text>
    </View>
    <Text style={{ flex: 1, color: color.text.primary, fontSize: 13, fontWeight: '600' }}>{label}</Text>
  </View>
);

export default PartyDetail;
