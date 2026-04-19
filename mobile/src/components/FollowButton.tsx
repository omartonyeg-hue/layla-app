import React, { useState } from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { color, radius, fontFamily } from '../theme/tokens';
import { api, ApiError } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { haptic } from '../lib/haptics';

// Three visible states:
// - "Follow" — not following, not pending.
// - "Requested" — private target, we've sent a PENDING request.
// - "Following" — approved relationship.
// Tap toggles between follow/unfollow (and cancel-request for pending).

type Props = {
  accountId: string;
  isFollowing: boolean;
  hasPendingRequest: boolean;
  targetIsPrivate: boolean;
  onChange: (next: { isFollowing: boolean; hasPendingRequest: boolean; followerCount: number }) => void;
  size?: 'md' | 'lg';
};

export const FollowButton: React.FC<Props> = ({
  accountId,
  isFollowing,
  hasPendingRequest,
  targetIsPrivate,
  onChange,
  size = 'md',
}) => {
  const { token } = useSession();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const state: 'follow' | 'requested' | 'following' =
    isFollowing ? 'following' : hasPendingRequest ? 'requested' : 'follow';

  const onPress = async () => {
    if (busy) return;
    setBusy(true);
    haptic.bump();
    try {
      const res = await api.toggleFollow(token, accountId);
      onChange({
        isFollowing: res.following,
        hasPendingRequest: res.pending,
        followerCount: res.followerCount,
      });
      if (res.following) toast.show({ message: 'Following', tone: 'violet', icon: '✓' });
      else if (res.pending) toast.show({ message: 'Request sent', tone: 'gold', icon: '◆' });
    } catch (err) {
      toast.show({
        message: err instanceof ApiError ? err.message : 'Network error',
        tone: 'rose',
        icon: '!',
      });
    } finally {
      setBusy(false);
    }
  };

  const styles = {
    md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12 },
    lg: { paddingVertical: 12, paddingHorizontal: 22, fontSize: 13 },
  }[size];

  // Filled violet for "Follow", outlined for already-connected states.
  const filled = state === 'follow';
  const bg = filled ? color.violet : 'transparent';
  const border = filled ? color.violet : color.stroke.mid;
  const textColor = filled ? color.text.primary : color.text.secondary;
  const label = state === 'following' ? 'Following' : state === 'requested' ? 'Requested' : targetIsPrivate ? 'Request' : 'Follow';

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => ({
        backgroundColor: bg,
        borderWidth: 1.5,
        borderColor: border,
        borderRadius: radius.pill,
        paddingVertical: styles.paddingVertical,
        paddingHorizontal: styles.paddingHorizontal,
        opacity: pressed ? 0.8 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minWidth: 96,
      })}
    >
      {busy ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={{
            color: textColor,
            fontSize: styles.fontSize,
            fontWeight: '800',
            letterSpacing: 0.5,
            fontFamily: fontFamily.body,
          }}
        >
          {label.toUpperCase()}
        </Text>
      )}
    </Pressable>
  );
};

export default FollowButton;
