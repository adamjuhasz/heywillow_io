-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('owner', 'member');

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT E'member';
