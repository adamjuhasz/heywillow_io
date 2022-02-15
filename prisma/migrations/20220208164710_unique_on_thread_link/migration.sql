/*
  Warnings:

  - A unique constraint covering the columns `[threadId,aliasEmailId]` on the table `ThreadLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ThreadLink_threadId_aliasEmailId_key" ON "ThreadLink"("threadId", "aliasEmailId");
