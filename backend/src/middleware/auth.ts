import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';

// `req.userId` is added globally to Express.Request via
// `src/types/express.d.ts`. Downstream route handlers can read it directly
// after `requireAuth` runs (use `req.userId!` since the type stays optional).
//
// `AuthedRequest` is kept as a deprecated alias only so existing imports
// don't break — new code should just rely on `req.userId`.
export type AuthedRequest = Request;

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    const { sub } = verifyToken(header.slice(7));
    req.userId = sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
