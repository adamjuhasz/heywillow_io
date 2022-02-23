/*
  Warnings:

  - The primary key for the `NotificationPreference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gmailInboxId` on the `NotificationPreference` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NotificationPreference" DROP CONSTRAINT "NotificationPreference_gmailInboxId_fkey";

-- AlterTable
ALTER TABLE "NotificationPreference" DROP CONSTRAINT "NotificationPreference_pkey",
DROP COLUMN "gmailInboxId",
ADD CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("teamMemberId", "type", "channel");
