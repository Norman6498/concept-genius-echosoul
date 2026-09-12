-- ============================================================
-- EchoSoul — Migration 009: Secure Security Definer Functions
-- ============================================================
-- Resolves Supabase Security Advisor issues:
-- 1. Public Can Execute SECURITY DEFINER Function (handle_new_user, rls_auto_enable)
-- 2. Signed-In Users Can Execute SECURITY DEFINER Function (handle_new_user, rls_auto_enable)
-- ============================================================

-- 1. Revoke execute privileges on handle_new_user() from public, anon, authenticated
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

grant execute on function public.handle_new_user() to postgres;
grant execute on function public.handle_new_user() to service_role;

-- 2. Revoke execute privileges on rls_auto_enable() from public, anon, authenticated
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on p.pronamespace = n.oid
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke execute on function public.rls_auto_enable() from public';
    execute 'revoke execute on function public.rls_auto_enable() from anon';
    execute 'revoke execute on function public.rls_auto_enable() from authenticated';
    execute 'grant execute on function public.rls_auto_enable() to postgres';
    execute 'grant execute on function public.rls_auto_enable() to service_role';
  end if;
end $$;
