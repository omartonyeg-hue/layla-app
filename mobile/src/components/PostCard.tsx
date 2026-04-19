import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, VerifiedBadge, StarRating } from './index';
import { resolveGradient } from '../lib/gradients';
import { haptic } from '../lib/haptics';
import type { Post } from '../lib/api';

// Unified feed item. Review / Mood / Text share the same author + footer; only
// the body swaps. Like is optimistic — we update count immediately and reconcile
// with the server response (which also returns `liked`, for idempotency safety).

type Props = {
  post: Post;
  onPressAuthor?: () => void;
  onToggleLike: (postId: string, nextLiked: boolean) => Promise<void>;
  onOpenComments: (postId: string) => void;
};

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ContextKicker: React.FC<{ post: Post }> = ({ post }) => {
  if (post.kind === 'REVIEW' && post.venueEvent) {
    return <Micro size="xs" color={color.violet}>REVIEWED {post.venueEvent.venue.toUpperCase()}</Micro>;
  }
  if (post.kind === 'MOOD' && post.venueEvent) {
    return <Micro size="xs" color={color.gold[500]}>AT {post.venueEvent.venue.toUpperCase()}</Micro>;
  }
  if (post.venueEvent) {
    return <Micro size="xs" color={color.text.muted}>📍 {post.venueEvent.venue.toUpperCase()}</Micro>;
  }
  return null;
};

const MoodCanvas: React.FC<{ gradientKey: string; emoji: string }> = ({ gradientKey, emoji }) => {
  const g = resolveGradient(gradientKey);
  return (
    <View
      style={{
        marginTop: 12,
        aspectRatio: 1.2,
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: color.stroke.soft,
      }}
    >
      <LinearGradient
        colors={g.colors}
        start={g.start}
        end={g.end}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 96, lineHeight: 112 }}>{emoji}</Text>
      </LinearGradient>
    </View>
  );
};

const VenuePreview: React.FC<{ post: Post }> = ({ post }) => {
  if (!post.venueEvent) return null;
  if (post.kind === 'MOOD') return null; // already surfaced via canvas + kicker
  const g = resolveGradient(post.venueEvent.gradient);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 10,
        borderRadius: radius.md,
        backgroundColor: 'rgba(139,63,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(139,63,255,0.15)',
        marginTop: 10,
      }}
    >
      <LinearGradient
        colors={g.colors}
        start={g.start}
        end={g.end}
        style={{ width: 40, height: 40, borderRadius: radius.sm }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>
          {post.venueEvent.venue}
        </Text>
        <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
          {post.venueEvent.location ?? post.venueEvent.name}
        </Micro>
      </View>
      {post.stars != null ? <StarRating value={post.stars} size={14} /> : null}
    </View>
  );
};

// Filled heart SVG for a cleaner like state than a text ♥.
const HeartIcon: React.FC<{ filled: boolean; size?: number }> = ({ filled, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 21s-7.5-4.8-9.6-9.6C1.2 8.4 3.4 5 6.8 5c2.2 0 3.8 1.4 5.2 3 1.4-1.6 3-3 5.2-3 3.4 0 5.6 3.4 4.4 6.4C19.5 16.2 12 21 12 21z"
      fill={filled ? color.rose : 'transparent'}
      stroke={filled ? color.rose : color.text.secondary}
      strokeWidth={filled ? 0 : 1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

export const PostCard: React.FC<Props> = ({ post, onPressAuthor, onToggleLike, onOpenComments }) => {
  const authorColor = post.author.avatarColor ?? color.gold[500];
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const heartScale = useRef(new Animated.Value(1)).current;

  // Keep local state in sync if feed reloads with fresh counts.
  React.useEffect(() => {
    setLiked(post.likedByMe);
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
  }, [post.id, post.likedByMe, post.likeCount, post.commentCount]);

  const toggleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    haptic.bump();
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.35, friction: 4, tension: 180, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }),
    ]).start();
    try {
      await onToggleLike(post.id, next);
    } catch {
      // revert on failure
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
    }
  };

  const onShare = async () => {
    haptic.tap();
    const who = post.author.name ?? 'Someone';
    const body = post.text ?? (post.kind === 'MOOD' ? `${post.emoji ?? '🪩'} vibe` : 'a post');
    try {
      await Share.share({ message: `${who} on LAYLA — "${body}"` });
    } catch { /* user cancelled */ }
  };

  return (
    <View
      style={{
        padding: 14,
        borderRadius: radius.lg,
        backgroundColor: color.bg.surface,
        borderWidth: 1,
        borderColor: color.stroke.soft,
      }}
    >
      {/* Author row */}
      <Pressable
        onPress={onPressAuthor ? () => { haptic.tap(); onPressAuthor(); } : undefined}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Avatar name={post.author.name ?? 'U'} color={authorColor} size={38} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '700' }}>
              {post.author.name ?? 'Member'}
            </Text>
            {post.author.hostVerified ? <VerifiedBadge size={11} /> : null}
            <Text style={{ color: color.text.muted, fontSize: 12 }}>· {timeAgo(post.createdAt)}</Text>
          </View>
          <ContextKicker post={post} />
        </View>
      </Pressable>

      {/* Body */}
      {post.kind === 'REVIEW' && post.stars != null ? (
        <View style={{ marginTop: 12 }}>
          <StarRating value={post.stars} size={20} />
          {post.vibes.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {post.vibes.map((v) => (
                <View
                  key={v}
                  style={{
                    paddingHorizontal: 10, paddingVertical: 5,
                    borderRadius: radius.pill,
                    backgroundColor: 'rgba(139,63,255,0.12)',
                    borderWidth: 1,
                    borderColor: 'rgba(139,63,255,0.25)',
                  }}
                >
                  <Text style={{ color: color.violet, fontSize: 11, fontWeight: '700' }}>{v}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {post.kind === 'MOOD' && post.gradient && post.emoji ? (
        <MoodCanvas gradientKey={post.gradient} emoji={post.emoji} />
      ) : null}

      {post.text ? (
        <Body color={color.text.primary} style={{ marginTop: 10, lineHeight: 20 }}>
          {post.text}
        </Body>
      ) : null}

      <VenuePreview post={post} />

      {/* Action footer */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 22,
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: color.stroke.soft,
        }}
      >
        <Pressable onPress={toggleLike} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <HeartIcon filled={liked} />
          </Animated.View>
          <Text
            style={{
              color: liked ? color.rose : color.text.secondary,
              fontSize: 12,
              fontWeight: '700',
              fontFamily: fontFamily.body,
              minWidth: 10,
            }}
          >
            {likeCount > 0 ? likeCount : ''}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            haptic.tap();
            onOpenComments(post.id);
          }}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Text style={{ color: color.text.secondary, fontSize: 17, lineHeight: 20 }}>💬</Text>
          <Text
            style={{
              color: color.text.secondary,
              fontSize: 12,
              fontWeight: '700',
              fontFamily: fontFamily.body,
            }}
          >
            {commentCount > 0 ? commentCount : ''}
          </Text>
        </Pressable>

        <Pressable onPress={onShare} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <Text style={{ color: color.text.secondary, fontSize: 17, lineHeight: 20 }}>↗</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PostCard;
