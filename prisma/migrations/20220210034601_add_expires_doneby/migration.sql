-- AlterTable
ALTER TABLE "ThreadState" ADD COLUMN     "doneById" BIGINT,
ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ThreadState" ADD CONSTRAINT "ThreadState_doneById_fkey" FOREIGN KEY ("doneById") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
