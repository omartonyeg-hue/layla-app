import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { color, radius, gradient, shadow } from '../theme/tokens';
import { Button, Micro, Body, DisplayHeadline } from '../components';

// Port of Claude Design Files/onboarding-v2.jsx lines 300–361.
// Welcome home — celebratory burst + personalized preview chips.

type Props = {
  name: string;
  onStart: () => void;
};

const BurstGlow: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="burst" cx="50%" cy="20%" r="70%">
          <Stop offset="0%" stopColor="#D4A843" stopOpacity="0.35" />
          <Stop offset="60%" stopColor="#D4A843" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#burst)" />
    </Svg>
  );
};

const previews = [
  { label: 'EVENTS',  tint: color.gold[500], icon: '◐', desc: '4 tonight · 12 this week' },
  { label: 'PARTIES', tint: color.rose,      icon: '▲', desc: '2 open · 1 friend hosting' },
  { label: 'VALET',   tint: color.teal,      icon: '▶', desc: 'Active in Zamalek & Sahel' },
];

export const Done: React.FC<Props> = ({ name, onStart }) => {
  const firstName = name.split(' ')[0] ?? name;

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <BurstGlow />
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 32,
          paddingTop: 40,
          paddingBottom: 28,
          alignItems: 'center',
        }}
      >
        {/* Gold check disc */}
        <LinearGradient
          colors={gradient.gold.colors}
          start={gradient.gold.start}
          end={gradient.gold.end}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 28,
            ...shadow.glowGold,
          }}
        >
          <Text style={{ color: color.text.inverse, fontSize: 36, fontWeight: '900' }}>✓</Text>
        </LinearGradient>

        <Micro size="sm" color={color.gold[500]}>AHLAN WA SAHLAN</Micro>

        {/* The last line is gold — render it as its own DisplayHeadline below
            the first two so we can color it independently. */}
        <DisplayHeadline
          lines={['WELCOME', 'TO LAYLA,']}
          size={52}
          lineHeightRatio={0.88}
          letterSpacingEm={0.02}
          style={{ marginTop: 8 }}
        />
        <DisplayHeadline
          lines={[`${firstName.toUpperCase()}.`]}
          size={52}
          lineHeightRatio={0.88}
          letterSpacingEm={0.02}
          color={color.gold[500]}
          style={{ marginBottom: 14, marginTop: -52 * 0.15 }}
        />

        <Body style={{ fontSize: 14, lineHeight: 14 * 1.5, maxWidth: 280, textAlign: 'center' }}>
          4 events tonight match your vibe. 2 parties open for requests.
        </Body>

        <View style={{ marginTop: 28, gap: 10, width: '100%', flex: 1 }}>
          {previews.map((p) => (
            <View
              key={p.label}
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
                  width: 36,
                  height: 36,
                  borderRadius: radius.sm,
                  backgroundColor: p.tint + '26',
                  borderWidth: 1,
                  borderColor: p.tint + '4D',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: p.tint, fontSize: 14, fontWeight: '900' }}>{p.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Micro size="xs" color={p.tint}>{p.label}</Micro>
                <Text
                  style={{
                    color: color.text.primary,
                    fontSize: 13,
                    fontWeight: '600',
                    marginTop: 2,
                  }}
                >
                  {p.desc}
                </Text>
              </View>
              <Text style={{ color: color.text.muted, fontSize: 16 }}>›</Text>
            </View>
          ))}
        </View>

        <Button variant="gold" onPress={onStart} style={{ marginTop: 20 }}>
          START EXPLORING →
        </Button>
      </SafeAreaView>
    </View>
  );
};

export default Done;
