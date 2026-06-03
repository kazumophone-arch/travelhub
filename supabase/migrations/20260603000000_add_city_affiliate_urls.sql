alter table public.cities
add column if not exists affiliate_hotel_url text,
add column if not exists affiliate_tour_url text;
