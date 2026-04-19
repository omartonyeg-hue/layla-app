import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { color, radius, fontFamily } from '../theme/tokens';
import { Avatar, Micro, Body, StarRating } from './index';
import type { DriverSummary, NearbyDriver } from '../lib/api';

type Props = {
  driver: DriverSummary | NearbyDriver;
  matched?: boolean;        // teal scrim + MATCHING tag
  onPress?: () => void;
  showVehicle?: boolean;    // include the car / plate row
};

const isNearby = (d: DriverSummary | NearbyDriver): d is NearbyDriver =>
  'etaMinutes' in d && 'distanceKm' in d;

export const DriverCard: React.FC<Props> = ({ driver, matched, onPress, showVehicle }) => {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress as any}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: radius.md,
        backgroundColor: matched ? 'rgba(0,229,200,0.08)' : color.bg.surface,
        borderWidth: 1,
        borderColor: matched ? color.teal : color.stroke.soft,
      }}
    >
      <Avatar name={driver.name} color={driver.avatarColor ?? color.teal} size={44} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: color.text.primary, fontSize: 14, fontWeight: '800' }}>
            {driver.name}
          </Text>
          {matched ? (
            <View
              style={{
                paddingHorizontal: 6, paddingVertical: 2,
                borderRadius: 4, backgroundColor: color.teal,
              }}
            >
              <Text style={{ color: color.text.inverse, fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>
                MATCHING
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <StarRating value={driver.rating} size={11} />
          <Text style={{ color: color.text.secondary, fontSize: 12 }}>
            {driver.rating.toFixed(1)}
          </Text>
          {isNearby(driver) ? (
            <Text style={{ color: color.text.muted, fontSize: 12 }}>
              · {driver.etaMinutes} MIN · {driver.distanceKm.toFixed(1)} KM
            </Text>
          ) : (
            <Text style={{ color: color.text.muted, fontSize: 12 }}>
              · {driver.trips} TRIPS · {driver.yearsActive} YRS
            </Text>
          )}
        </View>

        {showVehicle ? (
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Body size="sm" color={color.text.primary}>
              {driver.carMake} {driver.carModel} · {driver.carColor}
            </Body>
            <View
              style={{
                paddingHorizontal: 6, paddingVertical: 2,
                borderRadius: 4, backgroundColor: 'rgba(212,168,67,0.12)',
                borderWidth: 1, borderColor: 'rgba(212,168,67,0.35)',
              }}
            >
              <Text
                style={{
                  color: color.gold[500],
                  fontSize: 10,
                  fontWeight: '900',
                  letterSpacing: 1,
                  fontFamily: fontFamily.mono,
                }}
              >
                {driver.plate}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </Wrapper>
  );
};

export default DriverCard;
