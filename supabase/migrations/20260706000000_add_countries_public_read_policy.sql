-- Allow anonymous public reads of PUBLISHED countries only.
--
-- Context: the countries table has row level security enabled but no public
-- SELECT policy, so the anon client receives empty results (verified
-- 2026-07-06). data/supabase-public-countries.ts temporarily reads countries
-- with the service-role client as a server-only workaround. After this
-- policy is applied in production, that helper can switch back to the anon
-- client (follow-up code PR).
--
-- Behavior:
--   - anon may SELECT rows where is_published = true
--   - unpublished rows stay hidden from public clients
--   - no INSERT / UPDATE / DELETE is granted by this policy
--   - service role is unaffected (it bypasses RLS entirely)
--
-- Verified live 2026-07-06: policy roles={anon}, publishable-key REST
-- returns published countries only; anon writes rejected (401).

-- Idempotent: enabling RLS twice is a no-op; the policy is guarded below.
alter table public.countries enable row level security;

-- Ensure the public API roles hold the base SELECT grant. Supabase grants
-- this by default; re-granting is idempotent and row access is still
-- restricted by the policy below.
grant select on public.countries to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'countries'
      and policyname = 'Public can read published countries'
  ) then
    create policy "Public can read published countries"
      on public.countries
      for select
      to anon
      using (is_published = true);
  end if;
end $$;
