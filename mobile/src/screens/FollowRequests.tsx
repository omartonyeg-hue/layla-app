import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, DisplayHeadline } from '../components';
import { api, ApiError, type Account } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { haptic } from '../lib/haptics';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FollowRequests'>;

type Request = { id: string; createdAt: string; account: Account };

export const FollowRequests: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decidingId, setDecidingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.listFollowRequests(token);
      setRequests(res.requests);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const decide = async (request: Request, action: 'APPROVE' | 'DECLINE') => {
    if (decidingId) return;
    setDecidingId(request.id);
    haptic.bump();
    try {
      await api.decideFollowRequest(token, request.id, action);
      setRequests((prev) => (prev ? prev.filter((r) => r.id !== request.id) : prev));
      toast.show({
        message: action === 'APPROVE' ? `Approved @${request.account.handle}` : 'Declined',
        tone: action === 'APPROVE' ? 'violet' : 'rose',
        icon: action === 'APPROVE' ? '✓' : '×',
      });
    } catch (err) {
      toast.show({
        message: err instanceof ApiError ? err.message : 'Network error',
        tone: 'rose',
        icon: '!',
      });
    } finally {
      setDecidingId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 }}>
          <Pressable
            onPress={() => { haptic.tap(); navigation.goBack(); }}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: color.bg.surface,
              borderWidth: 1, borderColor: color.stroke.soft,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>×</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.violet}>INBOX</Micro>
            <DisplayHeadline
              lines={['FOLLOW REQUESTS']}
              size={26}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }} showsVerticalScrollIndicator={false}>
          {requests === null ? (
            <ActivityIndicator color={color.violet} style={{ marginTop: 40 }} />
          ) : error ? (
            <Body color={color.rose}>{error}</Body>
          ) : requests.length === 0 ? (
            <View style={{ paddingTop: 48, alignItems: 'center' }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>👋</Text>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                No pending requests
              </Text>
              <Body size="sm" style={{ marginTop: 4, textAlign: 'center' }}>
                When someone asks to follow your private account, they'll show up here.
              </Body>
            </View>
          ) : (
            requests.map((r) => (
              <View
                key={r.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.stroke.soft,
                }}
              >
                <Avatar
                  name={r.account.displayName}
                  color={r.account.avatarColor ?? color.gold[500]}
                  size={44}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                    {r.account.displayName}
                  </Text>
                  <Text style={{ color: color.violet, fontSize: 12, marginTop: 2 }}>@{r.account.handle}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Pressable
                    onPress={() => decide(r, 'DECLINE')}
                    disabled={decidingId === r.id}
                    style={({ pressed }) => ({
                      paddingHorizontal: 12, paddingVertical: 8,
                      borderRadius: radius.pill,
                      borderWidth: 1,
                      borderColor: color.stroke.mid,
                      opacity: pressed || decidingId === r.id ? 0.5 : 1,
                    })}
                  >
                    <Text
                      style={{
                        color: color.text.secondary,
                        fontSize: 11,
                        fontWeight: '800',
                        letterSpacing: 0.6,
                        fontFamily: fontFamily.body,
                      }}
                    >
                      DECLINE
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => decide(r, 'APPROVE')}
                    disabled={decidingId === r.id}
                    style={({ pressed }) => ({
                      paddingHorizontal: 12, paddingVertical: 8,
                      borderRadius: radius.pill,
                      backgroundColor: color.violet,
                      opacity: pressed || decidingId === r.id ? 0.7 : 1,
                    })}
                  >
                    {decidingId === r.id ? (
                      <ActivityIndicator size="small" color={color.text.primary} />
                    ) : (
                      <Text
                        style={{
                          color: color.text.primary,
                          fontSize: 11,
                          fontWeight: '800',
                          letterSpacing: 0.6,
                          fontFamily: fontFamily.body,
                        }}
                      >
                        APPROVE
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default FollowRequests;
