import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import {
  Micro,
  Body,
  Button,
  DisplayHeadline,
  StarRating,
  VibeChip,
  MediaPickerSheet,
  MentionTypeaheadList,
} from '../components';
import { api, ApiError, type EventWithTiers } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { resolveGradient } from '../lib/gradients';
import { haptic } from '../lib/haptics';
import { useKeyboardHeight } from '../lib/useKeyboardHeight';
import { useMentionTypeahead } from '../lib/mentionTypeahead';
import { pickAndUploadMany, type PickSource, type UploadedAsset } from '../lib/upload';
import type { CommunityStackParamList } from '../navigation/types';

// Unified post composer. Replaces the old MoodComposer + WriteReview duo
// with one surface that supports: multi-photo carousel (up to 10) OR a
// gradient+emoji fallback canvas, caption with native emoji keyboard +
// @mention typeahead + #hashtag support, location tag (free text OR pick
// from a LAYLA event's venue), and an optional review add-on (stars +
// vibes). Server derives kind (MOOD vs REVIEW) from whether stars is set.

type Props = NativeStackScreenProps<CommunityStackParamList, 'Composer'>;

const MAX_PHOTOS = 10;
const MAX_TEXT = 600;
const MAX_LOCATION = 60;

const GRADIENT_KEYS = [
  { key: 'night', label: 'Night' },
  { key: 'sunset', label: 'Sunset' },
  { key: 'community', label: 'Circle' },
  { key: 'valet', label: 'Cruise' },
  { key: 'gold', label: 'Signature' },
  { key: 'sahel', label: 'Sahel' },
];

const GLYPHS = ['🪩', '🌙', '🥂', '🎧', '✨', '🔥', '💫', '🌊', '🍸', '🖤', '💎', '👑'];
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

export const Composer: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  // Caption + cursor (cursor drives mention typeahead).
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const mention = useMentionTypeahead(token, text, setText, cursor);

  // Photos
  const [photos, setPhotos] = useState<UploadedAsset[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);

  // Backdrop fallback (used when no photos).
  const [gradientKey, setGradientKey] = useState<string>('night');
  const [emoji, setEmoji] = useState<string>('🪩');

  // Location
  const [locationOn, setLocationOn] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [venueEvents, setVenueEvents] = useState<EventWithTiers[]>([]);
  const [venueId, setVenueId] = useState<string | null>(null);

  // Review add-on
  const [reviewOn, setReviewOn] = useState(false);
  const [stars, setStars] = useState(0);
  const [vibes, setVibes] = useState<string[]>([]);

  // Submit
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listEvents(token)
      .then(({ events }) => setVenueEvents(events))
      .catch(() => { /* venue list is optional */ });
  }, [token]);

  const addPhotos = async (source: PickSource) => {
    if (uploading || photos.length >= MAX_PHOTOS) return;
    const room = MAX_PHOTOS - photos.length;
    setUploading({ done: 0, total: 0 });
    try {
      const assets = await pickAndUploadMany(token, source, 'post', room, (done, total) =>
        setUploading({ done, total }),
      );
      if (assets.length > 0) {
        setPhotos((prev) => [...prev, ...assets]);
        haptic.success();
      }
    } catch (err) {
      toast.show({
        message: err instanceof Error ? err.message : 'Upload failed',
        tone: 'rose',
        icon: '!',
      });
    } finally {
      setUploading(null);
    }
  };

  const removePhotoAt = (i: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    haptic.tap();
  };

  const toggleVibe = (v: string) =>
    setVibes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const submit = async () => {
    if (busy) return;
    const canSubmit =
      photos.length > 0 ||
      text.trim().length > 0 ||
      (reviewOn && stars >= 1);
    if (!canSubmit) {
      setError('Add a photo, write something, or rate the venue.');
      return;
    }
    if (reviewOn && stars < 1) {
      setError('Pick a rating or turn the review off.');
      return;
    }

    setBusy(true);
    setError(null);
    haptic.press();
    try {
      await api.createPost(token, {
        text: text.trim() || undefined,
        mediaUrls: photos.map((p) => p.url),
        // Only pass gradient+emoji when there are no photos — saves a few
        // bytes on the wire and makes the "post kind" at-a-glance obvious
        // when debugging DB rows.
        gradient: photos.length === 0 ? gradientKey : undefined,
        emoji: photos.length === 0 ? emoji : undefined,
        venueEventId: venueId ?? undefined,
        location: locationOn && locationText.trim() ? locationText.trim() : undefined,
        stars: reviewOn && stars >= 1 ? stars : undefined,
        vibes: reviewOn ? vibes : undefined,
      });
      toast.show({
        message: reviewOn ? 'Review posted' : 'Posted to your circle',
        tone: reviewOn ? 'violet' : 'gold',
        icon: reviewOn ? '◆' : '✓',
      });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const g = resolveGradient(gradientKey);
  const canPost =
    !busy &&
    !uploading &&
    (photos.length > 0 || text.trim().length > 0 || (reviewOn && stars >= 1)) &&
    (!reviewOn || stars >= 1);

  const footerPaddingBottom = keyboardHeight.interpolate({
    inputRange: [0, insets.bottom, insets.bottom + 1, 10000],
    outputRange: [Math.max(insets.bottom, 16), Math.max(insets.bottom, 16), insets.bottom + 1, 10000],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header */}
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
              lines={[reviewOn ? 'REVIEW.' : 'A MOMENT.']}
              size={28}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {/* Media preview — carousel or fallback gradient canvas */}
            {photos.length > 0 ? (
              <PhotoPreview photos={photos} onRemove={removePhotoAt} />
            ) : (
              <View
                style={{
                  aspectRatio: 1,
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
            )}

            {/* Add media button + upload progress */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => { haptic.tap(); setPickerOpen(true); }}
                disabled={!!uploading || photos.length >= MAX_PHOTOS}
                style={({ pressed }) => ({
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 12,
                  borderRadius: radius.pill,
                  backgroundColor: 'rgba(212,168,67,0.14)',
                  borderWidth: 1,
                  borderColor: color.gold[500],
                  opacity: pressed || uploading || photos.length >= MAX_PHOTOS ? 0.5 : 1,
                })}
              >
                {uploading ? (
                  <>
                    <ActivityIndicator size="small" color={color.gold[500]} />
                    <Text style={{ color: color.gold[500], fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>
                      UPLOADING {uploading.done}/{uploading.total || '—'}
                    </Text>
                  </>
                ) : (
                  <Text style={{ color: color.gold[500], fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>
                    {photos.length === 0 ? '📸 ADD PHOTOS' : `+ ADD MORE (${photos.length}/${MAX_PHOTOS})`}
                  </Text>
                )}
              </Pressable>
            </View>

            {/* Caption with mention typeahead */}
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Micro size="sm" color={color.text.muted}>CAPTION</Micro>
                <Micro size="xs" color={text.length > MAX_TEXT * 0.9 ? color.rose : color.text.muted}>
                  {text.length}/{MAX_TEXT}
                </Micro>
              </View>
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={(t) => setText(t.slice(0, MAX_TEXT))}
                onSelectionChange={(e) => setCursor(e.nativeEvent.selection.end)}
                placeholder="What's the vibe right now? Tag @friends, use #hashtags."
                placeholderTextColor={color.text.muted}
                multiline
                style={{
                  marginTop: 8,
                  minHeight: 100,
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
              <Micro size="xs" color={color.text.muted} style={{ marginTop: 6 }}>
                Tip: press 😀 on the keyboard for emoji. Type @ to tag someone.
              </Micro>
            </View>

            {/* Add-ons toolbar — toggle each feature on/off */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <AddonToggle
                active={locationOn}
                icon="📍"
                label="LOCATION"
                onPress={() => { haptic.tap(); setLocationOn((v) => !v); }}
              />
              <AddonToggle
                active={reviewOn}
                icon="⭐"
                label="REVIEW"
                onPress={() => { haptic.tap(); setReviewOn((v) => !v); }}
              />
              <AddonToggle
                active={false}
                icon="📊"
                label="POLL"
                disabled
                onPress={() => toast.show({ message: 'Polls land in the next update.', tone: 'violet' })}
              />
              <AddonToggle
                active={false}
                icon="🎵"
                label="MUSIC"
                disabled
                onPress={() => toast.show({ message: 'Music coming soon.', tone: 'violet' })}
              />
            </View>

            {/* Location add-on */}
            {locationOn ? (
              <View
                style={{
                  gap: 10,
                  padding: 14,
                  borderRadius: radius.lg,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.stroke.soft,
                }}
              >
                <Micro size="sm" color={color.gold[500]}>📍 LOCATION</Micro>
                <TextInput
                  value={locationText}
                  onChangeText={(t) => setLocationText(t.slice(0, MAX_LOCATION))}
                  placeholder="Zamalek, Cairo · Six Eight · anywhere"
                  placeholderTextColor={color.text.muted}
                  style={{
                    padding: 10,
                    borderRadius: radius.md,
                    backgroundColor: color.bg.base,
                    borderWidth: 1,
                    borderColor: locationText.length > 0 ? color.gold[500] : color.stroke.soft,
                    color: color.text.primary,
                    fontSize: 14,
                    fontFamily: fontFamily.body,
                  }}
                />
                {venueEvents.length > 0 ? (
                  <>
                    <Micro size="xs" color={color.text.muted}>OR TAG A LAYLA VENUE</Micro>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      <VenueChip
                        selected={venueId === null}
                        onPress={() => setVenueId(null)}
                        label="None"
                      />
                      {venueEvents.map((ev) => (
                        <VenueChip
                          key={ev.id}
                          selected={venueId === ev.id}
                          onPress={() => {
                            setVenueId(ev.id);
                            // Auto-fill the free-text field with the venue's
                            // known label if the user hasn't typed anything.
                            if (!locationText.trim()) setLocationText(ev.location ?? ev.venue);
                          }}
                          label={ev.venue}
                        />
                      ))}
                    </ScrollView>
                  </>
                ) : null}
              </View>
            ) : null}

            {/* Review add-on */}
            {reviewOn ? (
              <View
                style={{
                  gap: 12,
                  padding: 14,
                  borderRadius: radius.lg,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.stroke.soft,
                }}
              >
                <Micro size="sm" color={color.violet}>⭐ YOUR RATING</Micro>
                <StarRating value={stars} onChange={setStars} size={32} />
                <Micro size="sm" color={color.text.muted} style={{ marginTop: 4 }}>VIBE</Micro>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {VIBES.map((v) => (
                    <VibeChip
                      key={v}
                      label={v}
                      selected={vibes.includes(v)}
                      onPress={() => toggleVibe(v)}
                    />
                  ))}
                </View>
              </View>
            ) : null}

            {/* Backdrop picker — only relevant when there are no photos. */}
            {photos.length === 0 ? (
              <View style={{ gap: 10 }}>
                <Micro size="sm" color={color.text.muted}>BACKDROP</Micro>
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
                          fontSize: 10.5, fontWeight: active ? '800' : '600',
                          letterSpacing: 0.3,
                        }}>{label}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Micro size="sm" color={color.text.muted} style={{ marginTop: 6 }}>GLYPH</Micro>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {GLYPHS.map((e) => {
                    const active = emoji === e;
                    return (
                      <Pressable
                        key={e}
                        onPress={() => { haptic.tap(); setEmoji(e); }}
                        style={{
                          width: 44, height: 44, borderRadius: 22,
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
            ) : null}

            {error ? <Body color={color.rose}>{error}</Body> : null}
          </ScrollView>

          {/* Mention typeahead slides in above the composer footer whenever
              there's an active @fragment. */}
          {mention.active ? (
            <MentionTypeaheadList
              results={mention.results}
              loading={mention.loading}
              onPick={(account) => {
                const { cursor: nextCursor } = mention.select(account);
                setCursor(nextCursor);
                setTimeout(
                  () => inputRef.current?.setNativeProps({ selection: { start: nextCursor, end: nextCursor } }),
                  0,
                );
              }}
            />
          ) : null}
        </KeyboardAvoidingView>
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
        <Button
          variant={reviewOn ? 'night' : 'gold'}
          loading={busy}
          disabled={!canPost}
          onPress={submit}
        >
          {reviewOn ? 'POST REVIEW →' : 'POST →'}
        </Button>
      </Animated.View>

      <MediaPickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={addPhotos}
        title={photos.length === 0 ? 'ADD PHOTOS' : 'ADD MORE PHOTOS'}
      />
    </View>
  );
};

// ── Subcomponents ────────────────────────────────────────────────

const PhotoPreview: React.FC<{ photos: UploadedAsset[]; onRemove: (i: number) => void }> = ({ photos, onRemove }) => {
  if (photos.length === 1) {
    return (
      <View
        style={{
          aspectRatio: 1,
          borderRadius: radius.xl,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image source={{ uri: photos[0]!.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <RemoveButton onPress={() => onRemove(0)} />
      </View>
    );
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    >
      {photos.map((p, i) => (
        <View
          key={p.url}
          style={{
            width: 220,
            height: 275,
            borderRadius: radius.lg,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image source={{ uri: p.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <RemoveButton onPress={() => onRemove(i)} />
          <View
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(7,6,13,0.6)',
            }}
          >
            <Text style={{ color: color.text.primary, fontSize: 11, fontWeight: '800' }}>
              {i + 1} / {photos.length}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const RemoveButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => ({
      position: 'absolute',
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(7,6,13,0.7)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: pressed ? 0.5 : 1,
    })}
  >
    <Text style={{ color: color.text.primary, fontSize: 14, lineHeight: 16 }}>×</Text>
  </Pressable>
);

const AddonToggle: React.FC<{
  active: boolean;
  icon: string;
  label: string;
  disabled?: boolean;
  onPress: () => void;
}> = ({ active, icon, label, disabled, onPress }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: radius.pill,
      backgroundColor: active ? 'rgba(212,168,67,0.14)' : color.bg.surface,
      borderWidth: 1,
      borderColor: active ? color.gold[500] : color.stroke.soft,
      opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
    })}
  >
    <Text style={{ fontSize: 14 }}>{icon}</Text>
    <Text
      style={{
        color: active ? color.gold[500] : color.text.secondary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.6,
        fontFamily: fontFamily.body,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

const VenueChip: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({
  label,
  selected,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: radius.pill,
      backgroundColor: selected ? 'rgba(212,168,67,0.14)' : color.bg.elevated,
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

export default Composer;
