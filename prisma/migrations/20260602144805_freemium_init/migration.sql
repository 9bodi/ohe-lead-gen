-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('web_freemium', 'event');

-- CreateEnum
CREATE TYPE "BlockLevel" AS ENUM ('non_maitrise', 'fragile', 'fonctionnel', 'maitrise');

-- CreateEnum
CREATE TYPE "AdaptationProfile" AS ENUM ('adapted', 'not_adapted');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL DEFAULT 'web_freemium',
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmMedium" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreemiumResult" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "block1Correct" INTEGER NOT NULL,
    "block1Score" DOUBLE PRECISION NOT NULL,
    "block1Level" "BlockLevel" NOT NULL,
    "block2Correct" INTEGER NOT NULL,
    "block2Score" DOUBLE PRECISION NOT NULL,
    "block2Level" "BlockLevel" NOT NULL,
    "adaptationScore" INTEGER NOT NULL,
    "adaptationProfile" "AdaptationProfile" NOT NULL,
    "rawAnswers" JSONB NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreemiumResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE INDEX "Campaign_slug_idx" ON "Campaign"("slug");

-- CreateIndex
CREATE INDEX "Campaign_isActive_idx" ON "Campaign"("isActive");

-- CreateIndex
CREATE INDEX "Campaign_type_idx" ON "Campaign"("type");

-- CreateIndex
CREATE INDEX "Lead_campaignId_idx" ON "Lead"("campaignId");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_utmSource_idx" ON "Lead"("utmSource");

-- CreateIndex
CREATE UNIQUE INDEX "FreemiumResult_leadId_key" ON "FreemiumResult"("leadId");

-- CreateIndex
CREATE INDEX "FreemiumResult_completedAt_idx" ON "FreemiumResult"("completedAt");

-- CreateIndex
CREATE INDEX "FreemiumResult_adaptationProfile_idx" ON "FreemiumResult"("adaptationProfile");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreemiumResult" ADD CONSTRAINT "FreemiumResult_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
