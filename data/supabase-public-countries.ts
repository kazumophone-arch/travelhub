import "server-only";
import { supabase } from "@/lib/supabase";
// The countries table currently has RLS enabled with no public read policy,
// so the anon client gets an empty result (verified 2026-07-06). Until a
// "public read published countries" policy ships (owner-applied migration),
// country rows are read with the service-role client — server-only, and
// always filtered to is_published = true. Cities keep using the anon client.
import { supabaseAdmin } from "@/lib/supabase-admin";

export type SupabasePublicCountry = {
  id: string;
  name: string;
  slug: string;
  iso_code: string | null;
  region: string | null;
  image_url: string | null;
  image_source_url: string | null;
  is_published: boolean;
  sort_rank: number | null;
  updated_at: string | null;
};

export type CountryChapterCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
  country_id: string | null;
  summary: string | null;
  image_url: string | null;
  image_position?: string | null;
  best_months: string[] | null;
  season_note: string | null;
  climate?: unknown;
  sort_rank: number | null;
};

export type CountryVolume = {
  country: SupabasePublicCountry;
  // 1-based position among published countries that have at least one
  // published city, ordered by sort_rank then name. Current library order,
  // not a permanent ID — never written into URLs or JSON-LD.
  volumeNumber: number | null;
  volumeTotal: number;
  cities: CountryChapterCity[];
};

const COUNTRY_SELECT =
  "id, name, slug, iso_code, region, image_url, image_source_url, is_published, sort_rank, updated_at";

const CHAPTER_CITY_SELECT =
  "id, slug, city, country, country_id, summary, image_url, image_position, best_months, season_note, climate, sort_rank";

// Chapter order mirrors getCountryChapterContext in supabase-public-cities:
// sort_rank ascending, city name ascending as the tie-breaker.
async function getPublishedCitiesForCountry(
  country: SupabasePublicCountry
): Promise<CountryChapterCity[]> {
  const byId = await supabase
    .from("cities")
    .select(CHAPTER_CITY_SELECT)
    .eq("is_published", true)
    .eq("country_id", country.id)
    .order("sort_rank", { ascending: true, nullsFirst: false })
    .order("city", { ascending: true });

  if (!byId.error && (byId.data ?? []).length > 0) {
    return byId.data as CountryChapterCity[];
  }

  if (!country.name?.trim()) {
    return [];
  }

  const byName = await supabase
    .from("cities")
    .select(CHAPTER_CITY_SELECT)
    .eq("is_published", true)
    .ilike("country", country.name.trim())
    .order("sort_rank", { ascending: true, nullsFirst: false })
    .order("city", { ascending: true });

  if (byName.error || !byName.data) {
    return [];
  }

  return byName.data as CountryChapterCity[];
}

// Published countries that have at least one published city — the only
// countries that get a public volume page or a sitemap entry.
export async function getPublishedCountriesWithCities(): Promise<SupabasePublicCountry[]> {
  const [countriesResult, citiesResult] = await Promise.all([
    supabaseAdmin
      .from("countries")
      .select(COUNTRY_SELECT)
      .eq("is_published", true)
      .order("sort_rank", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true }),
    supabase
      .from("cities")
      .select("id, country_id, country")
      .eq("is_published", true),
  ]);

  if (countriesResult.error || !countriesResult.data) {
    return [];
  }

  const cities = citiesResult.error ? [] : (citiesResult.data ?? []);
  const cityCountryIds = new Set(
    cities.map((city) => city.country_id).filter(Boolean)
  );
  const cityCountryNames = new Set(
    cities
      .map((city) => String(city.country ?? "").trim().toLowerCase())
      .filter(Boolean)
  );

  return (countriesResult.data as SupabasePublicCountry[]).filter(
    (country) =>
      cityCountryIds.has(country.id) ||
      cityCountryNames.has(country.name.trim().toLowerCase())
  );
}

export async function getCountryVolume(slug: string): Promise<CountryVolume | null> {
  const { data, error } = await supabaseAdmin
    .from("countries")
    .select(COUNTRY_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const country = data as SupabasePublicCountry;

  const [cities, volumeCountries] = await Promise.all([
    getPublishedCitiesForCountry(country),
    getPublishedCountriesWithCities(),
  ]);

  const volumeIndex = volumeCountries.findIndex((entry) => entry.id === country.id);

  return {
    country,
    volumeNumber: volumeIndex === -1 ? null : volumeIndex + 1,
    volumeTotal: volumeCountries.length,
    cities,
  };
}
