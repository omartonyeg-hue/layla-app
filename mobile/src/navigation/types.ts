import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  EventWithTiers,
  PartyDetail,
  PartyListItem,
  Ride,
  StoryGroup,
  TicketDetail,
} from '../lib/api';

// ── Per-tab stack params ───────────────────────────────────────
export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: { event: EventWithTiers };
  Checkout: { event: EventWithTiers; tierId: string };
  TicketQR: { ticket: TicketDetail; from: 'purchase' | 'list' };
  MyTickets: undefined;
};

export type PartiesStackParamList = {
  PartiesFeed: undefined;
  PartyDetail: { party: PartyDetail | PartyListItem };
  RequestJoin: { party: PartyDetail };
  PartyApproved: { partyId: string };
};

export type CommunityStackParamList = {
  CommunityFeed: undefined;
  UserProfile: { userId: string };
  Composer: undefined;          // unified post composer (photos, caption, location, review)
  WriteReview: undefined;       // legacy — kept registered so old code/nav calls don't crash
  MoodComposer: undefined;      // legacy — replaced by Composer
  StoryComposer: undefined;
  StoryViewer: { groups: StoryGroup[]; startGroupIndex: number };
  Comments: { postId: string };
};

export type PinnedLocation = { label: string; lat: number; lng: number };

export type ValetStackParamList = {
  ValetBook: undefined;
  ValetPinLocation: {
    mode: 'pickup' | 'dropoff';
    initialLabel?: string;
    initialLat?: number;
    initialLng?: number;
    // Callback pattern keeps the pin screen decoupled from Book state.
    // React Navigation warns about non-serializable params in dev — acceptable
    // here because we never deep-link into the pin screen.
    onConfirm: (loc: PinnedLocation) => void;
  };
  ValetFinding: { ride: Ride };
  ValetTracking: { ride: Ride };
  ValetCompleted: { ride: Ride };
  ValetRate: { ride: Ride };
};

export type ProStackParamList = {
  ProRoot: undefined;        // wraps Landing/Dashboard branching
  ProCheckout: undefined;
  ProWelcome: undefined;
  ProDrops: undefined;
};

// ── Bottom tabs ───────────────────────────────────────────────
export type MainTabParamList = {
  EventsTab: NavigatorScreenParams<EventsStackParamList>;
  PartiesTab: NavigatorScreenParams<PartiesStackParamList>;
  CommunityTab: NavigatorScreenParams<CommunityStackParamList>;
  ValetTab: NavigatorScreenParams<ValetStackParamList>;
  ProTab: NavigatorScreenParams<ProStackParamList>;
};

// ── Root stack ────────────────────────────────────────────────
// Auth screens (shown when signedOut), profile-setup screens
// (shown when signedIn but profile/role missing), MainTabs (default
// signed-in surface), and shared modal-like screens that hide the tab
// bar by sitting above the tabs navigator.
export type RootStackParamList = {
  // Auth
  Splash: undefined;
  PhoneEntry: { initialPhone?: string } | undefined;
  PhoneOTP: { phone: string };

  // Profile setup (post-OTP)
  Profile: undefined;
  Role: undefined;
  Done: undefined;

  // Main
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;

  // Tab-bar-hiding overlays
  Settings: undefined;
  ProfileEdit: undefined;
  VehicleEdit: { returnTo?: keyof RootStackParamList } | undefined;
  HostInbox: undefined;
  CreateParty: undefined;
  AccountEdit: undefined;
  CreateProAccount: undefined;
  FollowRequests: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
