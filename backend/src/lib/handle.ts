import { prisma } from './prisma.js';

// Global @mention key: lowercase a-z, 0-9, underscore; 3-20 chars.
export const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

export const sanitizeHandleBase = (raw: string | null | undefined): string => {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 14); // leave room for a random suffix if we need to disambiguate
};

const randomSuffix = () => Math.random().toString(36).slice(2, 7);

// Generate a unique handle from a base string (name, phone, etc.). Tries the
// trunk first; falls back to trunk + random suffix if taken.
export const generateUniqueHandle = async (base: string): Promise<string> => {
  const trunk = base.length >= 3 ? base : 'member';
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate =
      attempt === 0 ? trunk.slice(0, 20) : `${trunk.slice(0, 14)}_${randomSuffix()}`;
    if (candidate.length < 3) continue;
    const exists = await prisma.account.findUnique({ where: { handle: candidate } });
    if (!exists) return candidate;
  }
  return `user_${randomSuffix()}${randomSuffix()}`;
};
