import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, Button, BackButton, DisplayHeadline, StarRating } from '../components';
import { api, ApiError, type Ride } from '../lib/api';

type Props = {
  token: string;
  ride: Ride;
  onSubmitted: () => void;
  onSkip: () => void;
};

const TAGS = [
  'Smooth driver',
  'Felt safe',
  'On time',
  'Careful with car',
  'Friendly',
  'Professional',
  'Clean & respectful',
  'Would book again',
];

const TIP_EGP = 50;

const RATING_LABEL: Record<number, string> = {
  1: 'NEEDS WORK',
  2: 'BELOW AVERAGE',
  3: 'GOOD',
  4: 'GREAT',
  5: 'PERFECT · 5 STARS',
};

export const ValetRate: React.FC<Props> = ({ token, ride, onSubmitted, onSkip }) => {
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(['Smooth driver', 'Felt safe', 'On time', 'Careful with car']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ride.driver) return null;

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.rateRide(token, ride.id, { stars, tags, tipEgp: TIP_EGP });
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onSkip} />
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 18 }}>
          <View>
            <Micro size="sm" color={color.teal}>RATE YOUR TRIP</Micro>
            <DisplayHeadline
              lines={[`HOW WAS`, `${ride.driver.name.split(' ')[0]?.toUpperCase()}?`]}
              size={32}
              lineHeightRatio={0.95}
              letterSpacingEm={0.02}
              style={{ marginTop: 6 }}
            />
          </View>

          {/* Driver card */}
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
            <Avatar name={ride.driver.name} color={ride.driver.avatarColor ?? color.teal} size={44} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>{ride.driver.name}</Text>
              <Body size="sm" style={{ marginTop: 2 }}>
                {ride.driver.carMake} {ride.driver.carModel} · {ride.distanceKm.toFixed(1)} km · {ride.etaMinutes} min
              </Body>
            </View>
          </View>

          {/* Stars */}
          <View style={{ alignItems: 'center', gap: 10 }}>
            <StarRating value={stars} onChange={setStars} size={36} />
            <Micro size="sm" color={color.gold[500]}>{RATING_LABEL[stars]}</Micro>
          </View>

          {/* Tags */}
          <View>
            <Micro size="xs" color={color.text.muted} style={{ marginBottom: 10 }}>
              WHAT WENT WELL · TAP ALL THAT APPLY
            </Micro>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {TAGS.map((t) => {
                const on = tags.includes(t);
                return (
                  <Pressable
                    key={t}
                    onPress={() => toggleTag(t)}
                    style={{
                      paddingHorizontal: 11,
                      paddingVertical: 7,
                      borderRadius: radius.pill,
                      backgroundColor: on ? 'rgba(0,229,200,0.12)' : 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: on ? color.teal : color.stroke.soft,
                    }}
                  >
                    <Text
                      style={{
                        color: on ? color.teal : color.text.secondary,
                        fontSize: 12,
                        lineHeight: 16,
                        fontWeight: on ? '800' : '500',
                      }}
                    >
                      {on ? '✓ ' : ''}{t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {error ? <Body color={color.rose}>{error}</Body> : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="valet" loading={busy} onPress={submit}>
            SUBMIT · TIP {TIP_EGP} EGP
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ValetRate;
