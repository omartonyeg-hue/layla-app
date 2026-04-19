import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../lib/AuthContext';
import { color } from '../theme/tokens';
import { Splash } from '../screens/Splash';
import { PhoneEntry } from '../screens/PhoneEntry';
import { PhoneOTP } from '../screens/PhoneOTP';
import { Profile } from '../screens/Profile';
import { Role } from '../screens/Role';
import { Done } from '../screens/Done';
import { Settings } from '../screens/Settings';
import { ProfileEdit } from '../screens/ProfileEdit';
import { HostInbox } from '../screens/HostInbox';
import { CreateParty } from '../screens/CreateParty';
import { AccountEdit } from '../screens/AccountEdit';
import { CreateProAccount } from '../screens/CreateProAccount';
import { FollowRequests } from '../screens/FollowRequests';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Loading = () => (
  <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator color={color.gold[500]} />
  </View>
);

export const RootNavigator = () => {
  const auth = useAuth();

  if (auth.status === 'bootstrapping') return <Loading />;

  if (auth.status === 'signedOut') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntry} />
        <Stack.Screen name="PhoneOTP" component={PhoneOTP} />
      </Stack.Navigator>
    );
  }

  // Signed in. Initial route depends on whether onboarding fields are filled.
  const initial: keyof RootStackParamList =
    !auth.user.name || !auth.user.birthdate ? 'Profile'
    : !auth.user.role ? 'Role'
    : 'MainTabs';

  // Settings and its children slide up like a sheet — they're tab-bar-hiding
  // overlays, not flow steps. Onboarding (Profile/Role/Done) stays
  // slide-from-right since it reads as forward progression.
  const sheet = { animation: 'slide_from_bottom', gestureDirection: 'vertical' } as const;

  return (
    <Stack.Navigator
      initialRouteName={initial}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Role" component={Role} />
      <Stack.Screen name="Done" component={Done} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="Settings"          component={Settings}          options={sheet} />
      <Stack.Screen name="ProfileEdit"       component={ProfileEdit}       options={sheet} />
      <Stack.Screen name="HostInbox"         component={HostInbox}         options={sheet} />
      <Stack.Screen name="CreateParty"       component={CreateParty}       options={sheet} />
      <Stack.Screen name="AccountEdit"       component={AccountEdit}       options={sheet} />
      <Stack.Screen name="CreateProAccount"  component={CreateProAccount}  options={sheet} />
      <Stack.Screen name="FollowRequests"    component={FollowRequests}    options={sheet} />
    </Stack.Navigator>
  );
};
