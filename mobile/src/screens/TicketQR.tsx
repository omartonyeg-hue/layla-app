import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Micro, Body, Button, BackButton, QRWidget } from '../components';
import type { TicketDetail } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  ticket: TicketDetail;
  userName: string;
  onBack: () => void;
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${date} · ${time}`;
};

export const TicketQR: React.FC<Props> = ({ ticket, userName, onBack }) => {
  const g = resolveGradient(ticket.event.gradient ?? 'sunset');

  // Count up seconds since load to drive the "REFRESHES EVERY 60s" chip.
  // Visual only — real QR rotation hooks into a future backend endpoint.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => (n + 1) % 60), 1000);
    return () => clearInterval(id);
  }, []);

  // Teal "LIVE" pulse — 1.2s breathe, infinite loop. Native driver keeps it
  // smooth during scroll.
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const rotateIn = 60 - tick;
  const rotateLabel = `ROTATES 00:${String(rotateIn).padStart(2, '0')}`;

  // Re-seed QR pattern every minute so it visually "refreshes".
  const qrSeed = `${ticket.id}-${Math.floor(Date.now() / 60000)}`;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.teal}>🛡 SECURE · LIVE</Micro>
            <Text style={{ color: color.text.primary, fontSize: 18, fontWeight: '800', marginTop: 2 }}>
              Your ticket
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16, alignItems: 'center' }}>
          {/* Ticket card */}
          <View
            style={{
              width: '100%',
              borderRadius: radius.xl,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.gold,
              overflow: 'hidden',
              ...shadow.float,
            }}
          >
            {/* Header band */}
            <LinearGradient
              colors={g.colors}
              start={g.start}
              end={g.end}
              style={{ padding: 16 }}
            >
              <Text numberOfLines={2} style={{ color: color.text.primary, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 }}>
                {ticket.event.name.toUpperCase()}
              </Text>
              <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 4 }}>
                ADMIT ONE · {ticket.tier.name.toUpperCase()}
              </Micro>
              <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 2 }}>
                {formatDateTime(ticket.event.startsAt)} · {ticket.event.venue.toUpperCase()}
              </Micro>
            </LinearGradient>

            {/* Perforation divider */}
            <View style={{ position: 'relative', height: 24 }}>
              <View style={{ position: 'absolute', left: -12, top: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: color.bg.base }} />
              <View style={{ position: 'absolute', right: -12, top: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: color.bg.base }} />
              <View style={{ position: 'absolute', left: 16, right: 16, top: 11, borderStyle: 'dashed', borderWidth: 0.5, borderColor: color.stroke.mid }} />
            </View>

            {/* QR + live indicator */}
            <View style={{ padding: 20, alignItems: 'center', gap: 14 }}>
              <QRWidget seed={qrSeed} size={240} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Animated.View
                  style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: color.teal,
                    opacity: pulse,
                    ...shadow.glowTeal,
                  }}
                />
                <Micro size="xs" color={color.text.muted}>
                  REFRESHES EVERY 60s · {rotateLabel}
                </Micro>
              </View>
            </View>

            {/* Meta grid */}
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft, flexDirection: 'row', flexWrap: 'wrap' }}>
              <MetaCell label="GUEST" value={userName} />
              <MetaCell label="TIER" value={`${ticket.tier.name.toUpperCase()} · ${ticket.tier.priceEgp.toLocaleString()} EGP`} />
              <MetaCell label="GATE" value={ticket.gate ?? 'A · STANDARD'} />
              <MetaCell label="ORDER" value={ticket.orderRef} mono />
            </View>
          </View>

          {/* Anti-screenshot warning */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: 12,
              borderRadius: radius.md,
              backgroundColor: 'rgba(255,61,107,0.08)',
              borderWidth: 1,
              borderColor: 'rgba(255,61,107,0.28)',
            }}
          >
            <Text style={{ fontSize: 16 }}>⚠️</Text>
            <Body size="sm" style={{ flex: 1, color: color.text.primary }}>
              Screenshots are voided. Only the live code in this app is valid at the gate.
            </Body>
          </View>

          <Button variant="ghost" onPress={() => { /* Apple Wallet integration — Phase 5+ */ }}>
            ADD TO APPLE WALLET
          </Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MetaCell: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <View style={{ width: '50%', paddingVertical: 6 }}>
    <Micro size="xs" color={color.text.muted}>{label}</Micro>
    <Text
      numberOfLines={1}
      style={{
        color: color.text.primary,
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
        fontFamily: mono ? fontFamily.mono : fontFamily.body,
      }}
    >
      {value}
    </Text>
  </View>
);

export default TicketQR;
