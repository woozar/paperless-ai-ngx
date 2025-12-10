-- Migration: Rename AiProvider to AiAccount and introduce AiModel
-- This migration:
-- 1. Renames AiProvider -> AiAccount
-- 2. Creates new AiModel table
-- 3. Migrates existing model field to AiModel entries
-- 4. Updates AiBot to reference AiModel instead of AiAccount
-- 5. Updates AiUsageMetric references

-- ============================================================================
-- Step 1: Rename AiProvider to AiAccount
-- ============================================================================

-- Drop foreign keys first
ALTER TABLE "AiBot" DROP CONSTRAINT "AiBot_aiProviderId_fkey";
ALTER TABLE "AiUsageMetric" DROP CONSTRAINT "AiUsageMetric_aiProviderId_fkey";
ALTER TABLE "UserAiProviderAccess" DROP CONSTRAINT "UserAiProviderAccess_aiProviderId_fkey";
ALTER TABLE "UserAiProviderAccess" DROP CONSTRAINT "UserAiProviderAccess_userId_fkey";

-- Rename AiProvider table to AiAccount
ALTER TABLE "AiProvider" RENAME TO "AiAccount";

-- Rename UserAiProviderAccess to UserAiAccountAccess
ALTER TABLE "UserAiProviderAccess" RENAME TO "UserAiAccountAccess";
ALTER TABLE "UserAiAccountAccess" RENAME COLUMN "aiProviderId" TO "aiAccountId";

-- Rename constraint
ALTER INDEX "UserAiProviderAccess_pkey" RENAME TO "UserAiAccountAccess_pkey";
ALTER INDEX "UserAiProviderAccess_userId_idx" RENAME TO "UserAiAccountAccess_userId_idx";
ALTER INDEX "UserAiProviderAccess_aiProviderId_idx" RENAME TO "UserAiAccountAccess_aiAccountId_idx";
ALTER INDEX "UserAiProviderAccess_userId_aiProviderId_key" RENAME TO "UserAiAccountAccess_userId_aiAccountId_key";

-- Rename AiProvider indexes
ALTER INDEX "AiProvider_pkey" RENAME TO "AiAccount_pkey";
ALTER INDEX "AiProvider_ownerId_idx" RENAME TO "AiAccount_ownerId_idx";
ALTER INDEX "AiProvider_isActive_idx" RENAME TO "AiAccount_isActive_idx";

-- Rename AiUsageMetric column
ALTER TABLE "AiUsageMetric" RENAME COLUMN "aiProviderId" TO "aiAccountId";

-- ============================================================================
-- Step 2: Create AiModel table
-- ============================================================================

CREATE TABLE "AiModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelIdentifier" TEXT NOT NULL,
    "inputTokenPrice" DOUBLE PRECISION,
    "outputTokenPrice" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "aiAccountId" TEXT NOT NULL,

    CONSTRAINT "AiModel_pkey" PRIMARY KEY ("id")
);

-- Create indexes for AiModel
CREATE INDEX "AiModel_ownerId_idx" ON "AiModel"("ownerId");
CREATE INDEX "AiModel_aiAccountId_idx" ON "AiModel"("aiAccountId");
CREATE INDEX "AiModel_isActive_idx" ON "AiModel"("isActive");

-- ============================================================================
-- Step 3: Create UserAiModelAccess table
-- ============================================================================

CREATE TABLE "UserAiModelAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "aiModelId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAiModelAccess_pkey" PRIMARY KEY ("id")
);

-- Create indexes for UserAiModelAccess
CREATE INDEX "UserAiModelAccess_userId_idx" ON "UserAiModelAccess"("userId");
CREATE INDEX "UserAiModelAccess_aiModelId_idx" ON "UserAiModelAccess"("aiModelId");
CREATE UNIQUE INDEX "UserAiModelAccess_userId_aiModelId_key" ON "UserAiModelAccess"("userId", "aiModelId");

-- ============================================================================
-- Step 4: Migrate data - create AiModel entries from AiAccount.model
-- ============================================================================

-- For each AiAccount, create an AiModel with the model field as modelIdentifier
INSERT INTO "AiModel" ("id", "name", "modelIdentifier", "isActive", "createdAt", "updatedAt", "ownerId", "aiAccountId")
SELECT
    gen_random_uuid()::text,
    "name" || ' - ' || "model",
    "model",
    "isActive",
    "createdAt",
    NOW(),
    "ownerId",
    "id"
FROM "AiAccount";

-- ============================================================================
-- Step 5: Update AiBot - add aiModelId and migrate data
-- ============================================================================

-- Add aiModelId column (nullable first for migration)
ALTER TABLE "AiBot" ADD COLUMN "aiModelId" TEXT;

-- Migrate AiBot references from aiProviderId to aiModelId
UPDATE "AiBot" b
SET "aiModelId" = m."id"
FROM "AiModel" m
WHERE b."aiProviderId" = m."aiAccountId";

-- Make aiModelId required
ALTER TABLE "AiBot" ALTER COLUMN "aiModelId" SET NOT NULL;

-- Drop old aiProviderId column and index
DROP INDEX "AiBot_aiProviderId_idx";
ALTER TABLE "AiBot" DROP COLUMN "aiProviderId";

-- Create new index for aiModelId
CREATE INDEX "AiBot_aiModelId_idx" ON "AiBot"("aiModelId");

-- ============================================================================
-- Step 6: Update AiUsageMetric - add aiModelId
-- ============================================================================

-- Add aiModelId column (nullable)
ALTER TABLE "AiUsageMetric" ADD COLUMN "aiModelId" TEXT;

-- Migrate AiUsageMetric to reference both aiAccountId and aiModelId
UPDATE "AiUsageMetric" u
SET "aiModelId" = m."id"
FROM "AiModel" m
WHERE u."aiAccountId" = m."aiAccountId";

-- Create index for aiModelId
CREATE INDEX "AiUsageMetric_aiModelId_idx" ON "AiUsageMetric"("aiModelId");

-- ============================================================================
-- Step 7: Remove model column from AiAccount
-- ============================================================================

ALTER TABLE "AiAccount" DROP COLUMN "model";

-- ============================================================================
-- Step 8: Add foreign key constraints
-- ============================================================================

-- UserAiAccountAccess foreign keys
ALTER TABLE "UserAiAccountAccess" ADD CONSTRAINT "UserAiAccountAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAiAccountAccess" ADD CONSTRAINT "UserAiAccountAccess_aiAccountId_fkey" FOREIGN KEY ("aiAccountId") REFERENCES "AiAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AiAccount foreign keys
ALTER TABLE "AiAccount" ADD CONSTRAINT "AiAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AiModel foreign keys
ALTER TABLE "AiModel" ADD CONSTRAINT "AiModel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AiModel" ADD CONSTRAINT "AiModel_aiAccountId_fkey" FOREIGN KEY ("aiAccountId") REFERENCES "AiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- UserAiModelAccess foreign keys
ALTER TABLE "UserAiModelAccess" ADD CONSTRAINT "UserAiModelAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAiModelAccess" ADD CONSTRAINT "UserAiModelAccess_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "AiModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AiBot foreign keys
ALTER TABLE "AiBot" ADD CONSTRAINT "AiBot_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "AiModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AiUsageMetric foreign keys
ALTER TABLE "AiUsageMetric" ADD CONSTRAINT "AiUsageMetric_aiAccountId_fkey" FOREIGN KEY ("aiAccountId") REFERENCES "AiAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AiUsageMetric" ADD CONSTRAINT "AiUsageMetric_aiModelId_fkey" FOREIGN KEY ("aiModelId") REFERENCES "AiModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
