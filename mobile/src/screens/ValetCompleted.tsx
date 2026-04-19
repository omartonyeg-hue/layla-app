import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Avatar, Micro, Body, Button, DisplayHeadline, StarRating } from '../components';
import type { Ride } from '../lib/api';

type Props = {
  ride: Ride;
  onRate: () => void;
  onDone: () => void;
};

const formatTime = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const TIP_EGP = 50;

export const ValetCompleted: React.FC<Props> = ({ ride, onRate, onDone }) => {
  const { width, height } = Dimensions.get('window');
  if (!ride.driver) return null;

  const total = ride.fareEgp + TIP_EGP;
  const completedAt = ride.completedAt ?? new Date().toISOString();

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
        <Defs>
          <RadialGradient id="completedGlow" cx="50%" cy="14%" r="70%">
            <Stop offset="0%" stopColor="#00E5C8" stopOpacity="0.18" />
            <Stop offset="60%" stopColor="#00E5C8" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#completedGlow)" />
      </Svg>

      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 72, height: 72, borderRadius: 36,
              borderWidth: 2, borderColor: color.teal,
              alignItems: 'center', justifyContent: 'center',
              ...shadow.glowTeal,
            }}
          >
            <Text style={{ color: color.teal, fontSize: 32, fontWeight: '900' }}>✓</Text>
          </View>
          <Micro size="sm" color={color.teal}>DELIVERED · {formatTime(completedAt).toUpperCase()}</Micro>
          <DisplayHeadline
            lines={["YOU'RE HOME."]}
            size={40}
            lineHeightRatio={1.0}
            letterSpacingEm={0.02}
          />
        </View>

        {/* Trip receipt */}
        <View
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: radius.lg,
            backgroundColor: color.bg.surface,
            borderWidth: 1,
            borderColor: color.stroke.soft,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center', paddingTop: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.teal }} />
              <View style={{ width: 1, flex: 1, backgroundColor: color.stroke.mid, marginVertical: 6 }} />
              <View style={{ width: 8, height: 8, backgroundColor: color.gold[500] }} />
            </View>
            <View style={{ flex: 1, gap: 14 }}>
              <ReceiptRow label={ride.pickupLabel} time={formatTime(ride.startedAt ?? ride.assignedAt)} />
              <ReceiptRow label={ride.dropoffLabel} time={formatTime(ride.completedAt)} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
            <Micro size="xs" color={color.text.muted}>{ride.etaMinutes} MIN · {ride.distanceKm.toFixed(1)} KM</Micro>
            <StarRating value={ride.driver.rating} size={12} />
          </View>
        </View>

        {/* Fare breakdown */}
        <View style={{ marginTop: 16, gap: 8 }}>
          <FareLine label="Flat fare" value={`${ride.fareEgp} EGP`} />
          <FareLine label="Tip to driver" value={`${TIP_EGP} EGP`} muted />
          <View style={{ height: 1, backgroundColor: color.stroke.soft, marginVertical: 4 }} />
          <FareLine label="Total · Apple Pay" value={`${total} EGP`} bold />
        </View>

        {/* Driver mini */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 18,
            padding: 12,
            borderRadius: radius.md,
            backgroundColor: color.bg.surface,
            borderWidth: 1,
            borderColor: color.stroke.soft,
          }}
        >
          <Avatar name={ride.driver.name} color={ride.driver.avatarColor ?? color.teal} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>
              {ride.driver.name}
            </Text>
            <Micro size="xs" color={color.text.muted} style={{ marginTop: 2 }}>
              ★ {ride.driver.rating.toFixed(1)} · YOUR DRIVER TONIGHT
            </Micro>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" onPress={onDone}>REBOOK</Button>
          </View>
          <View style={{ flex: 1.4 }}>
            <Button variant="valet" onPress={onRate}>RATE YOUR TRIP ★</Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const ReceiptRow: React.FC<{ label: string; time: string }> = ({ label, time }) => (
  <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
    <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 }} numberOfLines={1}>
      {label}
    </Text>
    <Text style={{ color: color.text.muted, fontSize: 12, fontFamily: fontFamily.mono }}>{time}</Text>
  </View>
);

const FareLine: React.FC<{ label: string; value: string; muted?: boolean; bold?: boolean }> = ({ label, value, muted, bold }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text style={{ color: muted ? color.text.muted : color.text.primary, fontSize: bold ? 15 : 13, fontWeight: bold ? '800' : '500' }}>
      {label}
    </Text>
    <Text style={{ color: bold ? color.teal : color.text.primary, fontSize: bold ? 16 : 13, fontWeight: bold ? '900' : '700', fontFamily: fontFamily.mono }}>
      {value}
    </Text>
  </View>
);

export default ValetCompleted;
