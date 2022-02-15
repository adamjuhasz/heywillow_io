-- This is an empty migration.
DROP POLICY  IF EXISTS  "Users can see their Team's threads." ON "Thread";

create policy "Users can see their Team's threads."
  on "Thread" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "Thread"."teamId")
    )
  );

DROP POLICY IF EXISTS  "Users can see their Team's messages." ON "Message";

-- DEMO
SELECT * FROM "Message" where ('c322fa01-904a-4dfc-8b41-ff4790e3e88e' IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      join "Message" on "Message"."threadId" = "Thread"."id"));
  
create policy "Users can see their Team's messages."
  on "Message" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      WHERE "Message"."threadId" = "Thread"."id")
  );

DROP POLICY IF EXISTS  "Users can see their Team's EmailMessages." ON "EmailMessage";
  
create policy "Users can see their Team's EmailMessages."
  on "EmailMessage" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      join "Message" on "Message"."threadId" = "Thread"."id"
      where "EmailMessage".id = "Message"."emailMessageId")
  );

DROP POLICY IF EXISTS  "Users can see their Team's InternalMessage." ON "InternalMessage";
  
create policy "Users can see their Team's InternalMessage."
  on "InternalMessage" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      join "Message" on "Message"."threadId" = "Thread"."id"
      where "InternalMessage".id = "Message"."internalMessageId")
  );

DROP POLICY IF EXISTS  "Users can see their Team's ThreadState." ON "ThreadState";
  
create policy "Users can see their Team's ThreadState."
  on "ThreadState" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      join "Thread" on "Thread"."teamId" = "TeamMember"."teamId"
      where "ThreadState"."threadId" = "Thread"."id")
  );

DROP POLICY IF EXISTS  "Users can see their Team's AliasEmail." ON "AliasEmail";
  
create policy "Users can see their Team's AliasEmail."
  on "AliasEmail" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      where "AliasEmail"."teamId" = "TeamMember"."teamId")
  );

DROP POLICY IF EXISTS  "Users can see their own Notifications." ON "Notification";
  
create policy "Users can see their own Notifications."
  on "Notification" for select
  using (
    auth.uid() IN (SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      where "Notification"."forMemberId" = "TeamMember"."id")
  );