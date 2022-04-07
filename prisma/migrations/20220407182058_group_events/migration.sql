/*
  Warnings:

  - A unique constraint covering the columns `[customerId,idempotency]` on the table `CustomerEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CustomerEvent_idempotency_key";

-- CreateTable
CREATE TABLE "GroupEvent" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "properties" JSONB,
    "idempotency" TEXT,
    "groupId" BIGINT NOT NULL,

    CONSTRAINT "GroupEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupEvent_groupId_idempotency_key" ON "GroupEvent"("groupId", "idempotency");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEvent_customerId_idempotency_key" ON "CustomerEvent"("customerId", "idempotency");

-- AddForeignKey
ALTER TABLE "GroupEvent" ADD CONSTRAINT "GroupEvent_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CustomerGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
