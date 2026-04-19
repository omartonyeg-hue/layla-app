-- Cloudinary media support on Post and Story.
-- Post.mediaUrls is an ordered array (index 0 = cover for carousel).
-- Story.mediaUrl is single-photo (stories aren't carousels in IG either).
-- Already applied to the shared Neon DB via `prisma db push`; recorded
-- here for migration history.

ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "mediaUrl" TEXT;
