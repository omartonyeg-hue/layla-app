import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Pricing config — single source of truth on the server. Frontend renders the
// plans grid using exactly this list, so keep them in sync.
const PLANS = [
  { id: 'ANNUAL'  as const, label: 'Annual',  priceMonthlyEqEgp: 799, billingNote: '/mo billed yearly', saveBadge: 'SAVE 11%' },
  { id: 'MONTHLY' as const, label: 'Monthly', priceMonthlyEqEgp: 899, billingNote: '/month',            saveBadge: null },
];

const TRIAL_DAYS = 7;

router.get('/plans', (_req, res) => {
  return res.json({ plans: PLANS, trialDays: TRIAL_DAYS });
});

router.get('/me', async (req, res) => {
  const userId = req.userId!;
  const sub = await prisma.subscription.findUnique({ where: { userId } });

  // Stats — derived. For demo purposes the values are computed cheaply from
  // existing tables; replace with real analytics once the perk-redemption flow
  // is built.
  const ticketCount = await prisma.ticket.count({ where: { userId } });
  const stats = {
    dropsUnlocked: sub ? 3 : 0,
    egpSaved: sub ? 1400 : 0,
    linesSkipped: ticketCount,
    dropsActive: 4,
    activePerks: 12,
  };
  return res.json({ subscription: sub, stats });
});

const SubscribeBody = z.object({ plan: z.enum(['ANNUAL', 'MONTHLY']) });

router.post('/subscribe', async (req, res) => {
  const parsed = SubscribeBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid plan' });

  const userId = req.userId!;
  const planConfig = PLANS.find((p) => p.id === parsed.data.plan)!;
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  const renewsAt = trialEndsAt; // first charge happens at trial end

  // Mock IAP — straight upsert. Real Apple/Stripe integration goes behind
  // a server-side receipt verification once payments are wired.
  const subscription = await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: planConfig.id,
      status: 'TRIALING',
      priceEgp: planConfig.priceMonthlyEqEgp,
      trialEndsAt,
      renewsAt,
    },
    update: {
      plan: planConfig.id,
      status: 'TRIALING',
      priceEgp: planConfig.priceMonthlyEqEgp,
      trialEndsAt,
      renewsAt,
      canceledAt: null,
    },
  });

  return res.json({ subscription });
});

router.post('/cancel', async (req, res) => {
  const userId = req.userId!;
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub) return res.status(404).json({ error: 'No active subscription' });

  const updated = await prisma.subscription.update({
    where: { userId },
    data: { status: 'CANCELED', canceledAt: new Date() },
  });
  return res.json({ subscription: updated });
});

router.get('/drops', async (_req, res) => {
  const drops = await prisma.drop.findMany({
    where: { startsAt: { gte: new Date() } },
    orderBy: { startsAt: 'asc' },
  });
  return res.json({ drops });
});

export default router;
