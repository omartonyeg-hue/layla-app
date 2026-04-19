import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { color, radius } from '../theme/tokens';
import { Micro, Body, Button, BackButton } from '../components';
import { api, ApiError, type EventWithTiers, type TicketDetail } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  token: string;
  event: EventWithTiers;
  tierId: string;
  onBack: () => void;
  onTicket: (ticket: TicketDetail) => void;
};

type Method = {
  id: string;
  label: string;
  hint: string;
  iconText?: string;
  iconFA?: keyof typeof FontAwesome5.glyphMap;
  iconBg: string;
  iconColor?: string;
  wordmark?: string; // lowercase wordmark rendering for brands w/o matching icon font
};

// Real brand colors so the tiles read as recognisable logos, not app palette.
const BRAND_VODAFONE = '#E60000';
const BRAND_FAWRY    = '#F29500';

const METHODS: Method[] = [
  { id: 'card',     label: 'Card',          hint: '•••• 4242',        iconText: '💳', iconBg: color.gold[500] },
  // FontAwesome5's `cc-apple-pay` is the full Apple Pay mark — Apple logo + "Pay".
  { id: 'applepay', label: 'Apple Pay',     hint: 'Touch ID',         iconFA: 'cc-apple-pay', iconBg: color.text.primary, iconColor: color.text.inverse },
  // Vodafone Cash — mobile glyph on Vodafone's signature red.
  { id: 'vcash',    label: 'Vodafone Cash', hint: 'Redirects to app', iconFA: 'mobile-alt', iconBg: BRAND_VODAFONE, iconColor: '#FFFFFF' },
  // Fawry uses a lowercase italic wordmark; no icon-font match, render as text.
  { id: 'fawry',    label: 'Fawry',         hint: 'Pay at any kiosk', wordmark: 'fawry', iconBg: BRAND_FAWRY, iconColor: '#FFFFFF' },
];

const SERVICE_FEE_PCT = 0.02; // 2%

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

export const Checkout: React.FC<Props> = ({ token, event, tierId, onBack, onTicket }) => {
  const tier = event.tiers.find((t) => t.id === tierId);
  const [method, setMethod] = useState<string>('card');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!tier) return null;

  const subtotal = tier.priceEgp;
  const fee = Math.round(subtotal * SERVICE_FEE_PCT);
  const total = subtotal + fee;

  const pay = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { ticket } = await api.purchaseTicket(token, event.id, tierId);
      onTicket(ticket);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const g = resolveGradient(event.gradient);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>CHECKOUT</Micro>
            <Text style={{ color: color.text.primary, fontSize: 18, fontWeight: '800', marginTop: 2 }}>1 of 1 step</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 20 }} showsVerticalScrollIndicator={false}>
          {/* Order summary card */}
          <View
            style={{
              borderRadius: radius.lg,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={g.colors}
              start={g.start}
              end={g.end}
              style={{ height: 90, paddingHorizontal: 16, justifyContent: 'flex-end', paddingBottom: 12 }}
            >
              <Text numberOfLines={2} style={{ color: color.text.primary, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 }}>
                {event.name.toUpperCase()}
              </Text>
              <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 2 }}>
                {formatWhen(event.startsAt).toUpperCase()}
              </Micro>
            </LinearGradient>

            <View style={{ padding: 16, gap: 8 }}>
              <LineItem label={`${tier.name} × 1`} value={`${subtotal.toLocaleString()} EGP`} />
              <LineItem label="Service fee" value={`${fee.toLocaleString()} EGP`} muted />
              <View style={{ height: 1, backgroundColor: color.stroke.soft, marginVertical: 4 }} />
              <LineItem label="Total" value={`${total.toLocaleString()} EGP`} bold />
            </View>
          </View>

          {/* Payment methods */}
          <View>
            <Micro size="sm" color={color.gold[500]} style={{ marginBottom: 10 }}>PAYMENT METHOD</Micro>
            <View style={{ gap: 8 }}>
              {METHODS.map((m) => {
                const on = method === m.id;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => setMethod(m.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderRadius: radius.md,
                      backgroundColor: on ? 'rgba(212,168,67,0.08)' : color.bg.surface,
                      borderWidth: 1.5,
                      borderColor: on ? color.gold[500] : color.stroke.soft,
                    }}
                  >
                    <View
                      style={{
                        width: 40, height: 40, borderRadius: radius.sm,
                        backgroundColor: m.iconBg,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {m.iconFA ? (
                        <FontAwesome5 name={m.iconFA} size={20} color={m.iconColor ?? color.text.inverse} />
                      ) : m.wordmark ? (
                        <Text
                          style={{
                            color: m.iconColor ?? color.text.inverse,
                            fontSize: 14,
                            fontWeight: '900',
                            fontStyle: 'italic',
                            letterSpacing: -0.5,
                          }}
                        >
                          {m.wordmark}
                        </Text>
                      ) : (
                        <Text style={{ color: m.iconColor ?? color.text.inverse, fontSize: 16, fontWeight: '900' }}>
                          {m.iconText ?? ''}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>{m.label}</Text>
                      <Body size="sm" style={{ marginTop: 2 }}>{m.hint}</Body>
                    </View>
                    <View
                      style={{
                        width: 20, height: 20, borderRadius: 10,
                        borderWidth: 1.5, borderColor: on ? color.gold[500] : color.stroke.mid,
                        backgroundColor: on ? color.gold[500] : 'transparent',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {on ? <Text style={{ color: color.text.inverse, fontSize: 10, fontWeight: '900' }}>✓</Text> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Security banner */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: 12,
              borderRadius: radius.md,
              backgroundColor: 'rgba(0,229,200,0.08)',
              borderWidth: 1,
              borderColor: 'rgba(0,229,200,0.28)',
            }}
          >
            <Text style={{ fontSize: 16 }}>🛡</Text>
            <View style={{ flex: 1 }}>
              <Micro size="xs" color={color.teal}>SECURE · PAYMOB</Micro>
              <Body size="sm" style={{ marginTop: 2, color: color.text.primary }}>
                Card data never touches LAYLA. Full refund if event cancels.
              </Body>
            </View>
          </View>

          {error ? <Body color={color.rose}>{error}</Body> : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="gold" loading={busy} onPress={pay}>
            PAY {total.toLocaleString()} EGP →
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

const LineItem: React.FC<{ label: string; value: string; muted?: boolean; bold?: boolean }> = ({ label, value, muted, bold }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={{ color: muted ? color.text.muted : color.text.primary, fontSize: bold ? 15 : 13, fontWeight: bold ? '800' : '500' }}>
      {label}
    </Text>
    <Text style={{ color: bold ? color.gold[500] : color.text.primary, fontSize: bold ? 15 : 13, fontWeight: bold ? '900' : '700' }}>
      {value}
    </Text>
  </View>
);

export default Checkout;
