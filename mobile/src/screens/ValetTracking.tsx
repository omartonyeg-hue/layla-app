import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, Easing, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Micro, Body, Button, BackButton, MapDecor, DriverCard } from '../components';
import { api, type Ride } from '../lib/api';

type Props = {
  token: string;
  ride: Ride;
  onArrived: (ride: Ride) => void;
};

// Demo: pickup ETA is 3 min in mock, then trip is the ride.etaMinutes. To
// keep the checkpoint short we accelerate everything: 8s pickup + 12s trip.
const PICKUP_SECONDS = 8;
const TRIP_SECONDS = 12;

const padN = (n: number) => String(n).padStart(2, '0');

export const ValetTracking: React.FC<Props> = ({ token, ride, onArrived }) => {
  const [phase, setPhase] = useState<'EN_ROUTE' | 'IN_TRIP'>('EN_ROUTE');
  const [secondsLeft, setSecondsLeft] = useState(PICKUP_SECONDS);
  const startedRef = useRef(false);

  // Pulse for the live indicator dot.
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // Drives the EN_ROUTE → IN_TRIP → COMPLETED transitions.
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (secondsLeft > 0) return;
    (async () => {
      if (phase === 'EN_ROUTE') {
        if (startedRef.current) return;
        startedRef.current = true;
        try { await api.startRide(token, ride.id); } catch { /* best-effort */ }
        setPhase('IN_TRIP');
        setSecondsLeft(TRIP_SECONDS);
        startedRef.current = false;
      } else {
        try {
          const { ride: completed } = await api.completeRide(token, ride.id);
          onArrived(completed);
        } catch { /* fallback: navigate with current ride */ onArrived(ride); }
      }
    })();
  }, [secondsLeft, phase]);

  if (!ride.driver) return null; // type guard — props guarantee assigned ride

  const driverFirst = ride.driver.name.split(' ')[0] ?? ride.driver.name;
  const etaLabel = phase === 'EN_ROUTE'
    ? `${driverFirst.toUpperCase()} ARRIVING IN ${secondsLeft}s`
    : `EN ROUTE · ARRIVING IN ${padN(Math.floor(secondsLeft / 60))}:${padN(secondsLeft % 60)}`;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 }}>
          <BackButton onPress={() => onArrived(ride)} />
          <View style={{ flex: 1 }} />
          <Pressable
            style={{
              paddingHorizontal: 12, paddingVertical: 6,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(255,61,107,0.12)',
              borderWidth: 1, borderColor: color.rose,
            }}
          >
            <Text style={{ color: color.rose, fontSize: 11, fontWeight: '900', letterSpacing: 1 }}>🛡 SOS</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <MapDecor height={300} showRoute showCar />

          {/* ETA pill — sits over the map */}
          <View
            style={{
              position: 'absolute',
              left: 36, right: 36, bottom: 18,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(7,6,13,0.85)',
              borderWidth: 1, borderColor: color.teal,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              ...shadow.glowTeal,
            }}
          >
            <Animated.View
              style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: color.teal,
                opacity: pulse,
              }}
            />
            <Text style={{ color: color.text.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 }}>
              {etaLabel}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 14, paddingTop: 16 }}>
          <DriverCard driver={ride.driver} showVehicle />

          <Body size="sm" style={{ textAlign: 'center', color: color.text.muted }}>
            He'll arrive in his car · then drive yours.
          </Body>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" onPress={() => { /* messaging stub */ }}>💬 MESSAGE</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" onPress={() => { /* call stub */ }}>📞 CALL</Button>
            </View>
          </View>

          <Button variant="valet" onPress={() => { /* share trip stub */ }}>
            SHARE LIVE TRIP →
          </Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ValetTracking;
