alter table public.spots
drop constraint if exists spots_city_id_fkey;

alter table public.spots
add constraint spots_city_id_fkey
foreign key (city_id)
references public.cities(id)
on delete restrict;
