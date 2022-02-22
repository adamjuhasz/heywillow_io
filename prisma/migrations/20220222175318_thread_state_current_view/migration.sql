-- This is an empty migration.
CREATE OR REPLACE VIEW ViewThreadStateCurrent as
  SELECT * FROM (
      SELECT *, 
      rank() OVER (
          PARTITION BY "threadId"
          ORDER BY "createdAt" DESC
      )
      FROM "ThreadState"
  ) rank_filter WHERE RANK = 1
  ORDER BY "createdAt" DESC;
