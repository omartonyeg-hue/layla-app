import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Micro, Button, DisplayHeadline } from '../components';
import { api, ApiError } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { resolveGradient } from '../lib/gradients';
import { haptic } from '../lib/haptics';
import type { CommunityStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CommunityStackParamList, 'StoryComposer'>;

const GRADIENT_KEYS: { key: string; label: string }[] = [
  { key: 'night',     label: 'Night'    },
  { key: 'sunset',    label: 'Sunset'   },
  { key: 'community', label: 'Circle'   },
  { key: 'valet',     label: 'Cruise'   },
  { key: 'gold',      label: 'Signature'},
  { key: 'sahel',     label: 'Sahel'    },
];

const EMOJIS = ['🪩','🌙','🥂','🎧','✨','🔥','💫','🌊','🍸','🖤','💎','👑'];
const MAX_CAPTION = 160;

export const StoryComposer: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const [gradientKey, setGradientKey] = useState<string>('night');
  const [emoji, setEmoji] = useState<string>('🪩');
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const g = resolveGradient(gradientKey);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.createStory(token, {
        gradient: gradientKey,
        emoji,
        caption: caption.trim() || undefined,
      });
      toast.show({ message: 'Story posted — live for 24h', tone: 'violet', icon: '◆' });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.bg.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
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
            <Micro size="sm" color={color.violet}>NEW STORY · 24h</Micro>
            <DisplayHeadline
              lines={['YOUR MOOD']}
              size={28}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 18 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 240,
                height: 360,
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
                {caption.trim().length > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      left: 14,
                      right: 14,
                      bottom: 22,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: radius.md,
                        backgroundColor: 'rgba(7,6,13,0.55)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <Text
                        style={{
                          color: color.text.primary,
                          fontSize: 13,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        {caption.trim()}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </LinearGradient>
            </View>
          </View>

          {/* Gradient picker */}
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

          {/* Emoji picker */}
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

          {/* Caption */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Micro size="sm" color={color.text.muted}>CAPTION · OPTIONAL</Micro>
              <Micro size="xs" color={caption.length > MAX_CAPTION * 0.9 ? color.rose : color.text.muted}>
                {caption.length}/{MAX_CAPTION}
              </Micro>
            </View>
            <TextInput
              value={caption}
              onChangeText={(t) => setCaption(t.slice(0, MAX_CAPTION))}
              placeholder="One line, one mood."
              placeholderTextColor={color.text.muted}
              multiline
              style={{
                marginTop: 8,
                minHeight: 64,
                padding: 12,
                borderRadius: radius.md,
                backgroundColor: color.bg.surface,
                borderWidth: 1.5,
                borderColor: caption.length > 0 ? color.violet : color.stroke.soft,
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

        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="night" loading={busy} onPress={submit}>POST STORY →</Button>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default StoryComposer;
