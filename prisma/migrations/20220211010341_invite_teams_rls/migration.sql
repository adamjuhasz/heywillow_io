-- This is an empty migration.
DROP POLICY IF EXISTS  "Users can see their team invites." ON "TeamInvite";

create policy "Users can see their team invites."
  on "TeamInvite" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      where "TeamMember"."teamId" = "TeamInvite"."teamId")
  );