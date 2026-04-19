import React from 'react';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabBar, type TabKey } from '../components';
import { EventsList } from '../screens/EventsList';
import { EventDetail } from '../screens/EventDetail';
import { Checkout } from '../screens/Checkout';
import { TicketQR } from '../screens/TicketQR';
import { MyTickets } from '../screens/MyTickets';
import { PartiesFeed } from '../screens/PartiesFeed';
import { PartyDetail } from '../screens/PartyDetail';
import { RequestJoin } from '../screens/RequestJoin';
import { PartyApproved } from '../screens/PartyApproved';
import { CommunityFeed } from '../screens/CommunityFeed';
import { UserProfile } from '../screens/UserProfile';
import { WriteReview } from '../screens/WriteReview';
import { MoodComposer } from '../screens/MoodComposer';
import { StoryComposer } from '../screens/StoryComposer';
import { StoryViewer } from '../screens/StoryViewer';
import { Comments } from '../screens/Comments';
import { ValetBook } from '../screens/ValetBook';
import { ValetFinding } from '../screens/ValetFinding';
import { ValetTracking } from '../screens/ValetTracking';
import { ValetCompleted } from '../screens/ValetCompleted';
import { ValetRate } from '../screens/ValetRate';
import { ProRoot } from '../screens/ProRoot';
import { ProCheckout } from '../screens/ProCheckout';
import { ProWelcome } from '../screens/ProWelcome';
import { ProDrops } from '../screens/ProDrops';
import type {
  EventsStackParamList,
  PartiesStackParamList,
  CommunityStackParamList,
  ValetStackParamList,
  ProStackParamList,
  MainTabParamList,
} from './types';

const stackOpts = { headerShown: false } as const;

const EventsStackNav = createNativeStackNavigator<EventsStackParamList>();
const EventsStack = () => (
  <EventsStackNav.Navigator screenOptions={stackOpts}>
    <EventsStackNav.Screen name="EventsList" component={EventsList} />
    <EventsStackNav.Screen name="EventDetail" component={EventDetail} />
    <EventsStackNav.Screen name="Checkout" component={Checkout} />
    <EventsStackNav.Screen name="TicketQR" component={TicketQR} />
    <EventsStackNav.Screen name="MyTickets" component={MyTickets} />
  </EventsStackNav.Navigator>
);

const PartiesStackNav = createNativeStackNavigator<PartiesStackParamList>();
const PartiesStack = () => (
  <PartiesStackNav.Navigator screenOptions={stackOpts}>
    <PartiesStackNav.Screen name="PartiesFeed" component={PartiesFeed} />
    <PartiesStackNav.Screen name="PartyDetail" component={PartyDetail} />
    <PartiesStackNav.Screen
      name="RequestJoin"
      component={RequestJoin}
      options={{ presentation: 'modal' }}
    />
    <PartiesStackNav.Screen name="PartyApproved" component={PartyApproved} />
  </PartiesStackNav.Navigator>
);

const CommunityStackNav = createNativeStackNavigator<CommunityStackParamList>();
const CommunityStack = () => (
  <CommunityStackNav.Navigator screenOptions={stackOpts}>
    <CommunityStackNav.Screen name="CommunityFeed" component={CommunityFeed} />
    <CommunityStackNav.Screen name="UserProfile" component={UserProfile} />
    <CommunityStackNav.Screen
      name="WriteReview"
      component={WriteReview}
      options={{ presentation: 'modal' }}
    />
    <CommunityStackNav.Screen
      name="MoodComposer"
      component={MoodComposer}
      options={{ presentation: 'modal' }}
    />
    <CommunityStackNav.Screen
      name="StoryComposer"
      component={StoryComposer}
      options={{ presentation: 'modal' }}
    />
    <CommunityStackNav.Screen
      name="StoryViewer"
      component={StoryViewer}
      options={{ presentation: 'fullScreenModal', animation: 'fade' }}
    />
    <CommunityStackNav.Screen
      name="Comments"
      component={Comments}
      options={{ presentation: 'modal' }}
    />
  </CommunityStackNav.Navigator>
);

const ValetStackNav = createNativeStackNavigator<ValetStackParamList>();
const ValetStack = () => (
  <ValetStackNav.Navigator screenOptions={stackOpts}>
    <ValetStackNav.Screen name="ValetBook" component={ValetBook} />
    <ValetStackNav.Screen name="ValetFinding" component={ValetFinding} />
    <ValetStackNav.Screen name="ValetTracking" component={ValetTracking} />
    <ValetStackNav.Screen name="ValetCompleted" component={ValetCompleted} />
    <ValetStackNav.Screen name="ValetRate" component={ValetRate} />
  </ValetStackNav.Navigator>
);

const ProStackNav = createNativeStackNavigator<ProStackParamList>();
const ProStack = () => (
  <ProStackNav.Navigator screenOptions={stackOpts}>
    <ProStackNav.Screen name="ProRoot" component={ProRoot} />
    <ProStackNav.Screen name="ProCheckout" component={ProCheckout} />
    <ProStackNav.Screen name="ProWelcome" component={ProWelcome} />
    <ProStackNav.Screen name="ProDrops" component={ProDrops} />
  </ProStackNav.Navigator>
);

// Map between react-navigation's tab route names and our TabBar's TabKey.
const TAB_KEY_BY_ROUTE: Record<keyof MainTabParamList, TabKey> = {
  EventsTab: 'events',
  PartiesTab: 'parties',
  CommunityTab: 'community',
  ValetTab: 'valet',
  ProTab: 'pro',
};
const ROUTE_BY_TAB_KEY: Record<TabKey, keyof MainTabParamList> = {
  events: 'EventsTab',
  parties: 'PartiesTab',
  community: 'CommunityTab',
  valet: 'ValetTab',
  pro: 'ProTab',
};

// Hide the tab bar on every detail screen inside a tab stack — the bar only
// appears on each tab's root.
const TAB_ROOT_BY_NAME: Record<keyof MainTabParamList, string> = {
  EventsTab: 'EventsList',
  PartiesTab: 'PartiesFeed',
  CommunityTab: 'CommunityFeed',
  ValetTab: 'ValetBook',
  ProTab: 'ProRoot',
};

// Renders our existing custom TabBar by adapting react-navigation's tab props.
const renderTabBar = (props: BottomTabBarProps) => {
  const route = props.state.routes[props.state.index];
  const activeKey = TAB_KEY_BY_ROUTE[route.name as keyof MainTabParamList];

  // If the focused inner-stack screen isn't the tab's root, hide the tab bar.
  // (Current detail screens are full-bleed, matching original state-machine UX.)
  const innerState = route.state;
  const innerRouteName = innerState?.routes?.[innerState.index ?? 0]?.name;
  const tabRootName = TAB_ROOT_BY_NAME[route.name as keyof MainTabParamList];
  const onRoot = !innerRouteName || innerRouteName === tabRootName;
  if (!onRoot) return null;

  return (
    <TabBar
      active={activeKey}
      onSelect={(key) => {
        const target = ROUTE_BY_TAB_KEY[key];
        props.navigation.navigate(target);
      }}
    />
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => (
  <Tab.Navigator
    tabBar={renderTabBar}
    screenOptions={{ headerShown: false, lazy: true, animation: 'shift' }}
  >
    <Tab.Screen name="EventsTab" component={EventsStack} />
    <Tab.Screen name="PartiesTab" component={PartiesStack} />
    <Tab.Screen name="CommunityTab" component={CommunityStack} />
    <Tab.Screen name="ValetTab" component={ValetStack} />
    <Tab.Screen name="ProTab" component={ProStack} />
  </Tab.Navigator>
);
