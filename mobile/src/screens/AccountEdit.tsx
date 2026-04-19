import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { color, fontFamily, radius } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline, Avatar, MediaPickerSheet } from '../components';
import { api, ApiError, type MyAccount } from '../lib/api';
import { useSession } from '../lib/AuthContext';
import { useToast } from '../lib/toast';
import { useKeyboardHeight } from '../lib/useKeyboardHeight';
import { haptic } from '../lib/haptics';
import { pickAndUpload, type PickSource } from '../lib/upload';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountEdit'>;

const MAX_DISPLAY = 40;
const MAX_BIO = 160;
const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

export const AccountEdit: React.FC<Props> = ({ navigation }) => {
  const { token } = useSession();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();

  const [account, setAccount] = useState<MyAccount | null>(null);
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const [handleAvailable, setHandleAvailable] = useState<null | boolean>(null);
  const [handleReason, setHandleReason] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Avatar upload — optimistic: the URL is saved to Account via PATCH /me
  // as soon as Cloudinary returns. Separate from the Save button so users
  // don't lose their change if they navigate away after uploading.
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { account } = await api.getMyAccount(token);
        setAccount(account);
        setHandle(account.handle);
        setDisplayName(account.displayName);
        setBio(account.bio ?? '');
        setAvatarUrl(account.avatarUrl);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Network error');
      }
    })();
  }, [token]);

  const uploadAvatar = async (source: PickSource) => {
    if (uploadingAvatar) return;
    setUploadingAvatar(true);
    try {
      const asset = await pickAndUpload(token, source, 'avatar');
      if (!asset) return;
      const { account: updated } = await api.updateMyAccount(token, { avatarUrl: asset.url });
      setAvatarUrl(updated.avatarUrl);
      setAccount((prev) => (prev ? { ...prev, avatarUrl: updated.avatarUrl } : prev));
      toast.show({ message: 'Photo updated', tone: 'violet', icon: '✓' });
    } catch (err) {
      toast.show({
        message: err instanceof Error ? err.message : 'Upload failed',
        tone: 'rose',
        icon: '!',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Debounced handle availability check — fires after the user stops typing.
  useEffect(() => {
    if (!account) return;
    const normalized = handle.toLowerCase();
    if (normalized === account.handle) {
      setHandleAvailable(true);
      setHandleReason(null);
      return;
    }
    if (!HANDLE_REGEX.test(normalized)) {
      setHandleAvailable(false);
      setHandleReason('3-20 lowercase letters, digits, or underscores.');
      return;
    }
    setChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.checkHandleAvailable(token, normalized);
        setHandleAvailable(res.available);
        setHandleReason(res.available ? null : res.reason ?? 'That username is taken.');
      } catch {
        setHandleAvailable(null);
        setHandleReason(null);
      } finally {
        setChecking(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [handle, account, token]);

  const save = async () => {
    if (!account || saving) return;
    const normalized = handle.toLowerCase();
    if (!HANDLE_REGEX.test(normalized)) {
      setError('Username must be 3-20 lowercase letters, digits, or underscores.');
      return;
    }
    if (handleAvailable === false) {
      setError(handleReason ?? 'Username not available.');
      return;
    }
    setSaving(true);
    setError(null);
    haptic.press();
    try {
      const { account: updated } = await api.updateMyAccount(token, {
        handle: normalized,
        displayName: displayName.trim() || 'Member',
        bio: bio.trim() || null,
      });
      toast.show({ message: 'Saved', tone: 'violet', icon: '✓' });
      setAccount({ ...account, ...updated });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setSaving(false);
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
            <Micro size="sm" color={color.violet}>IDENTITY</Micro>
            <DisplayHeadline
              lines={['EDIT ACCOUNT']}
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
          {!account ? (
            <ActivityIndicator color={color.violet} style={{ marginTop: 40 }} />
          ) : (
            <>
              {/* Avatar tile */}
              <View style={{ alignItems: 'center', marginTop: 4 }}>
                <Pressable
                  onPress={() => { haptic.tap(); setPickerOpen(true); }}
                  disabled={uploadingAvatar}
                  style={({ pressed }) => ({
                    width: 112,
                    height: 112,
                    borderRadius: 56,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: color.stroke.mid,
                    backgroundColor: color.bg.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Avatar
                      name={displayName || 'U'}
                      color={account.avatarColor ?? color.gold[500]}
                      size={106}
                    />
                  )}
                  {uploadingAvatar ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(7,6,13,0.6)',
                      }}
                    >
                      <ActivityIndicator color={color.text.primary} />
                    </View>
                  ) : null}
                </Pressable>
                <Pressable
                  onPress={() => { haptic.tap(); setPickerOpen(true); }}
                  disabled={uploadingAvatar}
                  style={({ pressed }) => ({ marginTop: 10, opacity: pressed ? 0.6 : 1 })}
                >
                  <Text
                    style={{
                      color: color.violet,
                      fontSize: 12,
                      fontWeight: '800',
                      letterSpacing: 0.6,
                      fontFamily: fontFamily.body,
                    }}
                  >
                    CHANGE PHOTO
                  </Text>
                </Pressable>
              </View>

              {/* Username */}
              <View>
                <Micro size="sm" color={color.text.muted} style={{ marginBottom: 8 }}>USERNAME</Micro>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
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
                    placeholder="your_handle"
                    placeholderTextColor={color.text.muted}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      paddingHorizontal: 4,
                      color: color.text.primary,
                      fontSize: 15,
                      fontFamily: fontFamily.body,
                    }}
                  />
                  {checking ? (
                    <ActivityIndicator size="small" color={color.violet} />
                  ) : handleAvailable === true ? (
                    <Text style={{ color: color.teal, fontSize: 14, fontWeight: '800' }}>✓</Text>
                  ) : handleAvailable === false ? (
                    <Text style={{ color: color.rose, fontSize: 14, fontWeight: '800' }}>×</Text>
                  ) : null}
                </View>
                {handleReason ? (
                  <Micro size="xs" color={handleAvailable === false ? color.rose : color.text.muted} style={{ marginTop: 6 }}>
                    {handleReason}
                  </Micro>
                ) : null}
              </View>

              {/* Display name */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Micro size="sm" color={color.text.muted}>NAME</Micro>
                  <Micro size="xs" color={color.text.muted}>{displayName.length}/{MAX_DISPLAY}</Micro>
                </View>
                <TextInput
                  value={displayName}
                  onChangeText={(t) => setDisplayName(t.slice(0, MAX_DISPLAY))}
                  placeholder="Your name as shown on LAYLA"
                  placeholderTextColor={color.text.muted}
                  style={{
                    marginTop: 8,
                    padding: 12,
                    borderRadius: radius.md,
                    backgroundColor: color.bg.surface,
                    borderWidth: 1.5,
                    borderColor: displayName.length > 0 ? color.violet : color.stroke.soft,
                    color: color.text.primary,
                    fontSize: 15,
                    fontFamily: fontFamily.body,
                  }}
                />
              </View>

              {/* Bio */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Micro size="sm" color={color.text.muted}>BIO · OPTIONAL</Micro>
                  <Micro size="xs" color={bio.length > MAX_BIO * 0.9 ? color.rose : color.text.muted}>
                    {bio.length}/{MAX_BIO}
                  </Micro>
                </View>
                <TextInput
                  value={bio}
                  onChangeText={(t) => setBio(t.slice(0, MAX_BIO))}
                  placeholder="Couple of lines about yourself."
                  placeholderTextColor={color.text.muted}
                  multiline
                  style={{
                    marginTop: 8,
                    minHeight: 80,
                    padding: 12,
                    borderRadius: radius.md,
                    backgroundColor: color.bg.surface,
                    borderWidth: 1.5,
                    borderColor: bio.length > 0 ? color.violet : color.stroke.soft,
                    color: color.text.primary,
                    fontSize: 14,
                    fontFamily: fontFamily.body,
                    textAlignVertical: 'top',
                    lineHeight: 20,
                  }}
                />
              </View>

              {error ? <Body color={color.rose}>{error}</Body> : null}
            </>
          )}
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
        <Button variant="night" loading={saving} disabled={!account || handleAvailable === false} onPress={save}>
          SAVE →
        </Button>
      </Animated.View>

      <MediaPickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={uploadAvatar}
        title="CHANGE PROFILE PHOTO"
      />
    </View>
  );
};

export default AccountEdit;
