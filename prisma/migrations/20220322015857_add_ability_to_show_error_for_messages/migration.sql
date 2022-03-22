/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `EmailMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "MessageError" (
    "messageId" BIGINT NOT NULL,
    "errorName" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,

    CONSTRAINT "MessageError_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailMessage_messageId_key" ON "EmailMessage"("messageId");

-- AddForeignKey
ALTER TABLE "MessageError" ADD CONSTRAINT "MessageError_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
