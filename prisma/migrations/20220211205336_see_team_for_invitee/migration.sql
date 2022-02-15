-- This is an empty migration.
DROP POLICY IF EXISTS  "Users can see invited team info." ON "Team";

create policy "Users can see invited team info."
  on "Team" for select
  using (
    auth.email() IN ( 
      SELECT "TeamInvite"."emailAddress"
      FROM "TeamInvite"
      WHERE ("TeamInvite"."teamId" = "Team".id)
    )
  );