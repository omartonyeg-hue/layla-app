import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, Button, BackButton, DisplayHeadline } from '../components';
import { resolveGradient } from '../lib/gradients';
import { api, ApiError, type PartyTheme, type PartyDetail } from '../lib/api';

type Props = {
  token: string;
  onBack: () => void;
  onCreated: (party: PartyDetail) => void;
};

const THEME_PRESETS: { value: PartyTheme; label: string; emoji: string; gradient: string }[] = [
  { value: 'ROOFTOP',     label: 'Rooftop',     emoji: '🌅', gradient: 'sunset'    },
  { value: 'UNDERGROUND', label: 'Underground', emoji: '🌑', gradient: 'night'     },
  { value: 'POOL',        label: 'Pool',        emoji: '🏊', gradient: 'valet'     },
  { value: 'BEACH',       label: 'Beach',       emoji: '🏖️', gradient: 'sunset'    },
  { value: 'LOFT',        label: 'Loft',        emoji: '🌙', gradient: 'night'     },
  { value: 'HOUSE',       label: 'House',       emoji: '🏠', gradient: 'community' },
];

const TAG_OPTIONS = ['TONIGHT', 'STRICT DOOR', 'NEW HOST'] as const;

export const CreateParty: React.FC<Props> = ({ token, onBack, onCreated }) => {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [doorDetail, setDoorDetail] = useState('');
  const [theme, setTheme] = useState<PartyTheme>('ROOFTOP');
  const [startsAt, setStartsAt] = useState<Date>(() => {
    // Default: tomorrow at 10pm.
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(22, 0, 0, 0);
    return d;
  });
  const [tempDate, setTempDate] = useState<Date>(startsAt);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [cap, setCap] = useState('22');
  const [rulesText, setRulesText] = useState('18+ only\nGuest list only');
  const [tag, setTag] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preset = THEME_PRESETS.find((t) => t.value === theme)!;
  const gradientKey = preset.gradient;
  const emoji = preset.emoji;

  const valid = useMemo(
    () =>
      title.trim().length >= 2 &&
      neighborhood.trim().length >= 2 &&
      address.trim().length >= 2 &&
      Number(cap) >= 2,
    [title, neighborhood, address, cap],
  );

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    try {
      const rules = rulesText
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
      const { party } = await api.createParty(token, {
        title: title.trim(),
        theme,
        emoji,
        gradient: gradientKey,
        neighborhood: neighborhood.trim(),
        address: address.trim(),
        doorDetail: doorDetail.trim() || undefined,
        startsAt: startsAt.toISOString(),
        cap: Number(cap),
        rules,
        tag,
      });
      onCreated(party);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const grad = resolveGradient(gradientKey);

  const formatDate = (d: Date) =>
    `${d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: color.bg.base }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.rose}>HOST A PARTY</Micro>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 4 }}>
          <DisplayHeadline lines={['NEW NIGHT.']} size={36} lineHeightRatio={1.0} letterSpacingEm={0.02} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, gap: 14 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Live preview band */}
          <LinearGradient
            colors={grad.colors}
            start={grad.start}
            end={grad.end}
            style={{ height: 96, borderRadius: radius.md, padding: 14, justifyContent: 'space-between' }}
          >
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
            <Text numberOfLines={1} style={{ color: color.text.primary, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 }}>
              {title.trim() ? title.toUpperCase() : 'YOUR PARTY TITLE'}
            </Text>
          </LinearGradient>

          {/* Title */}
          <Field label="TITLE">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Afterparty Zamalek"
              placeholderTextColor={color.text.muted}
              style={inputStyle}
            />
          </Field>

          {/* Theme picker */}
          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>THEME</Micro>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {THEME_PRESETS.map((t) => {
                const on = t.value === theme;
                return (
                  <Pressable
                    key={t.value}
                    onPress={() => setTheme(t.value)}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      paddingHorizontal: 12, paddingVertical: 8,
                      borderRadius: radius.pill,
                      backgroundColor: on ? 'rgba(255,61,107,0.12)' : 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: on ? color.rose : color.stroke.soft,
                    }}
                  >
                    <Text style={{ fontSize: 14 }}>{t.emoji}</Text>
                    <Text style={{ color: on ? color.rose : color.text.primary, fontSize: 12, fontWeight: on ? '800' : '600', lineHeight: 16 }}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Neighborhood + Cap */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 2 }}>
              <Field label="NEIGHBORHOOD">
                <TextInput value={neighborhood} onChangeText={setNeighborhood} placeholder="Zamalek · Cairo" placeholderTextColor={color.text.muted} style={inputStyle} />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="CAP">
                <TextInput
                  value={cap}
                  onChangeText={(t) => setCap(t.replace(/\D/g, '').slice(0, 4))}
                  placeholder="22"
                  placeholderTextColor={color.text.muted}
                  keyboardType="number-pad"
                  style={[inputStyle, { fontFamily: fontFamily.mono, fontWeight: '800' }]}
                />
              </Field>
            </View>
          </View>

          {/* Address */}
          <Field label="ADDRESS">
            <TextInput value={address} onChangeText={setAddress} placeholder="14 Abu El Feda St., Apt 8" placeholderTextColor={color.text.muted} style={inputStyle} />
          </Field>
          <Field label="DOOR DETAIL · OPTIONAL">
            <TextInput value={doorDetail} onChangeText={setDoorDetail} placeholder="Building with blue door" placeholderTextColor={color.text.muted} style={inputStyle} />
          </Field>

          {/* Date */}
          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>STARTS</Micro>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => { setTempDate(startsAt); setPickerMode('date'); setPickerOpen(true); }}
                style={[fieldFrame, { flex: 1.5 }]}
              >
                <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700' }}>
                  {startsAt.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { setTempDate(startsAt); setPickerMode('time'); setPickerOpen(true); }}
                style={[fieldFrame, { flex: 1 }]}
              >
                <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700', fontFamily: fontFamily.mono }}>
                  {startsAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Tag */}
          <View>
            <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>TAG · OPTIONAL</Micro>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {(['', ...TAG_OPTIONS] as const).map((t) => {
                const on = (tag ?? '') === t;
                const label = t === '' ? 'None' : t;
                return (
                  <Pressable
                    key={t || 'none'}
                    onPress={() => setTag(t === '' ? null : t)}
                    style={{
                      paddingHorizontal: 12, paddingVertical: 8,
                      borderRadius: radius.pill,
                      backgroundColor: on ? color.rose : 'rgba(255,255,255,0.04)',
                      borderWidth: 1,
                      borderColor: on ? color.rose : color.stroke.soft,
                    }}
                  >
                    <Text style={{ color: on ? color.text.primary : color.text.secondary, fontSize: 11, fontWeight: '800', letterSpacing: 1, lineHeight: 14 }}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Rules */}
          <Field label="HOUSE RULES · ONE PER LINE">
            <TextInput
              value={rulesText}
              onChangeText={setRulesText}
              placeholder={'18+ only\nNo phones on the dancefloor'}
              placeholderTextColor={color.text.muted}
              multiline
              style={[inputStyle, { minHeight: 100, textAlignVertical: 'top', lineHeight: 20 }]}
            />
          </Field>

          {error ? <Body color={color.rose}>{error}</Body> : null}
          <Body size="sm" style={{ textAlign: 'center', marginTop: 4 }}>
            Starts at {formatDate(startsAt)} · cap {cap || '—'}.
          </Body>
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="night" disabled={!valid} loading={busy} onPress={submit}>
            CREATE PARTY →
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
            <Micro size="sm" color={color.rose}>{pickerMode === 'date' ? 'DATE' : 'TIME'}</Micro>
            <Pressable onPress={() => { setStartsAt(tempDate); setPickerOpen(false); }}>
              <Text style={{ color: color.rose, fontSize: 14, fontWeight: '800' }}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={tempDate}
            mode={pickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            themeVariant="dark"
            onChange={(_, d) => {
              if (d) setTempDate(d);
              if (Platform.OS !== 'ios') {
                setStartsAt(d ?? tempDate);
                setPickerOpen(false);
              }
            }}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const inputStyle = {
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderRadius: radius.md,
  backgroundColor: color.bg.surface,
  borderWidth: 1,
  borderColor: color.stroke.soft,
  color: color.text.primary,
  fontSize: 14,
  fontWeight: '600' as const,
  fontFamily: fontFamily.body,
};

const fieldFrame = {
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderRadius: radius.md,
  backgroundColor: color.bg.surface,
  borderWidth: 1,
  borderColor: color.stroke.soft,
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View>
    <Micro size="sm" color={color.text.muted} style={{ marginBottom: 6 }}>{label}</Micro>
    {children}
  </View>
);

export default CreateParty;
