-- AlterTable
ALTER TABLE "CustomerEvent" RENAME CONSTRAINT "CustomerEvents_pkey" TO "CustomerEvent_pkey";

-- AlterTable
ALTER TABLE "CustomerTrait" RENAME CONSTRAINT "CustomerTraits_pkey" TO "CustomerTrait_pkey";

-- CreateTable
CREATE TABLE "CustomerGroupTraits" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "value" JSONB,
    "idempotency" TEXT,
    "customerGroupId" BIGINT NOT NULL,

    CONSTRAINT "CustomerGroupTraits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerGroupTraits_key_idempotency_key" ON "CustomerGroupTraits"("key", "idempotency");

-- RenameForeignKey
ALTER TABLE "CustomerEvent" RENAME CONSTRAINT "CustomerEvents_customerId_fkey" TO "CustomerEvent_customerId_fkey";

-- RenameForeignKey
ALTER TABLE "CustomerTrait" RENAME CONSTRAINT "CustomerTraits_customerId_fkey" TO "CustomerTrait_customerId_fkey";

-- AddForeignKey
ALTER TABLE "CustomerGroupTraits" ADD CONSTRAINT "CustomerGroupTraits_customerGroupId_fkey" FOREIGN KEY ("customerGroupId") REFERENCES "CustomerGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "CustomerEvents_idempotency_key" RENAME TO "CustomerEvent_idempotency_key";

-- RenameIndex
ALTER INDEX "CustomerTraits_key_idempotency_key" RENAME TO "CustomerTrait_key_idempotency_key";
