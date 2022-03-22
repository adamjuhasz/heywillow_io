-- AlterTable
ALTER TABLE "AliasEmail" ADD COLUMN     "customerId" BIGINT;

-- CreateTable
CREATE TABLE "Customer" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

alter table "Customer" enable row level security;
create policy "Users can see their team's Customer."
  on "Customer" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "Customer"."teamId")
    )
  );

-- CreateTable
CREATE TABLE "CustomerGroup" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "CustomerGroup_pkey" PRIMARY KEY ("id")
);

alter table "CustomerGroup" enable row level security;
create policy "Users can see their team's CustomerGroup."
  on "CustomerGroup" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "CustomerGroup"."teamId")
    )
  );

-- CreateTable
CREATE TABLE "CustomerInCustomerGroup" (
    "customerId" BIGINT NOT NULL,
    "customerGroupId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerInCustomerGroup_pkey" PRIMARY KEY ("customerId","customerGroupId")
);

alter table "CustomerInCustomerGroup" enable row level security;
create policy "Users can see their team's CustomerInCustomerGroup."
  on "CustomerInCustomerGroup" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      JOIN "Customer" ON "Customer"."teamId" = "TeamMember"."teamId"
      WHERE ("CustomerInCustomerGroup"."customerId" = "Customer"."id")
    )
  );

-- CreateTable
CREATE TABLE "CustomerTraits" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "value" JSONB,
    "idempotency" TEXT,
    "customerId" BIGINT NOT NULL,

    CONSTRAINT "CustomerTraits_pkey" PRIMARY KEY ("id")
);

alter table "CustomerTraits" enable row level security;
create policy "Users can see their team's CustomerTraits."
  on "CustomerTraits" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      JOIN "Customer" ON "Customer"."teamId" = "TeamMember"."teamId"
      WHERE ("CustomerTraits"."customerId" = "Customer"."id")
    )
  );

-- CreateTable
CREATE TABLE "CustomerEvents" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "properties" JSONB,
    "idempotency" TEXT,
    "customerId" BIGINT NOT NULL,

    CONSTRAINT "CustomerEvents_pkey" PRIMARY KEY ("id")
);

alter table "CustomerEvents" enable row level security;
create policy "Users can see their team's CustomerEvents."
  on "CustomerEvents" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      JOIN "Customer" ON "Customer"."teamId" = "TeamMember"."teamId"
      WHERE ("CustomerEvents"."customerId" = "Customer"."id")
    )
  );

-- CreateIndex
CREATE UNIQUE INDEX "Customer_teamId_userId_key" ON "Customer"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerGroup_teamId_groupId_key" ON "CustomerGroup"("teamId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerTraits_key_idempotency_key" ON "CustomerTraits"("key", "idempotency");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEvents_idempotency_key" ON "CustomerEvents"("idempotency");

-- AddForeignKey
ALTER TABLE "AliasEmail" ADD CONSTRAINT "AliasEmail_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerGroup" ADD CONSTRAINT "CustomerGroup_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerInCustomerGroup" ADD CONSTRAINT "CustomerInCustomerGroup_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerInCustomerGroup" ADD CONSTRAINT "CustomerInCustomerGroup_customerGroupId_fkey" FOREIGN KEY ("customerGroupId") REFERENCES "CustomerGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerTraits" ADD CONSTRAINT "CustomerTraits_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEvents" ADD CONSTRAINT "CustomerEvents_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
