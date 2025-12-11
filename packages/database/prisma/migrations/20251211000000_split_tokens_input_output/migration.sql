-- Split tokensUsed into inputTokens and outputTokens
-- Since we don't have the original breakdown, we assign all to outputTokens
-- (This is an approximation; future records will have accurate values)

-- Add new columns
ALTER TABLE "DocumentProcessingResult" ADD COLUMN "inputTokens" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "DocumentProcessingResult" ADD COLUMN "outputTokens" INTEGER NOT NULL DEFAULT 0;

-- Migrate existing data: assign old tokensUsed to outputTokens as approximation
UPDATE "DocumentProcessingResult" SET "outputTokens" = COALESCE("tokensUsed", 0);

-- Drop old column
ALTER TABLE "DocumentProcessingResult" DROP COLUMN "tokensUsed";
