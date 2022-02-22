-- This is an empty migration.
DROP POLICY IF EXISTS  "Users can see invited team namespace." ON "Namespace";

create policy "Users can see invited team namespace."
  on "Namespace" for select
  using (
    auth.email() IN ( 
      SELECT "TeamInvite"."emailAddress"
      FROM "TeamInvite"
      JOIN "Team" ON "TeamInvite"."teamId" = "Team"."id"
      WHERE ("Team"."namespaceId" = "Namespace"."id")
    )
  );