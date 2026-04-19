import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Avatar, RichCaption } from '../components';
import { resolveGradient } from '../lib/gradients';
import { api, type StoryGroup } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { haptic } from '../lib/haptics';
import type { CommunityStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CommunityStackParamList, 'StoryViewer'>;

const SEGMENT_MS = 5000;
const { width: W, height: H } = Dimensions.get('window');

const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return '1d';
};

export const StoryViewer: React.FC<Props> = ({ navigation, route }) => {
  const { groups: initialGroups, startGroupIndex } = route.params;
  const { token } = useSession();

  const [groupIndex, setGroupIndex] = useState(startGroupIndex);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const groups: StoryGroup[] = initialGroups;
  const group = groups[groupIndex];
  const segment = group?.stories[segmentIndex];

  // Mark viewed once we land on a segment.
  useEffect(() => {
    if (!segment || segment.seen) return;
    api.markStoryViewed(token, segment.id).catch(() => { /* silent */ });
  }, [segment?.id]);

  // Run progress bar animation per segment.
  useEffect(() => {
    progress.setValue(0);
    if (!segment || paused) return;
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: SEGMENT_MS,
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (finished) advance();
    });
    return () => anim.stop();
  }, [groupIndex, segmentIndex, paused]);

  const advance = () => {
    if (!group) return;
    if (segmentIndex < group.stories.length - 1) {
      setSegmentIndex((s) => s + 1);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((g) => g + 1);
      setSegmentIndex(0);
    } else {
      navigation.goBack();
    }
  };

  const rewind = () => {
    if (segmentIndex > 0) {
      setSegmentIndex((s) => s - 1);
    } else if (groupIndex > 0) {
      const prev = groups[groupIndex - 1];
      setGroupIndex((g) => g - 1);
      setSegmentIndex(prev.stories.length - 1);
    } else {
      // Stay on first segment, restart.
      progress.setValue(0);
    }
  };

  const gradientConfig = useMemo(
    () => (segment ? resolveGradient(segment.gradient) : resolveGradient('night')),
    [segment?.gradient],
  );

  if (!group || !segment) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: color.text.muted }}>No stories.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Photo if present, otherwise the gradient+emoji canvas is our fallback. */}
      {segment.mediaUrl ? (
        <Image
          source={{ uri: segment.mediaUrl }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: W, height: H }}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: W, height: H }}
        />
      )}
      {/* Darken top + bottom for readability */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.45)', 'transparent', 'transparent', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.2, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: W, height: H }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Progress bars */}
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
            paddingHorizontal: 12,
            paddingTop: 8,
          }}
        >
          {group.stories.map((s, i) => {
            const done = i < segmentIndex;
            const active = i === segmentIndex;
            const widthAnim = active
              ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
              : done
                ? ('100%' as const)
                : ('0%' as const);
            return (
              <View
                key={s.id}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  overflow: 'hidden',
                }}
              >
                <Animated.View
                  style={[
                    {
                      height: '100%',
                      backgroundColor: color.text.primary,
                    },
                    // widthAnim is either an Animated interpolation (string output) or a literal '0%'/'100%'.
                    // RN's style merge accepts both; TS doesn't narrow correctly without the cast.
                    { width: widthAnim } as unknown as object,
                  ]}
                />
              </View>
            );
          })}
        </View>

        {/* Author header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 16,
            paddingTop: 12,
          }}
        >
          <Avatar
            name={group.author.name ?? 'M'}
            color={group.author.avatarColor ?? color.gold[500]}
            size={34}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
              {group.isMe ? 'Your story' : (group.author.name ?? 'Member')}
            </Text>
            <Text style={{ color: 'rgba(240,237,230,0.7)', fontSize: 11, marginTop: 1 }}>
              {timeAgo(segment.createdAt)}
              {segment.location ? ` · 📍 ${segment.location}` : ''}
            </Text>
          </View>
          <Pressable
            onPress={() => { haptic.tap(); navigation.goBack(); }}
            hitSlop={10}
            style={{ paddingHorizontal: 6, paddingVertical: 2 }}
          >
            <Text style={{ color: color.text.primary, fontSize: 24, lineHeight: 26 }}>×</Text>
          </Pressable>
        </View>

        {/* Body — tap zones + centered glyph */}
        <View style={{ flex: 1, position: 'relative' }}>
          {/* Tap left third → rewind; tap right → advance; hold center → pause */}
          <Pressable
            onPress={() => { haptic.tap(); rewind(); }}
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: W * 0.3 }}
          />
          <Pressable
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
            style={{ position: 'absolute', left: W * 0.3, top: 0, bottom: 0, width: W * 0.4 }}
          />
          <Pressable
            onPress={() => { haptic.tap(); advance(); }}
            onLongPress={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: W * 0.3 }}
          />

          {/* Emoji glyph is only the hero when there's no photo backing. */}
          {!segment.mediaUrl ? (
            <View pointerEvents="none" style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={{
                  fontSize: 140,
                  lineHeight: 160,
                  textShadowColor: 'rgba(0,0,0,0.35)',
                  textShadowRadius: 20,
                }}
              >
                {segment.emoji}
              </Text>
            </View>
          ) : null}

          {/* Caption */}
          {segment.caption ? (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 28,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: radius.md,
                  backgroundColor: 'rgba(7,6,13,0.55)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <RichCaption
                  style={{
                    color: color.text.primary,
                    fontSize: 15,
                    fontWeight: '600',
                    fontFamily: fontFamily.body,
                    textAlign: 'center',
                    lineHeight: 20,
                  }}
                >
                  {segment.caption}
                </RichCaption>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default StoryViewer;
