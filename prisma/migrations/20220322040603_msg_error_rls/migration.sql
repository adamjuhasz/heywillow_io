-- This is an empty migration.
alter table "MessageError" enable row level security;
create policy "Users can see their team's MessageError."
  on "MessageError" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      join "Message" on "Message"."threadId" = "Thread"."id"
      where "MessageError"."messageId" = "Message"."id"
  )
);
