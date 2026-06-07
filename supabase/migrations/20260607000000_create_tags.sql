create extension if not exists pgcrypto;

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text null,
  is_active boolean not null default true,
  sort_rank integer null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tags_slug_key'
      and conrelid = 'public.tags'::regclass
  ) then
    alter table public.tags
      add constraint tags_slug_key
      unique (slug);
  end if;
end $$;

create index if not exists tags_is_active_sort_rank_name_idx
on public.tags(is_active, sort_rank, name);

create index if not exists tags_name_idx
on public.tags(name);

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
    'create table if not exists public.city_tags (
      city_id %s not null,
      tag_id uuid not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )',
    city_id_type
  );

  execute format(
    'create table if not exists public.spot_tags (
      spot_id %s not null,
      tag_id uuid not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )',
    spot_id_type
  );
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'city_tags_city_id_fkey'
      and conrelid = 'public.city_tags'::regclass
  ) then
    alter table public.city_tags
      add constraint city_tags_city_id_fkey
      foreign key (city_id)
      references public.cities(id)
      on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'city_tags_tag_id_fkey'
      and conrelid = 'public.city_tags'::regclass
  ) then
    alter table public.city_tags
      add constraint city_tags_tag_id_fkey
      foreign key (tag_id)
      references public.tags(id)
      on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'city_tags_city_id_tag_id_key'
      and conrelid = 'public.city_tags'::regclass
  ) then
    alter table public.city_tags
      add constraint city_tags_city_id_tag_id_key
      unique (city_id, tag_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'spot_tags_spot_id_fkey'
      and conrelid = 'public.spot_tags'::regclass
  ) then
    alter table public.spot_tags
      add constraint spot_tags_spot_id_fkey
      foreign key (spot_id)
      references public.spots(id)
      on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'spot_tags_tag_id_fkey'
      and conrelid = 'public.spot_tags'::regclass
  ) then
    alter table public.spot_tags
      add constraint spot_tags_tag_id_fkey
      foreign key (tag_id)
      references public.tags(id)
      on delete cascade;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'spot_tags_spot_id_tag_id_key'
      and conrelid = 'public.spot_tags'::regclass
  ) then
    alter table public.spot_tags
      add constraint spot_tags_spot_id_tag_id_key
      unique (spot_id, tag_id);
  end if;
end $$;

create index if not exists city_tags_city_id_idx
on public.city_tags(city_id);

create index if not exists city_tags_tag_id_idx
on public.city_tags(tag_id);

create index if not exists spot_tags_spot_id_idx
on public.spot_tags(spot_id);

create index if not exists spot_tags_tag_id_idx
on public.spot_tags(tag_id);
