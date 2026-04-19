import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline, SettingsButton } from '../components';

type Props = {
  trialDays: number;
  monthlyAfterEgp: number;
  onUnlock: () => void;
  onOpenSettings: () => void;
};

// Holographic gradient — exclusive to Pro surfaces. Gold → peach → rose → violet.
const HOLO = ['#D4A843', '#F0C96A', '#FF3D6B', '#8B3FFF'] as const;

const PERKS = [
  { icon: '⚡', title: 'Priority entry',     desc: 'Skip lines at partner venues.',           tint: '#F0C96A' },
  { icon: '🔥', title: 'Exclusive drops',    desc: 'Pro-only events that never go on sale.',  tint: '#FF3D6B' },
  { icon: '🛡', title: 'No valet surge',     desc: 'Flat fare nights, weekends, holidays.',   tint: '#00E5C8' },
  { icon: '🎁', title: 'Partner perks',      desc: 'Drinks on the house at 12 spots.',        tint: '#8B3FFF' },
];

const HoloGlow: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
      <Defs>
        <RadialGradient id="holoBg" cx="50%" cy="20%" r="80%">
          <Stop offset="0%" stopColor="#8B3FFF" stopOpacity="0.18" />
          <Stop offset="60%" stopColor="#D4A843" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#holoBg)" />
    </Svg>
  );
};

export const ProLanding: React.FC<Props> = ({ trialDays, monthlyAfterEgp, onUnlock, onOpenSettings }) => (
  <View style={{ flex: 1, backgroundColor: color.bg.base }}>
    <HoloGlow />
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4, flexDirection: 'row', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Micro size="sm" color={color.gold[500]}>⌁ MEMBERSHIP · BY INVITATION</Micro>
          <DisplayHeadline
            lines={['NIGHTLIFE,', 'UNLOCKED.']}
            size={44}
            lineHeightRatio={0.95}
            letterSpacingEm={0.02}
            style={{ marginTop: 6 }}
          />
        </View>
        <SettingsButton onPress={onOpenSettings} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 18 }}>
        {/* Holographic membership card */}
        <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
          {/* Back card shadow */}
          <View
            style={{
              position: 'absolute',
              top: 14, left: 36, right: 36, bottom: -14,
              borderRadius: radius.lg,
              backgroundColor: 'rgba(212,168,67,0.18)',
            }}
          />
          <LinearGradient
            colors={HOLO}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '90%',
              height: 180,
              borderRadius: radius.lg,
              padding: 18,
              justifyContent: 'space-between',
              ...shadow.glowGold,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Micro size="xs" color={color.text.inverse}>MEMBER · LIFETIME</Micro>
              <Text style={{ fontFamily: fontFamily.display, fontSize: 22, fontWeight: '900', color: color.text.inverse }}>L</Text>
            </View>
            <View>
              <Text style={{ fontFamily: fontFamily.display, fontSize: 28, fontWeight: '900', color: color.text.inverse, letterSpacing: 1 }}>
                LAYLA PRO
              </Text>
              <Text style={{ color: 'rgba(7,6,13,0.72)', fontSize: 12, fontWeight: '800', letterSpacing: 2, marginTop: 4, fontFamily: fontFamily.mono }}>
                •••• •••• •••• 2024
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Perks */}
        <View style={{ gap: 8, marginTop: 18 }}>
          {PERKS.map((p) => (
            <View
              key={p.title}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: radius.md,
                backgroundColor: color.bg.surface,
                borderWidth: 1,
                borderColor: color.stroke.soft,
              }}
            >
              <View
                style={{
                  width: 40, height: 40, borderRadius: radius.sm,
                  backgroundColor: p.tint + '22',
                  borderWidth: 1, borderColor: p.tint + '55',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18 }}>{p.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>{p.title}</Text>
                <Body size="sm" style={{ marginTop: 2 }}>{p.desc}</Body>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: color.stroke.soft }}>
        <Button variant="shine" onPress={onUnlock}>
          ⌁ UNLOCK PRO · {trialDays} DAYS FREE
        </Button>
        <Micro size="xs" color={color.text.muted} style={{ marginTop: 10, textAlign: 'center' }}>
          THEN {monthlyAfterEgp} EGP / MONTH · CANCEL ANYTIME
        </Micro>
      </View>
    </SafeAreaView>
  </View>
);

export default ProLanding;
