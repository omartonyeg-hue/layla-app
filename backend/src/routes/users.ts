import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/me', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
});

// Matches the Profile step of onboarding-v2: name, birthdate, city, vibes (min 3).
const ProfileBody = z.object({
  name: z.string().min(1).max(60),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'birthdate must be YYYY-MM-DD'),
  city: z.enum(['CAIRO', 'ALEXANDRIA', 'SAHEL', 'GOUNA', 'SHARM', 'HURGHADA']),
  vibes: z.array(z.string()).min(3).max(12),
});

const yearsSince = (isoDate: string): number => {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number];
  const now = new Date();
  let age = now.getUTCFullYear() - y;
  const beforeBirthday =
    now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
};

router.patch('/me/profile', async (req, res) => {
  const parsed = ProfileBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const age = yearsSince(parsed.data.birthdate);
  if (age < 18) return res.status(400).json({ error: 'Must be 18 or older' });
  if (age > 120) return res.status(400).json({ error: 'Invalid birthdate' });

  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: {
      name: parsed.data.name,
      birthdate: new Date(parsed.data.birthdate),
      city: parsed.data.city,
      vibes: parsed.data.vibes,
    },
  });

  // Mirror the name onto the personal Account's displayName so the user's
  // profile/settings views stay in sync. Only overwrite if the user hasn't
  // customized their displayName yet (still the default 'Member').
  await prisma.account.updateMany({
    where: {
      ownerUserId: req.userId!,
      kind: 'USER',
      OR: [{ displayName: 'Member' }, { displayName: '' }],
    },
    data: { displayName: parsed.data.name },
  });

  return res.json({ user });
});

const RoleBody = z.object({ role: z.enum(['GUEST', 'HOST', 'PRO']) });

router.patch('/me/role', async (req, res) => {
  const parsed = RoleBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid role' });

  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: { role: parsed.data.role },
  });
  return res.json({ user });
});

export default router;
