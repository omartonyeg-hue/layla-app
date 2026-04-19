import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, VerifiedBadge } from './index';
import type { PartyHostSummary } from '../lib/api';

type Props = {
  host: PartyHostSummary;
  responseTime?: string; // e.g. "~12 min"
  onPress?: () => void;
};

export const HostCard: React.FC<Props> = ({ host, responseTime, onPress }) => (
  <Pressable
    onPress={onPress}
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
    <Avatar name={host.name ?? 'H'} color={host.avatarColor ?? color.gold[500]} size={44} />
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>{host.name ?? 'Host'}</Text>
        {host.hostVerified ? <VerifiedBadge size={12} /> : null}
      </View>
      <Micro size="xs" color={color.gold[500]} style={{ marginTop: 3 }}>
        HOST{host.hostVerified ? ' · VERIFIED' : ''}
      </Micro>
      <Body size="sm" style={{ marginTop: 2 }}>
        {host.hostRating ? `★ ${host.hostRating.toFixed(1)}` : 'New host'}
        {host.hostedCount > 0 ? ` · ${host.hostedCount} parties` : ''}
        {responseTime ? ` · responds ${responseTime}` : ''}
      </Body>
    </View>
    {onPress ? (
      <Text style={{ color: color.gold[500], fontSize: 11, fontWeight: '800', letterSpacing: 1, fontFamily: fontFamily.body }}>
        VIEW
      </Text>
    ) : null}
  </Pressable>
);

export default HostCard;
