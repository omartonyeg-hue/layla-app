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
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Micro, MentionTypeaheadList } from '../components';
import { api, ApiError } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { resolveGradient } from '../lib/gradients';
import { haptic } from '../lib/haptics';
import { useKeyboardHeight } from '../lib/useKeyboardHeight';
import { useMentionTypeahead } from '../lib/mentionTypeahead';
import { pickAndUpload, type PickSource } from '../lib/upload';
import type { CommunityStackParamList } from '../navigation/types';

// Instagram-style story composer. Two modes:
// - PHOTO: user picks from Camera / Gallery / Files, we upload to Cloudinary
//   (9:16 preprocessing handled by upload.ts), preview renders photo
//   fullscreen with a caption overlay that stays readable via a scrim pill.
// - TEXT: gradient + emoji canvas (LAYLA's signature) when the user wants to
//   post a text-only story.
// Both modes share caption + location + @mention typeahead. Stories expire
// after 24h server-side; that stays opaque to this screen.

type Props = NativeStackScreenProps<CommunityStackParamList, 'StoryComposer'>;

const { width: W, height: H } = Dimensions.get('window');
const MAX_CAPTION = 160;
const MAX_LOCATION = 60;

const GRADIENT_KEYS = [
  { key: 'night',     label: 'Night'     },
  { key: 'sunset',    label: 'Sunset'    },
  { key: 'community', label: 'Circle'    },
  { key: 'valet',     label: 'Cruise'    },
  { key: 'gold',      label: 'Signature' },
  { key: 'sahel',     label: 'Sahel'     },
];
const GLYPHS = ['🪩', '🌙', '🥂', '🎧', '✨', '🔥', '💫', '🌊', '🍸', '🖤', '💎', '👑'];

type Mode = 'pick' | 'photo' | 'text';

export const StoryComposer: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  const [mode, setMode] = useState<Mode>('pick');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [gradientKey, setGradientKey] = useState<string>('night');
  const [emoji, setEmoji] = useState<string>('🪩');

  const [caption, setCaption] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const mention = useMentionTypeahead(token, caption, setCaption, cursor);

  const [location, setLocation] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [locationEditing, setLocationEditing] = useState(false);

  const [showBackdropPicker, setShowBackdropPicker] = useState(false);
  const [showGlyphPicker, setShowGlyphPicker] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload from the picked source, then transition into photo preview.
  const pickAndGo = async (source: PickSource) => {
    if (uploading) return;
    setUploading(true);
    try {
      const asset = await pickAndUpload(token, source, 'story');
      if (!asset) {
        // User cancelled — stay on pick screen.
        setUploading(false);
        return;
      }
      setMediaUrl(asset.url);
      setMode('photo');
      haptic.success();
    } catch (err) {
      toast.show({
        message: err instanceof Error ? err.message : 'Upload failed',
        tone: 'rose',
        icon: '!',
      });
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    haptic.press();
    try {
      await api.createStory(token, {
        gradient: gradientKey,
        emoji,
        mediaUrl: mediaUrl ?? undefined,
        caption: caption.trim() || undefined,
        location: location?.trim() || undefined,
      });
      toast.show({ message: 'Story posted — live for 24h', tone: 'violet', icon: '◆' });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  // ── Pick-source landing state ─────────────────────────────────
  if (mode === 'pick') {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base }}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
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
              <Micro size="sm" color={color.violet}>NEW STORY · 24h</Micro>
            </View>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 32, gap: 12 }}>
            {uploading ? (
              <View style={{ alignItems: 'center', paddingVertical: 60, gap: 12 }}>
                <ActivityIndicator color={color.violet} size="large" />
                <Text style={{ color: color.text.secondary, fontSize: 13 }}>Uploading…</Text>
              </View>
            ) : (
              <>
                <SourceRow icon="📸" title="TAKE PHOTO" subtitle="Open the camera now" onPress={() => pickAndGo('camera')} />
                <SourceRow icon="🖼️" title="CHOOSE FROM GALLERY" subtitle="Pick any photo from your library" onPress={() => pickAndGo('gallery')} />
                <SourceRow icon="📁" title="CHOOSE FROM FILES" subtitle="iCloud, Drive, anywhere" onPress={() => pickAndGo('files')} />
                <View style={{ height: 1, backgroundColor: color.stroke.soft, marginVertical: 10 }} />
                <SourceRow
                  icon="✨"
                  title="TEXT ONLY"
                  subtitle="Gradient backdrop · centered glyph"
                  onPress={() => { haptic.tap(); setMode('text'); }}
                  tint="violet"
                />
              </>
            )}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ── Photo / Text preview ──────────────────────────────────────
  const g = resolveGradient(gradientKey);
  const isPhoto = mode === 'photo' && mediaUrl;

  // Bottom padding for the "Your story" CTA + caption bar — slides above
  // keyboard like every other composer.
  const bottomPad = keyboardHeight.interpolate({
    inputRange: [0, insets.bottom, insets.bottom + 1, 10000],
    outputRange: [Math.max(insets.bottom, 20), Math.max(insets.bottom, 20), insets.bottom + 1, 10000],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Backdrop: photo or gradient canvas, fills the whole screen. */}
      {isPhoto ? (
        <Image
          source={{ uri: mediaUrl! }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: W, height: H }}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={g.colors}
          start={g.start}
          end={g.end}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: W, height: H }}
        />
      )}

      {/* Top + bottom scrim for chrome readability. */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.55)', 'transparent', 'transparent', 'rgba(0,0,0,0.65)']}
        locations={[0, 0.15, 0.75, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: W, height: H }}
      />

      {/* Centered glyph only in TEXT mode. */}
      {!isPhoto ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 140, lineHeight: 160, textShadowColor: 'rgba(0,0,0,0.3)', textShadowRadius: 20 }}>
            {emoji}
          </Text>
        </View>
      ) : null}

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Top bar — close + location pill */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 10,
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => { haptic.tap(); navigation.goBack(); }}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: 'rgba(7,6,13,0.5)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>×</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          {location ? (
            <Pressable
              onPress={() => { haptic.tap(); setLocationEditing(true); setLocationInput(location ?? ''); }}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 12, paddingVertical: 7,
                borderRadius: radius.pill,
                backgroundColor: 'rgba(212,168,67,0.2)',
                borderWidth: 1, borderColor: color.gold[500],
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontSize: 14 }}>📍</Text>
              <Text style={{ color: color.gold[500], fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>
                {location}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Right-side vertical toolbar — per-mode tools. */}
        <View
          style={{
            position: 'absolute',
            right: 12,
            top: insets.top + 60,
            gap: 12,
          }}
        >
          {!isPhoto ? (
            <>
              <ToolButton icon="🎨" onPress={() => { haptic.tap(); setShowGlyphPicker(false); setShowBackdropPicker((v) => !v); }} active={showBackdropPicker} />
              <ToolButton icon={emoji} onPress={() => { haptic.tap(); setShowBackdropPicker(false); setShowGlyphPicker((v) => !v); }} active={showGlyphPicker} />
            </>
          ) : null}
          <ToolButton
            icon="📍"
            onPress={() => {
              haptic.tap();
              setLocationEditing(true);
              setLocationInput(location ?? '');
            }}
            active={!!location}
          />
          <ToolButton
            icon="@"
            onPress={() => {
              haptic.tap();
              // Focus caption and drop an `@` at the end so the typeahead fires.
              inputRef.current?.focus();
              setCaption((c) => (c.endsWith(' ') || c === '' ? `${c}@` : `${c} @`));
              setTimeout(() => setCursor(caption.length + 2), 20);
            }}
          />
        </View>

        {/* Gradient swatch picker overlay (text mode only) */}
        {showBackdropPicker && !isPhoto ? (
          <View
            style={{
              position: 'absolute',
              right: 68,
              top: insets.top + 60,
              padding: 10,
              borderRadius: radius.lg,
              backgroundColor: 'rgba(7,6,13,0.85)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
              gap: 10,
            }}
          >
            {GRADIENT_KEYS.map(({ key }) => {
              const gg = resolveGradient(key);
              const active = gradientKey === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => { haptic.tap(); setGradientKey(key); }}
                  style={{
                    width: 40, height: 40, borderRadius: 20, padding: 2,
                    borderWidth: 2, borderColor: active ? color.gold[500] : 'transparent',
                  }}
                >
                  <LinearGradient colors={gg.colors} start={gg.start} end={gg.end} style={{ flex: 1, borderRadius: 18 }} />
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {/* Glyph picker overlay (text mode only) */}
        {showGlyphPicker && !isPhoto ? (
          <View
            style={{
              position: 'absolute',
              right: 68,
              top: insets.top + 60,
              padding: 10,
              borderRadius: radius.lg,
              backgroundColor: 'rgba(7,6,13,0.85)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.15)',
              maxWidth: 180,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            {GLYPHS.map((e) => {
              const active = emoji === e;
              return (
                <Pressable
                  key={e}
                  onPress={() => { haptic.tap(); setEmoji(e); }}
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: active ? 'rgba(212,168,67,0.25)' : 'transparent',
                    borderWidth: 1.5, borderColor: active ? color.gold[500] : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={{ flex: 1 }} />

        {/* Mention typeahead — sits above caption when active */}
        {mention.active ? (
          <View style={{ marginHorizontal: 12, marginBottom: 6, borderRadius: radius.lg, overflow: 'hidden' }}>
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
          </View>
        ) : null}
      </SafeAreaView>

      {/* Caption + POST footer pinned above keyboard */}
      <Animated.View
        style={{
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: bottomPad,
          gap: 10,
        }}
      >
        <View
          style={{
            borderRadius: radius.md,
            backgroundColor: 'rgba(7,6,13,0.55)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
            paddingHorizontal: 14,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <TextInput
            ref={inputRef}
            value={caption}
            onChangeText={(t) => setCaption(t.slice(0, MAX_CAPTION))}
            onSelectionChange={(e) => setCursor(e.nativeEvent.selection.end)}
            placeholder="Caption · @friends · #hashtags"
            placeholderTextColor="rgba(240,237,230,0.5)"
            multiline
            style={{
              flex: 1,
              minHeight: 22,
              maxHeight: 100,
              color: color.text.primary,
              fontSize: 15,
              fontWeight: '600',
              fontFamily: fontFamily.body,
              lineHeight: 20,
            }}
          />
          {caption.length > 0 ? (
            <Text style={{ color: 'rgba(240,237,230,0.6)', fontSize: 10 }}>
              {caption.length}/{MAX_CAPTION}
            </Text>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => { haptic.tap(); setMode('pick'); setMediaUrl(null); }}
              style={({ pressed }) => ({
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: radius.pill,
                backgroundColor: 'rgba(7,6,13,0.5)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ color: color.text.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>
                ← CHANGE
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={submit}
            disabled={busy}
            style={({ pressed }) => ({
              paddingVertical: 12,
              paddingHorizontal: 22,
              borderRadius: radius.pill,
              backgroundColor: color.violet,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: pressed || busy ? 0.7 : 1,
            })}
          >
            {busy ? (
              <ActivityIndicator size="small" color={color.text.primary} />
            ) : (
              <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800', letterSpacing: 0.5 }}>
                YOUR STORY  →
              </Text>
            )}
          </Pressable>
        </View>

        {error ? (
          <Text style={{ color: color.rose, fontSize: 12, textAlign: 'center' }}>{error}</Text>
        ) : null}
      </Animated.View>

      {/* Location editor sheet — a small centered modal the user taps through
          to set the location pill. Kept lightweight so we don't pull in a
          separate screen for one text field. */}
      {locationEditing ? (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(7,6,13,0.7)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: color.bg.elevated,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: color.stroke.mid,
              padding: 18,
              gap: 12,
            }}
          >
            <Micro size="sm" color={color.gold[500]}>📍 ADD A LOCATION</Micro>
            <TextInput
              autoFocus
              value={locationInput}
              onChangeText={(t) => setLocationInput(t.slice(0, MAX_LOCATION))}
              placeholder="Zamalek, Cairo · Six Eight"
              placeholderTextColor={color.text.muted}
              style={{
                padding: 10,
                borderRadius: radius.md,
                backgroundColor: color.bg.base,
                borderWidth: 1,
                borderColor: locationInput.length > 0 ? color.gold[500] : color.stroke.soft,
                color: color.text.primary,
                fontSize: 14,
                fontFamily: fontFamily.body,
              }}
              returnKeyType="done"
              onSubmitEditing={() => {
                setLocation(locationInput.trim() || null);
                setLocationEditing(false);
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {location ? (
                <Pressable
                  onPress={() => { setLocation(null); setLocationEditing(false); haptic.tap(); }}
                  style={({ pressed }) => ({
                    flex: 1, paddingVertical: 10,
                    borderRadius: radius.pill,
                    borderWidth: 1, borderColor: color.rose,
                    alignItems: 'center',
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <Text style={{ color: color.rose, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>REMOVE</Text>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => setLocationEditing(false)}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 10,
                  borderRadius: radius.pill,
                  borderWidth: 1, borderColor: color.stroke.mid,
                  alignItems: 'center',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text style={{ color: color.text.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setLocation(locationInput.trim() || null);
                  setLocationEditing(false);
                  haptic.success();
                }}
                style={({ pressed }) => ({
                  flex: 1, paddingVertical: 10,
                  borderRadius: radius.pill,
                  backgroundColor: color.gold[500],
                  alignItems: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ color: color.text.inverse, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>SET</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

// ── Subcomponents ────────────────────────────────────────────────

const SourceRow: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  tint?: 'violet' | 'gold';
}> = ({ icon, title, subtitle, onPress, tint = 'gold' }) => {
  const tintColor = tint === 'violet' ? color.violet : color.gold[500];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: radius.lg,
        backgroundColor: color.bg.surface,
        borderWidth: 1,
        borderColor: color.stroke.soft,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View
        style={{
          width: 52, height: 52, borderRadius: radius.md,
          backgroundColor: tint === 'violet' ? 'rgba(139,63,255,0.14)' : 'rgba(212,168,67,0.14)',
          borderWidth: 1, borderColor: tint === 'violet' ? 'rgba(139,63,255,0.3)' : 'rgba(212,168,67,0.3)',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 24, lineHeight: 28 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800', letterSpacing: 0.4 }}>{title}</Text>
        <Text style={{ color: color.text.muted, fontSize: 12, marginTop: 3, fontFamily: fontFamily.body }}>
          {subtitle}
        </Text>
      </View>
      <Text style={{ color: color.text.muted, fontSize: 22, lineHeight: 24 }}>›</Text>
    </Pressable>
  );
};

const ToolButton: React.FC<{ icon: string; onPress: () => void; active?: boolean }> = ({ icon, onPress, active }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: active ? 'rgba(212,168,67,0.25)' : 'rgba(7,6,13,0.55)',
      borderWidth: 1,
      borderColor: active ? color.gold[500] : 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: pressed ? 0.7 : 1,
    })}
  >
    <Text style={{ fontSize: 18, color: color.text.primary }}>{icon}</Text>
  </Pressable>
);

export default StoryComposer;
