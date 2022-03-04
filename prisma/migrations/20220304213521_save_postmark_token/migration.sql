-- CreateTable
CREATE TABLE "PostmarkServerToken" (
    "inboxId" BIGINT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "PostmarkServerToken_pkey" PRIMARY KEY ("inboxId")
);

ALTER TABLE "PostmarkServerToken" ENABLE ROW LEVEL SECURITY;

-- AddForeignKey
ALTER TABLE "PostmarkServerToken" ADD CONSTRAINT "PostmarkServerToken_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "Inbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;
