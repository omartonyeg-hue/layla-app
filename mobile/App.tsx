import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { color } from './src/theme/tokens';
import Splash from './src/screens/Splash';
import PhoneEntry from './src/screens/PhoneEntry';
import PhoneOTP from './src/screens/PhoneOTP';
import Profile from './src/screens/Profile';
import RoleScreen from './src/screens/Role';
import Done from './src/screens/Done';
import EventsList from './src/screens/EventsList';
import EventDetail from './src/screens/EventDetail';
import Checkout from './src/screens/Checkout';
import TicketQR from './src/screens/TicketQR';
import MyTickets from './src/screens/MyTickets';
import PartiesFeed from './src/screens/PartiesFeed';
import PartyDetail from './src/screens/PartyDetail';
import RequestJoin from './src/screens/RequestJoin';
import PartyApproved from './src/screens/PartyApproved';
import CommunityFeed from './src/screens/CommunityFeed';
import UserProfile from './src/screens/UserProfile';
import WriteReview from './src/screens/WriteReview';
import ValetBook from './src/screens/ValetBook';
import ValetFinding from './src/screens/ValetFinding';
import ValetTracking from './src/screens/ValetTracking';
import ValetCompleted from './src/screens/ValetCompleted';
import ValetRate from './src/screens/ValetRate';
import ProLanding from './src/screens/ProLanding';
import ProCheckout from './src/screens/ProCheckout';
import ProWelcome from './src/screens/ProWelcome';
import ProDashboard from './src/screens/ProDashboard';
import ProDrops from './src/screens/ProDrops';
import Settings from './src/screens/Settings';
import ProfileEdit from './src/screens/ProfileEdit';
import HostInbox from './src/screens/HostInbox';
import CreateParty from './src/screens/CreateParty';
import { TabBar, type TabKey } from './src/components';
import { saveToken, loadToken, clearToken } from './src/lib/auth';
import { api, type LaylaUser, type EventWithTiers, type TicketDetail, type PartyDetail as PartyDetailType, type PartyListItem, type Ride } from './src/lib/api';

// Linear state machine for Phases 1-3. The bottom TabBar is a persistent
// "feed" selector; detail/flow screens hide it. Swap the whole thing for
// react-navigation when Phases 4+ introduce deep links or modals.
type Step =
  | { name: 'splash' }
  | { name: 'phone'; initialPhone?: string }
  | { name: 'otp'; phone: string }
  | { name: 'profile'; token: string; user: LaylaUser }
  | { name: 'role'; token: string; user: LaylaUser }
  | { name: 'done'; token: string; user: LaylaUser }
  | { name: 'events'; token: string; user: LaylaUser }
  | { name: 'eventDetail'; token: string; user: LaylaUser; event: EventWithTiers }
  | { name: 'checkout'; token: string; user: LaylaUser; event: EventWithTiers; tierId: string }
  | { name: 'ticket'; token: string; user: LaylaUser; ticket: TicketDetail; from: 'purchase' | 'list' }
  | { name: 'tickets'; token: string; user: LaylaUser }
  | { name: 'parties'; token: string; user: LaylaUser }
  | { name: 'partyDetail'; token: string; user: LaylaUser; party: PartyDetailType | PartyListItem }
  | { name: 'partyRequest'; token: string; user: LaylaUser; party: PartyDetailType }
  | { name: 'partyApproved'; token: string; user: LaylaUser; partyId: string }
  | { name: 'community'; token: string; user: LaylaUser }
  | { name: 'userProfile'; token: string; user: LaylaUser; userId: string }
  | { name: 'writeReview'; token: string; user: LaylaUser }
  | { name: 'valet'; token: string; user: LaylaUser }
  | { name: 'valetFinding'; token: string; user: LaylaUser; ride: Ride }
  | { name: 'valetTracking'; token: string; user: LaylaUser; ride: Ride }
  | { name: 'valetCompleted'; token: string; user: LaylaUser; ride: Ride }
  | { name: 'valetRate'; token: string; user: LaylaUser; ride: Ride }
  | { name: 'pro'; token: string; user: LaylaUser }                          // landing OR dashboard, decided at render
  | { name: 'proCheckout'; token: string; user: LaylaUser }
  | { name: 'proWelcome'; token: string; user: LaylaUser }
  | { name: 'proDrops'; token: string; user: LaylaUser }
  | { name: 'settings'; token: string; user: LaylaUser }
  | { name: 'profileEdit'; token: string; user: LaylaUser }
  | { name: 'hostInbox'; token: string; user: LaylaUser }
  | { name: 'createParty'; token: string; user: LaylaUser };

// Feed-level steps show the bottom tab bar.
const FEED_STEPS: Step['name'][] = ['events', 'parties', 'community', 'valet', 'pro'];

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({ BebasNeue_400Regular });
  const [step, setStep] = useState<Step>({ name: 'splash' });
  const [ticketCount, setTicketCount] = useState(0);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  // Auto-login: try the saved JWT once on mount. On success skip straight past
  // splash/phone/OTP into the feed. On failure (missing or rejected token) the
  // user lands on splash and walks onboarding normally.
  useEffect(() => {
    (async () => {
      try {
        const token = await loadToken();
        if (!token) return;
        const { user } = await api.getMyProfile(token);
        setStep({ name: 'events', token, user });
      } catch {
        await clearToken();
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  // Refresh ticket count when we land back on the events feed.
  useEffect(() => {
    if (step.name !== 'events') return;
    api.listMyTickets(step.token)
      .then(({ tickets }) => setTicketCount(tickets.length))
      .catch(() => { /* keep last-known count */ });
  }, [step.name === 'events' ? step.token : null]);

  if ((!fontsLoaded && !fontError) || bootstrapping) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={color.gold[500]} />
      </View>
    );
  }

  const afterVerify = (token: string, user: LaylaUser, needsProfile: boolean, needsRole: boolean): Step => {
    if (needsProfile) return { name: 'profile', token, user };
    if (needsRole) return { name: 'role', token, user };
    return { name: 'events', token, user };
  };

  // Auth-scoped context for switching tabs. Splash/onboarding steps don't have
  // token/user yet, so the TabBar stays hidden there regardless.
  const authed = 'token' in step && 'user' in step
    ? { token: (step as any).token as string, user: (step as any).user as LaylaUser }
    : null;

  const onTabSelect = (key: TabKey) => {
    if (!authed) return;
    if (key === 'events') setStep({ name: 'events', ...authed });
    else if (key === 'parties') setStep({ name: 'parties', ...authed });
    else if (key === 'community') setStep({ name: 'community', ...authed });
    else if (key === 'valet') setStep({ name: 'valet', ...authed });
    else if (key === 'pro') setStep({ name: 'pro', ...authed });
  };

  const activeTab: TabKey | null =
    step.name === 'events' ? 'events'
    : step.name === 'parties' ? 'parties'
    : step.name === 'community' ? 'community'
    : step.name === 'valet' ? 'valet'
    : step.name === 'pro' ? 'pro'
    : null;
  const showTabBar = FEED_STEPS.includes(step.name);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={color.bg.base} />

      <View style={{ flex: 1 }}>
        {step.name === 'splash' && (
          <Splash
            onGetStarted={() => setStep({ name: 'phone' })}
            onSignIn={() => setStep({ name: 'phone' })}
          />
        )}

        {step.name === 'phone' && (
          <PhoneEntry
            initialPhone={step.initialPhone}
            onBack={() => setStep({ name: 'splash' })}
            onCodeSent={(phone) => setStep({ name: 'otp', phone })}
          />
        )}

        {step.name === 'otp' && (
          <PhoneOTP
            phone={step.phone}
            onBack={() => setStep({ name: 'phone', initialPhone: step.phone.replace(/^\+20/, '') })}
            onVerified={async ({ token, user, needsProfile, needsRole }) => {
              await saveToken(token);
              setStep(afterVerify(token, user, needsProfile, needsRole));
            }}
          />
        )}

        {step.name === 'profile' && (
          <Profile
            token={step.token}
            initial={step.user}
            onBack={() => setStep({ name: 'otp', phone: step.user.phone })}
            onSaved={(user) => setStep({ name: 'role', token: step.token, user })}
          />
        )}

        {step.name === 'role' && (
          <RoleScreen
            token={step.token}
            initial={step.user.role}
            onBack={() => setStep({ name: 'profile', token: step.token, user: step.user })}
            onChosen={(user) => setStep({ name: 'done', token: step.token, user })}
          />
        )}

        {step.name === 'done' && (
          <Done
            name={step.user.name ?? 'friend'}
            onStart={() => setStep({ name: 'events', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'events' && (
          <EventsList
            token={step.token}
            userName={step.user.name ?? ''}
            ticketCount={ticketCount}
            onOpenEvent={(event) => setStep({ name: 'eventDetail', token: step.token, user: step.user, event })}
            onOpenTickets={() => setStep({ name: 'tickets', token: step.token, user: step.user })}
            onOpenSettings={() => setStep({ name: 'settings', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'tickets' && (
          <MyTickets
            token={step.token}
            onBack={() => setStep({ name: 'events', token: step.token, user: step.user })}
            onOpenTicket={(ticket) => setStep({ name: 'ticket', token: step.token, user: step.user, ticket, from: 'list' })}
          />
        )}

        {step.name === 'eventDetail' && (
          <EventDetail
            token={step.token}
            eventId={step.event.id}
            initial={step.event}
            onBack={() => setStep({ name: 'events', token: step.token, user: step.user })}
            onCheckout={(event, tierId) => setStep({ name: 'checkout', token: step.token, user: step.user, event, tierId })}
          />
        )}

        {step.name === 'checkout' && (
          <Checkout
            token={step.token}
            event={step.event}
            tierId={step.tierId}
            onBack={() => setStep({ name: 'eventDetail', token: step.token, user: step.user, event: step.event })}
            onTicket={(ticket) => {
              setTicketCount((n) => n + 1);
              setStep({ name: 'ticket', token: step.token, user: step.user, ticket, from: 'purchase' });
            }}
          />
        )}

        {step.name === 'ticket' && (
          <TicketQR
            ticket={step.ticket}
            userName={step.user.name ?? 'Guest'}
            onBack={() =>
              setStep(
                step.from === 'list'
                  ? { name: 'tickets', token: step.token, user: step.user }
                  : { name: 'events', token: step.token, user: step.user },
              )
            }
          />
        )}

        {step.name === 'parties' && (
          <PartiesFeed
            token={step.token}
            onOpenParty={(party) => setStep({ name: 'partyDetail', token: step.token, user: step.user, party })}
            onOpenSettings={() => setStep({ name: 'settings', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'partyDetail' && (
          <PartyDetail
            token={step.token}
            partyId={step.party.id}
            initial={'address' in step.party ? (step.party as PartyDetailType) : undefined}
            onBack={() => setStep({ name: 'parties', token: step.token, user: step.user })}
            onRequestJoin={(party) => setStep({ name: 'partyRequest', token: step.token, user: step.user, party })}
            onAlreadyApproved={(party) => setStep({ name: 'partyApproved', token: step.token, user: step.user, partyId: party.id })}
          />
        )}

        {step.name === 'partyRequest' && (
          <RequestJoin
            token={step.token}
            party={step.party}
            me={step.user}
            onClose={() => setStep({ name: 'partyDetail', token: step.token, user: step.user, party: step.party })}
            onSent={() => setStep({ name: 'partyApproved', token: step.token, user: step.user, partyId: step.party.id })}
          />
        )}

        {step.name === 'partyApproved' && (
          <PartyApproved
            token={step.token}
            partyId={step.partyId}
            onBack={() => setStep({ name: 'parties', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'community' && (
          <CommunityFeed
            token={step.token}
            onOpenUser={(userId) => setStep({ name: 'userProfile', token: step.token, user: step.user, userId })}
            onWriteReview={() => setStep({ name: 'writeReview', token: step.token, user: step.user })}
            onOpenSettings={() => setStep({ name: 'settings', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'userProfile' && (
          <UserProfile
            token={step.token}
            userId={step.userId}
            onBack={() => setStep({ name: 'community', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'writeReview' && (
          <WriteReview
            token={step.token}
            onClose={() => setStep({ name: 'community', token: step.token, user: step.user })}
            onPosted={() => setStep({ name: 'community', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'valet' && (
          <ValetBook
            token={step.token}
            onOrdered={(ride) => setStep({ name: 'valetFinding', token: step.token, user: step.user, ride })}
            onOpenSettings={() => setStep({ name: 'settings', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'valetFinding' && (
          <ValetFinding
            token={step.token}
            ride={step.ride}
            onCancel={() => setStep({ name: 'valet', token: step.token, user: step.user })}
            onAssigned={(ride) => setStep({ name: 'valetTracking', token: step.token, user: step.user, ride })}
          />
        )}

        {step.name === 'valetTracking' && (
          <ValetTracking
            token={step.token}
            ride={step.ride}
            onArrived={(ride) => setStep({ name: 'valetCompleted', token: step.token, user: step.user, ride })}
          />
        )}

        {step.name === 'valetCompleted' && (
          <ValetCompleted
            ride={step.ride}
            onRate={() => setStep({ name: 'valetRate', token: step.token, user: step.user, ride: step.ride })}
            onDone={() => setStep({ name: 'valet', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'valetRate' && (
          <ValetRate
            token={step.token}
            ride={step.ride}
            onSubmitted={() => setStep({ name: 'valet', token: step.token, user: step.user })}
            onSkip={() => setStep({ name: 'valet', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'pro' && (
          <ProTab
            token={step.token}
            user={step.user}
            onSubscribe={() => setStep({ name: 'proCheckout', token: step.token, user: step.user })}
            onOpenDrops={() => setStep({ name: 'proDrops', token: step.token, user: step.user })}
            onOpenSettings={() => setStep({ name: 'settings', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'proCheckout' && (
          <ProCheckout
            token={step.token}
            onBack={() => setStep({ name: 'pro', token: step.token, user: step.user })}
            onSubscribed={() => setStep({ name: 'proWelcome', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'proWelcome' && (
          <ProWelcome onExplore={() => setStep({ name: 'pro', token: step.token, user: step.user })} />
        )}

        {step.name === 'proDrops' && (
          <ProDrops
            token={step.token}
            onBack={() => setStep({ name: 'pro', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'settings' && (
          <Settings
            user={step.user}
            onBack={() => setStep({ name: 'events', token: step.token, user: step.user })}
            onEditProfile={() => setStep({ name: 'profileEdit', token: step.token, user: step.user })}
            onHostInbox={() => setStep({ name: 'hostInbox', token: step.token, user: step.user })}
            onCreateParty={() => setStep({ name: 'createParty', token: step.token, user: step.user })}
            onSignOut={async () => {
              await clearToken();
              setStep({ name: 'splash' });
            }}
          />
        )}

        {step.name === 'profileEdit' && (
          <ProfileEdit
            token={step.token}
            initial={step.user}
            onBack={() => setStep({ name: 'settings', token: step.token, user: step.user })}
            onSaved={(user) => setStep({ name: 'settings', token: step.token, user })}
          />
        )}

        {step.name === 'hostInbox' && (
          <HostInbox
            token={step.token}
            onBack={() => setStep({ name: 'settings', token: step.token, user: step.user })}
          />
        )}

        {step.name === 'createParty' && (
          <CreateParty
            token={step.token}
            onBack={() => setStep({ name: 'settings', token: step.token, user: step.user })}
            onCreated={() => setStep({ name: 'parties', token: step.token, user: step.user })}
          />
        )}

        {showTabBar && activeTab ? <TabBar active={activeTab} onSelect={onTabSelect} /> : null}
      </View>
    </SafeAreaProvider>
  );
}

// Branches Pro tab between Landing (no subscription) and Dashboard (subscribed).
// Re-fetches on each mount so Welcome → Pro lands on Dashboard immediately.
const ProTab: React.FC<{
  token: string;
  user: LaylaUser;
  onSubscribe: () => void;
  onOpenDrops: () => void;
  onOpenSettings: () => void;
}> = ({ token, user, onSubscribe, onOpenDrops, onOpenSettings }) => {
  const [pro, setPro] = useState<{ subscription: { status: string } | null } | null>(null);
  const [trialDays, setTrialDays] = useState(7);
  const [monthlyAfter, setMonthlyAfter] = useState(899);

  useEffect(() => {
    api.getMyPro(token).then((r) => setPro(r)).catch(() => setPro({ subscription: null }));
    api.listPlans(token).then(({ plans, trialDays }) => {
      setTrialDays(trialDays);
      const monthly = plans.find((p) => p.id === 'MONTHLY');
      if (monthly) setMonthlyAfter(monthly.priceMonthlyEqEgp);
    }).catch(() => { /* fall back to defaults */ });
  }, [token]);

  if (!pro) {
    return (
      <View style={{ flex: 1, backgroundColor: color.bg.base, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={color.gold[500]} />
      </View>
    );
  }

  if (!pro.subscription || pro.subscription.status === 'CANCELED') {
    return (
      <ProLanding
        trialDays={trialDays}
        monthlyAfterEgp={monthlyAfter}
        onUnlock={onSubscribe}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  return (
    <ProDashboard
      token={token}
      userName={user.name ?? ''}
      onOpenDrops={onOpenDrops}
      onOpenSettings={onOpenSettings}
    />
  );
};
