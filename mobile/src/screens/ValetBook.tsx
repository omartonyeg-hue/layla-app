import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline, MapDecor, SettingsButton } from '../components';
import { api, ApiError, type Ride } from '../lib/api';

type Props = {
  token: string;
  onOrdered: (ride: Ride) => void;
  onOpenSettings: () => void;
};

// Simple flat-fare model: 50 EGP base + 12 EGP/km. No surge.
const BASE_FARE = 50;
const PER_KM = 12;
const AVG_KMH = 38;

const estimate = (distanceKm: number) => ({
  fare: Math.round(BASE_FARE + distanceKm * PER_KM),
  etaMinutes: Math.max(8, Math.round((distanceKm / AVG_KMH) * 60)),
});

export const ValetBook: React.FC<Props> = ({ token, onOrdered, onOpenSettings }) => {
  const [pickup, setPickup] = useState('CJC Zamalek · 26th of July');
  const [dropoff, setDropoff] = useState('Home · Maadi St. 9');
  // Static distance for the demo — a real implementation would call the
  // Mapbox/Google directions API once both points resolve.
  const [distanceKm] = useState(14.2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fare, etaMinutes } = estimate(distanceKm);

  const order = async () => {
    if (busy || !pickup.trim() || !dropoff.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { ride } = await api.createRide(token, {
        pickupLabel: pickup.trim(),
        dropoffLabel: dropoff.trim(),
        distanceKm,
        etaMinutes,
        fareEgp: fare,
      });
      onOrdered(ride);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Micro size="sm" color={color.teal}>● LAYLA VALET · CAIRO</Micro>
            <DisplayHeadline
              lines={['BOOK A DRIVE.']}
              size={36}
              lineHeightRatio={1.0}
              letterSpacingEm={0.02}
              style={{ marginTop: 4 }}
            />
          </View>
          <SettingsButton onPress={onOpenSettings} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }} showsVerticalScrollIndicator={false}>
          <MapDecor height={200} showRoute showCar={false} />

          {/* Route card */}
          <View
            style={{
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center', paddingTop: 6 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color.teal }} />
                <View style={{ width: 1, flex: 1, backgroundColor: color.stroke.mid, marginVertical: 6 }} />
                <View style={{ width: 10, height: 10, backgroundColor: color.gold[500] }} />
              </View>
              <View style={{ flex: 1, gap: 14 }}>
                <View>
                  <Micro size="xs" color={color.text.muted}>PICKUP · NOW</Micro>
                  <TextInput
                    value={pickup}
                    onChangeText={setPickup}
                    placeholderTextColor={color.text.muted}
                    style={{
                      color: color.text.primary,
                      fontSize: 14,
                      fontWeight: '700',
                      marginTop: 2,
                      paddingVertical: 0,
                    }}
                  />
                </View>
                <View>
                  <Micro size="xs" color={color.text.muted}>DROPOFF</Micro>
                  <TextInput
                    value={dropoff}
                    onChangeText={setDropoff}
                    placeholderTextColor={color.text.muted}
                    style={{
                      color: color.text.primary,
                      fontSize: 14,
                      fontWeight: '700',
                      marginTop: 2,
                      paddingVertical: 0,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Your car (mock — single hardcoded car for now) */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: color.bg.surface,
              borderWidth: 1,
              borderColor: color.stroke.soft,
            }}
          >
            <View
              style={{
                width: 40, height: 40, borderRadius: radius.sm,
                backgroundColor: 'rgba(212,168,67,0.12)',
                borderWidth: 1, borderColor: 'rgba(212,168,67,0.3)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>🚗</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Micro size="xs" color={color.text.muted}>YOUR CAR</Micro>
              <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '700', marginTop: 2 }}>
                Mercedes C200 · Black
              </Text>
              <Text style={{ color: color.text.muted, fontSize: 12, marginTop: 2, fontFamily: fontFamily.mono }}>
                QAS 4718 · AUTOMATIC
              </Text>
            </View>
            <Text style={{ color: color.gold[500], fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>EDIT</Text>
          </View>

          {/* Fare card */}
          <View
            style={{
              padding: 14,
              borderRadius: radius.md,
              backgroundColor: 'rgba(0,229,200,0.06)',
              borderWidth: 1,
              borderColor: 'rgba(0,229,200,0.3)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Micro size="xs" color={color.teal}>FARE · FLAT</Micro>
              <Body size="sm" style={{ marginTop: 4, color: color.text.primary }}>No surge. Ever.</Body>
            </View>
            <Text
              style={{
                color: color.teal,
                fontSize: 28,
                fontWeight: '900',
                fontFamily: fontFamily.mono,
                letterSpacing: 0.5,
              }}
            >
              {fare} EGP
            </Text>
          </View>

          {error ? <Body color={color.rose}>{error}</Body> : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="valet" loading={busy} onPress={order}>
            ORDER VALET · {fare} EGP →
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ValetBook;
