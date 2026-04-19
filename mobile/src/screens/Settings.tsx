import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, BackButton, DisplayHeadline } from '../components';
import type { LaylaUser } from '../lib/api';

type Props = {
  user: LaylaUser;
  onBack: () => void;
  onEditProfile: () => void;
  onHostInbox: () => void;
  onCreateParty: () => void;
  onSignOut: () => void;
};

type Row = {
  icon: string;
  label: string;
  hint?: string;
  onPress: () => void;
  destructive?: boolean;
};

export const Settings: React.FC<Props> = ({
  user,
  onBack,
  onEditProfile,
  onHostInbox,
  onCreateParty,
  onSignOut,
}) => {
  const rows: Row[][] = [
    [
      { icon: '✎', label: 'Edit profile',     hint: 'Name, birthdate, city, vibes', onPress: onEditProfile },
    ],
    [
      { icon: '✦', label: 'Host a party',     hint: 'Create a new private party',  onPress: onCreateParty },
      { icon: '📥', label: 'Host inbox',       hint: 'Pending guest requests',       onPress: onHostInbox },
    ],
    [
      { icon: '↪', label: 'Sign out',         onPress: onSignOut, destructive: true },
    ],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>SETTINGS</Micro>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 4 }}>
          <DisplayHeadline
            lines={['ACCOUNT.']}
            size={36}
            lineHeightRatio={1.0}
            letterSpacingEm={0.02}
          />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 18 }} showsVerticalScrollIndicator={false}>
          {/* Identity card */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <Avatar name={user.name ?? 'U'} color={color.gold[500]} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: color.text.primary, fontSize: 16, fontWeight: '800' }}>
                {user.name ?? 'Member'}
              </Text>
              <Body size="sm" style={{ marginTop: 2, fontFamily: fontFamily.mono }}>{user.phone}</Body>
              <Micro size="xs" color={color.text.muted} style={{ marginTop: 4 }}>
                {user.role ?? 'GUEST'}
                {user.city ? ` · ${user.city.charAt(0) + user.city.slice(1).toLowerCase()}` : ''}
              </Micro>
            </View>
          </View>

          {rows.map((group, i) => (
            <View
              key={i}
              style={{
                borderRadius: radius.md,
                backgroundColor: color.bg.surface,
                borderWidth: 1,
                borderColor: color.stroke.soft,
                overflow: 'hidden',
              }}
            >
              {group.map((r, j) => (
                <Pressable
                  key={r.label}
                  onPress={r.onPress}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    borderTopWidth: j === 0 ? 0 : 1,
                    borderTopColor: color.stroke.soft,
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 32, height: 32, borderRadius: radius.sm,
                      backgroundColor: r.destructive ? 'rgba(255,61,107,0.12)' : 'rgba(212,168,67,0.12)',
                      borderWidth: 1, borderColor: r.destructive ? 'rgba(255,61,107,0.3)' : 'rgba(212,168,67,0.3)',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: r.destructive ? color.rose : color.gold[500], fontSize: 14, fontWeight: '900' }}>
                      {r.icon}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: r.destructive ? color.rose : color.text.primary,
                        fontSize: 14,
                        fontWeight: '700',
                      }}
                    >
                      {r.label}
                    </Text>
                    {r.hint ? <Body size="sm" style={{ marginTop: 2 }}>{r.hint}</Body> : null}
                  </View>
                  {!r.destructive ? (
                    <Text style={{ color: color.text.muted, fontSize: 18 }}>›</Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
