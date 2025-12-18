-- AlterTable
ALTER TABLE "AiBot" ADD COLUMN     "documentMode" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "pdfMaxSizeMb" INTEGER;
