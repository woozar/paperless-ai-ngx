/*
  Warnings:

  - You are about to drop the column `paperlessId` on the `ProcessingQueue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paperlessInstanceId,paperlessDocumentId]` on the table `ProcessingQueue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paperlessDocumentId` to the `ProcessingQueue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProcessingQueue_paperlessId_idx";

-- DropIndex
DROP INDEX "ProcessingQueue_paperlessInstanceId_paperlessId_key";

-- AlterTable
ALTER TABLE "PaperlessInstance" ADD COLUMN     "autoApplyCorrespondent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoApplyDate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoApplyDocumentType" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoApplyTags" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "autoApplyTitle" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProcessingQueue" DROP COLUMN "paperlessId",
ADD COLUMN     "paperlessDocumentId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ProcessingQueue_paperlessDocumentId_idx" ON "ProcessingQueue"("paperlessDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingQueue_paperlessInstanceId_paperlessDocumentId_key" ON "ProcessingQueue"("paperlessInstanceId", "paperlessDocumentId");
