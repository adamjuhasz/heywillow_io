-- This is an empty migration.
DROP POLICY IF EXISTS  "Users can see their team's Comments." ON "Comment";
  
create policy "Users can see their team's Comments."
  on "Comment" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      join "Message" on "Message"."threadId" = "Thread"."id"
      where "Comment"."messageId" = "Message"."id"
  )
);