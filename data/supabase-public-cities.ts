import "server-only";
import type { City } from "@/data/types";
import {
  SUPABASE_PUBLIC_SPOT_SELECT,
  toCitySpotFromSupabase,
  type SupabasePublicSpot,
} from "@/data/supabase-public-spots";
import { supabase } from "@/lib/supabase";
import { normalizeImagePosition } from "@/lib/url-fields";

export type SupabasePublicCity = {
  id: string;
  country_id?: string | null;
  slug: string;
  city: string;
  country: string;
  countryName?: string;
  countrySlug?: string;
  region: string;
  summary: string;
  description: string;
  image_url: string;
  image_alt: string;
  image_credit: string;
  image_source_url: string;
  image_position?: string | null;
  imagePosition?: string;
  affiliate_hotel_url?: string | null;
  affiliate_tour_url?: string | null;
  is_published: boolean;
  sort_rank?: number | null;
  is_featured: boolean;
  featured_rank: number | null;
  best_months: string[];
  season_note: string | null;
};

export async function getPublishedSupabaseCity(
  slug: string
): Promise<SupabasePublicCity | null> {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeSupabasePublicCity(data as SupabasePublicCity);
}

export function normalizeSupabasePublicCity(
  city: SupabasePublicCity
): SupabasePublicCity {
  return {
    ...city,
    imagePosition: normalizeImagePosition(city.image_position),
  };
}

function toStopTuple(city: SupabasePublicCity, spots: SupabasePublicSpot[]) {
  const stopNames = spots
    .map((spot) => spot.name?.trim())
    .filter((name): name is string => Boolean(name));
  const fallbackStops = [
    city.city,
    city.country,
    city.region || "Travel idea",
  ];
  const stops = [...stopNames, ...fallbackStops]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .slice(0, 3);

  while (stops.length < 3) {
    stops.push(fallbackStops[stops.length] ?? city.city);
  }

  return stops as [string, string, string];
}

function toDirectoryCity(
  city: SupabasePublicCity,
  spots: SupabasePublicSpot[]
): City {
  return {
    slug: city.slug,
    city: city.city,
    countryId: city.country_id ?? null,
    country: city.countryName || city.country,
    countryName: city.countryName || city.country,
    countrySlug: city.countrySlug,
    stops: toStopTuple(city, spots),
    description: city.description || city.summary,
    isPublished: city.is_published,
    sortRank: city.sort_rank ?? 999,
    isFeatured: Boolean(city.is_featured),
    featuredRank: city.featured_rank ?? null,
    imageUrl: city.image_url,
    imagePosition: normalizeImagePosition(city.imagePosition ?? city.image_position),
    imageAlt: city.image_alt || city.city,
    imageCredit: city.image_credit,
    imageSourceUrl: city.image_source_url,
    spotDetails: spots.map(toCitySpotFromSupabase),
    seasons: ["All year"],
    months: city.best_months ?? [],
    seasonNote: city.season_note ?? null,
    travelStyles: [city.region || "City break"],
    themes: [city.region || "Travel city"],
    categories: city.region ? [city.region] : [],
    affiliateHotelUrl: city.affiliate_hotel_url ?? "",
    affiliateTourUrl: city.affiliate_tour_url ?? "",
    affHotelsUrl: city.affiliate_hotel_url ?? "",
    affToursUrl: city.affiliate_tour_url ?? "",
  };
}

export async function getPublishedSupabaseDirectoryCities(): Promise<City[]> {
  const [citiesResult, spotsResult] = await Promise.all([
    supabase
      .from("cities")
      .select("*")
      .eq("is_published", true)
      .order("sort_rank", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("spots")
      .select(SUPABASE_PUBLIC_SPOT_SELECT)
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  if (citiesResult.error || !citiesResult.data) {
    return [];
  }

  const cities = (citiesResult.data as SupabasePublicCity[]).map(
    normalizeSupabasePublicCity
  );
  const spots = spotsResult.error
    ? []
    : ((spotsResult.data ?? []) as SupabasePublicSpot[]);
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const spotsByCityId = new Map<string, SupabasePublicSpot[]>();

  for (const spot of spots) {
    if (!spot.city_id || !cityById.has(spot.city_id)) continue;

    const current = spotsByCityId.get(spot.city_id) ?? [];
    current.push(spot);
    spotsByCityId.set(spot.city_id, current);
  }

  return cities.map((city) =>
    toDirectoryCity(city, spotsByCityId.get(city.id) ?? [])
  );
}
