alter table public.cities
add column if not exists image_position text;

alter table public.spots
add column if not exists image_position text;
