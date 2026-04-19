import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius } from '../theme/tokens';
import { Micro, Body, Button, BackButton, DisplayHeadline, RadarPulse, DriverCard } from '../components';
import { api, ApiError, type Ride, type NearbyDriver } from '../lib/api';

type Props = {
  token: string;
  ride: Ride;
  onCancel: () => void;
  onAssigned: (ride: Ride) => void;
};

const POLL_MS = 1500;

export const ValetFinding: React.FC<Props> = ({ token, ride, onCancel, onAssigned }) => {
  const [drivers, setDrivers] = useState<NearbyDriver[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Snapshot the nearby driver list once for the "MATCHING" UI.
  useEffect(() => {
    api.listNearbyDrivers(token).then(({ drivers }) => setDrivers(drivers)).catch(() => {});
  }, [token]);

  // Elapsed counter (drives the AVG MATCH TIME chip).
  useEffect(() => {
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Poll the ride until a driver is assigned. Backend auto-flips after 5s.
  useEffect(() => {
    let active = true;
    let consecutiveErrors = 0;
    const tick = async () => {
      if (!active) return;
      try {
        const { ride: updated } = await api.getRide(token, ride.id);
        if (!active) return;
        consecutiveErrors = 0;
        if (updated.status === 'ASSIGNED' && updated.driver) {
          onAssigned(updated);
          return;
        }
        if (updated.status === 'CANCELED' || updated.status === 'COMPLETED') return;
        setTimeout(tick, POLL_MS);
      } catch {
        if (!active) return;
        consecutiveErrors += 1;
        if (consecutiveErrors >= 3) setError('Still trying to match a driver…');
        setTimeout(tick, POLL_MS * Math.min(consecutiveErrors, 3));
      }
    };
    tick();
    return () => { active = false; };
  }, [ride.id, token]);

  const handleCancel = async () => {
    try { await api.cancelRide(token, ride.id); } catch { /* best-effort */ }
    onCancel();
  };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={handleCancel} />
          <View style={{ flex: 1 }} />
        </View>

        <View style={{ alignItems: 'center', paddingTop: 8, gap: 6 }}>
          <Micro size="sm" color={color.teal}>FINDING A VALET</Micro>
          <DisplayHeadline
            lines={['SCANNING…']}
            size={28}
            lineHeightRatio={1.0}
            letterSpacingEm={0.02}
            color={color.text.primary}
          />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 16 }}>
          <RadarPulse size={260} />
        </View>

        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Micro size="xs" color={color.text.muted}>
            AVG MATCH TIME · 47S · ELAPSED {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </Micro>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 8 }}>
          <Micro size="xs" color={color.text.muted}>{drivers.length} DRIVERS NEARBY · VETTED</Micro>
          {drivers.map((d, i) => (
            <DriverCard key={d.id} driver={d} matched={i === 0} />
          ))}
          {error ? <Body color={color.rose} style={{ marginTop: 8 }}>{error}</Body> : null}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
          <Button variant="ghost" onPress={handleCancel}>CANCEL SEARCH</Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ValetFinding;
