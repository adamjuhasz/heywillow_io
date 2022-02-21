-- CreateTable
CREATE TABLE "Namespace" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "namespace" TEXT NOT NULL,
    "teamId" BIGINT,

    CONSTRAINT "Namespace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Namespace_namespace_key" ON "Namespace"("namespace");

-- CreateIndex
CREATE UNIQUE INDEX "Namespace_teamId_key" ON "Namespace"("teamId");
