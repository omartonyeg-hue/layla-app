import React from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar } from './Avatar';
import type { Account } from '../lib/api';

// Dropdown shown above a caption input when the user is inside an active
// `@fragment`. Tapping a row inserts `@handle ` into the caption (callback
// provided by the parent via `onPick`).

type Props = {
  results: Account[];
  loading: boolean;
  onPick: (account: Account) => void;
};

const kindBadge = (kind: Account['kind']) => {
  switch (kind) {
    case 'VENUE':     return { text: 'VENUE',     tint: color.teal };
    case 'DJ':        return { text: 'DJ',        tint: color.rose };
    case 'ORGANIZER': return { text: 'ORGANIZER', tint: color.gold[500] };
    case 'USER':      return null;
  }
};

export const MentionTypeaheadList: React.FC<Props> = ({ results, loading, onPick }) => {
  if (!loading && results.length === 0) return null;

  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: color.stroke.soft,
        backgroundColor: color.bg.elevated,
        maxHeight: 240,
      }}
    >
      {loading && results.length === 0 ? (
        <View style={{ padding: 14, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={color.violet} />
        </View>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled">
          {results.map((a) => {
            const badge = kindBadge(a.kind);
            return (
              <Pressable
                key={a.id}
                onPress={() => onPick(a)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: color.stroke.soft,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Avatar
                  name={a.displayName}
                  color={a.avatarColor ?? color.gold[500]}
                  url={a.avatarUrl ?? undefined}
                  size={36}
                />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ color: color.text.primary, fontSize: 13, fontWeight: '800' }}>
                      {a.displayName}
                    </Text>
                    {a.isVerified ? (
                      <Text style={{ color: color.teal, fontSize: 11 }}>✓</Text>
                    ) : null}
                    {badge ? (
                      <View
                        style={{
                          paddingHorizontal: 6, paddingVertical: 1,
                          borderRadius: radius.pill,
                          backgroundColor: 'transparent',
                          borderWidth: 1, borderColor: badge.tint,
                        }}
                      >
                        <Text
                          style={{
                            color: badge.tint,
                            fontSize: 9,
                            fontWeight: '800',
                            letterSpacing: 0.5,
                            fontFamily: fontFamily.body,
                          }}
                        >
                          {badge.text}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={{ color: color.violet, fontSize: 12, marginTop: 1 }}>
                    @{a.handle}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default MentionTypeaheadList;
