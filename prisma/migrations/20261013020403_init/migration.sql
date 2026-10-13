-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'REVIEWER', 'EDITOR');

-- CreateEnum
CREATE TYPE "EditorialStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'VERIFIED', 'PUBLISHED', 'OUTDATED');

-- CreateEnum
CREATE TYPE "ClaimType" AS ENUM ('FACT', 'INTERPRETATION', 'PROPOSAL', 'PREDICTION', 'OPINION');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('OFFICIAL', 'LEGISLATION', 'DATA', 'ACADEMIC', 'BOOK', 'JOURNALISM', 'FACT_CHECK', 'CAMPAIGN', 'DEMO', 'OTHER');

-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('UNKNOWN', 'OK', 'BLOCKED', 'BROKEN');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('LEFT', 'RIGHT');

-- CreateEnum
CREATE TYPE "Scope" AS ENUM ('BRAZIL', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "MythVerdict" AS ENUM ('CONFIRMED', 'FALSE', 'PARTIAL', 'CONTEXT_DEPENDENT', 'INSUFFICIENT_EVIDENCE');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PROMISE', 'IN_LEGISLATIVE_PROCESS', 'PARTIALLY_IMPLEMENTED', 'IMPLEMENTED', 'ABANDONED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AxisRelation" AS ENUM ('CONVENTIONAL', 'WEAK', 'NONE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "EditorialStatus" NOT NULL,
    "snapshot" JSONB NOT NULL,
    "note" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "institution" TEXT NOT NULL,
    "author" TEXT,
    "kind" "SourceKind" NOT NULL,
    "publishedLabel" TEXT,
    "publishedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "excerpt" TEXT,
    "notes" TEXT,
    "linkStatus" "LinkStatus" NOT NULL DEFAULT 'UNKNOWN',
    "linkCheckedAt" TIMESTAMP(3),
    "linkHttpCode" INTEGER,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "ClaimType" NOT NULL,
    "excerpt" TEXT,
    "context" TEXT,
    "limitations" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "verifiedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimSource" (
    "claimId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "locator" TEXT,

    CONSTRAINT "ClaimSource_pkey" PRIMARY KEY ("claimId","sourceId")
);

-- CreateTable
CREATE TABLE "Perspective" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "side" "Side" NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perspective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "perspectiveId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kicker" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "deepDive" TEXT,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Current" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "side" "Side",
    "summary" TEXT NOT NULL,
    "keyIdeas" TEXT[],
    "thinkers" TEXT[],
    "inBrazil" TEXT,
    "econX" DOUBLE PRECISION,
    "socialY" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Current_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valueConflict" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemePosition" (
    "id" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "side" "Side" NOT NULL,
    "summary" TEXT NOT NULL,
    "points" TEXT[],
    "nuances" TEXT NOT NULL,
    "claimKeys" TEXT[],
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scope" "Scope" NOT NULL,
    "tags" TEXT[],
    "claimKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Myth" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "verdict" "MythVerdict" NOT NULL,
    "explanation" TEXT NOT NULL,
    "claimKeys" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Myth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curiosity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "claimKey" TEXT,
    "tags" TEXT[],
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curiosity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dimension" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poleA" TEXT NOT NULL,
    "poleB" TEXT NOT NULL,
    "leftPole" TEXT,
    "relation" "AxisRelation" NOT NULL,
    "basis" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dimension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statement" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "dimensionId" TEXT NOT NULL,
    "direction" INTEGER NOT NULL,
    "argumentsAgree" TEXT NOT NULL,
    "argumentsDisagree" TEXT NOT NULL,
    "whyDepends" TEXT,
    "claimKeys" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ballotName" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "partyAcronym" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "photoAlt" TEXT,
    "summary" TEXT NOT NULL,
    "trajectory" TEXT NOT NULL,
    "history" TEXT,
    "officialRegistryUrl" TEXT,
    "planUrl" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "themeSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "plainSummary" TEXT NOT NULL,
    "originalExcerpt" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "instruments" TEXT NOT NULL,
    "claimedBenefits" TEXT NOT NULL,
    "critiques" TEXT NOT NULL,
    "costs" TEXT,
    "implementationStatus" "ProposalStatus" NOT NULL DEFAULT 'PROMISE',
    "sourceId" TEXT,
    "infoDate" TIMESTAMP(3) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "criteria" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Declaration" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "saidAt" TIMESTAMP(3) NOT NULL,
    "sourceId" TEXT,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Declaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Correction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "entityRef" TEXT,
    "correctedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Correction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorReport" (
    "id" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contactEmail" TEXT,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "credit" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "legalReviewRef" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Revision_entityType_entityId_idx" ON "Revision"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_key_key" ON "Claim"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Perspective_slug_key" ON "Perspective"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Perspective_side_key" ON "Perspective"("side");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_perspectiveId_slug_key" ON "Chapter"("perspectiveId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_perspectiveId_number_key" ON "Chapter"("perspectiveId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Current_slug_key" ON "Current"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_slug_key" ON "Theme"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ThemePosition_themeId_side_key" ON "ThemePosition"("themeId", "side");

-- CreateIndex
CREATE UNIQUE INDEX "TimelineEvent_slug_key" ON "TimelineEvent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Myth_slug_key" ON "Myth"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Curiosity_slug_key" ON "Curiosity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Dimension_key_key" ON "Dimension"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Statement_key_key" ON "Statement"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Election_slug_key" ON "Election"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_slug_key" ON "Candidate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimSource" ADD CONSTRAINT "ClaimSource_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimSource" ADD CONSTRAINT "ClaimSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_perspectiveId_fkey" FOREIGN KEY ("perspectiveId") REFERENCES "Perspective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemePosition" ADD CONSTRAINT "ThemePosition_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_dimensionId_fkey" FOREIGN KEY ("dimensionId") REFERENCES "Dimension"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declaration" ADD CONSTRAINT "Declaration_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declaration" ADD CONSTRAINT "Declaration_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
