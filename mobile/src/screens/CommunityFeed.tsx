import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius } from '../theme/tokens';
import { Micro, Body, DisplayHeadline, PostCard, SettingsButton } from '../components';
import { api, ApiError, type Post } from '../lib/api';

type Props = {
  token: string;
  onOpenUser: (userId: string) => void;
  onWriteReview: () => void;
  onOpenSettings: () => void;
};

export const CommunityFeed: React.FC<Props> = ({ token, onOpenUser, onWriteReview, onOpenSettings }) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const { posts } = await api.listFeed(token);
      setPosts(posts);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'flex-start' }}>
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
            <Pressable
              onPress={onWriteReview}
              style={({ pressed }) => ({
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: radius.pill,
                backgroundColor: color.bg.surface,
                borderWidth: 1,
                borderColor: 'rgba(139,63,255,0.35)',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: color.violet, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>
                ✎ REVIEW
              </Text>
            </Pressable>
            <SettingsButton onPress={onOpenSettings} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={color.violet}
            onRefresh={() => { setRefreshing(true); load(); }} />}
          showsVerticalScrollIndicator={false}
        >
          {posts === null ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}><ActivityIndicator color={color.violet} /></View>
          ) : error ? (
            <View style={{ padding: 16, borderRadius: radius.md, backgroundColor: color.bg.surface, borderWidth: 1, borderColor: color.rose }}>
              <Body color={color.rose}>{error}</Body>
            </View>
          ) : posts.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Body color={color.text.muted}>No posts yet — be the first to write a review.</Body>
            </View>
          ) : (
            posts.map((p) => (
              <PostCard key={p.id} post={p} onPressAuthor={() => onOpenUser(p.author.id)} />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default CommunityFeed;
