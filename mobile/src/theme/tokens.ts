// LAYLA design tokens — 1:1 port of Claude Design Files/tokens.jsx for React Native.
// Values are identical to the web source. Gradients are represented as ordered
// color-stop arrays because RN has no CSS gradient — consume via expo-linear-gradient.

export const color = {
  bg:       { base: '#07060D', surface: '#10101E', elevated: '#1A1A2A', map: '#0A1020' },
  text:     { primary: '#F0EDE6', secondary: '#9A98B0', muted: '#6B6880', inverse: '#07060D' },
  gold:     { 600: '#B98E2E', 500: '#D4A843', 400: '#F0C96A', 300: '#FFF4D6' },
  rose:     '#FF3D6B',
  violet:   '#8B3FFF',
  teal:     '#00E5C8',
  stroke:   {
    soft:       'rgba(255,255,255,0.06)',
    mid:        'rgba(255,255,255,0.08)',
    gold:       'rgba(212,168,67,0.2)',
    goldStrong: 'rgba(212,168,67,0.4)',
  },
  scrim: {
    40: 'rgba(7,6,13,0.4)',
    60: 'rgba(7,6,13,0.6)',
    80: 'rgba(7,6,13,0.8)',
  },
  success: '#00E5C8',
  warning: '#F0C96A',
  error:   '#FF3D6B',
  info:    '#8B3FFF',
} as const;

// Gradients are pairs/triples of [colors, start, end] — feed directly to LinearGradient.
// Angles from the web spec (135deg / 180deg) mapped to start/end points.
const G135 = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };   // 135deg
const G180 = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };   // 180deg
const GRadial = { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } }; // approx for "heroGlow"

export const gradient = {
  gold:      { colors: ['#D4A843', '#F0C96A'] as const,                       ...G135 },
  goldShine: { colors: ['#D4A843', '#F0C96A', '#FFF4D6'] as const,            ...G135 },
  sunset:    { colors: ['#D4A843', '#FF3D6B'] as const,                       ...G135 },
  night:     { colors: ['#FF3D6B', '#8B3FFF'] as const,                       ...G135 },
  valet:     { colors: ['#00E5C8', '#D4A843'] as const,                       ...G135 },
  community: { colors: ['#D4A843', '#FF3D6B', '#8B3FFF'] as const,            ...G135 },
  sahel:     { colors: ['#FFB547', '#FF6B9D', '#8B3FFF'] as const,            ...G180 },
  heroGlow:  { colors: ['rgba(212,168,67,0.15)', 'transparent'] as const,     ...GRadial },
} as const;

// Font family names. `display` matches the key exported by
// @expo-google-fonts/bebas-neue (BebasNeue_400Regular). The app must call
// useFonts() before rendering — RN silently falls back if the font isn't loaded.
export const fontFamily = {
  display: 'BebasNeue_400Regular',
  body: 'System',
  mono: 'Menlo',
} as const;

// Typography scale — same sizes and weights as web. `tracking` is ems (string);
// RN wants letterSpacing in points, so we compute it per-use via `resolveType()`.
type ScaleEntry = {
  size: number;
  line: number;           // leading multiplier
  trackingEm: number;     // letter-spacing in em
  weight: TextWeight;
  caps?: boolean;
  mono?: boolean;
};

export type TextWeight =
  | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  | 'normal' | 'bold';

export const typeScale = {
  'display-xl': { size: 88, line: 0.95, trackingEm: 0.08, weight: '900' },
  'display-lg': { size: 56, line: 1.00, trackingEm: 0.04, weight: '900' },
  'display-md': { size: 40, line: 1.05, trackingEm: 0.03, weight: '900' },
  'display-sm': { size: 32, line: 1.05, trackingEm: 0.03, weight: '900' },
  'display-xs': { size: 26, line: 1.10, trackingEm: 0.02, weight: '900' },
  'title-lg':   { size: 22, line: 1.20, trackingEm: 0.04, weight: '900' },
  'title-md':   { size: 18, line: 1.25, trackingEm: 0.04, weight: '900' },
  'body-lg':    { size: 15, line: 1.55, trackingEm: 0.00, weight: '500' },
  'body-md':    { size: 13, line: 1.55, trackingEm: 0.00, weight: '500' },
  'body-sm':    { size: 12, line: 1.50, trackingEm: 0.00, weight: '500' },
  'caption':    { size: 11, line: 1.40, trackingEm: 0.00, weight: '500' },
  'micro-xl':   { size: 14, line: 1.20, trackingEm: 0.15, weight: '700', caps: true, mono: true },
  'micro-lg':   { size: 12, line: 1.20, trackingEm: 0.20, weight: '700', caps: true, mono: true },
  'micro-md':   { size: 11, line: 1.20, trackingEm: 0.25, weight: '700', caps: true, mono: true },
  'micro-sm':   { size: 10, line: 1.20, trackingEm: 0.30, weight: '700', caps: true, mono: true },
  'micro-xs':   { size:  9, line: 1.20, trackingEm: 0.30, weight: '700', caps: true, mono: true },
} as const satisfies Record<string, ScaleEntry>;

export type TypeName = keyof typeof typeScale;

// 4-pt base — same numeric values as the web tokens.
export const space = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
} as const;

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999, phone: 44,
} as const;

// RN shadows: iOS uses shadow*, Android uses elevation. Approximated from web spec.
export const shadow = {
  none:      { shadowColor: 'transparent', shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  card:      { shadowColor: '#000', shadowOffset: { width: 0, height: 1 },  shadowOpacity: 0.3, shadowRadius: 2,  elevation: 1 },
  float:     { shadowColor: '#000', shadowOffset: { width: 0, height: 8 },  shadowOpacity: 0.4, shadowRadius: 24, elevation: 8 },
  phone:     { shadowColor: '#000', shadowOffset: { width: 0, height: 40 }, shadowOpacity: 0.5, shadowRadius: 80, elevation: 20 },
  glowGold:  { shadowColor: '#D4A843', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 8 },
  glowTeal:  { shadowColor: '#00E5C8', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 8 },
  glowCrown: { shadowColor: '#D4A843', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 60, elevation: 12 },
} as const;

export const motion = {
  duration: { fast: 120, base: 200, slow: 300 },
} as const;

export const tokens = {
  color, gradient, fontFamily, typeScale, space, radius, shadow, motion,
} as const;

export type Tokens = typeof tokens;
export default tokens;
