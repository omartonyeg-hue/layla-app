import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Keep the mobile-visible author shape tiny so we don't leak phone/birthdate/etc.
const authorSelect = {
  id: true,
  name: true,
  avatarColor: true,
  role: true,
  hostVerified: true,
} as const;

const venueSelect = {
  id: true,
  name: true,
  venue: true,
  location: true,
  gradient: true,
} as const;

// ── Feed ─────────────────────────────────────────────────────────
// Enriches each post with like/comment counts and whether the caller liked it.
router.get('/feed', async (req, res) => {
  const userId = req.userId!;
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      author: { select: authorSelect },
      venueEvent: { select: venueSelect },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId }, select: { id: true } },
    },
  });
  const shaped = posts.map(({ _count, likes, ...p }) => ({
    ...p,
    likeCount: _count.likes,
    commentCount: _count.comments,
    likedByMe: likes.length > 0,
  }));
  return res.json({ posts: shaped });
});

// ── Reviews (existing) ───────────────────────────────────────────
const ReviewBody = z.object({
  stars: z.number().int().min(1).max(5),
  vibes: z.array(z.string().max(32)).max(8).default([]),
  text: z.string().min(1).max(600),
  venueEventId: z.string().optional(),
});

router.post('/reviews', async (req, res) => {
  const parsed = ReviewBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (parsed.data.venueEventId) {
    const ev = await prisma.event.findUnique({ where: { id: parsed.data.venueEventId } });
    if (!ev) return res.status(400).json({ error: 'Unknown venue' });
  }

  const post = await prisma.post.create({
    data: {
      authorId: req.userId!,
      kind: 'REVIEW',
      stars: parsed.data.stars,
      vibes: parsed.data.vibes,
      text: parsed.data.text,
      venueEventId: parsed.data.venueEventId ?? null,
    },
    include: {
      author: { select: authorSelect },
      venueEvent: { select: venueSelect },
    },
  });
  return res.json({
    post: { ...post, likeCount: 0, commentCount: 0, likedByMe: false },
  });
});

// ── Mood posts ───────────────────────────────────────────────────
// Gradient canvas + emoji + optional caption. No photo upload infra yet; this
// matches LAYLA's gold/violet/sunset visual language.
const MoodBody = z.object({
  gradient: z.string().min(1).max(24),
  emoji: z.string().min(1).max(8),
  text: z.string().max(280).optional(),
  venueEventId: z.string().optional(),
});

router.post('/posts', async (req, res) => {
  const parsed = MoodBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  if (parsed.data.venueEventId) {
    const ev = await prisma.event.findUnique({ where: { id: parsed.data.venueEventId } });
    if (!ev) return res.status(400).json({ error: 'Unknown venue' });
  }

  const post = await prisma.post.create({
    data: {
      authorId: req.userId!,
      kind: 'MOOD',
      gradient: parsed.data.gradient,
      emoji: parsed.data.emoji,
      text: parsed.data.text?.trim() || null,
      venueEventId: parsed.data.venueEventId ?? null,
    },
    include: {
      author: { select: authorSelect },
      venueEvent: { select: venueSelect },
    },
  });
  return res.json({
    post: { ...post, likeCount: 0, commentCount: 0, likedByMe: false },
  });
});

// ── Likes ────────────────────────────────────────────────────────
// Toggle. Returns the fresh like state so the client can reconcile optimistic
// updates without fetching the whole feed.
router.post('/posts/:id/like', async (req, res) => {
  const userId = req.userId!;
  const postId = req.params.id;
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId, userId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({ data: { postId, userId } });
  }

  const likeCount = await prisma.postLike.count({ where: { postId } });
  return res.json({ liked: !existing, likeCount });
});

// ── Comments ─────────────────────────────────────────────────────
router.get('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const comments = await prisma.postComment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    include: { author: { select: authorSelect } },
    take: 200,
  });
  return res.json({ comments });
});

const CommentBody = z.object({ text: z.string().min(1).max(400) });
router.post('/posts/:id/comments', async (req, res) => {
  const parsed = CommentBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const postId = req.params.id;
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comment = await prisma.postComment.create({
    data: { postId, authorId: req.userId!, text: parsed.data.text.trim() },
    include: { author: { select: authorSelect } },
  });
  const commentCount = await prisma.postComment.count({ where: { postId } });
  return res.json({ comment, commentCount });
});

// ── Stories ──────────────────────────────────────────────────────
// Feed shape is grouped-by-author: tray shows one ring per author, viewer
// scrolls through that author's segments. 24h TTL; expired entries are filtered
// at read time (no cron — cheap for the phase-4 volume).
const STORY_TTL_MS = 24 * 60 * 60 * 1000;

router.get('/stories', async (req, res) => {
  const userId = req.userId!;
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: { expiresAt: { gt: now } },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: authorSelect },
      views: { where: { viewerId: userId }, select: { id: true } },
    },
  });

  // Group by author, preserving chronological order inside each group.
  const groups = new Map<
    string,
    {
      author: typeof stories[number]['author'];
      stories: Array<{
        id: string;
        gradient: string;
        emoji: string;
        caption: string | null;
        createdAt: Date;
        expiresAt: Date;
        seen: boolean;
      }>;
    }
  >();

  for (const s of stories) {
    const g = groups.get(s.authorId) ?? {
      author: s.author,
      stories: [],
    };
    g.stories.push({
      id: s.id,
      gradient: s.gradient,
      emoji: s.emoji,
      caption: s.caption,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      seen: s.views.length > 0,
    });
    groups.set(s.authorId, g);
  }

  const trayGroups = Array.from(groups.values()).map((g) => ({
    author: g.author,
    stories: g.stories,
    allSeen: g.stories.every((s) => s.seen),
    latestAt: g.stories[g.stories.length - 1]?.createdAt ?? null,
    isMe: g.author.id === userId,
  }));

  // Sort: me first, then unseen groups, then seen groups; within each, newest first.
  trayGroups.sort((a, b) => {
    if (a.isMe !== b.isMe) return a.isMe ? -1 : 1;
    if (a.allSeen !== b.allSeen) return a.allSeen ? 1 : -1;
    return (b.latestAt?.getTime() ?? 0) - (a.latestAt?.getTime() ?? 0);
  });

  return res.json({ groups: trayGroups });
});

const StoryBody = z.object({
  gradient: z.string().min(1).max(24),
  emoji: z.string().min(1).max(8),
  caption: z.string().max(160).optional(),
});

router.post('/stories', async (req, res) => {
  const parsed = StoryBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const story = await prisma.story.create({
    data: {
      authorId: req.userId!,
      gradient: parsed.data.gradient,
      emoji: parsed.data.emoji,
      caption: parsed.data.caption?.trim() || null,
      expiresAt: new Date(Date.now() + STORY_TTL_MS),
    },
    include: { author: { select: authorSelect } },
  });
  return res.json({ story });
});

router.post('/stories/:id/view', async (req, res) => {
  const storyId = req.params.id;
  const viewerId = req.userId!;
  // Upsert a view row — silent on repeat views.
  await prisma.storyView.upsert({
    where: { storyId_viewerId: { storyId, viewerId } },
    update: {},
    create: { storyId, viewerId },
  });
  return res.json({ ok: true });
});

// ── Public profile (existing) ────────────────────────────────────
// Accepts either a User id or an Account id in the route param; resolves to
// the personal (kind=USER) Account and hydrates follow relationship + counts
// alongside the existing host/review stats.
router.get('/users/:id', async (req, res) => {
  const viewerId = req.userId!;
  const param = req.params.id;

  // Try User id first, then fall back to Account id.
  let user = await prisma.user.findUnique({
    where: { id: param },
    select: {
      id: true,
      name: true,
      avatarColor: true,
      role: true,
      city: true,
      vibes: true,
      hostRating: true,
      hostedCount: true,
      hostVerified: true,
    },
  });
  if (!user) {
    const account = await prisma.account.findUnique({
      where: { id: param },
      select: { ownerUserId: true },
    });
    if (!account) return res.status(404).json({ error: 'User not found' });
    user = await prisma.user.findUnique({
      where: { id: account.ownerUserId },
      select: {
        id: true,
        name: true,
        avatarColor: true,
        role: true,
        city: true,
        vibes: true,
        hostRating: true,
        hostedCount: true,
        hostVerified: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
  }

  // Load both the target's personal Account and the viewer's, so we can
  // compute follow relationship + privacy gate.
  const [targetAccount, viewerAccount] = await Promise.all([
    prisma.account.findFirst({
      where: { ownerUserId: user.id, kind: 'USER' },
      select: {
        id: true, ownerUserId: true, kind: true, status: true,
        handle: true, displayName: true, bio: true,
        avatarUrl: true, avatarColor: true,
        isPrivate: true, isVerified: true, createdAt: true,
      },
    }),
    prisma.account.findFirst({
      where: { ownerUserId: viewerId, kind: 'USER' },
      select: { id: true },
    }),
  ]);

  const isMe = user.id === viewerId;
  let follow:
    | { isFollowing: boolean; hasPendingRequest: boolean; followsMe: boolean; canViewContent: boolean; followerCount: number; followingCount: number }
    = { isFollowing: false, hasPendingRequest: false, followsMe: false, canViewContent: true, followerCount: 0, followingCount: 0 };

  if (targetAccount) {
    const [outgoing, incoming, followerCount, followingCount] = await Promise.all([
      viewerAccount
        ? prisma.follow.findUnique({
            where: { followerId_followeeId: { followerId: viewerAccount.id, followeeId: targetAccount.id } },
            select: { status: true },
          })
        : Promise.resolve(null),
      viewerAccount
        ? prisma.follow.findUnique({
            where: { followerId_followeeId: { followerId: targetAccount.id, followeeId: viewerAccount.id } },
            select: { status: true },
          })
        : Promise.resolve(null),
      prisma.follow.count({ where: { followeeId: targetAccount.id, status: 'APPROVED' } }),
      prisma.follow.count({ where: { followerId: targetAccount.id, status: 'APPROVED' } }),
    ]);
    const isFollowing = outgoing?.status === 'APPROVED';
    const hasPendingRequest = outgoing?.status === 'PENDING';
    const followsMe = incoming?.status === 'APPROVED';
    const canViewContent = isMe || !targetAccount.isPrivate || isFollowing;
    follow = { isFollowing, hasPendingRequest, followsMe, canViewContent, followerCount, followingCount };
  }

  // Private account + not approved follower: return header only.
  if (!follow.canViewContent) {
    return res.json({
      user,
      account: targetAccount ? { ...targetAccount, ...follow, isMe } : null,
      posts: [],
      hostedParties: [],
      reviewCount: 0,
      privacyBlocked: true,
    });
  }

  const [posts, hostedParties, reviewCount] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      // PostCard always reads post.author, so include it even though these
      // posts are all by the profile's user — keeps the client code uniform.
      include: {
        author: { select: authorSelect },
        venueEvent: { select: venueSelect },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: viewerId }, select: { id: true } },
      },
    }),
    prisma.party.findMany({
      where: { hostId: user.id, startsAt: { gte: new Date() } },
      orderBy: { startsAt: 'asc' },
      take: 5,
      select: {
        id: true, title: true, emoji: true, gradient: true,
        neighborhood: true, startsAt: true, cap: true,
      },
    }),
    prisma.post.count({ where: { authorId: user.id, kind: 'REVIEW' } }),
  ]);

  const shapedPosts = posts.map(({ _count, likes, ...p }) => ({
    ...p,
    likeCount: _count.likes,
    commentCount: _count.comments,
    likedByMe: likes.length > 0,
  }));

  return res.json({
    user,
    account: targetAccount ? { ...targetAccount, ...follow, isMe } : null,
    posts: shapedPosts,
    hostedParties,
    reviewCount,
    privacyBlocked: false,
  });
});

export default router;
