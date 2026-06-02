update public.spots
set city_id = public.cities.id
from public.cities
where public.spots.city_slug = public.cities.slug
  and public.spots.city_id is null;

do $$
begin
  if exists (
    select 1
    from public.spots
    where city_id is not null
    group by city_id, slug
    having count(*) > 1
  ) then
    raise exception 'Cannot add spots_city_id_slug_key because duplicate non-null city_id + slug pairs exist.';
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'spots_city_id_slug_key'
      and conrelid = 'public.spots'::regclass
  ) then
    alter table public.spots
      add constraint spots_city_id_slug_key
      unique (city_id, slug);
  end if;
end $$;
