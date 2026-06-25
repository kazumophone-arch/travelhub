alter table public.cities
add column if not exists is_featured boolean not null default false,
add column if not exists featured_rank int null;
