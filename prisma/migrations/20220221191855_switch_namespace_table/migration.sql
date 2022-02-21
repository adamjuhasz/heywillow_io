/*
  Warnings:

  - You are about to drop the column `namespace` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[namespaceId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namespaceId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "namespace",
ADD COLUMN     "namespaceId" BIGINT NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Team_namespaceId_key" ON "Team"("namespaceId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "Namespace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Team" ALTER "namespaceId" DROP DEFAULT;