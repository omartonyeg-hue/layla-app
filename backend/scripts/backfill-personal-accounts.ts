// Create a personal Account (kind=USER) for every existing User who doesn't
// have one. Handle = a lowercased/sanitized form of the User's name plus a
// short random suffix to guarantee uniqueness. Safe to re-run.
//
// Usage:
//   npx tsx scripts/backfill-personal-accounts.ts
//
// After this lands, the auth route should also create a personal Account on
// first OTP verification for new users.
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

const sanitize = (raw: string | null | undefined) => {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 14); // leave room for the suffix
};

const randomSuffix = () => Math.random().toString(36).slice(2, 7);

const nextHandle = async (base: string): Promise<string> => {
  const trunk = base.length >= 3 ? base : 'member';
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate =
      attempt === 0 ? trunk.slice(0, 20) : `${trunk.slice(0, 14)}_${randomSuffix()}`;
    if (candidate.length < 3) continue;
    const exists = await p.account.findUnique({ where: { handle: candidate } });
    if (!exists) return candidate;
  }
  // Extremely unlucky: fall back to pure random.
  return `user_${randomSuffix()}${randomSuffix()}`;
};

const main = async () => {
  const users = await p.user.findMany({
    where: {
      accounts: { none: { kind: 'USER' } },
    },
    select: { id: true, name: true, phone: true, avatarColor: true },
  });

  console.log(`Found ${users.length} user(s) without a personal Account.`);

  let created = 0;
  for (const u of users) {
    const base = sanitize(u.name) || sanitize(u.phone?.replace('+', '')) || 'member';
    const handle = await nextHandle(base);
    const displayName = u.name?.trim() || 'Member';
    await p.account.create({
      data: {
        ownerUserId: u.id,
        kind: 'USER',
        handle,
        displayName,
        avatarColor: u.avatarColor ?? null,
      },
    });
    created++;
    console.log(`  ${u.id} → @${handle} (${displayName})`);
  }

  console.log(`Created ${created} personal Account(s).`);
  await p.$disconnect();
};

main().catch(async (err) => {
  console.error(err);
  await p.$disconnect();
  process.exit(1);
});
