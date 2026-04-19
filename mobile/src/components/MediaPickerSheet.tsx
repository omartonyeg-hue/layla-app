import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, radius, fontFamily, gradient as tokenGradient } from '../theme/tokens';
import { haptic } from '../lib/haptics';
import type { PickSource } from '../lib/upload';

// Bottom sheet for photo source selection. Three destinations — Camera,
// Gallery, Files — mirror what Instagram gives you when attaching media.
// Same animation / backdrop pattern as ComposeSheet so the app feels
// consistent across sheets.

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (source: PickSource) => void;
  title?: string;
};

type Option = {
  key: PickSource;
  title: string;
  subtitle: string;
  icon: string;
  gradientKey: 'gold' | 'night' | 'community';
};

const OPTIONS: Option[] = [
  { key: 'camera',  title: 'TAKE PHOTO',    subtitle: 'Open the camera and shoot now.', icon: '📸', gradientKey: 'gold' },
  { key: 'gallery', title: 'CHOOSE FROM GALLERY', subtitle: 'Pick any photo from your library.', icon: '🖼️', gradientKey: 'night' },
  { key: 'files',   title: 'CHOOSE FROM FILES', subtitle: 'iCloud, Drive, anything in Files.', icon: '📁', gradientKey: 'community' },
];

export const MediaPickerSheet: React.FC<Props> = ({ visible, onClose, onPick, title = 'ADD A PHOTO' }) => {
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

  const handle = (opt: Option) => () => {
    haptic.press();
    close();
    // Give the dismiss animation a beat before invoking the picker so
    // iOS's permission prompt doesn't race with our sheet dismiss.
    setTimeout(() => onPick(opt.key), 210);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <View style={{ flex: 1 }}>
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
              {title}
            </Text>
            <View style={{ gap: 10 }}>
              {OPTIONS.map((opt) => {
                const g = tokenGradient[opt.gradientKey];
                return (
                  <Pressable
                    key={opt.key}
                    onPress={handle(opt)}
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
                        <Text style={{ fontSize: 24, lineHeight: 28 }}>{opt.icon}</Text>
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
                          {opt.title}
                        </Text>
                        <Text
                          style={{
                            color: color.text.muted,
                            fontSize: 12,
                            marginTop: 3,
                            fontFamily: fontFamily.body,
                          }}
                        >
                          {opt.subtitle}
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

export default MediaPickerSheet;
