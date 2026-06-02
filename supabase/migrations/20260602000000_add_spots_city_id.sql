do $$
declare
  city_id_type text;
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

  if city_id_type is null then
    raise exception 'Could not determine public.cities.id type.';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'spots'
      and column_name = 'city_id'
  ) then
    execute format('alter table public.spots add column city_id %s', city_id_type);
  end if;
end $$;

update public.spots
set city_id = public.cities.id
from public.cities
where public.spots.city_slug = public.cities.slug
  and public.spots.city_id is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'spots_city_id_fkey'
      and conrelid = 'public.spots'::regclass
  ) then
    alter table public.spots
      add constraint spots_city_id_fkey
      foreign key (city_id)
      references public.cities(id)
      on delete cascade;
  end if;
end $$;

create index if not exists spots_city_id_idx
on public.spots(city_id);
