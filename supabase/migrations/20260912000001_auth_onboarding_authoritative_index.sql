-- ============================================================
-- EchoSoul — Migration 006: Auth Onboarding Authoritative Index
-- ============================================================
-- 1. Creates index on public.profiles(onboarding_completed)
-- 2. Creates composite index on public.profiles(id, onboarding_completed)
-- 3. Ensures handle_new_user() trigger function explicitly initializes
--    onboarding_completed = false and onboarding_step = 1
-- ============================================================

-- 1. Indexes for instant lookup during session restoration
create index if not exists profiles_onboarding_completed_idx 
  on public.profiles(onboarding_completed);

create index if not exists profiles_user_onboarding_idx 
  on public.profiles(id, onboarding_completed);

-- 2. Ensure trigger explicitly specifies defaults
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, onboarding_step, onboarding_completed)
  values (new.id, 1, false)
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
grant execute on function public.handle_new_user() to postgres;
grant execute on function public.handle_new_user() to service_role;
