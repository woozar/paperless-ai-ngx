/*
  Warnings:

  - The values [ADMIN] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('READ', 'WRITE', 'FULL');
ALTER TABLE "public"."UserAiBotAccess" ALTER COLUMN "permission" DROP DEFAULT;
ALTER TABLE "public"."UserAiProviderAccess" ALTER COLUMN "permission" DROP DEFAULT;
ALTER TABLE "public"."UserPaperlessInstanceAccess" ALTER COLUMN "permission" DROP DEFAULT;
ALTER TABLE "UserPaperlessInstanceAccess" ALTER COLUMN "permission" TYPE "Permission_new" USING ("permission"::text::"Permission_new");
ALTER TABLE "UserAiProviderAccess" ALTER COLUMN "permission" TYPE "Permission_new" USING ("permission"::text::"Permission_new");
ALTER TABLE "UserAiBotAccess" ALTER COLUMN "permission" TYPE "Permission_new" USING ("permission"::text::"Permission_new");
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "public"."Permission_old";
ALTER TABLE "UserAiBotAccess" ALTER COLUMN "permission" SET DEFAULT 'READ';
ALTER TABLE "UserAiProviderAccess" ALTER COLUMN "permission" SET DEFAULT 'READ';
ALTER TABLE "UserPaperlessInstanceAccess" ALTER COLUMN "permission" SET DEFAULT 'READ';
COMMIT;
