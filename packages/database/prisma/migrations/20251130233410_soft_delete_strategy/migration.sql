/*
  Warnings:

  - You are about to drop the column `isActive` on the `AiBot` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `PaperlessInstance` table. All the data in the column will be lost.
  - Added the required column `aiProviderId` to the `AiUsageMetric` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AiBot" DROP CONSTRAINT "AiBot_aiProviderId_fkey";

-- DropForeignKey
ALTER TABLE "AiBot" DROP CONSTRAINT "AiBot_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AiProvider" DROP CONSTRAINT "AiProvider_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AiUsageMetric" DROP CONSTRAINT "AiUsageMetric_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaperlessInstance" DROP CONSTRAINT "PaperlessInstance_ownerId_fkey";

-- DropIndex
DROP INDEX "AiBot_ownerId_name_key";

-- DropIndex
DROP INDEX "AiProvider_ownerId_name_key";

-- DropIndex
DROP INDEX "PaperlessInstance_ownerId_name_key";

-- DropIndex
DROP INDEX "ProcessedDocument_paperlessInstanceId_paperlessId_key";

-- DropIndex
DROP INDEX "ProcessingQueue_paperlessInstanceId_paperlessId_key";

-- AlterTable
ALTER TABLE "AiBot" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "AiUsageMetric" ADD COLUMN     "aiProviderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaperlessInstance" DROP COLUMN "isActive";

-- CreateIndex
CREATE INDEX "AiProvider_isActive_idx" ON "AiProvider"("isActive");

-- AddForeignKey
ALTER TABLE "PaperlessInstance" ADD CONSTRAINT "PaperlessInstance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiProvider" ADD CONSTRAINT "AiProvider_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiBot" ADD CONSTRAINT "AiBot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiBot" ADD CONSTRAINT "AiBot_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "AiProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageMetric" ADD CONSTRAINT "AiUsageMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageMetric" ADD CONSTRAINT "AiUsageMetric_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "AiProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
