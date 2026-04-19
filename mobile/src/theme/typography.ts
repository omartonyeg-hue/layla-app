import type { TextStyle } from 'react-native';
import { fontFamily, typeScale, type TypeName } from './tokens';

// Web tokens express tracking in ems (e.g. "0.08em"). RN's letterSpacing is in
// points, so we resolve it against the font size at style-build time.
export const resolveType = (name: TypeName): TextStyle => {
  const s = typeScale[name];
  const isDisplay = name.startsWith('display') || name.startsWith('title');
  const family = s.mono ? fontFamily.mono : isDisplay ? fontFamily.display : fontFamily.body;
  return {
    fontFamily: family,
    fontSize: s.size,
    lineHeight: s.size * s.line,
    letterSpacing: s.size * s.trackingEm,
    fontWeight: s.weight,
    ...(s.caps ? { textTransform: 'uppercase' as const } : null),
  };
};
