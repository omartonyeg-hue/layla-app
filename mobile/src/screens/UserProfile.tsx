import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, radius, fontFamily } from '../theme/tokens';
import {
  Avatar,
  Micro,
  Body,
  BackButton,
  Button,
  VerifiedBadge,
  PostCard,
  FollowButton,
} from '../components';
import {
  api,
  ApiError,
  type AccountView,
  type PublicProfile,
  type Post,
  type ProfileParty,
} from '../lib/api';
import { useSession } from '../lib/AuthContext';
import type { CommunityStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CommunityStackParamList, 'UserProfile'>;

const COVER_HEIGHT = 160;
const AVATAR_SIZE = 96;

const formatCount = (n: number) => {
  if (n >= 10000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

export const UserProfile: React.FC<Props> = ({ navigation, route }) => {
  const { token } = useSession();
  const { userId } = route.params;
  const onBack = () => navigation.goBack();
  const [user, setUser] = useState<PublicProfile | null>(null);
  const [account, setAccount] = useState<AccountView | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hostedParties, setHostedParties] = useState<ProfileParty[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [privacyBlocked, setPrivacyBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getPublicProfile(token, userId);
        setUser(res.user);
        setAccount(res.account);
        setPosts(res.posts);
        setHostedParties(res.hostedParties);
        setReviewCount(res.reviewCount);
        setPrivacyBlocked(res.privacyBlocked);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        {error ? <Body color={color.rose}>{error}</Body> : <ActivityIndicator color={color.violet} />}
      </View>
    );
  }

  const { width } = Dimensions.get('window');
  const displayName = account?.displayName ?? user.name ?? 'Member';
  const handle = account?.handle;
  const isMe = account?.isMe ?? false;

  const onFollowChange = (next: { isFollowing: boolean; hasPendingRequest: boolean; followerCount: number }) => {
    if (!account) return;
    setAccount({
      ...account,
      isFollowing: next.isFollowing,
      hasPendingRequest: next.hasPendingRequest,
      followerCount: next.followerCount,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={{ height: COVER_HEIGHT, width }}>
          <LinearGradient
            colors={['#FF3D6B', '#8B3FFF', '#07060D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1 }}
          />
          <View
            style={{
              position: 'absolute',
              top: insets.top,
              left: 16,
              right: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <BackButton onPress={onBack} />
          </View>
        </View>

        {/* Avatar + identity */}
        <View style={{ paddingHorizontal: 24, marginTop: -AVATAR_SIZE / 2 }}>
          <View
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              borderWidth: 3,
              borderColor: color.bg.base,
              backgroundColor: color.bg.base,
            }}
          >
            <Avatar name={displayName} color={account?.avatarColor ?? user.avatarColor ?? color.gold[500]} size={AVATAR_SIZE - 6} />
            {(account?.isVerified || user.hostVerified) ? (
              <View style={{ position: 'absolute', right: -2, bottom: -2 }}>
                <VerifiedBadge size={16} />
              </View>
            ) : null}
          </View>

          <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
            <Text
              style={{
                fontFamily: fontFamily.display,
                fontSize: 26,
                color: color.text.primary,
                fontWeight: '900',
                letterSpacing: 0.5,
              }}
            >
              {displayName.toUpperCase()}
            </Text>
            {account?.isPrivate ? (
              <View style={{
                paddingHorizontal: 7, paddingVertical: 2,
                borderRadius: radius.pill,
                backgroundColor: 'rgba(139,63,255,0.14)',
                borderWidth: 1, borderColor: 'rgba(139,63,255,0.4)',
              }}>
                <Text style={{ color: color.violet, fontSize: 9, fontWeight: '800', letterSpacing: 0.8 }}>
                  🔒 PRIVATE
                </Text>
              </View>
            ) : null}
          </View>
          {handle ? (
            <Text style={{ color: color.text.secondary, fontSize: 13, marginTop: 2, fontFamily: fontFamily.body }}>
              @{handle}
            </Text>
          ) : null}
          <Micro size="xs" color={color.violet} style={{ marginTop: 4 }}>
            {user.role ?? 'GUEST'} {user.hostVerified ? '· VERIFIED HOST' : ''}
            {user.city ? ` · ${user.city.charAt(0) + user.city.slice(1).toLowerCase()}` : ''}
          </Micro>

          {/* Bio */}
          {account?.bio ? (
            <Text
              style={{
                color: color.text.primary,
                fontSize: 14,
                lineHeight: 20,
                marginTop: 10,
                fontFamily: fontFamily.body,
              }}
            >
              {account.bio}
            </Text>
          ) : null}

          {/* Follower / Following / Parties stats row */}
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              marginTop: 18,
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <Stat label="FOLLOWERS" value={account ? formatCount(account.followerCount) : '—'} />
            <Stat label="FOLLOWING" value={account ? formatCount(account.followingCount) : '—'} />
            <Stat label="REVIEWS" value={reviewCount.toString()} />
          </View>

          {/* CTAs */}
          {!isMe && account ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <FollowButton
                  accountId={account.id}
                  isFollowing={account.isFollowing}
                  hasPendingRequest={account.hasPendingRequest}
                  targetIsPrivate={account.isPrivate}
                  onChange={onFollowChange}
                  size="lg"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button variant="ghost" full onPress={() => { /* DM stub — Phase ≥ 4 */ }}>MESSAGE</Button>
              </View>
            </View>
          ) : null}

          {/* Private account block */}
          {privacyBlocked ? (
            <View
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: radius.lg,
                backgroundColor: color.bg.surface,
                borderWidth: 1,
                borderColor: color.stroke.soft,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 30, marginBottom: 6 }}>🔒</Text>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                This account is private
              </Text>
              <Text style={{ color: color.text.muted, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                {account?.hasPendingRequest
                  ? 'Your request is pending.'
                  : 'Follow to see their posts and stories.'}
              </Text>
            </View>
          ) : null}

          {/* Hosted parties */}
          {!privacyBlocked && hostedParties.length > 0 ? (
            <View style={{ marginTop: 24 }}>
              <Micro size="sm" color={color.rose}>UPCOMING PARTIES</Micro>
              <View style={{ gap: 10, marginTop: 10 }}>
                {hostedParties.map((p) => (
                  <View
                    key={p.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      padding: 10,
                      borderRadius: radius.md,
                      backgroundColor: color.bg.surface,
                      borderWidth: 1,
                      borderColor: color.stroke.soft,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{p.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>
                        {p.title.toUpperCase()}
                      </Text>
                      <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
                        {p.neighborhood.toUpperCase()}
                      </Micro>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Posts */}
          {!privacyBlocked && posts.length > 0 ? (
            <View style={{ marginTop: 24 }}>
              <Micro size="sm" color={color.violet}>RECENT POSTS</Micro>
              <View style={{ gap: 12, marginTop: 10 }}>
                {posts.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    onToggleLike={async (postId) => {
                      const res = await api.togglePostLike(token, postId);
                      setPosts((prev) =>
                        prev.map((x) =>
                          x.id === postId
                            ? { ...x, likedByMe: res.liked, likeCount: res.likeCount }
                            : x,
                        ),
                      );
                    }}
                    onOpenComments={(postId) => navigation.navigate('Comments', { postId })}
                    onPressMention={(userId) => navigation.push('UserProfile', { userId })}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text
      style={{
        color: color.text.primary,
        fontFamily: fontFamily.display,
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 0.5,
      }}
    >
      {value}
    </Text>
    <Micro size="xs" color={color.text.muted} style={{ marginTop: 4 }}>{label}</Micro>
  </View>
);

export default UserProfile;
