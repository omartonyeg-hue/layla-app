import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, gradient as tokenGradient, radius } from '../theme/tokens';
import {
  Micro,
  Body,
  DisplayHeadline,
  PostCard,
  SettingsButton,
  SkeletonList,
  EmptyState,
  StoryTray,
  ComposeSheet,
} from '../components';
import { api, ApiError, type Post, type StoryGroup } from '../lib/api';
import { useSession, useAuth } from '../lib/AuthContext';
import type { CommunityStackParamList, RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<CommunityStackParamList & RootStackParamList>;

export const CommunityFeed: React.FC = () => {
  const { token } = useSession();
  const auth = useAuth();
  const me = auth.status === 'signedIn' ? auth.user : null;
  const navigation = useNavigation<Nav>();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [stories, setStories] = useState<StoryGroup[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const load = async () => {
    setError(null);
    try {
      const [feedRes, storyRes] = await Promise.all([
        api.listFeed(token),
        api.listStories(token).catch(() => ({ groups: [] as StoryGroup[] })),
      ]);
      setPosts(feedRes.posts);
      setStories(storyRes.groups);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  // Refresh when user returns to the tab (e.g. after posting / viewing a story).
  useFocusEffect(useCallback(() => { load(); }, []));

  const onOpenUser = (userId: string) => navigation.navigate('UserProfile', { userId });
  const onOpenSettings = () => navigation.navigate('Settings');
  const onOpenStoryGroup = (groupIndex: number) => {
    if (!stories || stories.length === 0) return;
    navigation.navigate('StoryViewer', { groups: stories, startGroupIndex: groupIndex });
  };

  const toggleLike = async (postId: string, nextLiked: boolean) => {
    try {
      const res = await api.togglePostLike(token, postId);
      setPosts((prev) =>
        prev
          ? prev.map((p) =>
              p.id === postId
                ? { ...p, likedByMe: res.liked, likeCount: res.likeCount }
                : p,
            )
          : prev,
      );
    } catch (err) {
      // let the card revert optimistic state
      throw err;
    }
  };

  const onOpenComments = (postId: string) => {
    navigation.navigate('Comments', { postId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 4,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.violet}>● YOUR CIRCLE</Micro>
            <DisplayHeadline
              lines={['COMMUNITY']}
              size={40}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 4 }}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComposeFab onPress={() => setComposeOpen(true)} />
            <SettingsButton onPress={onOpenSettings} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={color.violet}
              onRefresh={() => { setRefreshing(true); load(); }}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Stories tray — always visible so user can open composer even with empty feed */}
          <StoryTray
            groups={stories ?? []}
            meName={me?.name}
            meAvatarColor={undefined}
            onOpenStory={onOpenStoryGroup}
            onAddStory={() => navigation.navigate('StoryComposer')}
          />

          <View
            style={{
              height: 1,
              backgroundColor: color.stroke.soft,
              marginHorizontal: 20,
              marginBottom: 12,
            }}
          />

          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {posts === null ? (
              <SkeletonList count={3} variant="card" />
            ) : error ? (
              <View
                style={{
                  padding: 16,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.rose,
                }}
              >
                <Body color={color.rose}>{error}</Body>
              </View>
            ) : posts.length === 0 ? (
              <EmptyState
                icon="◆"
                eyebrow="QUIET FEED"
                title="No posts yet."
                body="Be the first — share a mood, a review, or a story."
                tint="violet"
              />
            ) : (
              posts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onPressAuthor={() => onOpenUser(p.author.id)}
                  onToggleLike={toggleLike}
                  onOpenComments={onOpenComments}
                  onPressMention={onOpenUser}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <ComposeSheet
        visible={composeOpen}
        onClose={() => setComposeOpen(false)}
        onMood={() => navigation.navigate('MoodComposer')}
        onStory={() => navigation.navigate('StoryComposer')}
        onReview={() => navigation.navigate('WriteReview')}
      />
    </View>
  );
};

// Gold-tinted "+" fab that replaces the old "✎ REVIEW" pill.
const ComposeFab: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const g = tokenGradient.goldShine;
  const scale = React.useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
        }}
      >
        <LinearGradient
          colors={g.colors}
          start={g.start}
          end={g.end}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <Text style={{ color: color.text.inverse, fontSize: 22, lineHeight: 24, fontWeight: '900' }}>+</Text>
      </Animated.View>
    </Pressable>
  );
};

export default CommunityFeed;
