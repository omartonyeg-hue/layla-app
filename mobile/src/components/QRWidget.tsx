import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, fontFamily, gradient } from '../theme/tokens';

// Visual QR-ish grid. NOT a real QR code — just a deterministic dot pattern
// seeded from the order ref so each ticket looks unique. Real scanning will
// come with a proper library once the gate-scanner flow is spec'd.

type Props = { seed: string; size?: number };

const GRID = 21;
const FINDERS: Array<[number, number]> = [
  [0, 0],              // top-left
  [0, GRID - 7],       // top-right
  [GRID - 7, 0],       // bottom-left
];

// Mulberry32 — small deterministic PRNG so the same seed gives the same grid.
const prng = (seedStr: string) => {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  return () => {
    h |= 0;
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const inFinder = (r: number, c: number) =>
  FINDERS.some(([fr, fc]) => r >= fr && r < fr + 7 && c >= fc && c < fc + 7);

const CENTER_START = (GRID - 5) / 2;
const inCenterLogo = (r: number, c: number) =>
  r >= CENTER_START && r < CENTER_START + 5 && c >= CENTER_START && c < CENTER_START + 5;

export const QRWidget: React.FC<Props> = ({ seed, size = 220 }) => {
  const cell = size / GRID;

  const { rows, finderRings } = useMemo(() => {
    const rand = prng(seed);
    const rows: boolean[][] = [];
    for (let r = 0; r < GRID; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < GRID; c++) {
        if (inFinder(r, c) || inCenterLogo(r, c)) row.push(false);
        else row.push(rand() > 0.5);
      }
      rows.push(row);
    }
    return { rows, finderRings: FINDERS };
  }, [seed]);

  return (
    <View style={{ width: size, height: size, backgroundColor: color.text.primary, padding: cell, borderRadius: radius.sm }}>
      {/* Random dot pattern */}
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((on, c) => (
            <View
              key={c}
              style={{
                width: cell,
                height: cell,
                backgroundColor: on ? color.bg.base : 'transparent',
              }}
            />
          ))}
        </View>
      ))}

      {/* Three finder rings (QR-style corner squares) */}
      {finderRings.map(([fr, fc], i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: cell + fr * cell,
            left: cell + fc * cell,
            width: cell * 7,
            height: cell * 7,
            borderWidth: cell,
            borderColor: color.bg.base,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: cell * 3, height: cell * 3, backgroundColor: color.bg.base }} />
        </View>
      ))}

      {/* Center "L" logo inside a gold tile */}
      <LinearGradient
        colors={gradient.gold.colors}
        start={gradient.gold.start}
        end={gradient.gold.end}
        style={{
          position: 'absolute',
          top: cell + CENTER_START * cell,
          left: cell + CENTER_START * cell,
          width: cell * 5,
          height: cell * 5,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.display,
            fontSize: cell * 4,
            color: color.text.inverse,
            fontWeight: '900',
          }}
        >
          L
        </Text>
      </LinearGradient>
    </View>
  );
};

export default QRWidget;
