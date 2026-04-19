import React from 'react';
import { View } from 'react-native';
import { color } from '../theme/tokens';

// Step indicator — thin bars, filled gold up to `current` (zero-indexed).
// Matches Claude Design Files/onboarding-v2.jsx lines 27–37.
type Props = { total?: number; current: number };

export const StepsBar: React.FC<Props> = ({ total = 4, current }) => (
  <View style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
    {Array.from({ length: total }).map((_, i) => {
      const filled = i <= current;
      return (
        <View
          key={i}
          style={{
            flex: filled ? 2 : 1,
            height: 3,
            borderRadius: 2,
            backgroundColor: filled ? color.gold[500] : color.stroke.mid,
          }}
        />
      );
    })}
  </View>
);

export default StepsBar;
