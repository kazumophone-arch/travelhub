create extension if not exists pgcrypto;

do $$
declare
  city_id_type text;
  spot_id_type text;
begin
  select format_type(attribute.atttypid, attribute.atttypmod)
  into city_id_type
  from pg_attribute attribute
  join pg_class class on class.oid = attribute.attrelid
  join pg_namespace namespace on namespace.oid = class.relnamespace
  where namespace.nspname = 'public'
    and class.relname = 'cities'
    and attribute.attname = 'id'
    and not attribute.attisdropped;

  select format_type(attribute.atttypid, attribute.atttypmod)
  into spot_id_type
  from pg_attribute attribute
  join pg_class class on class.oid = attribute.attrelid
  join pg_namespace namespace on namespace.oid = class.relnamespace
  where namespace.nspname = 'public'
    and class.relname = 'spots'
    and attribute.attname = 'id'
    and not attribute.attisdropped;

  if city_id_type is null then
    raise exception 'Could not determine public.cities.id type.';
  end if;

  if spot_id_type is null then
    raise exception 'Could not determine public.spots.id type.';
  end if;

  execute format(
    'create table if not exists public.click_logs (
      id uuid primary key default gen_random_uuid(),
      created_at timestamptz not null default now(),
      type text not null,
      city_id %s null references public.cities(id) on delete set null,
      spot_id %s null references public.spots(id) on delete set null,
      city_slug text null,
      spot_slug text null,
      target_url text null,
      src text null,
      v text null,
      referer text null,
      user_agent text null
    )',
    city_id_type,
    spot_id_type
  );
end $$;

alter table public.click_logs enable row level security;

create index if not exists click_logs_created_at_desc_idx
on public.click_logs(created_at desc);

create index if not exists click_logs_type_idx
on public.click_logs(type);

create index if not exists click_logs_city_id_idx
on public.click_logs(city_id);

create index if not exists click_logs_spot_id_idx
on public.click_logs(spot_id);

create index if not exists click_logs_src_idx
on public.click_logs(src);

create index if not exists click_logs_v_idx
on public.click_logs(v);
