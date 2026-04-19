import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, {
  Defs, RadialGradient as SvgRadial, Stop, Rect, Circle, Path, Line, G,
} from 'react-native-svg';
import { color, radius } from '../theme/tokens';

// Decorative dark "map" — solid SVG composition. No real tiles. The pins/route
// path are absolute-positioned at fixed normalized coords so the visual reads
// like a route without us pretending to be Mapbox.

type Props = {
  height?: number;
  showRoute?: boolean;        // dashed line from pickup → dropoff
  showCar?: boolean;          // animated car position along the route
};

export const MapDecor: React.FC<Props> = ({ height = 200, showRoute = true, showCar = false }) => {
  const { width } = Dimensions.get('window');
  return (
    <View style={{ height, width: '100%', overflow: 'hidden', borderRadius: radius.lg, backgroundColor: color.bg.map }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <SvgRadial id="mapBg" cx="50%" cy="40%" r="80%">
            <Stop offset="0%" stopColor="#17171f" />
            <Stop offset="60%" stopColor="#0b0b12" />
            <Stop offset="100%" stopColor="#07060D" />
          </SvgRadial>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#mapBg)" />

        {/* Block grid — abstract neighborhood vibe */}
        <G opacity={0.6}>
          <Rect x={width * 0.08} y={height * 0.15} width={width * 0.22} height={height * 0.18} fill="#10101E" rx={4} />
          <Rect x={width * 0.36} y={height * 0.10} width={width * 0.20} height={height * 0.22} fill="#1b1b27" rx={4} />
          <Rect x={width * 0.62} y={height * 0.18} width={width * 0.26} height={height * 0.16} fill="#10101E" rx={4} />
          <Rect x={width * 0.10} y={height * 0.55} width={width * 0.30} height={height * 0.20} fill="#1b1b27" rx={4} />
          <Rect x={width * 0.50} y={height * 0.58} width={width * 0.36} height={height * 0.18} fill="#10101E" rx={4} />
        </G>

        {/* Roads */}
        <Line x1={0} y1={height * 0.45} x2={width} y2={height * 0.45} stroke="#202032" strokeWidth={2} />
        <Line x1={width * 0.45} y1={0} x2={width * 0.45} y2={height} stroke="#202032" strokeWidth={2} />
        <Line x1={0} y1={height * 0.78} x2={width} y2={height * 0.78} stroke="#2a2a40" strokeWidth={1} strokeDasharray="6,6" />

        {/* Nile sliver */}
        <Path d={`M 0 ${height * 0.85} Q ${width * 0.5} ${height * 0.95}, ${width} ${height * 0.82} L ${width} ${height} L 0 ${height} Z`} fill="#0d1d24" />

        {/* Route */}
        {showRoute ? (
          <Path
            d={`M ${width * 0.18} ${height * 0.30} Q ${width * 0.42} ${height * 0.42}, ${width * 0.55} ${height * 0.55} T ${width * 0.82} ${height * 0.72}`}
            stroke={color.teal}
            strokeWidth={2.5}
            fill="none"
            strokeDasharray="6,5"
            opacity={0.9}
          />
        ) : null}

        {/* Pickup pin (teal) */}
        <Circle cx={width * 0.18} cy={height * 0.30} r={8} fill={color.teal} />
        <Circle cx={width * 0.18} cy={height * 0.30} r={14} fill="none" stroke={color.teal} strokeWidth={1.5} opacity={0.4} />

        {/* Dropoff pin (gold square-ish) */}
        <Rect x={width * 0.82 - 7} y={height * 0.72 - 7} width={14} height={14} fill={color.gold[500]} rx={2} />
        <Rect x={width * 0.82 - 12} y={height * 0.72 - 12} width={24} height={24} fill="none" stroke={color.gold[500]} strokeWidth={1.5} opacity={0.4} rx={4} />

        {/* Optional car along the route (~40% in) */}
        {showCar ? (
          <>
            <Circle cx={width * 0.45} cy={height * 0.46} r={14} fill={color.gold[500]} />
            <Circle cx={width * 0.45} cy={height * 0.46} r={20} fill="none" stroke={color.teal} strokeWidth={2} opacity={0.6} />
          </>
        ) : null}
      </Svg>
    </View>
  );
};

export default MapDecor;
