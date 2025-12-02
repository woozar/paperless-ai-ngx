/*
  Warnings:

  - You are about to drop the `ProcessedDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProcessedDocument" DROP CONSTRAINT "ProcessedDocument_paperlessInstanceId_fkey";

-- DropTable
DROP TABLE "ProcessedDocument";

-- CreateTable
CREATE TABLE "PaperlessDocument" (
    "id" TEXT NOT NULL,
    "paperlessId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "correspondentId" INTEGER,
    "tagIds" INTEGER[],
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paperlessInstanceId" TEXT NOT NULL,

    CONSTRAINT "PaperlessDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentProcessingResult" (
    "id" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiProvider" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "changes" JSONB,
    "originalTitle" TEXT,
    "originalCorrespondent" TEXT,
    "originalDocumentType" TEXT,
    "originalTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DocumentProcessingResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaperlessDocument_paperlessInstanceId_idx" ON "PaperlessDocument"("paperlessInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "PaperlessDocument_paperlessInstanceId_paperlessId_key" ON "PaperlessDocument"("paperlessInstanceId", "paperlessId");

-- CreateIndex
CREATE INDEX "DocumentProcessingResult_processedAt_idx" ON "DocumentProcessingResult"("processedAt");

-- CreateIndex
CREATE INDEX "DocumentProcessingResult_documentId_idx" ON "DocumentProcessingResult"("documentId");

-- AddForeignKey
ALTER TABLE "PaperlessDocument" ADD CONSTRAINT "PaperlessDocument_paperlessInstanceId_fkey" FOREIGN KEY ("paperlessInstanceId") REFERENCES "PaperlessInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentProcessingResult" ADD CONSTRAINT "DocumentProcessingResult_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "PaperlessDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
