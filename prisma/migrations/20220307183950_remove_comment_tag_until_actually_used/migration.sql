/*
  Warnings:

  - You are about to drop the `CommentTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentTag" DROP CONSTRAINT "CommentTag_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentTag" DROP CONSTRAINT "CommentTag_teamMemberId_fkey";

-- DropTable
DROP TABLE "CommentTag";
