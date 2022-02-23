-- This is an empty migration.
CREATE POLICY "Users can insert their own notification preferences."
  on "NotificationPreference" for insert
  with check (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."id" = "NotificationPreference"."teamMemberId")
    )
  );