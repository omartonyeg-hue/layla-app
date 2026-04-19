import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const driverSelect = {
  id: true, name: true, avatarColor: true, rating: true, trips: true,
  yearsActive: true, carMake: true, carModel: true, carColor: true,
  plate: true, transmission: true,
} as const;

const rideInclude = {
  driver: { select: driverSelect },
  rating: true,
} as const;

// Dev-only mock — seconds before MATCHING auto-flips to ASSIGNED.
const DEV_MATCH_DELAY_MS = 5000;

router.get('/drivers/nearby', async (_req, res) => {
  const drivers = await prisma.driver.findMany({
    where: { online: true },
    orderBy: { rating: 'desc' },
    take: 6,
    select: driverSelect,
  });
  // Synthesize an ETA per driver since we don't have real geolocation yet.
  const withEta = drivers.map((d, i) => ({
    ...d,
    etaMinutes: 3 + i * 3,
    distanceKm: 1.2 + i * 1.2,
  }));
  return res.json({ drivers: withEta });
});

const CreateRideBody = z.object({
  pickupLabel: z.string().min(1).max(120),
  dropoffLabel: z.string().min(1).max(120),
  distanceKm: z.number().positive().max(500),
  etaMinutes: z.number().int().positive().max(600),
  fareEgp: z.number().int().positive().max(10000),
});

router.post('/rides', async (req, res) => {
  const parsed = CreateRideBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ride = await prisma.ride.create({
    data: {
      riderId: req.userId!,
      pickupLabel: parsed.data.pickupLabel,
      dropoffLabel: parsed.data.dropoffLabel,
      distanceKm: parsed.data.distanceKm,
      etaMinutes: parsed.data.etaMinutes,
      fareEgp: parsed.data.fareEgp,
      status: 'MATCHING',
    },
    include: rideInclude,
  });

  // Dev auto-match — pick the highest-rated online driver after a short delay.
  setTimeout(async () => {
    try {
      const top = await prisma.driver.findFirst({
        where: { online: true },
        orderBy: { rating: 'desc' },
      });
      if (!top) return;
      await prisma.ride.updateMany({
        where: { id: ride.id, status: 'MATCHING' },
        data: { driverId: top.id, status: 'ASSIGNED', assignedAt: new Date() },
      });
    } catch (err) {
      console.error('[valet] auto-match failed', err);
    }
  }, DEV_MATCH_DELAY_MS);

  return res.json({ ride });
});

router.get('/rides/:id', async (req, res) => {
  const ride = await prisma.ride.findUnique({
    where: { id: req.params.id },
    include: rideInclude,
  });
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  if (ride.riderId !== req.userId!) {
    return res.status(403).json({ error: 'Not your ride' });
  }
  return res.json({ ride });
});

router.post('/rides/:id/start', async (req, res) => {
  const ride = await prisma.ride.findUnique({ where: { id: req.params.id } });
  if (!ride || ride.riderId !== req.userId!) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  const updated = await prisma.ride.update({
    where: { id: ride.id },
    data: { status: 'IN_PROGRESS', startedAt: new Date() },
    include: rideInclude,
  });
  return res.json({ ride: updated });
});

router.post('/rides/:id/complete', async (req, res) => {
  const ride = await prisma.ride.findUnique({ where: { id: req.params.id } });
  if (!ride || ride.riderId !== req.userId!) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  const updated = await prisma.ride.update({
    where: { id: ride.id },
    data: { status: 'COMPLETED', completedAt: new Date() },
    include: rideInclude,
  });
  return res.json({ ride: updated });
});

router.post('/rides/:id/cancel', async (req, res) => {
  const ride = await prisma.ride.findUnique({ where: { id: req.params.id } });
  if (!ride || ride.riderId !== req.userId!) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  await prisma.ride.update({
    where: { id: ride.id },
    data: { status: 'CANCELED' },
  });
  return res.json({ ok: true });
});

const RatingBody = z.object({
  stars: z.number().int().min(1).max(5),
  tags: z.array(z.string().max(40)).max(8).default([]),
  tipEgp: z.number().int().min(0).max(2000).default(0),
  comment: z.string().max(400).optional(),
});

router.post('/rides/:id/rate', async (req, res) => {
  const parsed = RatingBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ride = await prisma.ride.findUnique({ where: { id: req.params.id } });
  if (!ride || ride.riderId !== req.userId!) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  if (ride.status !== 'COMPLETED') {
    return res.status(400).json({ error: 'Ride not completed yet' });
  }

  const rating = await prisma.rideRating.upsert({
    where: { rideId: ride.id },
    create: { rideId: ride.id, ...parsed.data, comment: parsed.data.comment ?? null },
    update: parsed.data,
  });
  return res.json({ rating });
});

export default router;
