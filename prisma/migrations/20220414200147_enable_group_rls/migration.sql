-- This is an empty migration.
ALTER TABLE "CustomerGroupTraits" ENABLE ROW LEVEL SECURITY;
create policy "Users can see their team's CustomerGroupTraits."
  on "CustomerGroupTraits" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      JOIN "CustomerGroup" ON "CustomerGroup"."teamId" = "TeamMember"."teamId"
      WHERE ("CustomerGroup"."id" = "CustomerGroupTraits"."customerGroupId")
    )
  );

ALTER TABLE "GroupEvent" ENABLE ROW LEVEL SECURITY;
create policy "Users can see their team's GroupEvent."
  on "GroupEvent" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      JOIN "CustomerGroup" ON "CustomerGroup"."teamId" = "TeamMember"."teamId"
      WHERE ("CustomerGroup"."id" = "GroupEvent"."groupId")
    )
  );

ALTER TABLE "Attachment" ENABLE ROW LEVEL SECURITY;
create policy "Users can see their team's Attachment."
  on "Attachment" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "Attachment"."teamId")
    )
  );

