-- This is an empty migration.

-- This is an empty migration.

-- delete a row from public."Users" when the user is deleted
create or replace function public.handle_deleted_user()
returns trigger as $$
begin
  delete from public."Profile" where public."Profile".id = old.id;
  return old;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is deleted
drop trigger if exists on_auth_user_deleted on auth.users;

create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_deleted_user();


-- update a row in public."Users" when the email is updated
create or replace function public.handle_updated_user()
returns trigger as $$
begin
  update public."Profile" set email = new.email where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is updated
drop trigger if exists on_auth_user_updated on auth.users;

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_updated_user();