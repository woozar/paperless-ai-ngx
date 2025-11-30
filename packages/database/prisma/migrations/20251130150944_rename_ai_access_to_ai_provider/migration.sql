/*
  Warnings:

  - You are about to drop the column `aiAccessId` on the `AiBot` table. All the data in the column will be lost.
  - You are about to drop the `AiAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAiAccessAccess` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aiProviderId` to the `AiBot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AiAccess" DROP CONSTRAINT "AiAccess_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "AiBot" DROP CONSTRAINT "AiBot_aiAccessId_fkey";

-- DropForeignKey
ALTER TABLE "UserAiAccessAccess" DROP CONSTRAINT "UserAiAccessAccess_aiAccessId_fkey";

-- DropForeignKey
ALTER TABLE "UserAiAccessAccess" DROP CONSTRAINT "UserAiAccessAccess_userId_fkey";

-- DropIndex
DROP INDEX "AiBot_aiAccessId_idx";

-- AlterTable
ALTER TABLE "AiBot" DROP COLUMN "aiAccessId",
ADD COLUMN     "aiProviderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AiAccess";

-- DropTable
DROP TABLE "UserAiAccessAccess";

-- CreateTable
CREATE TABLE "UserAiProviderAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aiProviderId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAiProviderAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "baseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "AiProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAiProviderAccess_userId_idx" ON "UserAiProviderAccess"("userId");

-- CreateIndex
CREATE INDEX "UserAiProviderAccess_aiProviderId_idx" ON "UserAiProviderAccess"("aiProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAiProviderAccess_userId_aiProviderId_key" ON "UserAiProviderAccess"("userId", "aiProviderId");

-- CreateIndex
CREATE INDEX "AiProvider_ownerId_idx" ON "AiProvider"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "AiProvider_ownerId_name_key" ON "AiProvider"("ownerId", "name");

-- CreateIndex
CREATE INDEX "AiBot_aiProviderId_idx" ON "AiBot"("aiProviderId");

-- AddForeignKey
ALTER TABLE "UserAiProviderAccess" ADD CONSTRAINT "UserAiProviderAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAiProviderAccess" ADD CONSTRAINT "UserAiProviderAccess_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "AiProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiProvider" ADD CONSTRAINT "AiProvider_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiBot" ADD CONSTRAINT "AiBot_aiProviderId_fkey" FOREIGN KEY ("aiProviderId") REFERENCES "AiProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
