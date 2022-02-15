-- This is an empty migration.
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  insert into public."Profile" (id, email)
  values (new.id, new.email);
  return new;
end;
$$;