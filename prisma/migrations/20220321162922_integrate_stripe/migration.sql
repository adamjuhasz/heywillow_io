-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('OneTime', 'Recurring');

-- CreateEnum
CREATE TYPE "PriceInterval" AS ENUM ('Month', 'Year', 'Week', 'Day');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Trialing', 'Active', 'Canceled', 'Incomplete', 'IncompleteExpired', 'PastDue', 'Unpaid');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
alter table "Product" enable row level security;
create policy "Allow public read-only access." on "Product" for select using (true);


-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" TEXT,
    "unitAmount" BIGINT,
    "currency" TEXT NOT NULL,
    "type" "PriceType" NOT NULL,
    "interval" "PriceInterval",
    "intervalCount" INTEGER,
    "trialPeriodDays" INTEGER,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);
alter table "Price" enable row level security;
create policy "Allow public read-only access." on "Price" for select using (true);


-- CreateTable
CREATE TABLE "StripeCustomer" (
    "teamId" BIGINT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("teamId")
);
alter table "StripeCustomer" enable row level security;
create policy "Users can see their Team's StripeCustomer."
  on "StripeCustomer" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "StripeCustomer"."teamId")
    )
  );

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "metadata" JSONB NOT NULL,
    "priceId" TEXT NOT NULL,
    "quantity" INTEGER,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL,
    "currentPeriodStart" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMPTZ(6),
    "cancelAt" TIMESTAMPTZ(6),
    "canceledAt" TIMESTAMPTZ(6),
    "trialStart" TIMESTAMPTZ(6),
    "trialEnd" TIMESTAMPTZ(6),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
alter table "Subscription" enable row level security;
create policy "Users can see their Team's Subscription."
  on "Subscription" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "Subscription"."teamId")
    )
  );

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
