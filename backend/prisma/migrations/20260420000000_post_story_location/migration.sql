-- Free-text location tag on Post and Story (Phase 4a compose overhaul).
-- Shown as a 📍 pin in the feed / story header. Already applied to the
-- shared Neon DB via `prisma db push`; recorded here for history.

ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "location" TEXT;
