import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Micro, Button, DisplayHeadline } from '../components';
import { api, ApiError, type EventWithTiers } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { resolveGradient } from '../lib/gradients';
import { haptic } from '../lib/haptics';
import { useKeyboardHeight } from '../lib/useKeyboardHeight';
import type { CommunityStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CommunityStackParamList, 'MoodComposer'>;

const GRADIENT_KEYS = [
  { key: 'night',     label: 'Night'     },
  { key: 'sunset',    label: 'Sunset'    },
  { key: 'community', label: 'Circle'    },
  { key: 'valet',     label: 'Cruise'    },
  { key: 'gold',      label: 'Signature' },
  { key: 'sahel',     label: 'Sahel'     },
];

const EMOJIS = ['🪩','🌙','🥂','🎧','✨','🔥','💫','🌊','🍸','🖤','💎','👑'];
const MAX_TEXT = 280;

export const MoodComposer: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const [events, setEvents] = useState<EventWithTiers[]>([]);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [gradientKey, setGradientKey] = useState<string>('night');
  const [emoji, setEmoji] = useState<string>('🪩');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listEvents(token).then(({ events }) => setEvents(events)).catch(() => { /* optional */ });
  }, [token]);

  const g = resolveGradient(gradientKey);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.createMoodPost(token, {
        gradient: gradientKey,
        emoji,
        text: text.trim() || undefined,
        venueEventId: venueId ?? undefined,
      });
      toast.show({ message: 'Posted to your circle', tone: 'gold', icon: '◆' });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  // Footer padding = max(keyboardHeight, safe-area bottom). POST button slides
  // above the keyboard when any input is focused.
  const footerPaddingBottom = keyboardHeight.interpolate({
    inputRange: [0, insets.bottom, insets.bottom + 1, 10000],
    outputRange: [Math.max(insets.bottom, 16), Math.max(insets.bottom, 16), insets.bottom + 1, 10000],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 }}>
          <Pressable
            onPress={() => { haptic.tap(); navigation.goBack(); }}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: color.bg.surface,
              borderWidth: 1, borderColor: color.stroke.soft,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>×</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>NEW POST</Micro>
            <DisplayHeadline
              lines={['A MOOD.']}
              size={28}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 18 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                aspectRatio: 1.1,
                borderRadius: radius.xl,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: color.stroke.mid,
              }}
            >
              <LinearGradient
                colors={g.colors}
                start={g.start}
                end={g.end}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 120, lineHeight: 140 }}>{emoji}</Text>
              </LinearGradient>
            </View>
          </View>

          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 10 }}>BACKDROP</Micro>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {GRADIENT_KEYS.map(({ key, label }) => {
                const gg = resolveGradient(key);
                const active = gradientKey === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => { haptic.tap(); setGradientKey(key); }}
                    style={{ alignItems: 'center', gap: 6 }}
                  >
                    <View
                      style={{
                        width: 48, height: 48, borderRadius: 24,
                        padding: 2,
                        borderWidth: 2,
                        borderColor: active ? color.gold[500] : 'transparent',
                      }}
                    >
                      <LinearGradient
                        colors={gg.colors}
                        start={gg.start}
                        end={gg.end}
                        style={{ flex: 1, borderRadius: 22 }}
                      />
                    </View>
                    <Text style={{
                      color: active ? color.text.primary : color.text.muted,
                      fontSize: 10.5,
                      fontWeight: active ? '800' : '600',
                      letterSpacing: 0.3,
                    }}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 10 }}>GLYPH</Micro>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {EMOJIS.map((e) => {
                const active = emoji === e;
                return (
                  <Pressable
                    key={e}
                    onPress={() => { haptic.tap(); setEmoji(e); }}
                    style={{
                      width: 48, height: 48, borderRadius: 24,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: active ? 'rgba(212,168,67,0.14)' : color.bg.surface,
                      borderWidth: 1.5,
                      borderColor: active ? color.gold[500] : color.stroke.soft,
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{e}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {events.length > 0 ? (
            <View>
              <Micro size="sm" color={color.text.muted} style={{ marginBottom: 10 }}>TAG A VENUE · OPTIONAL</Micro>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <VenueChip
                  selected={venueId === null}
                  onPress={() => setVenueId(null)}
                  label="No venue"
                />
                {events.map((ev) => (
                  <VenueChip
                    key={ev.id}
                    selected={venueId === ev.id}
                    onPress={() => setVenueId(ev.id)}
                    label={ev.venue}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Micro size="sm" color={color.text.muted}>CAPTION · OPTIONAL</Micro>
              <Micro size="xs" color={text.length > MAX_TEXT * 0.9 ? color.rose : color.text.muted}>
                {text.length}/{MAX_TEXT}
              </Micro>
            </View>
            <TextInput
              value={text}
              onChangeText={(t) => setText(t.slice(0, MAX_TEXT))}
              placeholder="What's the vibe right now?"
              placeholderTextColor={color.text.muted}
              multiline
              style={{
                marginTop: 8,
                minHeight: 80,
                padding: 12,
                borderRadius: radius.md,
                backgroundColor: color.bg.surface,
                borderWidth: 1.5,
                borderColor: text.length > 0 ? color.gold[500] : color.stroke.soft,
                color: color.text.primary,
                fontSize: 14,
                fontFamily: fontFamily.body,
                textAlignVertical: 'top',
                lineHeight: 20,
              }}
            />
          </View>

          {error ? <Text style={{ color: color.rose, fontSize: 13 }}>{error}</Text> : null}
        </ScrollView>
      </SafeAreaView>

      <Animated.View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: footerPaddingBottom,
          borderTopWidth: 1,
          borderTopColor: color.stroke.soft,
          backgroundColor: color.bg.base,
        }}
      >
        <Button variant="gold" loading={busy} onPress={submit}>POST →</Button>
      </Animated.View>
    </View>
  );
};

const VenueChip: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({
  label,
  selected,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: radius.pill,
      backgroundColor: selected ? 'rgba(212,168,67,0.14)' : color.bg.surface,
      borderWidth: 1,
      borderColor: selected ? color.gold[500] : color.stroke.soft,
    }}
  >
    <Text
      style={{
        color: selected ? color.gold[500] : color.text.primary,
        fontSize: 12,
        fontWeight: selected ? '800' : '600',
      }}
    >
      {label}
    </Text>
  </Pressable>
);

export default MoodComposer;
