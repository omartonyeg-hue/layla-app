import React from 'react';
import Svg, { Text as SvgText } from 'react-native-svg';
import type { ViewStyle } from 'react-native';
import { color, fontFamily } from '../theme/tokens';

// Bebas display text via SVG. RN Text clips Bebas' tall ascenders on iOS at
// any lineHeight; SVG has no line-box, so glyphs render freely. Used for all
// `display-*` / `title-*` sizes (≥18pt) across Phase 01–06 screens.

type Props = {
  lines: string[];             // one line per entry; no \n splitting inside
  size: number;                // font size in pt
  lineHeightRatio?: number;    // matches tokens.typeScale[...].line
  letterSpacingEm?: number;    // matches tokens.typeScale[...].trackingEm
  color?: string;
  style?: ViewStyle;
};

export const DisplayHeadline: React.FC<Props> = ({
  lines,
  size,
  lineHeightRatio = 1.05,
  letterSpacingEm = 0.02,
  color: c = color.text.primary,
  style,
}) => {
  const lineHeight = size * lineHeightRatio;
  // Buffers keep the ascender above the SVG top and the descender/last-line
  // glyphs below the last baseline inside the viewport. Without the bottom
  // buffer, tight lineHeightRatios (<1.0) clip letters like "CODE."'s period.
  const topBuffer = size * 0.15;
  const bottomBuffer = size * 0.3;
  const svgHeight = topBuffer + size + (lines.length - 1) * lineHeight + bottomBuffer;

  return (
    <Svg width="100%" height={svgHeight} style={style}>
      {lines.map((line, i) => (
        <SvgText
          key={`${i}-${line}`}
          x={0}
          y={topBuffer + size + i * lineHeight}
          fontFamily={fontFamily.display}
          fontSize={size}
          fontWeight="900"
          fill={c}
          letterSpacing={size * letterSpacingEm}
        >
          {line}
        </SvgText>
      ))}
    </Svg>
  );
};

export default DisplayHeadline;
