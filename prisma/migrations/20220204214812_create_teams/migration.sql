-- CreateTable
CREATE TABLE "Team" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);
alter table "Team" enable row level security;


-- CreateTable
CREATE TABLE "TeamMember" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" BIGINT,
    "profileId" UUID,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);
alter table "TeamMember" enable row level security;

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
alter table "Profile" enable row level security;

-- RLS Policies
create policy "Users can update own profile."
  on "Profile" for update
  using ( auth.uid() = id );

create policy "Profiles are viewable by users who created them."
  on "Profile" for select
  using ( auth.uid() = id );
  
create policy "Users can see their own teams."
  on "Team" for select
  using (
    auth.uid() IN ( 
      SELECT "TeamMember"."profileId"
      FROM "TeamMember"
      WHERE ("TeamMember"."teamId" = "Team".id)
    )
  );

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- inserts a row into public.Profile
create function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public."Profile" (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();