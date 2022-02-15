/*
  Warnings:

  - You are about to drop the column `email` on the `GmailInbox` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailAddress]` on the table `GmailInbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,profileId]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailAddress` to the `GmailInbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Made the column `teamId` on table `TeamMember` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileId` on table `TeamMember` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TeamInviteStatus" AS ENUM ('pending', 'accepted', 'cancelled');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('email', 'internal');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('incoming', 'outgoing');

-- CreateEnum
CREATE TYPE "ThreadStateType" AS ENUM ('open', 'done', 'snoozed', 'assigned');

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_profileId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropIndex
DROP INDEX "GmailInbox_email_key";

-- AlterTable
ALTER TABLE "GmailInbox" DROP COLUMN "email",
ADD COLUMN     "emailAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeamMember" ALTER COLUMN "teamId" SET NOT NULL,
ALTER COLUMN "profileId" SET NOT NULL;

-- CreateTable
CREATE TABLE "TeamInvite" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "inviterId" BIGINT NOT NULL,
    "status" "TeamInviteStatus" NOT NULL,

    CONSTRAINT "TeamInvite_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "TeamInvite" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "CustomerGroup" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerGroup_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "CustomerGroup" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "Customer" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "AliasEmail" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" BIGINT,
    "emailAddress" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "AliasEmail_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "AliasEmail" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "MessageType" NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "emailMessageId" BIGINT,
    "internalMessageId" BIGINT,
    "threadId" BIGINT NOT NULL,
    "aliasId" BIGINT,
    "teamMemberId" BIGINT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "sourceMessageId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "raw" JSONB NOT NULL,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "EmailMessage" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "InternalMessage" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "body" TEXT NOT NULL,

    CONSTRAINT "InternalMessage_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "InternalMessage" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "Thread" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,
    "aliasEmailId" BIGINT NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Thread" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "ThreadState" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadId" BIGINT NOT NULL,
    "teamMemberId" BIGINT,
    "state" "ThreadStateType" NOT NULL,

    CONSTRAINT "ThreadState_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ThreadState" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "Comment" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" BIGINT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" BIGINT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "CommentTag" (
    "commentId" BIGINT NOT NULL,
    "teamMemberId" BIGINT NOT NULL,

    CONSTRAINT "CommentTag_pkey" PRIMARY KEY ("commentId","teamMemberId")
);
ALTER TABLE "CommentTag" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMPTZ(6),
    "seenAt" TIMESTAMPTZ(6),
    "clearedAt" TIMESTAMPTZ(6),
    "forMemberId" BIGINT NOT NULL,
    "text" TEXT NOT NULL,
    "messageId" BIGINT,
    "commentId" BIGINT,
    "byMemberId" BIGINT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "ThreadLink" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadId" BIGINT NOT NULL,
    "aliasEmailId" BIGINT NOT NULL,

    CONSTRAINT "ThreadLink_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ThreadLink" ENABLE ROW LEVEL SECURITY;

-- CreateTable
CREATE TABLE "_CustomerToCustomerGroup" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);
ALTER TABLE "_CustomerToCustomerGroup" ENABLE ROW LEVEL SECURITY;

-- CreateIndex
CREATE UNIQUE INDEX "TeamInvite_teamId_emailAddress_key" ON "TeamInvite"("teamId", "emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AliasEmail_teamId_emailAddress_key" ON "AliasEmail"("teamId", "emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Message_emailMessageId_key" ON "Message"("emailMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_internalMessageId_key" ON "Message"("internalMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomerToCustomerGroup_AB_unique" ON "_CustomerToCustomerGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomerToCustomerGroup_B_index" ON "_CustomerToCustomerGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "GmailInbox_emailAddress_key" ON "GmailInbox"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_profileId_key" ON "TeamMember"("teamId", "profileId");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AliasEmail" ADD CONSTRAINT "AliasEmail_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AliasEmail" ADD CONSTRAINT "AliasEmail_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "AliasEmail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_emailMessageId_fkey" FOREIGN KEY ("emailMessageId") REFERENCES "EmailMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_internalMessageId_fkey" FOREIGN KEY ("internalMessageId") REFERENCES "InternalMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_aliasEmailId_fkey" FOREIGN KEY ("aliasEmailId") REFERENCES "AliasEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadState" ADD CONSTRAINT "ThreadState_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadState" ADD CONSTRAINT "ThreadState_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTag" ADD CONSTRAINT "CommentTag_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTag" ADD CONSTRAINT "CommentTag_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_forMemberId_fkey" FOREIGN KEY ("forMemberId") REFERENCES "TeamMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_byMemberId_fkey" FOREIGN KEY ("byMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadLink" ADD CONSTRAINT "ThreadLink_aliasEmailId_fkey" FOREIGN KEY ("aliasEmailId") REFERENCES "AliasEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadLink" ADD CONSTRAINT "ThreadLink_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToCustomerGroup" ADD FOREIGN KEY ("A") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToCustomerGroup" ADD FOREIGN KEY ("B") REFERENCES "CustomerGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
