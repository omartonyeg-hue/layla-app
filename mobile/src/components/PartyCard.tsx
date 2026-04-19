import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius } from '../theme/tokens';
import { Avatar, Micro, Tag } from './index';
import { resolveGradient } from '../lib/gradients';
import type { PartyListItem } from '../lib/api';

type Props = {
  party: PartyListItem;
  onPress?: () => void;
};

const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${weekday} · ${day} · ${time}`;
};

export const PartyCard: React.FC<Props> = ({ party, onPress }) => {
  const g = resolveGradient(party.gradient);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: radius.lg,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: color.stroke.soft,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {/* Hero band */}
      <LinearGradient
        colors={g.colors}
        start={g.start}
        end={g.end}
        style={{ height: 130, padding: 14, justifyContent: 'space-between' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {party.tag ? (
              <Tag bg={color.text.inverse} fg={color.text.primary}>{party.tag}</Tag>
            ) : null}
            <Tag bg="rgba(7,6,13,0.55)" fg={color.text.primary}>🔒 ADDRESS LOCKED</Tag>
          </View>
          <Text style={{ fontSize: 28 }}>{party.emoji}</Text>
        </View>

        <View>
          <Text numberOfLines={1} style={{ color: color.text.primary, fontSize: 20, fontWeight: '900', letterSpacing: 0.5 }}>
            {party.title.toUpperCase()}
          </Text>
          <Micro size="xs" color="rgba(255,255,255,0.85)" style={{ marginTop: 2 }}>
            {formatWhen(party.startsAt)} · {party.neighborhood.toUpperCase()}
          </Micro>
        </View>
      </LinearGradient>

      {/* Host row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 12,
          backgroundColor: color.bg.surface,
        }}
      >
        <Avatar name={party.host.name ?? 'H'} color={party.host.avatarColor ?? color.gold[500]} size={28} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: color.text.primary, fontSize: 12, fontWeight: '700' }}>
            {party.host.name ?? 'Host'}
          </Text>
          <Micro size="xs" color={color.text.muted} style={{ marginTop: 1 }}>
            HOSTED · {party.approvedCount}/{party.cap} APPROVED
          </Micro>
        </View>
        <Text style={{ color: color.rose, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>REQUEST →</Text>
      </View>
    </Pressable>
  );
};

export default PartyCard;
