create extension if not exists pgcrypto;

create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  iso_code text null,
  region text null,
  image_url text null,
  image_source_url text null,
  is_published boolean not null default true,
  sort_rank integer null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cities
add column if not exists country_id uuid null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cities_country_id_fkey'
      and conrelid = 'public.cities'::regclass
  ) then
    alter table public.cities
      add constraint cities_country_id_fkey
      foreign key (country_id)
      references public.countries(id)
      on delete set null;
  end if;
end $$;

create index if not exists cities_country_id_idx
on public.cities(country_id);

do $$
declare
  country_name text;
  base_slug text;
  candidate_slug text;
  suffix integer;
begin
  for country_name in
    select distinct trim(country)
    from public.cities
    where nullif(trim(country), '') is not null
    order by trim(country)
  loop
    if not exists (
      select 1
      from public.countries
      where lower(trim(name)) = lower(country_name)
    ) then
      base_slug := regexp_replace(lower(country_name), '[^a-z0-9]+', '-', 'g');
      base_slug := trim(both '-' from base_slug);

      if base_slug = '' then
        base_slug := 'country';
      end if;

      candidate_slug := base_slug;
      suffix := 2;

      while exists (
        select 1
        from public.countries
        where slug = candidate_slug
      ) loop
        candidate_slug := base_slug || '-' || suffix;
        suffix := suffix + 1;
      end loop;

      insert into public.countries (name, slug, is_published, updated_at)
      values (country_name, candidate_slug, true, now());
    end if;
  end loop;
end $$;

update public.cities
set country_id = countries.id
from public.countries countries
where public.cities.country_id is null
  and nullif(trim(public.cities.country), '') is not null
  and lower(trim(public.cities.country)) = lower(trim(countries.name));
