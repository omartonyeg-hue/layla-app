import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color, radius, fontFamily, gradient } from '../theme/tokens';
import { Button, Micro, Body, BackButton, DisplayHeadline } from '../components';
import { api, ApiError, type City, type LaylaUser } from '../lib/api';

// Edit-profile mirror of the Profile onboarding step. Same backend endpoint
// (PATCH /users/me/profile), but standalone — no step indicator, lets you
// drop in from Settings any time.

type Props = {
  token: string;
  initial: LaylaUser;
  onBack: () => void;
  onSaved: (user: LaylaUser) => void;
};

const VIBES = [
  'House', 'Techno', 'Afro', 'Arabic',
  'Rooftop', 'Underground', 'Beach', 'Pool',
  'Lounge', 'Chill', 'Hip-Hop', 'R&B',
];

const CITIES: { value: City; label: string; emoji: string }[] = [
  { value: 'CAIRO',      label: 'Cairo',      emoji: '🏙️' },
  { value: 'ALEXANDRIA', label: 'Alexandria', emoji: '🌊' },
  { value: 'SAHEL',      label: 'Sahel',      emoji: '🏖️' },
  { value: 'GOUNA',      label: 'El Gouna',   emoji: '⛵' },
  { value: 'SHARM',      label: 'Sharm',      emoji: '🐠' },
  { value: 'HURGHADA',   label: 'Hurghada',   emoji: '🌴' },
];

const MIN_VIBES = 3;
const MIN_AGE = 18;

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const computeAge = (d: Date): number => {
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
};

const formatBirthdate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const MAX_BIRTHDATE = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - MIN_AGE); return d; })();
const MIN_BIRTHDATE = new Date(1905, 0, 1);
const DEFAULT_BIRTHDATE = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 25); return d; })();

export const ProfileEdit: React.FC<Props> = ({ token, initial, onBack, onSaved }) => {
  const [name, setName] = useState(initial.name ?? '');
  const [birthdate, setBirthdate] = useState<Date | null>(initial.birthdate ? new Date(initial.birthdate) : null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tempPick, setTempPick] = useState<Date>(DEFAULT_BIRTHDATE);
  const [city, setCity] = useState<City | null>(initial.city ?? null);
  const [vibes, setVibes] = useState<string[]>(initial.vibes ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const age = birthdate ? computeAge(birthdate) : null;
  const valid = useMemo(
    () =>
      name.trim().length > 0 &&
      age !== null && age >= MIN_AGE && age <= 120 &&
      city !== null &&
      vibes.length >= MIN_VIBES,
    [name, age, city, vibes.length],
  );

  const toggleVibe = (v: string) =>
    setVibes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const pickCity = () => {
    const labels = CITIES.map((c) => `${c.emoji}  ${c.label}`);
    ActionSheetIOS.showActionSheetWithOptions(
      { options: [...labels, 'Cancel'], cancelButtonIndex: labels.length, userInterfaceStyle: 'dark' },
      (idx) => { if (idx < labels.length) setCity(CITIES[idx]!.value); },
    );
  };

  const submit = async () => {
    if (!valid || busy || !city || !birthdate) return;
    setBusy(true);
    setError(null);
    try {
      const { user } = await api.updateProfile(token, {
        name: name.trim(),
        birthdate: toIsoDate(birthdate),
        city,
        vibes,
      });
      onSaved(user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const selectedCity = CITIES.find((c) => c.value === city);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: color.bg.base }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.gold[500]}>EDIT PROFILE</Micro>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 4 }}>
          <DisplayHeadline lines={['REFINE.']} size={36} lineHeightRatio={1.0} letterSpacingEm={0.02} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>NAME</Micro>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Yasmin R."
            placeholderTextColor={color.text.muted}
            style={{
              paddingHorizontal: 14, paddingVertical: 12,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1.5, borderColor: color.gold[500],
              color: color.text.primary, fontSize: 15, fontWeight: '600',
              marginBottom: 14,
            }}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
            <View style={{ flex: 1.2 }}>
              <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>BIRTHDATE</Micro>
              <Pressable
                onPress={() => { setTempPick(birthdate ?? DEFAULT_BIRTHDATE); setPickerOpen(true); }}
                style={{
                  paddingHorizontal: 14, paddingVertical: 12,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1, borderColor: color.stroke.soft,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: birthdate ? color.text.primary : color.text.muted,
                    fontSize: 15, fontWeight: '600',
                    fontFamily: birthdate ? fontFamily.mono : fontFamily.body,
                  }}
                >
                  {birthdate ? formatBirthdate(birthdate) : 'Select…'}
                </Text>
                {age !== null ? (
                  <Text style={{ color: color.gold[500], fontSize: 12, fontWeight: '700' }}>{age}</Text>
                ) : (
                  <Text style={{ color: color.text.muted }}>⌄</Text>
                )}
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>CITY</Micro>
              <Pressable
                onPress={pickCity}
                style={{
                  paddingHorizontal: 14, paddingVertical: 12,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1, borderColor: color.stroke.soft,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: selectedCity ? color.text.primary : color.text.muted, fontSize: 15, fontWeight: '600' }}>
                  {selectedCity ? `${selectedCity.emoji} ${selectedCity.label}` : 'Select…'}
                </Text>
                <Text style={{ color: color.text.muted }}>⌄</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <Micro size="sm" color={color.gold[500]}>YOUR VIBE</Micro>
            <Micro size="xs" color={color.text.muted}>{vibes.length} SELECTED · MIN {MIN_VIBES}</Micro>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {VIBES.map((v) => {
              const on = vibes.includes(v);
              const pill = (
                <View
                  style={{
                    paddingHorizontal: 12, paddingVertical: 7,
                    borderRadius: radius.pill,
                    backgroundColor: on ? 'transparent' : 'rgba(255,255,255,0.04)',
                    borderWidth: on ? 0 : 1,
                    borderColor: color.stroke.soft,
                  }}
                >
                  <Text style={{ color: on ? color.text.inverse : color.text.secondary, fontSize: 12, fontWeight: on ? '800' : '500', lineHeight: 16 }}>
                    {v}
                  </Text>
                </View>
              );
              return (
                <Pressable key={v} onPress={() => toggleVibe(v)}>
                  {on ? (
                    <LinearGradient colors={gradient.gold.colors} start={gradient.gold.start} end={gradient.gold.end} style={{ borderRadius: radius.pill }}>
                      {pill}
                    </LinearGradient>
                  ) : pill}
                </Pressable>
              );
            })}
          </View>

          {error ? <Body size="sm" color={color.rose} style={{ marginTop: 12 }}>{error}</Body> : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="gold" disabled={!valid} loading={busy} onPress={submit}>
            SAVE CHANGES
          </Button>
        </View>
      </SafeAreaView>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable onPress={() => setPickerOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(7,6,13,0.6)' }} />
        <View style={{ backgroundColor: color.bg.elevated, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, paddingTop: 12, paddingBottom: 32, paddingHorizontal: 16 }}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: color.stroke.mid }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
            <Pressable onPress={() => setPickerOpen(false)}>
              <Text style={{ color: color.text.secondary, fontSize: 14, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
            <Micro size="sm" color={color.gold[500]}>BIRTHDATE</Micro>
            <Pressable onPress={() => { setBirthdate(tempPick); setPickerOpen(false); }}>
              <Text style={{ color: color.gold[500], fontSize: 14, fontWeight: '800' }}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={tempPick}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={MAX_BIRTHDATE}
            minimumDate={MIN_BIRTHDATE}
            themeVariant="dark"
            onChange={(_, d) => {
              if (d) setTempPick(d);
              if (Platform.OS !== 'ios') {
                setBirthdate(d ?? null);
                setPickerOpen(false);
              }
            }}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ProfileEdit;
