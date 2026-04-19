import Constants from 'expo-constants';

// In dev, auto-derive the backend host from Metro's own host so the iPhone hits
// the same LAN IP. `hostUri` looks like "192.168.100.52:8081" under Expo Go.
// In prod we'll swap this for a configured EXPO_PUBLIC_API_URL.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
const envBase = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL =
  envBase?.replace(/\/$/, '') ?? (devHost ? `http://${devHost}:3001` : 'http://localhost:3001');

class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string, public body?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

const request = async <T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> => {
  const { token, ...rest } = init;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : null),
      ...rest.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      (body as { error?: string }).error ?? `Request failed: ${res.status}`,
      res.status,
      (body as { code?: string }).code,
      body,
    );
  }
  return body as T;
};

export type City = 'CAIRO' | 'ALEXANDRIA' | 'SAHEL' | 'GOUNA' | 'SHARM' | 'HURGHADA';
export type Role = 'GUEST' | 'HOST' | 'PRO';

export type LaylaUser = {
  id: string;
  phone: string;
  name: string | null;
  birthdate: string | null; // ISO date string (YYYY-MM-DD)
  city: City | null;
  vibes: string[];
  role: Role | null;
};

export const api = {
  requestOtp: (phone: string) =>
    request<{ ok: true; expiresAt: string }>('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    request<{
      token: string;
      user: LaylaUser;
      needsProfile: boolean;
      needsRole: boolean;
    }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  getMyProfile: (token: string) =>
    request<{ user: LaylaUser }>('/users/me', { token }),

  updateProfile: (
    token: string,
    data: { name: string; birthdate: string; city: City; vibes: string[] },
  ) =>
    request<{ user: LaylaUser }>('/users/me/profile', {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    }),

  updateRole: (token: string, role: Role) =>
    request<{ user: LaylaUser }>('/users/me/role', {
      method: 'PATCH',
      token,
      body: JSON.stringify({ role }),
    }),

  // ── Phase 2 — Events ────────────────────────────────────────
  listEvents: (token: string) =>
    request<{ events: EventWithTiers[] }>('/events', { token }),

  getEvent: (token: string, id: string) =>
    request<{ event: EventWithTiers }>(`/events/${id}`, { token }),

  purchaseTicket: (token: string, eventId: string, tierId: string) =>
    request<{ ticket: TicketDetail }>(`/events/${eventId}/purchase`, {
      method: 'POST',
      token,
      body: JSON.stringify({ tierId }),
    }),

  listMyTickets: (token: string) =>
    request<{ tickets: TicketDetail[] }>('/events/tickets/me', { token }),

  // ── Phase 3 — Parties ──────────────────────────────────────
  listParties: (token: string) =>
    request<{ parties: PartyListItem[] }>('/parties', { token }),

  getParty: (token: string, id: string) =>
    request<{ party: PartyDetail; myRequest: PartyRequest | null }>(`/parties/${id}`, { token }),

  requestToJoin: (token: string, partyId: string, message?: string) =>
    request<{ request: PartyRequest }>(`/parties/${partyId}/request`, {
      method: 'POST',
      token,
      body: JSON.stringify({ message: message?.trim() || undefined }),
    }),

  getMyPartyRequest: (token: string, partyId: string) =>
    request<{ request: PartyRequest | null }>(`/parties/${partyId}/request/me`, { token }),

  createParty: (
    token: string,
    data: {
      title: string;
      theme: PartyTheme;
      emoji: string;
      gradient: string;
      neighborhood: string;
      address: string;
      doorDetail?: string;
      startsAt: string;          // ISO datetime
      cap: number;
      rules: string[];
      tag?: string | null;
      city?: City | null;
    },
  ) =>
    request<{ party: PartyDetail }>('/parties', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  hostInbox: (token: string) =>
    request<{ requests: HostInboxRequest[] }>('/parties/host/inbox', { token }),

  decidePartyRequest: (
    token: string,
    partyId: string,
    requestId: string,
    action: 'APPROVE' | 'DECLINE',
  ) =>
    request<{ request: PartyRequest }>(`/parties/${partyId}/requests/${requestId}/decide`, {
      method: 'POST',
      token,
      body: JSON.stringify({ action }),
    }),

  // ── Phase 4 — Community ────────────────────────────────────
  listFeed: (token: string) =>
    request<{ posts: Post[] }>('/community/feed', { token }),

  createReview: (
    token: string,
    data: { stars: number; vibes: string[]; text: string; venueEventId?: string },
  ) =>
    request<{ post: Post }>('/community/reviews', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  getPublicProfile: (token: string, userId: string) =>
    request<{
      user: PublicProfile;
      posts: Post[];
      hostedParties: ProfileParty[];
      reviewCount: number;
    }>(`/community/users/${userId}`, { token }),

  // ── Phase 5 — Valet ────────────────────────────────────────
  listNearbyDrivers: (token: string) =>
    request<{ drivers: NearbyDriver[] }>('/valet/drivers/nearby', { token }),

  createRide: (
    token: string,
    data: { pickupLabel: string; dropoffLabel: string; distanceKm: number; etaMinutes: number; fareEgp: number },
  ) =>
    request<{ ride: Ride }>('/valet/rides', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  getRide: (token: string, id: string) =>
    request<{ ride: Ride }>(`/valet/rides/${id}`, { token }),

  startRide: (token: string, id: string) =>
    request<{ ride: Ride }>(`/valet/rides/${id}/start`, { method: 'POST', token, body: '{}' }),

  completeRide: (token: string, id: string) =>
    request<{ ride: Ride }>(`/valet/rides/${id}/complete`, { method: 'POST', token, body: '{}' }),

  cancelRide: (token: string, id: string) =>
    request<{ ok: true }>(`/valet/rides/${id}/cancel`, { method: 'POST', token, body: '{}' }),

  rateRide: (
    token: string,
    id: string,
    data: { stars: number; tags: string[]; tipEgp: number; comment?: string },
  ) =>
    request<{ rating: RideRating }>(`/valet/rides/${id}/rate`, {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  // ── Phase 6 — Pro / Scale ──────────────────────────────────
  listPlans: (token: string) =>
    request<{ plans: ProPlan[]; trialDays: number }>('/pro/plans', { token }),

  getMyPro: (token: string) =>
    request<{ subscription: Subscription | null; stats: ProStats }>('/pro/me', { token }),

  subscribePro: (token: string, plan: 'ANNUAL' | 'MONTHLY') =>
    request<{ subscription: Subscription }>('/pro/subscribe', {
      method: 'POST',
      token,
      body: JSON.stringify({ plan }),
    }),

  cancelPro: (token: string) =>
    request<{ subscription: Subscription }>('/pro/cancel', { method: 'POST', token, body: '{}' }),

  listDrops: (token: string) =>
    request<{ drops: Drop[] }>('/pro/drops', { token }),
};

export type ProPlan = {
  id: 'ANNUAL' | 'MONTHLY';
  label: string;
  priceMonthlyEqEgp: number;
  billingNote: string;
  saveBadge: string | null;
};

export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'CANCELED';

export type Subscription = {
  id: string;
  userId: string;
  plan: 'ANNUAL' | 'MONTHLY';
  status: SubscriptionStatus;
  priceEgp: number;
  startedAt: string;
  trialEndsAt: string | null;
  renewsAt: string;
  canceledAt: string | null;
};

export type ProStats = {
  dropsUnlocked: number;
  egpSaved: number;
  linesSkipped: number;
  dropsActive: number;
  activePerks: number;
};

export type Drop = {
  id: string;
  name: string;
  host: string;
  neighborhood: string;
  emoji: string;
  gradient: string;
  startsAt: string;
  capacity: number;
  taken: number;
  tag: 'LIVE' | 'LIMITED' | 'EXCLUSIVE';
  feeEgp: number;
};

export type DriverSummary = {
  id: string;
  name: string;
  avatarColor: string | null;
  rating: number;
  trips: number;
  yearsActive: number;
  carMake: string;
  carModel: string;
  carColor: string;
  plate: string;
  transmission: string;
};

export type NearbyDriver = DriverSummary & {
  etaMinutes: number;
  distanceKm: number;
};

export type RideStatus = 'PENDING' | 'MATCHING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export type Ride = {
  id: string;
  riderId: string;
  driverId: string | null;
  driver: DriverSummary | null;
  pickupLabel: string;
  dropoffLabel: string;
  distanceKm: number;
  etaMinutes: number;
  fareEgp: number;
  status: RideStatus;
  createdAt: string;
  assignedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  rating: RideRating | null;
};

export type RideRating = {
  id: string;
  rideId: string;
  stars: number;
  tags: string[];
  tipEgp: number;
  comment: string | null;
  createdAt: string;
};

export type PostKind = 'REVIEW' | 'PHOTO' | 'TEXT';

export type PostAuthor = {
  id: string;
  name: string | null;
  avatarColor: string | null;
  role: Role | null;
  hostVerified: boolean;
};

export type PostVenue = {
  id: string;
  name: string;
  venue: string;
  location: string | null;
  gradient: string;
};

export type Post = {
  id: string;
  author: PostAuthor;
  kind: PostKind;
  text: string | null;
  stars: number | null;
  vibes: string[];
  venueEvent: PostVenue | null;
  createdAt: string;
};

export type PublicProfile = {
  id: string;
  name: string | null;
  avatarColor: string | null;
  role: Role | null;
  city: City | null;
  vibes: string[];
  hostRating: number | null;
  hostedCount: number;
  hostVerified: boolean;
};

export type ProfileParty = {
  id: string;
  title: string;
  emoji: string;
  gradient: string;
  neighborhood: string;
  startsAt: string;
  cap: number;
};

export type PartyHostSummary = {
  id: string;
  name: string | null;
  avatarColor: string | null;
  hostRating: number | null;
  hostedCount: number;
  hostVerified: boolean;
};

export type PartyTheme = 'ROOFTOP' | 'UNDERGROUND' | 'POOL' | 'BEACH' | 'LOFT' | 'HOUSE';

export type PartyBase = {
  id: string;
  title: string;
  theme: PartyTheme;
  emoji: string;
  gradient: string;     // token key
  neighborhood: string;
  startsAt: string;
  cap: number;
  rules: string[];
  tag: string | null;
  city: City | null;
  host: PartyHostSummary;
  approvedCount: number;
};

export type PartyListItem = PartyBase & { address: null; doorDetail: null };
export type PartyDetail = PartyBase & {
  address: string | null;    // null until my request is APPROVED
  doorDetail: string | null;
};

export type PartyRequest = {
  id: string;
  partyId: string;
  requesterId: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  message: string | null;
  decidedAt: string | null;
  createdAt: string;
};

export type HostInboxRequest = {
  id: string;
  partyId: string;
  requesterId: string;
  status: 'PENDING';
  message: string | null;
  createdAt: string;
  party: {
    id: string;
    title: string;
    emoji: string;
    gradient: string;
    startsAt: string;
    neighborhood: string;
  };
  requester: {
    id: string;
    name: string | null;
    avatarColor: string | null;
    city: City | null;
    vibes: string[];
    role: Role | null;
    hostVerified: boolean;
  };
};

export type EventTier = {
  id: string;
  eventId: string;
  name: string;
  description: string;
  priceEgp: number;
  stockTotal: number;
  stockLeft: number;
  sortOrder: number;
};

export type EventWithTiers = {
  id: string;
  name: string;
  venue: string;
  location: string | null;
  description: string;
  startsAt: string;    // ISO
  gradient: string;    // token key: "sunset" | "night" | "valet" | "community"
  lineup: string | null;
  tag: string | null;  // "HOT" | "NEW" | null
  featured: boolean;
  city: City | null;
  tiers: EventTier[];
};

export type TicketDetail = {
  id: string;
  orderRef: string;
  gate: string | null;
  createdAt: string;
  event: { name: string; venue: string; startsAt: string; gradient?: string };
  tier:  { name: string; priceEgp: number };
};

export { ApiError };
