import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, radius, fontFamily, gradient as tokenGradient } from '../theme/tokens';
import { haptic } from '../lib/haptics';

// Bottom sheet that offers the three compose entry points. No external sheet
// lib — React Modal + a small spring translation keeps it consistent with the
// rest of LAYLA's overlay language.

type Props = {
  visible: boolean;
  onClose: () => void;
  onMood: () => void;
  onStory: () => void;
  onReview: () => void;
};

type Action = {
  key: 'mood' | 'story' | 'review';
  title: string;
  subtitle: string;
  emoji: string;
  gradientKey: 'gold' | 'night' | 'community';
  onPress: () => void;
};

export const ComposeSheet: React.FC<Props> = ({ visible, onClose, onMood, onStory, onReview }) => {
  const insets = useSafeAreaInsets();
  const translate = useRef(new Animated.Value(400)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translate, { toValue: 0, friction: 9, tension: 80, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    } else {
      translate.setValue(400);
      backdrop.setValue(0);
    }
  }, [visible]);

  const close = () => {
    Animated.parallel([
      Animated.timing(translate, { toValue: 400, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const actions: Action[] = [
    { key: 'mood',   title: 'POST A MOOD', subtitle: 'Gradient canvas, emoji, caption.', emoji: '🪩', gradientKey: 'gold',     onPress: () => { haptic.press(); close(); setTimeout(onMood, 210); } },
    { key: 'story',  title: 'ADD A STORY', subtitle: 'Live for 24 hours, just your circle.', emoji: '✨', gradientKey: 'night', onPress: () => { haptic.press(); close(); setTimeout(onStory, 210); } },
    { key: 'review', title: 'WRITE A REVIEW', subtitle: 'Stars · vibe · where you were.', emoji: '◆', gradientKey: 'community', onPress: () => { haptic.press(); close(); setTimeout(onReview, 210); } },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(7,6,13,0.55)',
            opacity: backdrop,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={close} />
        </Animated.View>

        {/* Sheet */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }} pointerEvents="box-none">
          <Animated.View
            style={{
              backgroundColor: color.bg.surface,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingTop: 10,
              paddingHorizontal: 16,
              paddingBottom: insets.bottom + 18,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: color.stroke.soft,
              transform: [{ translateY: translate }],
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: color.stroke.mid,
                marginBottom: 14,
              }}
            />
            <Text
              style={{
                color: color.text.muted,
                fontSize: 10.5,
                letterSpacing: 1.2,
                fontWeight: '800',
                fontFamily: fontFamily.body,
                marginBottom: 10,
                marginLeft: 4,
              }}
            >
              SHARE WITH YOUR CIRCLE
            </Text>
            <View style={{ gap: 10 }}>
              {actions.map((a) => {
                const g = tokenGradient[a.gradientKey];
                return (
                  <Pressable
                    key={a.key}
                    onPress={a.onPress}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                        padding: 14,
                        borderRadius: radius.lg,
                        backgroundColor: color.bg.elevated,
                        borderWidth: 1,
                        borderColor: color.stroke.soft,
                      }}
                    >
                      <View
                        style={{
                          width: 52, height: 52, borderRadius: radius.md,
                          overflow: 'hidden',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <LinearGradient
                          colors={g.colors}
                          start={g.start}
                          end={g.end}
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                        <Text style={{ fontSize: 24, lineHeight: 28 }}>{a.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: color.text.primary,
                            fontSize: 14,
                            fontWeight: '800',
                            letterSpacing: 0.4,
                          }}
                        >
                          {a.title}
                        </Text>
                        <Text
                          style={{
                            color: color.text.muted,
                            fontSize: 12,
                            marginTop: 3,
                            fontFamily: fontFamily.body,
                          }}
                        >
                          {a.subtitle}
                        </Text>
                      </View>
                      <Text style={{ color: color.text.muted, fontSize: 22, lineHeight: 24 }}>›</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default ComposeSheet;
