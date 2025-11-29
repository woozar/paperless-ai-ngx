-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DEFAULT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('READ', 'WRITE', 'ADMIN');

-- CreateTable
CREATE TABLE "Setting" (
    "settingKey" TEXT NOT NULL,
    "settingValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("settingKey")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DEFAULT',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPaperlessInstanceAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPaperlessInstanceAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAiAccessAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aiAccessId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAiAccessAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAiBotAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aiBotId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAiBotAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperlessInstance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "apiToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "PaperlessInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAccess" (
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

    CONSTRAINT "AiAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiBot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "aiAccessId" TEXT NOT NULL,

    CONSTRAINT "AiBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedDocument" (
    "id" TEXT NOT NULL,
    "paperlessId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
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
    "paperlessInstanceId" TEXT NOT NULL,

    CONSTRAINT "ProcessedDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingQueue" (
    "id" TEXT NOT NULL,
    "paperlessId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "scheduledFor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paperlessInstanceId" TEXT NOT NULL,

    CONSTRAINT "ProcessingQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsageMetric" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "estimatedCost" DOUBLE PRECISION,
    "documentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "aiBotId" TEXT,

    CONSTRAINT "AiUsageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "UserPaperlessInstanceAccess_userId_idx" ON "UserPaperlessInstanceAccess"("userId");

-- CreateIndex
CREATE INDEX "UserPaperlessInstanceAccess_instanceId_idx" ON "UserPaperlessInstanceAccess"("instanceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPaperlessInstanceAccess_userId_instanceId_key" ON "UserPaperlessInstanceAccess"("userId", "instanceId");

-- CreateIndex
CREATE INDEX "UserAiAccessAccess_userId_idx" ON "UserAiAccessAccess"("userId");

-- CreateIndex
CREATE INDEX "UserAiAccessAccess_aiAccessId_idx" ON "UserAiAccessAccess"("aiAccessId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAiAccessAccess_userId_aiAccessId_key" ON "UserAiAccessAccess"("userId", "aiAccessId");

-- CreateIndex
CREATE INDEX "UserAiBotAccess_userId_idx" ON "UserAiBotAccess"("userId");

-- CreateIndex
CREATE INDEX "UserAiBotAccess_aiBotId_idx" ON "UserAiBotAccess"("aiBotId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAiBotAccess_userId_aiBotId_key" ON "UserAiBotAccess"("userId", "aiBotId");

-- CreateIndex
CREATE INDEX "PaperlessInstance_ownerId_idx" ON "PaperlessInstance"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaperlessInstance_ownerId_name_key" ON "PaperlessInstance"("ownerId", "name");

-- CreateIndex
CREATE INDEX "AiAccess_ownerId_idx" ON "AiAccess"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "AiAccess_ownerId_name_key" ON "AiAccess"("ownerId", "name");

-- CreateIndex
CREATE INDEX "AiBot_ownerId_idx" ON "AiBot"("ownerId");

-- CreateIndex
CREATE INDEX "AiBot_aiAccessId_idx" ON "AiBot"("aiAccessId");

-- CreateIndex
CREATE UNIQUE INDEX "AiBot_ownerId_name_key" ON "AiBot"("ownerId", "name");

-- CreateIndex
CREATE INDEX "ProcessedDocument_paperlessId_idx" ON "ProcessedDocument"("paperlessId");

-- CreateIndex
CREATE INDEX "ProcessedDocument_processedAt_idx" ON "ProcessedDocument"("processedAt");

-- CreateIndex
CREATE INDEX "ProcessedDocument_paperlessInstanceId_idx" ON "ProcessedDocument"("paperlessInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedDocument_paperlessInstanceId_paperlessId_key" ON "ProcessedDocument"("paperlessInstanceId", "paperlessId");

-- CreateIndex
CREATE INDEX "ProcessingQueue_status_scheduledFor_idx" ON "ProcessingQueue"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "ProcessingQueue_paperlessId_idx" ON "ProcessingQueue"("paperlessId");

-- CreateIndex
CREATE INDEX "ProcessingQueue_paperlessInstanceId_idx" ON "ProcessingQueue"("paperlessInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingQueue_paperlessInstanceId_paperlessId_key" ON "ProcessingQueue"("paperlessInstanceId", "paperlessId");

-- CreateIndex
CREATE INDEX "AiUsageMetric_createdAt_idx" ON "AiUsageMetric"("createdAt");

-- CreateIndex
CREATE INDEX "AiUsageMetric_provider_idx" ON "AiUsageMetric"("provider");

-- CreateIndex
CREATE INDEX "AiUsageMetric_userId_idx" ON "AiUsageMetric"("userId");

-- CreateIndex
CREATE INDEX "AiUsageMetric_aiBotId_idx" ON "AiUsageMetric"("aiBotId");

-- AddForeignKey
ALTER TABLE "UserPaperlessInstanceAccess" ADD CONSTRAINT "UserPaperlessInstanceAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPaperlessInstanceAccess" ADD CONSTRAINT "UserPaperlessInstanceAccess_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "PaperlessInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAiAccessAccess" ADD CONSTRAINT "UserAiAccessAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAiAccessAccess" ADD CONSTRAINT "UserAiAccessAccess_aiAccessId_fkey" FOREIGN KEY ("aiAccessId") REFERENCES "AiAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAiBotAccess" ADD CONSTRAINT "UserAiBotAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAiBotAccess" ADD CONSTRAINT "UserAiBotAccess_aiBotId_fkey" FOREIGN KEY ("aiBotId") REFERENCES "AiBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperlessInstance" ADD CONSTRAINT "PaperlessInstance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAccess" ADD CONSTRAINT "AiAccess_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiBot" ADD CONSTRAINT "AiBot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiBot" ADD CONSTRAINT "AiBot_aiAccessId_fkey" FOREIGN KEY ("aiAccessId") REFERENCES "AiAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessedDocument" ADD CONSTRAINT "ProcessedDocument_paperlessInstanceId_fkey" FOREIGN KEY ("paperlessInstanceId") REFERENCES "PaperlessInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingQueue" ADD CONSTRAINT "ProcessingQueue_paperlessInstanceId_fkey" FOREIGN KEY ("paperlessInstanceId") REFERENCES "PaperlessInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageMetric" ADD CONSTRAINT "AiUsageMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageMetric" ADD CONSTRAINT "AiUsageMetric_aiBotId_fkey" FOREIGN KEY ("aiBotId") REFERENCES "AiBot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
