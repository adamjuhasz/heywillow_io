-- This is an empty migration.
alter table "Namespace" enable row level security;
ALTER TABLE "Namespace" ADD CONSTRAINT "Namespace_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DROP POLICY IF EXISTS  "Users can see their team namesapces." ON "Namespace";

create policy "Users can see their team namesapces."
  on "Namespace" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      where "TeamMember"."teamId" = "Namespace"."teamId")
  );
