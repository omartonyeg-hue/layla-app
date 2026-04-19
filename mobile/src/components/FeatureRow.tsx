import React from 'react';
import { View, Text } from 'react-native';
import { color, radius } from '../theme/tokens';
import { Body } from './Text';

type Props = {
  tintColor?: string;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
};

export const FeatureRow: React.FC<Props> = ({
  tintColor = color.gold[500],
  title,
  desc,
  icon,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: radius.md,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderWidth: 1,
      borderColor: color.stroke.soft,
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: radius.sm,
        backgroundColor: tintColor + '33',
        borderWidth: 1,
        borderColor: tintColor + '66',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon ?? <Text style={{ color: tintColor, fontSize: 16 }}>◆</Text>}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '700' }}>{title}</Text>
      {desc ? <Body size="sm" style={{ marginTop: 2 }}>{desc}</Body> : null}
    </View>
  </View>
);

export default FeatureRow;
