import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, VerifiedBadge, StarRating } from './index';
import { resolveGradient } from '../lib/gradients';
import type { Post } from '../lib/api';

// Unified feed item. Renders review (stars + vibes + venue card), plain text,
// or photo (deferred) depending on `kind`.

type Props = {
  post: Post;
  onPressAuthor?: () => void;
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
  if (post.venueEvent) {
    return <Micro size="xs" color={color.text.muted}>📍 {post.venueEvent.venue.toUpperCase()}</Micro>;
  }
  return null;
};

const VenuePreview: React.FC<{ post: Post }> = ({ post }) => {
  if (!post.venueEvent) return null;
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

export const PostCard: React.FC<Props> = ({ post, onPressAuthor }) => {
  const authorColor = post.author.avatarColor ?? color.gold[500];
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
        onPress={onPressAuthor}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
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
          gap: 18,
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: color.stroke.soft,
        }}
      >
        <FooterAction icon="♡" label="Like" />
        <FooterAction icon="💬" label="Comment" />
        <FooterAction icon="↗" label="Share" />
      </View>
    </View>
  );
};

const FooterAction: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
    <Text style={{ color: color.text.secondary, fontSize: 15 }}>{icon}</Text>
    <Text
      style={{
        color: color.text.secondary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        fontFamily: fontFamily.body,
      }}
    >
      {label.toUpperCase()}
    </Text>
  </View>
);

export default PostCard;
