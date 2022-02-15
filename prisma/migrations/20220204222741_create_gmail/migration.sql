-- CreateTable
CREATE TABLE "GmailInbox" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "GmailInbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inboxId" BIGINT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmailLastSync" (
    "inboxId" BIGINT NOT NULL,
    "historyid" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmailLastSync_pkey" PRIMARY KEY ("inboxId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GmailInbox_email_key" ON "GmailInbox"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_inboxId_key" ON "RefreshToken"("inboxId");

-- CreateIndex
CREATE UNIQUE INDEX "GmailLastSync_inboxId_key" ON "GmailLastSync"("inboxId");

-- AddForeignKey
ALTER TABLE "GmailInbox" ADD CONSTRAINT "GmailInbox_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "GmailInbox"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GmailLastSync" ADD CONSTRAINT "GmailLastSync_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "GmailInbox"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
