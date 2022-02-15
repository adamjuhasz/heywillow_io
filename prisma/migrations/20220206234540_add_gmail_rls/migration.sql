-- This is an empty migration.
ALTER TABLE "GmailInbox" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GmailLastSync" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RefreshToken" ENABLE ROW LEVEL SECURITY;

create policy "Users can see their inboxes."
  on "GmailInbox" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "GmailInbox"."teamId")
    )
  );
