-- DropForeignKey
ALTER TABLE "PostmarkDomain" DROP CONSTRAINT "PostmarkDomain_teamId_fkey";

-- AddForeignKey
ALTER TABLE "PostmarkDomain" ADD CONSTRAINT "PostmarkDomain_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
