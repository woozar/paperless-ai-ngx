-- AlterTable
ALTER TABLE "PaperlessDocument" ADD COLUMN     "paperlessModified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PaperlessInstance" ADD COLUMN     "importFilterTags" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- CreateTable
CREATE TABLE "ImportHistory" (
    "id" TEXT NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentsImported" INTEGER NOT NULL,
    "documentsUpdated" INTEGER NOT NULL,
    "documentsUnchanged" INTEGER NOT NULL,
    "totalInPaperless" INTEGER NOT NULL,
    "paperlessInstanceId" TEXT NOT NULL,

    CONSTRAINT "ImportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportHistory_paperlessInstanceId_importedAt_idx" ON "ImportHistory"("paperlessInstanceId", "importedAt");

-- AddForeignKey
ALTER TABLE "ImportHistory" ADD CONSTRAINT "ImportHistory_paperlessInstanceId_fkey" FOREIGN KEY ("paperlessInstanceId") REFERENCES "PaperlessInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
