import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { color, radius, shadow } from '../theme/tokens';
import { Micro, Body } from './Text';
import type { EventTier } from '../lib/api';

type Props = {
  tiers: EventTier[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const formatPrice = (egp: number) => `${egp.toLocaleString()} EGP`;

export const TierSelector: React.FC<Props> = ({ tiers, selectedId, onSelect }) => (
  <View style={{ gap: 10 }}>
    {tiers.map((tier) => {
      const on = tier.id === selectedId;
      const soldOut = tier.stockLeft <= 0;
      const low = tier.stockLeft > 0 && tier.stockLeft <= 10;

      return (
        <Pressable
          key={tier.id}
          disabled={soldOut}
          onPress={() => onSelect(tier.id)}
          style={{
            padding: 14,
            borderRadius: radius.md,
            backgroundColor: on ? 'rgba(212,168,67,0.08)' : color.bg.surface,
            borderWidth: 1.5,
            borderColor: on ? color.gold[500] : color.stroke.soft,
            opacity: soldOut ? 0.4 : 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            ...(on ? shadow.glowGold : null),
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 1.5,
              borderColor: on ? color.gold[500] : color.stroke.mid,
              backgroundColor: on ? color.gold[500] : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {on ? <Text style={{ color: color.text.inverse, fontSize: 11, fontWeight: '900' }}>✓</Text> : null}
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                {tier.name.toUpperCase()}
              </Text>
              {soldOut ? (
                <Micro size="xs" color={color.rose}>SOLD OUT</Micro>
              ) : low ? (
                <Micro size="xs" color={color.rose}>{tier.stockLeft} LEFT</Micro>
              ) : (
                <Micro size="xs" color={color.teal}>{tier.stockLeft} AVAILABLE</Micro>
              )}
            </View>
            <Body size="sm" style={{ marginTop: 2 }}>{tier.description}</Body>
          </View>

          <Text style={{ color: color.text.primary, fontSize: 15, fontWeight: '800' }}>
            {formatPrice(tier.priceEgp)}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default TierSelector;
