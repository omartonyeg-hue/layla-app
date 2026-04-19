import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline, StarRating, VibeChip } from '../components';
import { api, ApiError, type EventWithTiers } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { resolveGradient } from '../lib/gradients';
import { useKeyboardHeight } from '../lib/useKeyboardHeight';
import type { CommunityStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CommunityStackParamList, 'WriteReview'>;

const VIBES = [
  'Great sound',
  'Real crowd',
  'Strict door',
  'Packed',
  'Expensive drinks',
  'Worth it',
  'Stayed late',
  'Clean space',
];

const MAX_TEXT = 600;

export const WriteReview: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const onClose = () => navigation.goBack();
  const onPosted = () => {
    toast.show({ message: 'Review posted to your circle', tone: 'violet', icon: '◆' });
    navigation.goBack();
  };
  const [events, setEvents] = useState<EventWithTiers[]>([]);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [vibes, setVibes] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listEvents(token).then(({ events }) => setEvents(events)).catch(() => { /* venue picker optional */ });
  }, [token]);

  const toggleVibe = (v: string) =>
    setVibes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const valid = stars >= 1 && text.trim().length > 0;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.createReview(token, {
        stars,
        vibes,
        text: text.trim(),
        venueEventId: venueId ?? undefined,
      });
      onPosted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const selectedVenue = events.find((e) => e.id === venueId);

  const footerPaddingBottom = keyboardHeight.interpolate({
    inputRange: [0, insets.bottom, insets.bottom + 1, 10000],
    outputRange: [Math.max(insets.bottom, 16), Math.max(insets.bottom, 16), insets.bottom + 1, 10000],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <Pressable
            onPress={onClose}
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
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, gap: 18 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View>
            <Micro size="sm" color={color.violet}>WRITE A REVIEW</Micro>
            <DisplayHeadline
              lines={['PUBLIC · TO', 'YOUR CIRCLE.']}
              size={30}
              lineHeightRatio={0.95}
              letterSpacingEm={0.02}
              style={{ marginTop: 6 }}
            />
          </View>

          {/* Venue picker */}
          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>REVIEWING · OPTIONAL</Micro>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <VenueChip
                selected={venueId === null}
                onPress={() => setVenueId(null)}
                label="Just a post"
              />
              {events.map((ev) => (
                <VenueChip
                  key={ev.id}
                  selected={venueId === ev.id}
                  onPress={() => setVenueId(ev.id)}
                  label={ev.venue}
                  gradientKey={ev.gradient}
                />
              ))}
            </ScrollView>
          </View>

          {/* Venue preview when chosen */}
          {selectedVenue ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 10,
                borderRadius: radius.md,
                backgroundColor: 'rgba(139,63,255,0.06)',
                borderWidth: 1,
                borderColor: 'rgba(139,63,255,0.2)',
              }}
            >
              <LinearGradient
                colors={resolveGradient(selectedVenue.gradient).colors}
                start={resolveGradient(selectedVenue.gradient).start}
                end={resolveGradient(selectedVenue.gradient).end}
                style={{ width: 40, height: 40, borderRadius: radius.sm }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>
                  {selectedVenue.venue}
                </Text>
                <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
                  {selectedVenue.location ?? selectedVenue.name}
                </Micro>
              </View>
            </View>
          ) : null}

          {/* Stars */}
          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 10 }}>YOUR RATING</Micro>
            <StarRating value={stars} onChange={setStars} size={32} />
          </View>

          {/* Vibes */}
          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 10 }}>VIBE</Micro>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {VIBES.map((v) => (
                <VibeChip key={v} label={v} selected={vibes.includes(v)} onPress={() => toggleVibe(v)} />
              ))}
            </View>
          </View>

          {/* Note */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Micro size="sm" color={color.text.muted}>NOTE</Micro>
              <Micro size="xs" color={text.length > MAX_TEXT * 0.9 ? color.rose : color.text.muted}>
                {text.length}/{MAX_TEXT}
              </Micro>
            </View>
            <TextInput
              value={text}
              onChangeText={(t) => setText(t.slice(0, MAX_TEXT))}
              placeholder="What was the sound like? The crowd? The door?"
              placeholderTextColor={color.text.muted}
              multiline
              style={{
                marginTop: 8,
                minHeight: 120,
                padding: 14,
                borderRadius: radius.md,
                backgroundColor: color.bg.surface,
                borderWidth: 1.5,
                borderColor: text.length > 0 ? color.violet : color.stroke.soft,
                color: color.text.primary,
                fontSize: 14,
                fontFamily: fontFamily.body,
                textAlignVertical: 'top',
                lineHeight: 20,
              }}
            />
          </View>

          {error ? <Body color={color.rose}>{error}</Body> : null}
        </ScrollView>
      </SafeAreaView>

      <Animated.View
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: footerPaddingBottom,
          borderTopWidth: 1,
          borderTopColor: color.stroke.soft,
          backgroundColor: color.bg.base,
        }}
      >
        <Button variant="night" disabled={!valid} loading={busy} onPress={submit}>
          POST REVIEW →
        </Button>
      </Animated.View>
    </View>
  );
};

const VenueChip: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
  gradientKey?: string;
}> = ({ label, selected, onPress, gradientKey }) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: radius.pill,
      backgroundColor: selected ? 'rgba(139,63,255,0.18)' : color.bg.surface,
      borderWidth: 1,
      borderColor: selected ? color.violet : color.stroke.soft,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    }}
  >
    {gradientKey ? (
      <LinearGradient
        colors={resolveGradient(gradientKey).colors}
        start={resolveGradient(gradientKey).start}
        end={resolveGradient(gradientKey).end}
        style={{ width: 14, height: 14, borderRadius: 4 }}
      />
    ) : null}
    <Text
      style={{
        color: selected ? color.violet : color.text.primary,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: selected ? '800' : '600',
      }}
    >
      {label}
    </Text>
  </Pressable>
);

export default WriteReview;
