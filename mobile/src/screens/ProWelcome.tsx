import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { color, radius, fontFamily, shadow } from '../theme/tokens';
import { Micro, Body, Button, DisplayHeadline } from '../components';

type Props = {
  onExplore: () => void;
};

const HOLO = ['#D4A843', '#F0C96A', '#FF3D6B', '#8B3FFF'] as const;

const ORBITS = ['⚡', '🔥', '🛡', '🎁', '★'];

const Glow: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
      <Defs>
        <RadialGradient id="welcomeGlow" cx="50%" cy="30%" r="80%">
          <Stop offset="0%" stopColor="#D4A843" stopOpacity="0.32" />
          <Stop offset="60%" stopColor="#8B3FFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#welcomeGlow)" />
    </Svg>
  );
};

export const ProWelcome: React.FC<Props> = ({ onExplore }) => {
  const { width } = Dimensions.get('window');
  const orbitRadius = Math.min(140, width * 0.36);

  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <Glow />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          {/* Orbiting glyphs */}
          <View style={{ width: orbitRadius * 2, height: orbitRadius * 2, alignItems: 'center', justifyContent: 'center' }}>
            {ORBITS.map((g, i) => {
              const angle = (i / ORBITS.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              return (
                <Text
                  key={g}
                  style={{
                    position: 'absolute',
                    left: orbitRadius + x - 14,
                    top: orbitRadius + y - 14,
                    fontSize: 22,
                    opacity: 0.85,
                  }}
                >
                  {g}
                </Text>
              );
            })}

            {/* Holographic badge */}
            <LinearGradient
              colors={HOLO}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 124, height: 124, borderRadius: 62,
                alignItems: 'center', justifyContent: 'center',
                ...shadow.glowGold,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.display,
                  fontSize: 56,
                  fontWeight: '900',
                  color: color.text.inverse,
                  letterSpacing: 2,
                }}
              >
                L
              </Text>
            </LinearGradient>
          </View>

          <View
            style={{
              alignSelf: 'center',
              marginTop: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: radius.pill,
              backgroundColor: color.gold[500],
            }}
          >
            <Text style={{ color: color.text.inverse, fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>
              PRO MEMBER
            </Text>
          </View>

          <Micro size="sm" color={color.teal} style={{ marginTop: 28 }}>✓ WELCOME ABOARD</Micro>
          <DisplayHeadline
            lines={["YOU'RE IN."]}
            size={56}
            lineHeightRatio={1.0}
            letterSpacingEm={0.02}
            style={{ marginTop: 6 }}
          />
          <Body style={{ marginTop: 14, textAlign: 'center', maxWidth: 300 }}>
            Your Pro perks are active. Check the dashboard for this week's exclusive drops and partner offers.
          </Body>
        </View>

        <Button variant="shine" onPress={onExplore}>EXPLORE YOUR PERKS →</Button>
      </SafeAreaView>
    </View>
  );
};

export default ProWelcome;
