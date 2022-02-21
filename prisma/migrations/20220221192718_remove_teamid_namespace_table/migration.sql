/*
  Warnings:

  - You are about to drop the column `teamId` on the `Namespace` table. All the data in the column will be lost.

*/

DROP POLICY IF EXISTS  "Users can see their team namesapces." ON "Namespace";

-- DropIndex
DROP INDEX "Namespace_teamId_key";

-- AlterTable
ALTER TABLE "Namespace" DROP COLUMN "teamId";

create policy "Users can see their team namesapces."
  on "Namespace" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      JOIN "Team" on "TeamMember"."teamId" = "Team"."id"
      where "Team"."namespaceId" = "Namespace"."id")
  );
