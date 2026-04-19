import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from '../theme/tokens';

// Bottom tab bar. Active tabs ship now; locked tabs display the phase they'll
// unlock (matches the LockedPill pattern from the design system).

export type TabKey = 'events' | 'parties' | 'community' | 'valet' | 'pro';

type Tab = {
  key: TabKey;
  label: string;
  icon: string;        // emoji/text glyph for now; swap for vector later
  tint: string;
  locked?: number;     // phase number if locked
};

const TABS: Tab[] = [
  { key: 'events',    label: 'Events',    icon: '◐', tint: color.gold[500] },
  { key: 'parties',   label: 'Parties',   icon: '▲', tint: color.rose },
  { key: 'community', label: 'Community', icon: '◆', tint: color.violet },
  { key: 'valet',     label: 'Valet',     icon: '▶', tint: color.teal },
  { key: 'pro',       label: 'Pro',       icon: '♛', tint: color.gold[400] },
];

type Props = {
  active: TabKey;
  onSelect: (key: TabKey) => void;
};

export const TabBar: React.FC<Props> = ({ active, onSelect }) => (
  <View
    style={{
      borderTopWidth: 1,
      borderTopColor: color.stroke.soft,
      backgroundColor: color.bg.base,
    }}
  >
    <SafeAreaView edges={['bottom']}>
      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
        {TABS.map((t) => {
          const on = t.key === active;
          const disabled = Boolean(t.locked);
          const iconColor = on ? t.tint : disabled ? color.text.muted : color.text.secondary;
          const labelColor = on ? t.tint : disabled ? color.text.muted : color.text.secondary;
          return (
            <Pressable
              key={t.key}
              disabled={disabled}
              onPress={() => onSelect(t.key)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                paddingVertical: 6,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ color: iconColor, fontSize: 16, fontWeight: '900' }}>{t.icon}</Text>
              <Text
                style={{
                  color: labelColor,
                  fontSize: 10,
                  fontWeight: on ? '800' : '600',
                  letterSpacing: 1,
                  marginTop: 2,
                  textTransform: 'uppercase',
                }}
              >
                {t.label}
              </Text>
              {disabled ? (
                <Text
                  style={{
                    color: color.text.muted,
                    fontSize: 8,
                    fontWeight: '800',
                    letterSpacing: 1,
                    marginTop: 1,
                  }}
                >
                  PH {t.locked}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  </View>
);

export default TabBar;
