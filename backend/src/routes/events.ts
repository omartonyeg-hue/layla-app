import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// GET /events — list all upcoming, featured first, then by date. Tiers embedded
// so the EventCard can show "from N EGP" without a second round-trip.
router.get('/', async (_req, res) => {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: { startsAt: { gte: now } },
    orderBy: [{ featured: 'desc' }, { startsAt: 'asc' }],
    include: { tiers: { orderBy: { sortOrder: 'asc' } } },
  });
  return res.json({ events });
});

// NB: `/tickets/me` is declared *before* `/:id` so Express doesn't match
// "tickets" as an event id.
router.get('/tickets/me', async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    include: {
      event: { select: { name: true, venue: true, startsAt: true, gradient: true } },
      tier:  { select: { name: true, priceEgp: true } },
    },
  });
  return res.json({ tickets });
});

router.get('/:id', async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { tiers: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  return res.json({ event });
});

// Mock purchase flow — no real payment integration yet. Reserves a seat (decrements
// stockLeft under a transaction) and returns the Ticket so the mobile app can
// render the QR screen.
const PurchaseBody = z.object({ tierId: z.string().min(1) });

const randomOrderRef = (): string => {
  // e.g. "#LYL-8AF-24" — three hex chars, dash, two hex chars
  const a = crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 3);
  const b = crypto.randomBytes(1).toString('hex').toUpperCase();
  return `#LYL-${a}-${b}`;
};

const GATES = ['A · STANDARD', 'B · PRIORITY', 'C · VIP'];

router.post('/:id/purchase', async (req, res) => {
  const parsed = PurchaseBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

  const userId = req.userId!;
  const eventId = req.params.id;

  try {
    const ticket = await prisma.$transaction(async (tx) => {
      const tier = await tx.eventTier.findUnique({ where: { id: parsed.data.tierId } });
      if (!tier || tier.eventId !== eventId) throw new Error('Tier not found for event');
      if (tier.stockLeft <= 0) throw new Error('Sold out');

      await tx.eventTier.update({
        where: { id: tier.id },
        data: { stockLeft: { decrement: 1 } },
      });

      return tx.ticket.create({
        data: {
          userId,
          eventId,
          tierId: tier.id,
          orderRef: randomOrderRef(),
          gate: tier.name.startsWith('VIP') ? 'B · PRIORITY'
              : tier.name.startsWith('Table') ? 'C · VIP'
              : 'A · STANDARD',
        },
        include: {
          event: { select: { name: true, venue: true, startsAt: true } },
          tier:  { select: { name: true, priceEgp: true } },
        },
      });
    });

    return res.json({ ticket });
  } catch (err) {
    const message = (err as Error).message;
    const status = message === 'Sold out' ? 409 : message.includes('not found') ? 404 : 400;
    return res.status(status).json({ error: message });
  }
});

export default router;
