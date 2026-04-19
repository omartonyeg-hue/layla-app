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

router.get('/feed', async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      author: { select: authorSelect },
      venueEvent: { select: venueSelect },
    },
  });
  return res.json({ posts });
});

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
  return res.json({ post });
});

// Public profile of another user — read-only for Phase 4 MVP.
router.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
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

  return res.json({ user, posts, hostedParties, reviewCount });
});

export default router;
