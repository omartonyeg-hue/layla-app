import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';

const OTP_TTL_MS = 5 * 60 * 1000;    // 5 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000; // 30s — matches "RESEND IN 00:28" in design

export const generateCode = (): string => {
  // Uniformly distributed 6-digit code.
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
};

export const issueOtp = async (phone: string) => {
  const latest = await prisma.otpChallenge.findFirst({
    where: { phone },
    orderBy: { createdAt: 'desc' },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const retryInMs = RESEND_COOLDOWN_MS - (Date.now() - latest.createdAt.getTime());
    const err = new Error('Please wait before requesting another code');
    (err as any).code = 'RESEND_COOLDOWN';
    (err as any).retryInMs = retryInMs;
    throw err;
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpChallenge.create({
    data: { phone, codeHash, expiresAt },
  });

  if (config.otpDevLog) {
    console.log(`[OTP] ${phone} -> ${code} (expires ${expiresAt.toISOString()})`);
  } else if (config.smsProvider !== 'none') {
    // TODO: wire up SMS provider
  }

  return { expiresAt };
};

export const verifyOtp = async (phone: string, code: string) => {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  if (!challenge) {
    const err = new Error('Code expired or not found');
    (err as any).code = 'OTP_NOT_FOUND';
    throw err;
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    const err = new Error('Too many attempts');
    (err as any).code = 'OTP_LOCKED';
    throw err;
  }

  const ok = await bcrypt.compare(code, challenge.codeHash);
  if (!ok) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    const err = new Error('Invalid code');
    (err as any).code = 'OTP_INVALID';
    throw err;
  }

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });
};
