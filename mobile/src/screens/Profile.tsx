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
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily, gradient } from '../theme/tokens';
import {
  Button,
  Micro,
  Body,
  BackButton,
  StepsBar,
  DisplayHeadline,
} from '../components';
import { api, ApiError, type City, type LaylaUser } from '../lib/api';

// Port of Claude Design Files/onboarding-v2.jsx lines 151–229.
// Profile step of onboarding: name, age, city, vibes (min 3 of 12).

type Props = {
  token: string;
  initial?: Partial<LaylaUser>;
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

// Backend expects YYYY-MM-DD. Convert Date → ISO date without timezone drift.
const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const computeAge = (birthdate: Date): number => {
  const now = new Date();
  let age = now.getFullYear() - birthdate.getFullYear();
  const m = now.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthdate.getDate())) age -= 1;
  return age;
};

const DEFAULT_BIRTHDATE = (() => {
  // Default the picker to 25 years ago — common onboarding default.
  const d = new Date();
  d.setFullYear(d.getFullYear() - 25);
  return d;
})();

const MAX_BIRTHDATE = (() => {
  // No one under 18.
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE);
  return d;
})();

const MIN_BIRTHDATE = new Date(1905, 0, 1);

const formatBirthdate = (d: Date): string => {
  // "15 Mar 2001" — human-readable, locale-safe for Egyptian users.
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const Profile: React.FC<Props> = ({ token, initial, onBack, onSaved }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [birthdate, setBirthdate] = useState<Date | null>(
    initial?.birthdate ? new Date(initial.birthdate) : null,
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tempPick, setTempPick] = useState<Date>(DEFAULT_BIRTHDATE);
  const [city, setCity] = useState<City | null>(initial?.city ?? null);
  const [vibes, setVibes] = useState<string[]>(initial?.vibes ?? []);
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

  const toggleVibe = (v: string) => {
    setVibes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const pickCity = () => {
    const labels = CITIES.map((c) => `${c.emoji}  ${c.label}`);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...labels, 'Cancel'],
        cancelButtonIndex: labels.length,
        userInterfaceStyle: 'dark',
      },
      (idx) => {
        if (idx < labels.length) setCity(CITIES[idx]!.value);
      },
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
      const msg = err instanceof ApiError ? err.message : 'Network error. Check backend.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const openBirthdatePicker = () => {
    setTempPick(birthdate ?? DEFAULT_BIRTHDATE);
    setPickerOpen(true);
  };

  const selectedCity = CITIES.find((c) => c.value === city);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: color.bg.base }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <BackButton onPress={onBack} />
          <StepsBar total={4} current={2} />
          <Micro size="xs" color={color.text.muted}>3/4</Micro>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Micro size="sm" color={color.gold[500]}>YOUR PROFILE</Micro>
          <DisplayHeadline
            lines={['WHO ARE', 'YOU?']}
            size={36}
            lineHeightRatio={0.95}
            letterSpacingEm={0.02}
            style={{ marginTop: 6, marginBottom: 20 }}
          />

          <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>NAME</Micro>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Yasmin R."
            placeholderTextColor={color.text.muted}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1.5,
              borderColor: color.gold[500],
              color: color.text.primary,
              fontSize: 15,
              fontWeight: '600',
              marginBottom: 14,
            }}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
            <View style={{ flex: 1.2 }}>
              <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>BIRTHDATE</Micro>
              <Pressable
                onPress={openBirthdatePicker}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.stroke.soft,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: birthdate ? color.text.primary : color.text.muted,
                    fontSize: 15,
                    fontWeight: '600',
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
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: radius.md,
                  backgroundColor: color.bg.surface,
                  borderWidth: 1,
                  borderColor: color.stroke.soft,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{ color: selectedCity ? color.text.primary : color.text.muted, fontSize: 15, fontWeight: '600' }}
                >
                  {selectedCity ? `${selectedCity.emoji} ${selectedCity.label}` : 'Select…'}
                </Text>
                <Text style={{ color: color.text.muted }}>⌄</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <Micro size="sm" color={color.gold[500]}>YOUR VIBE</Micro>
            <Micro size="xs" color={color.text.muted}>
              {vibes.length} SELECTED · MIN {MIN_VIBES}
            </Micro>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {VIBES.map((v) => {
              const on = vibes.includes(v);
              const pill = (
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: radius.pill,
                    backgroundColor: on ? 'transparent' : 'rgba(255,255,255,0.04)',
                    borderWidth: on ? 0 : 1,
                    borderColor: color.stroke.soft,
                  }}
                >
                  <Text
                    style={{
                      color: on ? color.text.inverse : color.text.secondary,
                      fontSize: 12,
                      fontWeight: on ? '800' : '500',
                    }}
                  >
                    {v}
                  </Text>
                </View>
              );
              return (
                <Pressable key={v} onPress={() => toggleVibe(v)}>
                  {on ? (
                    <LinearGradient
                      colors={gradient.gold.colors}
                      start={gradient.gold.start}
                      end={gradient.gold.end}
                      style={{ borderRadius: radius.pill }}
                    >
                      {pill}
                    </LinearGradient>
                  ) : (
                    pill
                  )}
                </Pressable>
              );
            })}
          </View>

          {error ? (
            <Body size="sm" color={color.rose} style={{ marginTop: 12 }}>{error}</Body>
          ) : null}
        </ScrollView>

        <Button variant="gold" disabled={!valid} loading={busy} onPress={submit}>
          CONTINUE →
        </Button>
      </SafeAreaView>

      {/* Birthdate picker — iOS wheel inside a bottom-sheet modal. Confirm/cancel
          control the commit so an accidental scroll doesn't save. */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable onPress={() => setPickerOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(7,6,13,0.6)' }} />
        <View
          style={{
            backgroundColor: color.bg.elevated,
            borderTopLeftRadius: radius.xxl,
            borderTopRightRadius: radius.xxl,
            paddingTop: 12,
            paddingBottom: 32,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: color.stroke.mid }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
            <Pressable onPress={() => setPickerOpen(false)}>
              <Text style={{ color: color.text.secondary, fontSize: 14, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
            <Micro size="sm" color={color.gold[500]}>BIRTHDATE</Micro>
            <Pressable
              onPress={() => {
                setBirthdate(tempPick);
                setPickerOpen(false);
              }}
            >
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

export default Profile;
