import type { MetadataRoute } from "next";
import { journalArticles } from "@/data/journal";
import { getPublishedCountriesWithCities } from "@/data/supabase-public-countries";
import { themes } from "@/data/themes";
import { getAbsoluteUrl } from "@/lib/site-metadata";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SupabaseSitemapCity = {
  id: string;
  slug: string;
  updated_at: string | null;
};

type SupabaseSitemapSpot = {
  id: string;
  city_id: string | null;
  slug: string;
  updated_at: string | null;
};

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

function isSitemapEntry(entry: SitemapEntry | null): entry is SitemapEntry {
  return entry !== null;
}

function toOptionalDate(value: string | null): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function getSupabaseSitemapData() {
  const [citiesResult, spotsResult] = await Promise.all([
    supabase
      .from("cities")
      .select("id, slug, updated_at")
      .eq("is_published", true)
      .order("sort_rank", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("spots")
      .select("id, city_id, slug, updated_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  return {
    cities: (citiesResult.data ?? []) as SupabaseSitemapCity[],
    spots: spotsResult.error
      ? []
      : ((spotsResult.data ?? []) as SupabaseSitemapSpot[]),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ cities: supabaseCities, spots: supabaseSpots }, publishedCountries] =
    await Promise.all([getSupabaseSitemapData(), getPublishedCountriesWithCities()]);

  const supabaseCityById = new Map(
    supabaseCities.map((city) => [city.id, city])
  );

  const seenUrls = new Set<string>();

  function addEntry(
    path: string,
    changeFrequency: ChangeFrequency,
    priority: number,
    lastModified?: Date
  ): SitemapEntry | null {
    const url = getAbsoluteUrl(path);

    if (seenUrls.has(url)) return null;

    seenUrls.add(url);

    return {
      url,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
    };
  }

  const staticPages: MetadataRoute.Sitemap = [
    addEntry("/", "weekly", 1),
    addEntry("/discover", "weekly", 0.9),
    addEntry("/cities", "weekly", 0.9),
    addEntry("/spots", "weekly", 0.9),
    addEntry("/themes", "weekly", 0.9),
    addEntry("/journal", "weekly", 0.8),
    addEntry("/about", "monthly", 0.5),
    addEntry("/contact", "yearly", 0.3),
    addEntry("/affiliate-disclosure", "monthly", 0.4),
    addEntry("/privacy", "yearly", 0.3),
    addEntry("/terms", "yearly", 0.3),
  ].filter(isSitemapEntry);

  const themePages: MetadataRoute.Sitemap = themes
    .map((theme) => addEntry(`/themes/${theme.slug}`, "weekly", 0.75))
    .filter(isSitemapEntry);

  const journalPages: MetadataRoute.Sitemap = journalArticles
    .map((article) => addEntry(`/journal/${article.slug}`, "monthly", 0.65))
    .filter(isSitemapEntry);

  const countryPages: MetadataRoute.Sitemap = publishedCountries
    .map((country) =>
      addEntry(
        `/countries/${country.slug}`,
        "weekly",
        0.85,
        toOptionalDate(country.updated_at)
      )
    )
    .filter(isSitemapEntry);

  const cityPages: MetadataRoute.Sitemap = supabaseCities
    .map((city) =>
      addEntry(
        `/c/${city.slug}`,
        "weekly",
        0.8,
        toOptionalDate(city.updated_at)
      )
    )
    .filter(isSitemapEntry);

  const spotPages: MetadataRoute.Sitemap = supabaseSpots
    .map((spot) => {
      const city = spot.city_id
        ? supabaseCityById.get(spot.city_id)
        : undefined;

      if (!city) return null;

      return addEntry(
        `/c/${city.slug}/spot/${spot.slug}`,
        "weekly",
        0.7,
        toOptionalDate(spot.updated_at)
      );
    })
    .filter(isSitemapEntry);

  return [
    ...staticPages,
    ...themePages,
    ...journalPages,
    ...countryPages,
    ...cityPages,
    ...spotPages,
  ];
}
