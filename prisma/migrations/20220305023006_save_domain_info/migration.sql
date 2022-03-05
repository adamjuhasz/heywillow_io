-- CreateTable
CREATE TABLE "PostmarkDomain" (
    "domain" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "postmarkDomainId" INTEGER NOT NULL,

    CONSTRAINT "PostmarkDomain_pkey" PRIMARY KEY ("domain")
);

ALTER TABLE "PostmarkDomain" ENABLE ROW LEVEL SECURITY;
create policy "Users can see their own domains."
  on "PostmarkDomain" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "PostmarkDomain"."teamId")
    )
  );

-- AddForeignKey
ALTER TABLE "PostmarkDomain" ADD CONSTRAINT "PostmarkDomain_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
