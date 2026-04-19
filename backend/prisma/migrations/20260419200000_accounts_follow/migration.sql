-- Accounts + Follow system for Instagram-style profiles.
-- Adds Account (kind: USER|VENUE|DJ|ORGANIZER), Follow (APPROVED|PENDING),
-- and application metadata for admin-reviewed professional accounts.
-- The shared Neon DB has already had these changes applied via
-- `prisma db push`; this file is recorded for migration history.

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "AccountKind" AS ENUM ('USER', 'VENUE', 'DJ', 'ORGANIZER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'PENDING_REVIEW', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "FollowStatus" AS ENUM ('APPROVED', 'PENDING');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "kind" "AccountKind" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "handle" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "avatarColor" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "applicationCity" "City",
    "applicationAddress" TEXT,
    "applicationLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicationNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followeeId" TEXT NOT NULL,
    "status" "FollowStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Account_handle_key" ON "Account"("handle");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_owner_kind_unique_personal" ON "Account"("ownerUserId", "kind");
CREATE INDEX IF NOT EXISTS "Account_ownerUserId_idx" ON "Account"("ownerUserId");
CREATE INDEX IF NOT EXISTS "Account_kind_idx" ON "Account"("kind");
CREATE INDEX IF NOT EXISTS "Account_status_idx" ON "Account"("status");

CREATE UNIQUE INDEX IF NOT EXISTS "Follow_followerId_followeeId_key" ON "Follow"("followerId", "followeeId");
CREATE INDEX IF NOT EXISTS "Follow_followeeId_status_idx" ON "Follow"("followeeId", "status");
CREATE INDEX IF NOT EXISTS "Follow_followerId_status_idx" ON "Follow"("followerId", "status");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "Account" ADD CONSTRAINT "Account_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
