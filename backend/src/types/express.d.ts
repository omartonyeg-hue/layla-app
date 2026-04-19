// Augment Express's Request so authed routes can read `req.userId` directly
// without casting. The `requireAuth` middleware sets it; downstream handlers
// use `req.userId!` (the bang asserts that auth ran first).
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}
