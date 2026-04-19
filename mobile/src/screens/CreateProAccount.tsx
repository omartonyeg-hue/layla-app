import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline } from '../components';
import {
  api,
  ApiError,
  type Account,
  type AccountKind,
  type City,
} from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { useKeyboardHeight } from '../lib/useKeyboardHeight';
import { haptic } from '../lib/haptics';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProAccount'>;

const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;
const CITIES: City[] = ['CAIRO', 'ALEXANDRIA', 'SAHEL', 'GOUNA', 'SHARM', 'HURGHADA'];
const KIND_OPTIONS: { kind: Exclude<AccountKind, 'USER'>; title: string; blurb: string; icon: string }[] = [
  { kind: 'VENUE', title: 'Venue', blurb: 'Club, bar, rooftop, event space.', icon: '◎' },
  { kind: 'DJ', title: 'DJ / Artist', blurb: 'Performer with sets to promote.', icon: '🎧' },
  { kind: 'ORGANIZER', title: 'Organizer', blurb: 'Promoter, collective, label.', icon: '✦' },
];

export const CreateProAccount: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  const [existing, setExisting] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<'pick' | 'form'>('pick');
  const [kind, setKind] = useState<Exclude<AccountKind, 'USER'> | null>(null);
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState<City | null>(null);
  const [address, setAddress] = useState('');
  const [links, setLinks] = useState('');
  const [note, setNote] = useState('');
  const [handleAvailable, setHandleAvailable] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { otherAccounts } = await api.getMyAccount(token);
        setExisting(otherAccounts);
      } catch { /* no-op */ }
      finally { setLoading(false); }
    })();
  }, [token]);

  useEffect(() => {
    const normalized = handle.toLowerCase();
    if (!HANDLE_REGEX.test(normalized)) { setHandleAvailable(null); return; }
    setChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.checkHandleAvailable(token, normalized);
        setHandleAvailable(res.available);
      } catch { setHandleAvailable(null); }
      finally { setChecking(false); }
    }, 350);
    return () => clearTimeout(t);
  }, [handle, token]);

  const canSubmit = kind && HANDLE_REGEX.test(handle.toLowerCase()) && handleAvailable === true
    && displayName.trim().length > 0;

  const submit = async () => {
    if (!canSubmit || !kind || submitting) return;
    setSubmitting(true);
    setError(null);
    haptic.press();
    try {
      const linkList = links
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      await api.createAccount(token, {
        kind,
        handle: handle.toLowerCase(),
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
        applicationCity: city ?? undefined,
        applicationAddress: address.trim() || undefined,
        applicationLinks: linkList.length > 0 ? linkList : undefined,
        applicationNote: note.trim() || undefined,
      });
      toast.show({ message: 'Application submitted — we\'ll review within 48h.', tone: 'violet', icon: '◆' });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

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
            onPress={() => {
              haptic.tap();
              if (step === 'form') { setStep('pick'); setKind(null); }
              else navigation.goBack();
            }}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: color.bg.surface,
              borderWidth: 1, borderColor: color.stroke.soft,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: color.text.primary, fontSize: 18, lineHeight: 20 }}>
              {step === 'form' ? '‹' : '×'}
            </Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>PROFESSIONAL ACCOUNT</Micro>
            <DisplayHeadline
              lines={step === 'pick' ? ['APPLY'] : [kind?.toUpperCase() ?? 'APPLY']}
              size={28}
              lineHeightRatio={1.0}
              letterSpacingEm={0.03}
              style={{ marginTop: 2 }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 18 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator color={color.violet} style={{ marginTop: 40 }} />
          ) : existing.length > 0 ? (
            <View>
              <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>YOUR PROFESSIONAL ACCOUNTS</Micro>
              {existing.map((a) => (
                <View
                  key={a.id}
                  style={{
                    padding: 14,
                    marginBottom: 10,
                    borderRadius: radius.md,
                    backgroundColor: color.bg.surface,
                    borderWidth: 1,
                    borderColor: color.stroke.soft,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
                      {a.displayName}
                    </Text>
                    <Text style={{ color: color.violet, fontSize: 12 }}>@{a.handle}</Text>
                  </View>
                  <Text
                    style={{
                      marginTop: 6,
                      color: a.status === 'ACTIVE' ? color.teal : a.status === 'PENDING_REVIEW' ? color.gold[500] : color.rose,
                      fontSize: 11,
                      fontWeight: '800',
                      letterSpacing: 0.6,
                    }}
                  >
                    {a.kind} · {a.status.replace('_', ' ')}
                  </Text>
                  {a.status === 'PENDING_REVIEW' ? (
                    <Body size="sm" style={{ marginTop: 6 }}>
                      We review professional accounts manually — typically within 48 hours.
                    </Body>
                  ) : null}
                </View>
              ))}
              <Body size="sm" style={{ marginTop: 8 }}>
                You can apply for one of each kind (Venue, DJ, Organizer).
              </Body>
            </View>
          ) : null}

          {step === 'pick' ? (
            <View style={{ gap: 10 }}>
              <Micro size="sm" color={color.text.muted} style={{ marginBottom: 2 }}>WHAT KIND?</Micro>
              {KIND_OPTIONS.map((opt) => {
                const already = existing.find((a) => a.kind === opt.kind);
                const disabled = !!already;
                return (
                  <Pressable
                    key={opt.kind}
                    onPress={() => {
                      if (disabled) return;
                      haptic.tap();
                      setKind(opt.kind);
                      setStep('form');
                    }}
                    disabled={disabled}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      padding: 14,
                      borderRadius: radius.md,
                      backgroundColor: color.bg.surface,
                      borderWidth: 1,
                      borderColor: color.stroke.soft,
                      opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={{ fontSize: 24 }}>{opt.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: color.text.primary, fontSize: 15, fontWeight: '800' }}>{opt.title}</Text>
                      <Body size="sm" style={{ marginTop: 3 }}>{opt.blurb}</Body>
                    </View>
                    <Text style={{ color: color.text.muted, fontSize: 18 }}>›</Text>
                  </Pressable>
                );
              })}
              <Body size="sm" style={{ marginTop: 4 }}>
                All professional accounts are reviewed by LAYLA admins before going live.
              </Body>
            </View>
          ) : (
            <>
              <View>
                <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>USERNAME</Micro>
                <View
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    borderRadius: radius.md,
                    backgroundColor: color.bg.surface,
                    borderWidth: 1.5,
                    borderColor:
                      handleAvailable === true ? color.teal
                        : handleAvailable === false ? color.rose
                        : color.stroke.soft,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ color: color.text.muted, fontSize: 15, fontWeight: '700' }}>@</Text>
                  <TextInput
                    value={handle}
                    onChangeText={(t) => setHandle(t.toLowerCase().slice(0, 20))}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="cjc_cairo"
                    placeholderTextColor={color.text.muted}
                    style={{
                      flex: 1, paddingVertical: 12, paddingHorizontal: 4,
                      color: color.text.primary, fontSize: 15, fontFamily: fontFamily.body,
                    }}
                  />
                  {checking ? <ActivityIndicator size="small" color={color.violet} />
                    : handleAvailable === true ? <Text style={{ color: color.teal, fontSize: 14, fontWeight: '800' }}>✓</Text>
                    : handleAvailable === false ? <Text style={{ color: color.rose, fontSize: 14, fontWeight: '800' }}>×</Text>
                    : null}
                </View>
              </View>

              <View>
                <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>DISPLAY NAME</Micro>
                <TextInput
                  value={displayName}
                  onChangeText={(t) => setDisplayName(t.slice(0, 60))}
                  placeholder={kind === 'VENUE' ? 'CJC' : kind === 'DJ' ? 'DJ Karim' : 'Scene Sahel'}
                  placeholderTextColor={color.text.muted}
                  style={fieldStyle(displayName.length > 0)}
                />
              </View>

              <View>
                <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>BIO · OPTIONAL</Micro>
                <TextInput
                  value={bio}
                  onChangeText={(t) => setBio(t.slice(0, 160))}
                  placeholder="What makes this account worth following."
                  placeholderTextColor={color.text.muted}
                  multiline
                  style={{ ...fieldStyle(bio.length > 0), minHeight: 70, textAlignVertical: 'top', lineHeight: 20 }}
                />
              </View>

              {kind === 'VENUE' ? (
                <>
                  <View>
                    <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>CITY</Micro>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                      {CITIES.map((c) => {
                        const active = city === c;
                        return (
                          <Pressable
                            key={c}
                            onPress={() => { haptic.tap(); setCity(active ? null : c); }}
                            style={{
                              paddingHorizontal: 14, paddingVertical: 9,
                              borderRadius: radius.pill,
                              backgroundColor: active ? 'rgba(212,168,67,0.14)' : color.bg.surface,
                              borderWidth: 1,
                              borderColor: active ? color.gold[500] : color.stroke.soft,
                            }}
                          >
                            <Text style={{
                              color: active ? color.gold[500] : color.text.primary,
                              fontSize: 12, fontWeight: active ? '800' : '600',
                            }}>
                              {c.charAt(0) + c.slice(1).toLowerCase()}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                  <View>
                    <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>ADDRESS · OPTIONAL</Micro>
                    <TextInput
                      value={address}
                      onChangeText={(t) => setAddress(t.slice(0, 200))}
                      placeholder="26th of July, Zamalek"
                      placeholderTextColor={color.text.muted}
                      style={fieldStyle(address.length > 0)}
                    />
                  </View>
                </>
              ) : null}

              <View>
                <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>LINKS · OPTIONAL</Micro>
                <TextInput
                  value={links}
                  onChangeText={setLinks}
                  placeholder="instagram.com/... soundcloud.com/..."
                  placeholderTextColor={color.text.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={fieldStyle(links.length > 0)}
                />
                <Micro size="xs" color={color.text.muted} style={{ marginTop: 6 }}>
                  Space or comma separated. Up to 5.
                </Micro>
              </View>

              <View>
                <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>NOTE TO ADMINS · OPTIONAL</Micro>
                <TextInput
                  value={note}
                  onChangeText={(t) => setNote(t.slice(0, 500))}
                  placeholder="Anything that'll help us verify you."
                  placeholderTextColor={color.text.muted}
                  multiline
                  style={{ ...fieldStyle(note.length > 0), minHeight: 80, textAlignVertical: 'top', lineHeight: 20 }}
                />
              </View>

              {error ? <Body color={color.rose}>{error}</Body> : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {step === 'form' ? (
        <Animated.View
          style={{
            paddingHorizontal: 20, paddingTop: 12,
            paddingBottom: footerPaddingBottom,
            borderTopWidth: 1, borderTopColor: color.stroke.soft,
            backgroundColor: color.bg.base,
          }}
        >
          <Button variant="gold" loading={submitting} disabled={!canSubmit} onPress={submit}>
            SUBMIT FOR REVIEW →
          </Button>
        </Animated.View>
      ) : null}
    </View>
  );
};

const fieldStyle = (hasContent: boolean) => ({
  padding: 12,
  borderRadius: radius.md,
  backgroundColor: color.bg.surface,
  borderWidth: 1.5,
  borderColor: hasContent ? color.gold[500] : color.stroke.soft,
  color: color.text.primary,
  fontSize: 15,
  fontFamily: fontFamily.body,
});

export default CreateProAccount;
