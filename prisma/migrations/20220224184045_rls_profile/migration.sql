-- This is an empty migration.
DROP POLICY  IF EXISTS  "Users can see their Team's profiles." ON "Profile";

create policy "Users can see their Team's profiles."
  on "Profile" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE "TeamMember"."teamId" IN (SELECT "TeamMember"."teamId" FROM "TeamMember" where "TeamMember"."profileId" = "Profile"."id")
    )
  );

create or replace function get_teams_for_authenticated_user()
returns setof bigint
language sql
security definer
set search_path = public
stable
as $$
    select "TeamMember"."teamId"
    from "TeamMember"
    where "TeamMember"."profileId" = auth.uid()
$$;

DROP POLICY  IF EXISTS  "Users can see their Team's TeamMembers." ON "TeamMember";

create policy "Users can see their Team's TeamMembers."
  on "TeamMember" for select
  using ("TeamMember"."teamId" IN (
    SELECT get_teams_for_authenticated_user()
  )
  );

