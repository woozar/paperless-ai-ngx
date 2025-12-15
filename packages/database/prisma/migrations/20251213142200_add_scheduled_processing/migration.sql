/*
  Warnings:

  - A unique constraint covering the columns `[paperlessInstanceId,paperlessId]` on the table `ProcessingQueue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaperlessInstance" ADD COLUMN     "autoProcessEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "defaultAiBotId" TEXT,
ADD COLUMN     "lastScanAt" TIMESTAMP(3),
ADD COLUMN     "nextScanAt" TIMESTAMP(3),
ADD COLUMN     "scanCronExpression" TEXT NOT NULL DEFAULT '0 * * * *';

-- AlterTable
ALTER TABLE "ProcessingQueue" ADD COLUMN     "aiBotId" TEXT,
ADD COLUMN     "documentId" TEXT,
ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 3;

-- CreateIndex
CREATE INDEX "PaperlessInstance_autoProcessEnabled_nextScanAt_idx" ON "PaperlessInstance"("autoProcessEnabled", "nextScanAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingQueue_paperlessInstanceId_paperlessId_key" ON "ProcessingQueue"("paperlessInstanceId", "paperlessId");

-- AddForeignKey
ALTER TABLE "PaperlessInstance" ADD CONSTRAINT "PaperlessInstance_defaultAiBotId_fkey" FOREIGN KEY ("defaultAiBotId") REFERENCES "AiBot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingQueue" ADD CONSTRAINT "ProcessingQueue_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PaperlessDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingQueue" ADD CONSTRAINT "ProcessingQueue_aiBotId_fkey" FOREIGN KEY ("aiBotId") REFERENCES "AiBot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
