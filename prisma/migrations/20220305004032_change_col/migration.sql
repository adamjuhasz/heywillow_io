/*
  Warnings:

  - You are about to drop the column `gmailInboxId` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `inboxId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_gmailInboxId_fkey";

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "gmailInboxId",
ADD COLUMN     "inboxId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "Inbox"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
