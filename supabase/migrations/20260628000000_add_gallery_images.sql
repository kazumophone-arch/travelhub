-- Adds a multi-image gallery to cities and spots, on top of the existing
-- single image_url/image_position/image_alt/image_credit fields (which stay
-- as the primary/hero image). Each gallery item is a JSON object:
-- { "url": "https://...", "position": "center", "alt": "", "credit": "" }
alter table cities
  add column if not exists gallery jsonb not null default '[]'::jsonb;

alter table spots
  add column if not exists gallery jsonb not null default '[]'::jsonb;

-- Per-spot editorial notes shown in the "Why go / How to use it / Best for /
-- Before you go" grid. Shape: { "how_to_use": "", "best_for": "", "before_you_go": "" }
-- ("why go" reuses the existing description/summary fields).
alter table spots
  add column if not exists notes jsonb not null default '{}'::jsonb;

-- Per-city climate + seasonality used by the "Best time to visit" section.
-- Shape: {
--   "months": [ { "month": "Jan", "high": 9, "low": 1, "demand": "low" }, ... ],
--   "peak_season": "", "value_season": "", "weather_summary": ""
-- } where demand is one of low | mid | high | peak (crowds & prices).
alter table cities
  add column if not exists climate jsonb not null default '{}'::jsonb;
