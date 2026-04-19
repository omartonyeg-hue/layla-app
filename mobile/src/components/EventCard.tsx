import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, shadow } from '../theme/tokens';
import { Micro, Tag } from './index';
import { resolveGradient } from '../lib/gradients';
import type { EventWithTiers } from '../lib/api';

type Props = {
  event: EventWithTiers;
  onPress?: () => void;
  featured?: boolean; // bigger hero treatment
};

const formatWhen = (iso: string) => {
  // "THU · APR 24 · 9:00 PM"
  const d = new Date(iso);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${weekday} · ${day} · ${time}`;
};

const formatPrice = (fromEgp: number) => `FROM ${fromEgp.toLocaleString()} EGP`;

export const EventCard: React.FC<Props> = ({ event, onPress, featured }) => {
  const g = resolveGradient(event.gradient);
  const minPrice = Math.min(...event.tiers.map((t) => t.priceEgp));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: radius.lg,
          overflow: 'hidden',
          transform: [{ scale: pressed ? 0.98 : 1 }],
          ...(featured ? shadow.float : shadow.card),
        },
      ]}
    >
      <LinearGradient
        colors={g.colors}
        start={g.start}
        end={g.end}
        style={{
          height: featured ? 220 : 140,
          padding: 16,
          justifyContent: 'space-between',
        }}
      >
        {/* Top row: tags */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {event.featured ? <Tag bg={color.text.inverse} fg={color.gold[500]}>FEATURED</Tag> : null}
          {event.tag ? (
            <Tag bg={event.tag === 'HOT' ? color.rose : color.teal} fg={color.text.inverse}>
              {event.tag}
            </Tag>
          ) : null}
        </View>

        {/* Bottom block: title + meta + price */}
        <View>
          <Text
            numberOfLines={2}
            style={{
              color: color.text.primary,
              fontSize: featured ? 26 : 20,
              fontWeight: '900',
              letterSpacing: 0.5,
            }}
          >
            {event.name.toUpperCase()}
          </Text>
          <View style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Micro size="xs" color="rgba(255,255,255,0.85)">{formatWhen(event.startsAt)}</Micro>
              <Text
                numberOfLines={1}
                style={{ color: color.text.primary, fontSize: 12, fontWeight: '600', marginTop: 2 }}
              >
                {event.venue}{event.location ? ` · ${event.location}` : ''}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: radius.sm,
                backgroundColor: 'rgba(7,6,13,0.55)',
              }}
            >
              <Text style={{ color: color.text.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>
                {formatPrice(minPrice)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default EventCard;
