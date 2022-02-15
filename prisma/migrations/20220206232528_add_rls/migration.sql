-- This is an empty migration.
create policy "Users can see their own team membership."
  on "TeamMember" for select
  using (
    auth.uid() = "profileId"
  );