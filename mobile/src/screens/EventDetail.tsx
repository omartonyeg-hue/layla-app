import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, Button, BackButton, Tag } from '../components';
import { TierSelector } from '../components';
import { api, ApiError, type EventWithTiers } from '../lib/api';
import { resolveGradient } from '../lib/gradients';

type Props = {
  token: string;
  eventId: string;
  initial?: EventWithTiers;  // skip fetch if list already gave us the object
  onBack: () => void;
  onCheckout: (event: EventWithTiers, tierId: string) => void;
};

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${weekday} · ${day} · ${time}`;
};

export const EventDetail: React.FC<Props> = ({ token, eventId, initial, onBack, onCheckout }) => {
  const [event, setEvent] = useState<EventWithTiers | null>(initial ?? null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (event) return;
    (async () => {
      try {
        const { event } = await api.getEvent(token, eventId);
        setEvent(event);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  if (loading || !event) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        {error ? (
          <Body color={color.rose}>{error}</Body>
        ) : (
          <ActivityIndicator color={color.gold[500]} />
        )}
      </View>
    );
  }

  const g = resolveGradient(event.gradient);
  const { width } = Dimensions.get('window');
  const heroHeight = 280;
  const tier = event.tiers.find((t) => t.id === selectedTier);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ height: heroHeight, width }}>
          <LinearGradient
            colors={g.colors}
            start={g.start}
            end={g.end}
            style={{ flex: 1 }}
          />
          {/* Dark scrim so back button + tags stay legible */}
          <LinearGradient
            colors={['rgba(7,6,13,0.55)', 'transparent', 'rgba(7,6,13,0.6)']}
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
              gap: 8,
              alignItems: 'center',
            }}
          >
            <BackButton onPress={onBack} />
            <View style={{ flex: 1 }} />
            {event.tag ? (
              <Tag bg={event.tag === 'HOT' ? color.rose : color.teal} fg={color.text.inverse}>
                🔥 FEATURED · {event.tag}
              </Tag>
            ) : null}
          </View>

          {/* Bottom-of-hero title block */}
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
            <Text
              style={{
                color: color.text.primary,
                fontSize: 30,
                fontWeight: '900',
                letterSpacing: 0.5,
              }}
            >
              {event.name.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          {/* Meta rows */}
          <View style={{ gap: 10 }}>
            <MetaRow icon="📅" label={formatWhen(event.startsAt)} />
            <MetaRow icon="📍" label={`${event.venue}${event.location ? ' · ' + event.location : ''}`} />
            {event.lineup ? <MetaRow icon="🎧" label={event.lineup} /> : null}
          </View>

          <Micro size="sm" color={color.gold[500]} style={{ marginTop: 24 }}>ABOUT</Micro>
          <Body style={{ marginTop: 6 }}>{event.description}</Body>

          <Micro size="sm" color={color.gold[500]} style={{ marginTop: 24, marginBottom: 10 }}>PICK YOUR TIER</Micro>
          <TierSelector
            tiers={event.tiers}
            selectedId={selectedTier}
            onSelect={setSelectedTier}
          />
        </View>
      </ScrollView>

      {/* Floating CTA dock */}
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
        <Button
          variant="gold"
          disabled={!tier}
          onPress={() => tier && onCheckout(event, tier.id)}
        >
          {tier ? `CHECKOUT · ${tier.priceEgp.toLocaleString()} EGP →` : 'PICK A TIER'}
        </Button>
      </View>
    </View>
  );
};

const MetaRow: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: 'rgba(212,168,67,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(212,168,67,0.28)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
    </View>
    <Text style={{ flex: 1, color: color.text.primary, fontSize: 14, fontWeight: '600' }}>{label}</Text>
  </View>
);

export default EventDetail;
