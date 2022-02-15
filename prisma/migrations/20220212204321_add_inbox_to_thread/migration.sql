-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "gmailInboxId" BIGINT;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_gmailInboxId_fkey" FOREIGN KEY ("gmailInboxId") REFERENCES "GmailInbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;
