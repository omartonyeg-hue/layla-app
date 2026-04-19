import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Text as SvgText } from 'react-native-svg';
import { color, gradient, radius, shadow, fontFamily } from '../theme/tokens';
import { Micro, Body, Button } from '../components';

// LAYLA Phase 01 — Welcome. Ported from Claude Design Files/onboarding-v2.jsx
// lines 39–89. Ambient glows (top gold, bottom rose) are SVG radial gradients
// since RN has no CSS radial-gradient equivalent.

type Props = { onGetStarted?: () => void; onSignIn?: () => void };

const AmbientGlows: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="goldGlow" cx="30%" cy="10%" r="65%">
          <Stop offset="0%" stopColor="#D4A843" stopOpacity="0.28" />
          <Stop offset="60%" stopColor="#D4A843" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="roseGlow" cx="50%" cy="110%" r="60%">
          <Stop offset="0%" stopColor="#FF3D6B" stopOpacity="0.18" />
          <Stop offset="60%" stopColor="#FF3D6B" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#goldGlow)" />
      <Rect x={0} y={0} width={width} height={height} fill="url(#roseGlow)" />
    </Svg>
  );
};

const LogoMark: React.FC = () => (
  <LinearGradient
    colors={gradient.gold.colors}
    start={gradient.gold.start}
    end={gradient.gold.end}
    style={{
      width: 56,
      height: 56,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadow.glowGold,
    }}
  >
    <Text
      style={{
        fontFamily: fontFamily.display,
        fontSize: 30,
        color: color.text.inverse,
        fontWeight: '900',
        letterSpacing: 30 * 0.04,
      }}
    >
      L
    </Text>
  </LinearGradient>
);

export const Splash: React.FC<Props> = ({ onGetStarted, onSignIn }) => {
  return (
    <View style={{ flex: 1, backgroundColor: color.bg.base }}>
      <AmbientGlows />
      <SafeAreaView
        style={{ flex: 1, paddingHorizontal: 32, paddingTop: 48, paddingBottom: 32 }}
      >
        {/* Logo pinned to top */}
        <View style={{ marginBottom: 40 }}>
          <LogoMark />
        </View>

        {/* Title block — pushed to the bottom of the screen (auto-margin in web). */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Micro size="sm" color={color.gold[500]}>
            EGYPT'S NIGHTLIFE
          </Micro>
          {/* SVG text — RN's Text clips Bebas' tall ascenders on iOS regardless
              of lineHeight. SVG has no line-box; glyphs render cleanly at any
              spacing. Baselines stacked at 0.82 × 88 = 72pt to match the web. */}
          <Svg
            width="100%"
            height={88 * 0.82 * 3 + 20}
            style={{ marginTop: 12, marginBottom: 16 }}
          >
            {['NIGHT', 'IS', 'YOURS.'].map((line, i) => (
              <SvgText
                key={line}
                x={0}
                y={88 + i * (88 * 0.82)}
                fontFamily={fontFamily.display}
                fontSize={88}
                fontWeight="900"
                fill={color.text.primary}
                letterSpacing={88 * 0.01}
              >
                {line}
              </SvgText>
            ))}
          </Svg>
          <Body style={{ fontSize: 15, lineHeight: 15 * 1.5, maxWidth: 280 }}>
            Events, private parties, valet — one app, from sunset to sunrise.
          </Body>
        </View>

        {/* CTAs */}
        <View style={{ marginTop: 40, gap: 10 }}>
          <Button variant="gold" onPress={onGetStarted}>GET STARTED →</Button>
          <Pressable onPress={onSignIn} style={{ alignItems: 'center' }}>
            <Text style={{ color: color.text.secondary, fontSize: 13 }}>
              Already have an account?{' '}
              <Text style={{ color: color.gold[500], fontWeight: '700' }}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Splash;
