create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text null
);

alter table public.waitlist enable row level security;

create unique index if not exists waitlist_email_unique_idx
on public.waitlist (lower(email));

create index if not exists waitlist_created_at_desc_idx
on public.waitlist(created_at desc);
