-- AlterTable
ALTER TABLE "UserAiBotAccess" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserAiProviderAccess" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserPaperlessInstanceAccess" ALTER COLUMN "userId" DROP NOT NULL;
