import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, BackButton, DisplayHeadline } from '../components';
import { useAuth, useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { api, ApiError, type Account, type MyAccount } from '../lib/api';
import { haptic } from '../lib/haptics';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

type Row = {
  icon: string;
  label: string;
  hint?: string;
  onPress: () => void;
  destructive?: boolean;
  badge?: string;
};

export const Settings: React.FC<Props> = ({ navigation }) => {
  const { user, token } = useSession();
  const { signOut } = useAuth();
  const toast = useToast();
  const [me, setMe] = useState<MyAccount | null>(null);
  const [otherAccounts, setOtherAccounts] = useState<Account[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [privacyBusy, setPrivacyBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [meRes, reqRes] = await Promise.all([
        api.getMyAccount(token),
        api.listFollowRequests(token).catch(() => ({ requests: [] as Array<{ id: string }> })),
      ]);
      setMe(meRes.account);
      setOtherAccounts(meRes.otherAccounts);
      setPendingRequests(reqRes.requests.length);
    } catch {
      // silent — settings still works without account info for onboarding edge cases
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const togglePrivacy = async (next: boolean) => {
    if (!me || privacyBusy) return;
    setPrivacyBusy(true);
    haptic.tap();
    try {
      const { account } = await api.updateMyAccount(token, { isPrivate: next });
      setMe({ ...me, isPrivate: account.isPrivate });
      toast.show({
        message: next ? 'Profile set to private' : 'Profile is public',
        tone: next ? 'violet' : 'gold',
        icon: next ? '🔒' : '◆',
      });
    } catch (err) {
      toast.show({
        message: err instanceof ApiError ? err.message : 'Network error',
        tone: 'rose',
        icon: '!',
      });
    } finally {
      setPrivacyBusy(false);
    }
  };

  const onBack = () => navigation.goBack();
  const onEditProfile = () => navigation.navigate('ProfileEdit');
  const onEditAccount = () => navigation.navigate('AccountEdit');
  const onCreateProAccount = () => navigation.navigate('CreateProAccount');
  const onFollowRequests = () => navigation.navigate('FollowRequests');
  const onHostInbox = () => navigation.navigate('HostInbox');
  const onCreateParty = () => navigation.navigate('CreateParty');
  const onSignOut = () => {
    toast.show({ message: 'Signed out · see you tonight', tone: 'rose', icon: '↪' });
    void signOut();
  };

  const accountRows: Row[] = [
    { icon: '@', label: 'Username & bio', hint: me ? `@${me.handle}` : 'Set your handle', onPress: onEditAccount },
    { icon: '✎', label: 'Edit profile', hint: 'Name, birthdate, city, vibes', onPress: onEditProfile },
  ];
  if (pendingRequests > 0) {
    accountRows.push({
      icon: '👋',
      label: 'Follow requests',
      hint: `${pendingRequests} waiting`,
      onPress: onFollowRequests,
      badge: pendingRequests.toString(),
    });
  }

  const proLabel = otherAccounts.length > 0
    ? otherAccounts.some((a) => a.status === 'ACTIVE')
      ? 'Manage professional accounts'
      : 'Application pending review'
    : 'Apply for a venue / DJ / organizer account';

  const rows: { title: string; items: Row[] }[] = [
    { title: 'ACCOUNT', items: accountRows },
    {
      title: 'PROFESSIONAL',
      items: [
        { icon: '♛', label: proLabel, hint: 'Admin-reviewed profile for venues, artists, or promoters', onPress: onCreateProAccount },
      ],
    },
    {
      title: 'HOSTING',
      items: [
        { icon: '✦', label: 'Host a party', hint: 'Create a new private party', onPress: onCreateParty },
        { icon: '📥', label: 'Host inbox', hint: 'Pending guest requests', onPress: onHostInbox },
      ],
    },
    {
      title: 'SESSION',
      items: [
        { icon: '↪', label: 'Sign out', onPress: onSignOut, destructive: true },
      ],
    },
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
            <Avatar name={me?.displayName ?? user.name ?? 'U'} color={me?.avatarColor ?? color.gold[500]} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: color.text.primary, fontSize: 16, fontWeight: '800' }}>
                {me?.displayName ?? user.name ?? 'Member'}
              </Text>
              {me?.handle ? (
                <Text style={{ color: color.violet, fontSize: 13, marginTop: 2, fontWeight: '700' }}>
                  @{me.handle}
                </Text>
              ) : (
                <ActivityIndicator size="small" color={color.violet} style={{ alignSelf: 'flex-start', marginTop: 2 }} />
              )}
              <Body size="sm" style={{ marginTop: 4, fontFamily: fontFamily.mono }}>{user.phone}</Body>
            </View>
          </View>

          {/* Privacy toggle — prominent inline switch */}
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
            <View
              style={{
                width: 32, height: 32, borderRadius: radius.sm,
                backgroundColor: 'rgba(139,63,255,0.12)',
                borderWidth: 1, borderColor: 'rgba(139,63,255,0.3)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ color: color.violet, fontSize: 14 }}>🔒</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>
                Private profile
              </Text>
              <Body size="sm" style={{ marginTop: 2 }}>
                Followers need your approval to see your posts and stories.
              </Body>
            </View>
            <Switch
              value={me?.isPrivate ?? false}
              onValueChange={togglePrivacy}
              disabled={!me || privacyBusy}
              trackColor={{ false: color.stroke.mid, true: color.violet }}
              thumbColor={color.text.primary}
              ios_backgroundColor={color.stroke.mid}
            />
          </View>

          {/* Sectioned rows */}
          {rows.map((section) => (
            <View key={section.title} style={{ gap: 6 }}>
              <Text
                style={{
                  color: color.text.muted,
                  fontSize: 10.5,
                  letterSpacing: 1.4,
                  fontWeight: '800',
                  fontFamily: fontFamily.body,
                  marginLeft: 4,
                }}
              >
                {section.title}
              </Text>
              <View
                style={{
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.stroke.soft,
                  overflow: 'hidden',
                }}
              >
                {section.items.map((r, j) => (
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
                    {r.badge ? (
                      <View
                        style={{
                          paddingHorizontal: 8, paddingVertical: 3,
                          borderRadius: radius.pill,
                          backgroundColor: color.violet,
                        }}
                      >
                        <Text style={{ color: color.text.primary, fontSize: 11, fontWeight: '800' }}>
                          {r.badge}
                        </Text>
                      </View>
                    ) : !r.destructive ? (
                      <Text style={{ color: color.text.muted, fontSize: 18 }}>›</Text>
                    ) : null}
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
