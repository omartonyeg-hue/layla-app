import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { HANDLE_REGEX, generateUniqueHandle, sanitizeHandleBase } from '../lib/handle.js';

const router = Router();
router.use(requireAuth);

// Minimal projection of an Account surfaced everywhere a profile is shown.
const accountPublicSelect = {
  id: true,
  ownerUserId: true,
  kind: true,
  status: true,
  handle: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  avatarColor: true,
  isPrivate: true,
  isVerified: true,
  createdAt: true,
} as const;

// Return the caller's personal Account (kind=USER). All mobile clients use
// this to bootstrap "my account" after login.
const findMyAccount = async (userId: string) =>
  prisma.account.findFirst({
    where: { ownerUserId: userId, kind: 'USER' },
    select: accountPublicSelect,
  });

router.get('/me', async (req, res) => {
  const account = await findMyAccount(req.userId!);
  if (!account) return res.status(404).json({ error: 'Personal account not found' });
  const [followerCount, followingCount, otherAccounts] = await Promise.all([
    prisma.follow.count({ where: { followeeId: account.id, status: 'APPROVED' } }),
    prisma.follow.count({ where: { followerId: account.id, status: 'APPROVED' } }),
    prisma.account.findMany({
      where: { ownerUserId: req.userId!, kind: { not: 'USER' } },
      select: accountPublicSelect,
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return res.json({ account: { ...account, followerCount, followingCount }, otherAccounts });
});

// GET /accounts/by-handle/:handle — lightweight lookup (for @mentions later).
router.get('/by-handle/:handle', async (req, res) => {
  const account = await prisma.account.findUnique({
    where: { handle: req.params.handle.toLowerCase() },
    select: accountPublicSelect,
  });
  if (!account || account.status !== 'ACTIVE') return res.status(404).json({ error: 'Not found' });
  return res.json({ account });
});

// GET /accounts/:id — public profile. Privacy filter: if account.isPrivate
// and the caller isn't an approved follower (or the owner), hide post data;
// just return header stats + the viewer's follow status so they can request.
router.get('/:id', async (req, res) => {
  const viewerUserId = req.userId!;
  const viewerAccount = await findMyAccount(viewerUserId);
  if (!viewerAccount) return res.status(404).json({ error: 'Personal account not found' });

  const target = await prisma.account.findUnique({
    where: { id: req.params.id },
    select: accountPublicSelect,
  });
  if (!target) return res.status(404).json({ error: 'Not found' });
  if (target.status !== 'ACTIVE' && target.ownerUserId !== viewerUserId) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Relationship summary from the viewer's perspective.
  const [outgoing, incoming, followerCount, followingCount] = await Promise.all([
    prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId: viewerAccount.id, followeeId: target.id } },
      select: { status: true },
    }),
    prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId: target.id, followeeId: viewerAccount.id } },
      select: { status: true },
    }),
    prisma.follow.count({ where: { followeeId: target.id, status: 'APPROVED' } }),
    prisma.follow.count({ where: { followerId: target.id, status: 'APPROVED' } }),
  ]);

  const isMe = target.ownerUserId === viewerUserId;
  const isFollowing = outgoing?.status === 'APPROVED';
  const hasPendingRequest = outgoing?.status === 'PENDING';
  const followsMe = incoming?.status === 'APPROVED';
  const canViewContent = isMe || !target.isPrivate || isFollowing;

  return res.json({
    account: {
      ...target,
      followerCount,
      followingCount,
      isMe,
      isFollowing,
      hasPendingRequest,
      followsMe,
      canViewContent,
    },
  });
});

// PATCH /accounts/me — update the caller's personal Account.
const MePatchBody = z.object({
  handle: z.string().optional(),
  displayName: z.string().trim().min(1).max(40).optional(),
  bio: z.string().trim().max(160).nullable().optional(),
  avatarColor: z.string().regex(/^#?[0-9A-Fa-f]{6}$/).nullable().optional(),
  avatarUrl: z.string().url().startsWith('https://res.cloudinary.com/').nullable().optional(),
  isPrivate: z.boolean().optional(),
});

router.patch('/me', async (req, res) => {
  const parsed = MePatchBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const me = await findMyAccount(req.userId!);
  if (!me) return res.status(404).json({ error: 'Personal account not found' });

  const data: Record<string, unknown> = {};
  if (parsed.data.displayName !== undefined) data.displayName = parsed.data.displayName;
  if (parsed.data.bio !== undefined) data.bio = parsed.data.bio?.trim() || null;
  if (parsed.data.avatarColor !== undefined) {
    data.avatarColor = parsed.data.avatarColor
      ? parsed.data.avatarColor.startsWith('#')
        ? parsed.data.avatarColor
        : `#${parsed.data.avatarColor}`
      : null;
  }
  if (parsed.data.avatarUrl !== undefined) data.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.isPrivate !== undefined) data.isPrivate = parsed.data.isPrivate;

  if (parsed.data.handle !== undefined) {
    const next = parsed.data.handle.toLowerCase();
    if (!HANDLE_REGEX.test(next)) {
      return res.status(400).json({ error: 'Handle must be 3-20 lowercase letters, digits, or underscores.' });
    }
    if (next !== me.handle) {
      const existing = await prisma.account.findUnique({ where: { handle: next }, select: { id: true } });
      if (existing && existing.id !== me.id) {
        return res.status(409).json({ error: 'That username is taken.' });
      }
      data.handle = next;
    }
  }

  const updated = await prisma.account.update({
    where: { id: me.id },
    data,
    select: accountPublicSelect,
  });
  return res.json({ account: updated });
});

// POST /accounts/:id/follow — toggle follow. Private accounts get PENDING;
// public accounts get APPROVED immediately. Returns updated status.
router.post('/:id/follow', async (req, res) => {
  const viewer = await findMyAccount(req.userId!);
  if (!viewer) return res.status(404).json({ error: 'Personal account not found' });

  const target = await prisma.account.findUnique({
    where: { id: req.params.id },
    select: { id: true, ownerUserId: true, isPrivate: true, status: true },
  });
  if (!target || target.status !== 'ACTIVE') return res.status(404).json({ error: 'Not found' });
  if (target.id === viewer.id) return res.status(400).json({ error: "Can't follow yourself" });

  const existing = await prisma.follow.findUnique({
    where: { followerId_followeeId: { followerId: viewer.id, followeeId: target.id } },
  });

  if (existing) {
    // Toggle off — unfollow / cancel pending request.
    await prisma.follow.delete({ where: { id: existing.id } });
    const followerCount = await prisma.follow.count({
      where: { followeeId: target.id, status: 'APPROVED' },
    });
    return res.json({ following: false, pending: false, followerCount });
  }

  const status = target.isPrivate ? 'PENDING' : 'APPROVED';
  await prisma.follow.create({
    data: {
      followerId: viewer.id,
      followeeId: target.id,
      status,
      decidedAt: status === 'APPROVED' ? new Date() : null,
    },
  });
  const followerCount = await prisma.follow.count({
    where: { followeeId: target.id, status: 'APPROVED' },
  });
  return res.json({ following: status === 'APPROVED', pending: status === 'PENDING', followerCount });
});

// GET /accounts/:id/followers — list approved followers. Blocked on private
// accounts unless the viewer is an approved follower or the owner.
router.get('/:id/followers', async (req, res) => {
  const viewer = await findMyAccount(req.userId!);
  if (!viewer) return res.status(404).json({ error: 'Personal account not found' });

  const target = await prisma.account.findUnique({
    where: { id: req.params.id },
    select: { id: true, ownerUserId: true, isPrivate: true, status: true },
  });
  if (!target || target.status !== 'ACTIVE') return res.status(404).json({ error: 'Not found' });

  if (target.isPrivate && target.ownerUserId !== req.userId) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId: viewer.id, followeeId: target.id } },
      select: { status: true },
    });
    if (follow?.status !== 'APPROVED') return res.status(403).json({ error: 'Private account' });
  }

  const rows = await prisma.follow.findMany({
    where: { followeeId: target.id, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    include: { follower: { select: accountPublicSelect } },
    take: 100,
  });
  return res.json({ accounts: rows.map((r) => r.follower) });
});

router.get('/:id/following', async (req, res) => {
  const viewer = await findMyAccount(req.userId!);
  if (!viewer) return res.status(404).json({ error: 'Personal account not found' });

  const target = await prisma.account.findUnique({
    where: { id: req.params.id },
    select: { id: true, ownerUserId: true, isPrivate: true, status: true },
  });
  if (!target || target.status !== 'ACTIVE') return res.status(404).json({ error: 'Not found' });

  if (target.isPrivate && target.ownerUserId !== req.userId) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId: viewer.id, followeeId: target.id } },
      select: { status: true },
    });
    if (follow?.status !== 'APPROVED') return res.status(403).json({ error: 'Private account' });
  }

  const rows = await prisma.follow.findMany({
    where: { followerId: target.id, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    include: { followee: { select: accountPublicSelect } },
    take: 100,
  });
  return res.json({ accounts: rows.map((r) => r.followee) });
});

// Pending follow requests for my personal account (when isPrivate=true).
router.get('/me/follow-requests', async (req, res) => {
  const me = await findMyAccount(req.userId!);
  if (!me) return res.status(404).json({ error: 'Personal account not found' });
  const rows = await prisma.follow.findMany({
    where: { followeeId: me.id, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: { follower: { select: accountPublicSelect } },
    take: 100,
  });
  return res.json({ requests: rows.map((r) => ({ id: r.id, createdAt: r.createdAt, account: r.follower })) });
});

const DecideBody = z.object({ action: z.enum(['APPROVE', 'DECLINE']) });
router.post('/me/follow-requests/:id/decide', async (req, res) => {
  const parsed = DecideBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

  const me = await findMyAccount(req.userId!);
  if (!me) return res.status(404).json({ error: 'Personal account not found' });

  const row = await prisma.follow.findUnique({ where: { id: req.params.id } });
  if (!row || row.followeeId !== me.id) return res.status(404).json({ error: 'Not found' });

  if (parsed.data.action === 'APPROVE') {
    await prisma.follow.update({
      where: { id: row.id },
      data: { status: 'APPROVED', decidedAt: new Date() },
    });
    return res.json({ ok: true, status: 'APPROVED' });
  }
  await prisma.follow.delete({ where: { id: row.id } });
  return res.json({ ok: true, status: 'DECLINED' });
});

// Create a Venue/DJ/Organizer account — starts as PENDING_REVIEW. One per
// kind per owner (enforced by the @@unique in the schema).
const CreateBody = z.object({
  kind: z.enum(['VENUE', 'DJ', 'ORGANIZER']),
  handle: z.string(),
  displayName: z.string().trim().min(1).max(40),
  bio: z.string().trim().max(160).optional(),
  applicationCity: z.enum(['CAIRO', 'ALEXANDRIA', 'SAHEL', 'GOUNA', 'SHARM', 'HURGHADA']).optional(),
  applicationAddress: z.string().trim().max(200).optional(),
  applicationLinks: z.array(z.string().url()).max(5).optional(),
  applicationNote: z.string().trim().max(500).optional(),
});

router.post('/', async (req, res) => {
  const parsed = CreateBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const normalizedHandle = parsed.data.handle.toLowerCase();
  if (!HANDLE_REGEX.test(normalizedHandle)) {
    return res.status(400).json({ error: 'Handle must be 3-20 lowercase letters, digits, or underscores.' });
  }

  const taken = await prisma.account.findUnique({ where: { handle: normalizedHandle }, select: { id: true } });
  if (taken) return res.status(409).json({ error: 'That username is taken.' });

  // @@unique(ownerUserId, kind) guards against duplicates — surface a
  // friendly error if the user already applied for this kind.
  const existing = await prisma.account.findFirst({
    where: { ownerUserId: req.userId!, kind: parsed.data.kind },
    select: { id: true, status: true },
  });
  if (existing) {
    return res.status(409).json({
      error: `You already have a ${parsed.data.kind.toLowerCase()} account (${existing.status.toLowerCase()}).`,
    });
  }

  const created = await prisma.account.create({
    data: {
      ownerUserId: req.userId!,
      kind: parsed.data.kind,
      status: 'PENDING_REVIEW',
      handle: normalizedHandle,
      displayName: parsed.data.displayName,
      bio: parsed.data.bio?.trim() || null,
      applicationCity: parsed.data.applicationCity ?? null,
      applicationAddress: parsed.data.applicationAddress?.trim() || null,
      applicationLinks: parsed.data.applicationLinks ?? [],
      applicationNote: parsed.data.applicationNote?.trim() || null,
    },
    select: accountPublicSelect,
  });
  return res.status(201).json({ account: created });
});

// GET /accounts/search?q=...&kind=...&limit=20
// Typeahead for @mentions and account discovery. Matches ACTIVE accounts by
// handle prefix OR displayName (case-insensitive contains). Ranked: exact
// handle match first, then handle prefix, then displayName, then by follower
// count. Limited to 20 by default.
const SearchQuery = z.object({
  q: z.string().trim().min(1).max(40),
  kind: z.enum(['USER', 'VENUE', 'DJ', 'ORGANIZER']).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

router.get('/search', async (req, res) => {
  const parsed = SearchQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid query' });

  const { q, kind, limit = 20 } = parsed.data;
  const qLower = q.toLowerCase();

  // Prisma doesn't express the ranking we want in one query cleanly, so we
  // fan out to three narrow queries (exact, handle-prefix, display-contains)
  // and merge. Each query takes at most `limit` rows — three round-trips
  // against Neon's pooled connection stays well under 100ms for the typeahead.
  const base = {
    where: {
      status: 'ACTIVE' as const,
      ...(kind ? { kind } : {}),
    },
    select: {
      id: true, ownerUserId: true, kind: true, status: true,
      handle: true, displayName: true, bio: true,
      avatarUrl: true, avatarColor: true,
      isPrivate: true, isVerified: true, createdAt: true,
    },
    take: limit,
  };

  const [exact, handlePrefix, nameMatch] = await Promise.all([
    prisma.account.findMany({ ...base, where: { ...base.where, handle: qLower } }),
    prisma.account.findMany({
      ...base,
      where: { ...base.where, handle: { startsWith: qLower } },
      orderBy: { handle: 'asc' },
    }),
    prisma.account.findMany({
      ...base,
      where: { ...base.where, displayName: { contains: q, mode: 'insensitive' } },
      orderBy: { displayName: 'asc' },
    }),
  ]);

  // Merge, dedupe by id, preserve ranking.
  const seen = new Set<string>();
  const out: typeof exact = [];
  for (const batch of [exact, handlePrefix, nameMatch]) {
    for (const a of batch) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      out.push(a);
      if (out.length >= limit) break;
    }
    if (out.length >= limit) break;
  }

  return res.json({ accounts: out });
});

// Check handle availability — used by the mobile client as the user types.
router.get('/handle-available/:handle', async (req, res) => {
  const handle = req.params.handle.toLowerCase();
  if (!HANDLE_REGEX.test(handle)) {
    return res.json({ available: false, reason: 'Must be 3-20 lowercase letters, digits, or underscores.' });
  }
  const existing = await prisma.account.findUnique({ where: { handle }, select: { id: true } });
  return res.json({ available: !existing });
});

export default router;
