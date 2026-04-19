import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { color, radius, fontFamily, gradient, shadow } from '../theme/tokens';
import { Micro, Body, Button, BackButton, DisplayHeadline } from '../components';
import { api, type PartyDetail, type PartyRequest } from '../lib/api';

type Props = {
  token: string;
  partyId: string;
  onBack: () => void;
};

// Poll cadence while waiting for the host's decision. Matches the "~12 min"
// response-time SLA shown in the detail screen — but since dev auto-approves
// after 5s, we hit APPROVED quickly.
const POLL_MS = 1500;
const MAX_WAIT_MS = 30000;

const pad2 = (n: number) => String(n).padStart(2, '0');

const formatCountdown = (targetIso: string) => {
  const ms = new Date(targetIso).getTime() - Date.now();
  if (ms <= 0) return 'LIVE NOW';
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  if (days > 0) return `${pad2(days)}D ${pad2(hours)}H`;
  if (hours > 0) return `${pad2(hours)}H ${pad2(mins)}M`;
  return `${pad2(mins)}M`;
};

const BurstGlow: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
      <Defs>
        <RadialGradient id="approvedBurst" cx="50%" cy="18%" r="70%">
          <Stop offset="0%" stopColor="#00E5C8" stopOpacity="0.22" />
          <Stop offset="60%" stopColor="#00E5C8" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#approvedBurst)" />
    </Svg>
  );
};

export const PartyApproved: React.FC<Props> = ({ token, partyId, onBack }) => {
  const [party, setParty] = useState<PartyDetail | null>(null);
  const [myRequest, setMyRequest] = useState<PartyRequest | null>(null);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);

  // Countdown ticker — 30s is plenty granular for D/H display.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  void now;

  // Poll until APPROVED or max-wait. Transient errors (e.g. Neon's idle
  // connection close) must NOT kill the poll — we just show a soft banner
  // and keep trying until the deadline.
  useEffect(() => {
    let active = true;
    let consecutiveErrors = 0;
    const start = Date.now();

    const tick = async () => {
      if (!active) return;
      try {
        const { party, myRequest } = await api.getParty(token, partyId);
        if (!active) return;
        consecutiveErrors = 0;
        setError(null);
        setParty(party);
        setMyRequest(myRequest);
        if (myRequest?.status === 'APPROVED') return; // done
        if (myRequest?.status === 'DECLINED') return; // terminal
        if (Date.now() - start > MAX_WAIT_MS) return;
        setTimeout(tick, POLL_MS);
      } catch {
        if (!active) return;
        consecutiveErrors += 1;
        // Three failures in a row before we surface an error to the user.
        if (consecutiveErrors >= 3) setError('Still trying to reach host…');
        if (Date.now() - start > MAX_WAIT_MS) return;
        // Back off a bit so we don't hammer a flaky DB.
        setTimeout(tick, POLL_MS * Math.min(consecutiveErrors, 3));
      }
    };
    tick();
    return () => { active = false; };
  }, [partyId, token]);

  const approved = myRequest?.status === 'APPROVED' && party?.address;
  const declined = myRequest?.status === 'DECLINED';

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <BurstGlow />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView contentContainerStyle={{ gap: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {!party ? (
            <View style={{ paddingVertical: 80, alignItems: 'center' }}><ActivityIndicator color={color.teal} /></View>
          ) : declined ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 44 }}>🚫</Text>
              <Micro size="sm" color={color.rose} style={{ marginTop: 14 }}>REQUEST DECLINED</Micro>
              <Body style={{ marginTop: 6, textAlign: 'center' }}>
                Host decided not to approve. Try another party.
              </Body>
            </View>
          ) : (
            <>
              {/* Check disc */}
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <LinearGradient
                  colors={gradient.valet.colors}
                  start={gradient.valet.start}
                  end={gradient.valet.end}
                  style={{
                    width: 72, height: 72, borderRadius: 36,
                    alignItems: 'center', justifyContent: 'center',
                    ...shadow.glowTeal,
                  }}
                >
                  <Text style={{ color: color.text.inverse, fontSize: 32, fontWeight: '900' }}>
                    {approved ? '✓' : '◔'}
                  </Text>
                </LinearGradient>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Micro size="sm" color={color.teal}>
                  {approved ? "YOU'RE IN" : 'WAITING FOR HOST'}
                </Micro>
                <DisplayHeadline
                  lines={[
                    approved
                      ? `${(party.host.name ?? 'Host').split(' ')[0]?.toUpperCase()} APPROVED`
                      : 'REQUEST SENT.',
                    approved ? 'YOUR REQUEST.' : '',
                  ].filter(Boolean)}
                  size={28}
                  lineHeightRatio={1.05}
                  letterSpacingEm={0.02}
                  style={{ marginTop: 6 }}
                />
              </View>

              {approved ? (
                <View
                  style={{
                    padding: 16,
                    borderRadius: radius.lg,
                    backgroundColor: 'rgba(0,229,200,0.06)',
                    borderWidth: 1.5,
                    borderColor: color.teal,
                    ...shadow.glowTeal,
                  }}
                >
                  <Micro size="xs" color={color.teal}>🔓 ADDRESS UNLOCKED</Micro>
                  <Text
                    style={{
                      color: color.text.primary,
                      fontSize: 16,
                      fontWeight: '800',
                      letterSpacing: 0.3,
                      marginTop: 8,
                    }}
                  >
                    {party.address}
                  </Text>
                  {party.doorDetail ? (
                    <Body size="sm" style={{ marginTop: 4, fontFamily: fontFamily.mono }}>
                      {party.doorDetail}
                    </Body>
                  ) : null}
                  <Body size="sm" style={{ marginTop: 4 }}>{party.neighborhood}</Body>
                </View>
              ) : null}

              {/* Party strip + countdown */}
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
                <Text style={{ fontSize: 28 }}>{party.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                    {party.title.toUpperCase()}
                  </Text>
                  <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
                    {party.neighborhood.toUpperCase()}
                  </Micro>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Micro size="xs" color={color.text.muted}>STARTS IN</Micro>
                  <Text style={{ color: color.rose, fontSize: 15, fontWeight: '900', letterSpacing: 1, fontFamily: fontFamily.mono }}>
                    {formatCountdown(party.startsAt)}
                  </Text>
                </View>
              </View>

              {/* Reminders checklist — static content for now */}
              {approved ? (
                <View style={{ gap: 8 }}>
                  <Micro size="sm" color={color.gold[500]}>BEFORE YOU GO</Micro>
                  {party.rules.slice(0, 3).map((r, i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                      <View
                        style={{
                          width: 18, height: 18, borderRadius: 9,
                          borderWidth: 1.5, borderColor: color.stroke.mid,
                          marginTop: 2,
                        }}
                      />
                      <Body size="sm" color={color.text.primary} style={{ flex: 1 }}>{r}</Body>
                    </View>
                  ))}
                </View>
              ) : null}

              {error ? <Body color={color.rose}>{error}</Body> : null}
            </>
          )}
        </ScrollView>

        {approved ? (
          <Button variant="valet" onPress={() => { /* ADD_TO_CALENDAR hook — future work */ }}>
            ADD TO CALENDAR →
          </Button>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

export default PartyApproved;
