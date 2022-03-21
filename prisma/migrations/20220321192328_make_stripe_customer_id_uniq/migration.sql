/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `StripeCustomer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_stripeCustomerId_key" ON "StripeCustomer"("stripeCustomerId");
