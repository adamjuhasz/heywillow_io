-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_gmailInboxId_fkey";

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_gmailInboxId_fkey" FOREIGN KEY ("gmailInboxId") REFERENCES "GmailInbox"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
