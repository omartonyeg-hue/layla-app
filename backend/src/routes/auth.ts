import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { normalizePhone } from '../lib/phone.js';
import { issueOtp, verifyOtp } from '../services/otp.js';

const router = Router();

const RequestOtpBody = z.object({ phone: z.string().min(6) });

router.post('/otp/request', async (req, res) => {
  const parsed = RequestOtpBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

  let phone: string;
  try {
    phone = normalizePhone(parsed.data.phone);
  } catch {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  try {
    const { expiresAt } = await issueOtp(phone);
    return res.json({ ok: true, expiresAt });
  } catch (err: any) {
    if (err.code === 'RESEND_COOLDOWN') {
      return res.status(429).json({ error: err.message, retryInMs: err.retryInMs });
    }
    // Express 4 doesn't forward async throws to the error middleware, so we
    // handle DB/network failures here rather than letting them crash the process.
    console.error('[otp/request] failed:', err?.message ?? err);
    return res.status(503).json({ error: 'Service unavailable. Try again.' });
  }
});

const VerifyOtpBody = z.object({
  phone: z.string().min(6),
  code: z.string().regex(/^\d{6}$/),
});

router.post('/otp/verify', async (req, res) => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body' });

  let phone: string;
  try {
    phone = normalizePhone(parsed.data.phone);
  } catch {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  try {
    await verifyOtp(phone, parsed.data.code);
  } catch (err: any) {
    const map: Record<string, number> = {
      OTP_NOT_FOUND: 410,
      OTP_LOCKED: 429,
      OTP_INVALID: 401,
    };
    return res.status(map[err.code] ?? 400).json({ error: err.message, code: err.code });
  }

  const user = await prisma.user.upsert({
    where: { phone },
    create: { phone, phoneVerified: true },
    update: { phoneVerified: true },
  });

  const token = signToken(user.id);
  return res.json({
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      birthdate: user.birthdate ? user.birthdate.toISOString().slice(0, 10) : null,
      city: user.city,
      vibes: user.vibes,
      role: user.role,
    },
    // The mobile app branches on these flags to pick the next onboarding step.
    needsProfile: !user.name || !user.birthdate || !user.city || user.vibes.length < 3,
    needsRole: !user.role,
  });
});

export default router;
