/*
  Warnings:

  - You are about to drop the column `byMemberId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `gmailInboxId` on table `Thread` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ThreadNew', 'ThreadTeamMemberReplied', 'ThreadCustomerReplied', 'ThreadAwaken', 'ThreadClosed', 'CommentMentioned');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('InApp', 'Email');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_byMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_messageId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "byMemberId",
DROP COLUMN "messageId",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "Thread" ALTER COLUMN "gmailInboxId" SET NOT NULL;

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "teamMemberId" BIGINT NOT NULL,
    "gmailInboxId" BIGINT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "channel" "NotificationChannel" NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("teamMemberId","gmailInboxId","type","channel")
);

ALTER TABLE "NotificationPreference" enable row level security;

CREATE POLICY "Users can see their own notification preferences."
  on "NotificationPreference" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."id" = "NotificationPreference"."teamMemberId")
    )
  );

CREATE POLICY "Users can update their own notification preferences."
  on "NotificationPreference" for update
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."id" = "NotificationPreference"."teamMemberId")
    )
  );

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_gmailInboxId_fkey" FOREIGN KEY ("gmailInboxId") REFERENCES "GmailInbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;
