-- This is an empty migration.
DROP POLICY IF EXISTS  "Users can see their invites." ON "TeamInvite";
  
create policy "Users can see their invites."
  on "TeamInvite" for select
  using (
    auth.email() = "TeamInvite"."emailAddress"
  );