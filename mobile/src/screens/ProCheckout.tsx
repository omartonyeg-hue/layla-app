import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, Button, BackButton, DisplayHeadline } from '../components';
import { api, ApiError, type ProPlan, type Subscription } from '../lib/api';

type Props = {
  token: string;
  onBack: () => void;
  onSubscribed: (sub: Subscription) => void;
};

const HOLO = ['#D4A843', '#F0C96A', '#FF3D6B', '#8B3FFF'] as const;

const formatTrialEnd = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
};

export const ProCheckout: React.FC<Props> = ({ token, onBack, onSubscribed }) => {
  const [plans, setPlans] = useState<ProPlan[]>([]);
  const [trialDays, setTrialDays] = useState(7);
  const [selected, setSelected] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listPlans(token).then(({ plans, trialDays }) => {
      setPlans(plans);
      setTrialDays(trialDays);
    }).catch((err) => {
      setError(err instanceof ApiError ? err.message : 'Network error');
    });
  }, [token]);

  const subscribe = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const { subscription } = await api.subscribePro(token, selected);
      onSubscribed(subscription);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selected);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>CHECKOUT</Micro>
            <Text style={{ color: color.text.primary, fontSize: 18, fontWeight: '800', marginTop: 2 }}>Choose your plan</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
          <DisplayHeadline
            lines={['7 DAYS FREE.']}
            size={32}
            lineHeightRatio={1.0}
            letterSpacingEm={0.02}
          />

          {/* Plan grid */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {plans.map((p) => {
              const on = p.id === selected;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setSelected(p.id)}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: radius.md,
                    backgroundColor: on ? 'rgba(212,168,67,0.08)' : color.bg.surface,
                    borderWidth: 1.5,
                    borderColor: on ? color.gold[500] : color.stroke.soft,
                    gap: 6,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>{p.label}</Text>
                    <View
                      style={{
                        width: 18, height: 18, borderRadius: 9,
                        borderWidth: 1.5,
                        borderColor: on ? color.gold[500] : color.stroke.mid,
                        backgroundColor: on ? color.gold[500] : 'transparent',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {on ? <Text style={{ color: color.text.inverse, fontSize: 10, fontWeight: '900' }}>✓</Text> : null}
                    </View>
                  </View>
                  <Text style={{ color: color.text.primary, fontSize: 22, fontWeight: '900', fontFamily: fontFamily.mono }}>
                    {p.priceMonthlyEqEgp}
                    <Text style={{ color: color.text.muted, fontSize: 12, fontWeight: '600' }}> EGP{p.billingNote}</Text>
                  </Text>
                  {p.saveBadge ? (
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        paddingHorizontal: 6, paddingVertical: 2,
                        borderRadius: 4,
                        backgroundColor: color.teal,
                      }}
                    >
                      <Text style={{ color: color.text.inverse, fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>
                        {p.saveBadge}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          {/* Trial banner */}
          <LinearGradient
            colors={HOLO}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: radius.md, padding: 14, gap: 4 }}
          >
            <Micro size="xs" color={color.text.inverse}>FIRST-TIME OFFER · {trialDays} DAYS FREE</Micro>
            <Text style={{ color: color.text.inverse, fontSize: 13, fontWeight: '700' }}>
              Cancel anytime, no charge.
            </Text>
          </LinearGradient>

          {/* Payment method (mock) */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <LinearGradient
              colors={['#D4A843', '#FF3D6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 44, height: 30, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: color.text.inverse, fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>VISA</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>•••• 2847</Text>
              <Body size="sm" style={{ marginTop: 2 }}>Default payment method</Body>
            </View>
            <Text style={{ color: color.gold[500], fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>EDIT</Text>
          </View>

          {error ? <Body color={color.rose}>{error}</Body> : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="shine" loading={busy} onPress={subscribe}>
            START {trialDays}-DAY FREE TRIAL
          </Button>
          <Micro size="xs" color={color.text.muted} style={{ marginTop: 10, textAlign: 'center' }}>
            TRIAL ENDS {formatTrialEnd(trialDays)} · BILLED {selectedPlan?.priceMonthlyEqEgp ?? '—'} EGP / MO AFTER
          </Micro>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProCheckout;
