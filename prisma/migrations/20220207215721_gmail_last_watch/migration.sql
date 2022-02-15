-- CreateTable
CREATE TABLE "GmailLastWatch" (
    "inboxId" BIGINT NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration" TIMESTAMP(3) NOT NULL,
    "historyid" TEXT NOT NULL,

    CONSTRAINT "GmailLastWatch_pkey" PRIMARY KEY ("inboxId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GmailLastWatch_inboxId_key" ON "GmailLastWatch"("inboxId");

-- AddForeignKey
ALTER TABLE "GmailLastWatch" ADD CONSTRAINT "GmailLastWatch_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "GmailInbox"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
