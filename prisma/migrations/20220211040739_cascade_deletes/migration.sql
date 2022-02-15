-- DropForeignKey
ALTER TABLE "AliasEmail" DROP CONSTRAINT "AliasEmail_customerId_fkey";

-- DropForeignKey
ALTER TABLE "AliasEmail" DROP CONSTRAINT "AliasEmail_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_messageId_fkey";

-- DropForeignKey
ALTER TABLE "CommentTag" DROP CONSTRAINT "CommentTag_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_teamId_fkey";

-- DropForeignKey
ALTER TABLE "EncryptedText" DROP CONSTRAINT "EncryptedText_teamId_fkey";

-- DropForeignKey
ALTER TABLE "GmailInbox" DROP CONSTRAINT "GmailInbox_teamId_fkey";

-- DropForeignKey
ALTER TABLE "GmailLastSync" DROP CONSTRAINT "GmailLastSync_inboxId_fkey";

-- DropForeignKey
ALTER TABLE "GmailLastWatch" DROP CONSTRAINT "GmailLastWatch_inboxId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_forMemberId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_inboxId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvite" DROP CONSTRAINT "TeamInvite_inviterId_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvite" DROP CONSTRAINT "TeamInvite_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_aliasEmailId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ThreadLink" DROP CONSTRAINT "ThreadLink_aliasEmailId_fkey";

-- DropForeignKey
ALTER TABLE "ThreadLink" DROP CONSTRAINT "ThreadLink_threadId_fkey";

-- DropForeignKey
ALTER TABLE "ThreadState" DROP CONSTRAINT "ThreadState_threadId_fkey";

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmailInbox" ADD CONSTRAINT "GmailInbox_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "GmailInbox"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GmailLastSync" ADD CONSTRAINT "GmailLastSync_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "GmailInbox"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GmailLastWatch" ADD CONSTRAINT "GmailLastWatch_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "GmailInbox"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AliasEmail" ADD CONSTRAINT "AliasEmail_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AliasEmail" ADD CONSTRAINT "AliasEmail_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_aliasEmailId_fkey" FOREIGN KEY ("aliasEmailId") REFERENCES "AliasEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadState" ADD CONSTRAINT "ThreadState_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTag" ADD CONSTRAINT "CommentTag_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_forMemberId_fkey" FOREIGN KEY ("forMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadLink" ADD CONSTRAINT "ThreadLink_aliasEmailId_fkey" FOREIGN KEY ("aliasEmailId") REFERENCES "AliasEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadLink" ADD CONSTRAINT "ThreadLink_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncryptedText" ADD CONSTRAINT "EncryptedText_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
