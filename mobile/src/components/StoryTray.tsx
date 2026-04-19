import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, gradient as tokenGradient, fontFamily } from '../theme/tokens';
import { Avatar } from './Avatar';
import { haptic } from '../lib/haptics';
import type { StoryGroup } from '../lib/api';

// Instagram-style story tray: horizontal scroll of avatar rings. Unseen groups
// get the gold→rose→violet ring; seen groups flatten to a muted stroke. The
// first tile ("You") is always the composer entry point.

type Props = {
  groups: StoryGroup[];
  meName?: string | null;
  meAvatarColor?: string | null;
  onOpenStory: (groupIndex: number) => void;
  onAddStory: () => void;
};

const RING_SIZE = 62;
const RING_THICKNESS = 2;
const INNER = RING_SIZE - RING_THICKNESS * 2;

const UnseenRing: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LinearGradient
    colors={tokenGradient.community.colors}
    start={tokenGradient.community.start}
    end={tokenGradient.community.end}
    style={{
      width: RING_SIZE,
      height: RING_SIZE,
      borderRadius: RING_SIZE / 2,
      padding: RING_THICKNESS,
    }}
  >
    <View
      style={{
        width: INNER,
        height: INNER,
        borderRadius: INNER / 2,
        backgroundColor: color.bg.base,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  </LinearGradient>
);

const SeenRing: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View
    style={{
      width: RING_SIZE,
      height: RING_SIZE,
      borderRadius: RING_SIZE / 2,
      padding: RING_THICKNESS,
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: color.stroke.mid,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: INNER - 2,
        height: INNER - 2,
        borderRadius: (INNER - 2) / 2,
        backgroundColor: color.bg.base,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  </View>
);

const Label: React.FC<{ children: string; active?: boolean }> = ({ children, active }) => (
  <Text
    numberOfLines={1}
    style={{
      marginTop: 6,
      maxWidth: 72,
      fontSize: 10.5,
      fontFamily: fontFamily.body,
      fontWeight: active ? '800' : '600',
      letterSpacing: 0.2,
      color: active ? color.text.primary : color.text.secondary,
      textAlign: 'center',
    }}
  >
    {children}
  </Text>
);

export const StoryTray: React.FC<Props> = ({
  groups,
  meName,
  meAvatarColor,
  onOpenStory,
  onAddStory,
}) => {
  // Split "me" from others — me always leads, even if empty.
  const meGroup = groups.find((g) => g.isMe) ?? null;
  const others = groups.filter((g) => !g.isMe);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 14,
      }}
    >
      {/* "You" tile — composer entry */}
      <Pressable
        onPress={() => {
          haptic.tap();
          if (meGroup) onOpenStory(groups.indexOf(meGroup));
          else onAddStory();
        }}
        style={({ pressed }) => ({ alignItems: 'center', opacity: pressed ? 0.7 : 1 })}
      >
        <View style={{ position: 'relative' }}>
          {meGroup && !meGroup.allSeen ? (
            <UnseenRing>
              <Avatar
                name={meName ?? 'Y'}
                color={meAvatarColor ?? color.gold[500]}
                size={INNER - 4}
              />
            </UnseenRing>
          ) : (
            <SeenRing>
              <Avatar
                name={meName ?? 'Y'}
                color={meAvatarColor ?? color.gold[500]}
                size={INNER - 8}
              />
            </SeenRing>
          )}
          {/* Gold + badge, pinned bottom-right */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              haptic.tap();
              onAddStory();
            }}
            hitSlop={6}
            style={{
              position: 'absolute',
              right: -2,
              bottom: -2,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: color.gold[500],
              borderWidth: 2,
              borderColor: color.bg.base,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: color.text.inverse,
                fontSize: 13,
                lineHeight: 15,
                fontWeight: '900',
              }}
            >
              +
            </Text>
          </Pressable>
        </View>
        <Label active={!!meGroup && !meGroup.allSeen}>You</Label>
      </Pressable>

      {others.map((g, idxInOthers) => {
        const groupIndex = groups.indexOf(g);
        const active = !g.allSeen;
        const firstName = g.author.name?.split(' ')[0] ?? 'Member';
        return (
          <Pressable
            key={g.author.id}
            onPress={() => {
              haptic.tap();
              onOpenStory(groupIndex);
            }}
            style={({ pressed }) => ({ alignItems: 'center', opacity: pressed ? 0.7 : 1 })}
          >
            {active ? (
              <UnseenRing>
                <Avatar
                  name={g.author.name ?? 'M'}
                  color={g.author.avatarColor ?? color.gold[500]}
                  size={INNER - 4}
                />
              </UnseenRing>
            ) : (
              <SeenRing>
                <Avatar
                  name={g.author.name ?? 'M'}
                  color={g.author.avatarColor ?? color.gold[500]}
                  size={INNER - 8}
                />
              </SeenRing>
            )}
            <Label active={active}>{firstName}</Label>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default StoryTray;
