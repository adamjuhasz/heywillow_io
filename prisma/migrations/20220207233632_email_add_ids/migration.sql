/*
  Warnings:

  - A unique constraint covering the columns `[sourceMessageId]` on the table `EmailMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailMessageId` to the `EmailMessage` table without a default value. This is not possible if the table is not empty.
  - Made the column `sourceMessageId` on table `EmailMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmailMessage" ADD COLUMN     "emailMessageId" TEXT NOT NULL,
ALTER COLUMN "sourceMessageId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmailMessage_sourceMessageId_key" ON "EmailMessage"("sourceMessageId");
