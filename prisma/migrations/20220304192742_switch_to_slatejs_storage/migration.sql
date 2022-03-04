/*
  Warnings:

  - You are about to drop the column `customerId` on the `AliasEmail` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `EmailMessage` table. All the data in the column will be lost.
  - You are about to drop the column `emailMessageId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `internalMessageId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GmailInbox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GmailLastSync` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GmailLastWatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InternalMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CustomerToCustomerGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `htmlBody` to the `EmailMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `EmailMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textBody` to the `EmailMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AliasEmail" DROP CONSTRAINT "AliasEmail_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_teamId_fkey";

-- DropForeignKey
ALTER TABLE "GmailInbox" DROP CONSTRAINT "GmailInbox_teamId_fkey";

-- DropForeignKey
ALTER TABLE "GmailLastSync" DROP CONSTRAINT "GmailLastSync_inboxId_fkey";

-- DropForeignKey
ALTER TABLE "GmailLastWatch" DROP CONSTRAINT "GmailLastWatch_inboxId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_aliasId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_emailMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_internalMessageId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_inboxId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_gmailInboxId_fkey";

-- DropForeignKey
ALTER TABLE "_CustomerToCustomerGroup" DROP CONSTRAINT "_CustomerToCustomerGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomerToCustomerGroup" DROP CONSTRAINT "_CustomerToCustomerGroup_B_fkey";

-- DropIndex
DROP INDEX "Message_emailMessageId_key";

-- DropIndex
DROP INDEX "Message_internalMessageId_key";

-- AlterTable
ALTER TABLE "AliasEmail" DROP COLUMN "customerId";

DROP POLICY IF EXISTS  "Users can see their Team's EmailMessages." ON "EmailMessage";

-- AlterTable
ALTER TABLE "EmailMessage" DROP COLUMN "body",
ADD COLUMN     "htmlBody" TEXT NOT NULL,
ADD COLUMN     "messageId" BIGINT NOT NULL,
ADD COLUMN     "textBody" TEXT NOT NULL;

create policy "Users can see their Team's EmailMessages."
  on "EmailMessage" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      join "Message" on "Message"."threadId" = "Thread"."id"
      where "EmailMessage"."messageId" = "Message"."id")
  );

DROP POLICY IF EXISTS  "Users can see their Team's InternalMessage." ON "InternalMessage";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "emailMessageId",
DROP COLUMN "internalMessageId",
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "text" JSONB NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "CustomerGroup";

-- DropTable
DROP TABLE "GmailInbox";

-- DropTable
DROP TABLE "GmailLastSync";

-- DropTable
DROP TABLE "GmailLastWatch";

-- DropTable
DROP TABLE "InternalMessage";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "_CustomerToCustomerGroup";

-- CreateTable
CREATE TABLE "Inbox" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,
    "emailAddress" TEXT NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Inbox" ENABLE ROW LEVEL SECURITY;
create policy "Users can see their inboxes."
  on "Inbox" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "Inbox"."teamId")
    )
  );


-- CreateIndex
CREATE UNIQUE INDEX "Inbox_emailAddress_key" ON "Inbox"("emailAddress");

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "AliasEmail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_gmailInboxId_fkey" FOREIGN KEY ("gmailInboxId") REFERENCES "Inbox"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
