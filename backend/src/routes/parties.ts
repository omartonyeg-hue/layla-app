import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Host sub-selection used everywhere parties are returned.
const hostSelect = {
  id: true,
  name: true,
  avatarColor: true,
  hostRating: true,
  hostedCount: true,
  hostVerified: true,
} as const;

const baseInclude = {
  host: { select: hostSelect },
  _count: { select: { requests: { where: { status: 'APPROVED' as const } } } },
} as const;

// Strip address/door until the requester is approved. The frontend treats
// `address` === null as "locked" and renders a dashed rose row accordingly.
const maskAddressIfNotApproved = <
  T extends { address: string; doorDetail: string | null },
>(
  party: T,
  approved: boolean,
): T | (Omit<T, 'address' | 'doorDetail'> & { address: null; doorDetail: null }) =>
  approved ? party : { ...party, address: null, doorDetail: null };

const CreatePartyBody = z.object({
  title: z.string().min(2).max(60),
  theme: z.enum(['ROOFTOP', 'UNDERGROUND', 'POOL', 'BEACH', 'LOFT', 'HOUSE']),
  emoji: z.string().min(1).max(8),
  gradient: z.string().min(1).max(32),
  neighborhood: z.string().min(2).max(120),
  address: z.string().min(2).max(180),
  doorDetail: z.string().max(180).optional(),
  startsAt: z.string().datetime(),
  cap: z.number().int().min(2).max(500),
  rules: z.array(z.string().max(120)).max(10).default([]),
  tag: z.string().max(40).nullable().optional(),
  city: z.enum(['CAIRO', 'ALEXANDRIA', 'SAHEL', 'GOUNA', 'SHARM', 'HURGHADA']).nullable().optional(),
});

router.post('/', async (req, res) => {
  const parsed = CreatePartyBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const party = await prisma.party.create({
    data: {
      hostId: req.userId!,
      title: parsed.data.title,
      theme: parsed.data.theme,
      emoji: parsed.data.emoji,
      gradient: parsed.data.gradient,
      neighborhood: parsed.data.neighborhood,
      address: parsed.data.address,
      doorDetail: parsed.data.doorDetail ?? null,
      startsAt: new Date(parsed.data.startsAt),
      cap: parsed.data.cap,
      rules: parsed.data.rules,
      tag: parsed.data.tag ?? null,
      city: parsed.data.city ?? null,
    },
    include: baseInclude,
  });

  return res.json({ party });
});

router.get('/', async (_req, res) => {
  const parties = await prisma.party.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
    include: baseInclude,
  });
  // Feed view never exposes the address — approved count only.
  const masked = parties.map((p) => ({
    ...maskAddressIfNotApproved(p, false),
    approvedCount: p._count.requests,
  }));
  return res.json({ parties: masked });
});

// Hosts: pending requests across all parties this user hosts.
// NB: declared before /:id so "host" isn't parsed as a party id.
router.get('/host/inbox', async (req, res) => {
  const userId = req.userId!;
  const requests = await prisma.partyRequest.findMany({
    where: { status: 'PENDING', party: { hostId: userId } },
    orderBy: { createdAt: 'desc' },
    include: {
      party: { select: { id: true, title: true, emoji: true, gradient: true, startsAt: true, neighborhood: true } },
      requester: { select: { id: true, name: true, avatarColor: true, city: true, vibes: true, role: true, hostVerified: true } },
    },
  });
  return res.json({ requests });
});

const DecideBody = z.object({ action: z.enum(['APPROVE', 'DECLINE']) });

router.post('/:partyId/requests/:requestId/decide', async (req, res) => {
  const parsed = DecideBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid action' });

  const userId = req.userId!;
  const { partyId, requestId } = req.params;

  const party = await prisma.party.findUnique({ where: { id: partyId } });
  if (!party) return res.status(404).json({ error: 'Party not found' });
  if (party.hostId !== userId) return res.status(403).json({ error: 'Only the host can decide' });

  const request = await prisma.partyRequest.findUnique({ where: { id: requestId } });
  if (!request || request.partyId !== partyId) return res.status(404).json({ error: 'Request not found' });
  if (request.status !== 'PENDING') return res.status(409).json({ error: 'Already decided' });

  const updated = await prisma.partyRequest.update({
    where: { id: requestId },
    data: {
      status: parsed.data.action === 'APPROVE' ? 'APPROVED' : 'DECLINED',
      decidedAt: new Date(),
    },
  });
  return res.json({ request: updated });
});

// NB: declared before /:id so "my-requests" isn't parsed as a party id.
router.get('/my-requests', async (req, res) => {
  const requests = await prisma.partyRequest.findMany({
    where: { requesterId: req.userId! },
    orderBy: { createdAt: 'desc' },
    include: {
      party: { include: baseInclude },
    },
  });
  return res.json({ requests });
});

router.get('/:id', async (req, res) => {
  const userId = req.userId!;
  const party = await prisma.party.findUnique({
    where: { id: req.params.id },
    include: {
      ...baseInclude,
      requests: { where: { requesterId: userId } },
    },
  });
  if (!party) return res.status(404).json({ error: 'Party not found' });
  const myRequest = party.requests[0] ?? null;
  const approved = myRequest?.status === 'APPROVED';
  const { requests: _ignore, ...rest } = party;
  return res.json({
    party: {
      ...maskAddressIfNotApproved(rest, approved),
      approvedCount: party._count.requests,
    },
    myRequest,
  });
});

const RequestBody = z.object({
  message: z.string().max(240).optional(),
});

// Dev auto-approval window — host-side UI doesn't exist yet, so for demo
// the backend flips PENDING → APPROVED after a short delay.
const DEV_AUTO_APPROVE_MS = 5000;

router.post('/:id/request', async (req, res) => {
  const parsed = RequestBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

  const userId = req.userId!;
  const partyId = req.params.id;

  try {
    const party = await prisma.party.findUnique({ where: { id: partyId } });
    if (!party) return res.status(404).json({ error: 'Party not found' });
    if (party.hostId === userId) return res.status(400).json({ error: 'Hosts cannot request their own party' });

    const request = await prisma.partyRequest.upsert({
      where: { partyId_requesterId: { partyId, requesterId: userId } },
      create: { partyId, requesterId: userId, message: parsed.data.message ?? null },
      update: { message: parsed.data.message ?? null, status: 'PENDING', decidedAt: null },
    });

    // Schedule dev auto-approve. In production this is replaced by the host's
    // decision in the host-side UI.
    setTimeout(async () => {
      try {
        await prisma.partyRequest.updateMany({
          where: { id: request.id, status: 'PENDING' },
          data: { status: 'APPROVED', decidedAt: new Date() },
        });
      } catch (err) {
        console.error('[parties] dev auto-approve failed', err);
      }
    }, DEV_AUTO_APPROVE_MS);

    return res.json({ request });
  } catch (err) {
    console.error('[parties] request failed:', err);
    return res.status(503).json({ error: 'Service unavailable. Try again.' });
  }
});

router.get('/:id/request/me', async (req, res) => {
  const userId = req.userId!;
  const request = await prisma.partyRequest.findUnique({
    where: { partyId_requesterId: { partyId: req.params.id, requesterId: userId } },
  });
  return res.json({ request });
});

export default router;
