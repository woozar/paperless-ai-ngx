-- AlterTable
ALTER TABLE "PaperlessDocument" ADD COLUMN "documentDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PaperlessDocument_paperlessInstanceId_documentDate_idx" ON "PaperlessDocument"("paperlessInstanceId", "documentDate");
