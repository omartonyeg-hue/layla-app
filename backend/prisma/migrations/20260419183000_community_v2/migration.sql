-- Community v2: Instagram-style interactions.
-- Adds MOOD post kind + gradient/emoji columns, plus PostLike / PostComment /
-- Story / StoryView tables. The shared Neon DB has already had these changes
-- applied via `prisma db push`; this file is recorded for migration history.

-- AlterEnum
ALTER TYPE "PostKind" ADD VALUE IF NOT EXISTS 'MOOD';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "gradient" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "emoji" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PostLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Story" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "StoryView" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PostLike_postId_userId_key" ON "PostLike"("postId", "userId");
CREATE INDEX IF NOT EXISTS "PostLike_postId_idx" ON "PostLike"("postId");
CREATE INDEX IF NOT EXISTS "PostLike_userId_createdAt_idx" ON "PostLike"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "PostComment_postId_createdAt_idx" ON "PostComment"("postId", "createdAt");
CREATE INDEX IF NOT EXISTS "PostComment_authorId_createdAt_idx" ON "PostComment"("authorId", "createdAt");

CREATE INDEX IF NOT EXISTS "Story_authorId_createdAt_idx" ON "Story"("authorId", "createdAt");
CREATE INDEX IF NOT EXISTS "Story_expiresAt_idx" ON "Story"("expiresAt");

CREATE UNIQUE INDEX IF NOT EXISTS "StoryView_storyId_viewerId_key" ON "StoryView"("storyId", "viewerId");
CREATE INDEX IF NOT EXISTS "StoryView_viewerId_createdAt_idx" ON "StoryView"("viewerId", "createdAt");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "StoryView" ADD CONSTRAINT "StoryView_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE "StoryView" ADD CONSTRAINT "StoryView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
