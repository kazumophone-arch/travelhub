alter table public.cities
add column if not exists best_months text[] not null default '{}',
add column if not exists season_note text null;
