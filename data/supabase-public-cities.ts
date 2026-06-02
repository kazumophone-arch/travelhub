import "server-only";
import type { City } from "@/data/types";
import {
  SUPABASE_PUBLIC_SPOT_SELECT,
  toCitySpotFromSupabase,
  type SupabasePublicSpot,
} from "@/data/supabase-public-spots";
import { supabase } from "@/lib/supabase";

export type SupabasePublicCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
  region: string;
  summary: string;
  description: string;
  image_url: string;
  image_alt: string;
  image_credit: string;
  image_source_url: string;
  is_published: boolean;
  sort_rank?: number | null;
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

  return data as SupabasePublicCity;
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
    country: city.country,
    stops: toStopTuple(city, spots),
    description: city.description || city.summary,
    isPublished: city.is_published,
    sortRank: city.sort_rank ?? 999,
    imageUrl: city.image_url,
    imageAlt: city.image_alt || city.city,
    imageCredit: city.image_credit,
    spotDetails: spots.map(toCitySpotFromSupabase),
    seasons: ["All year"],
    travelStyles: [city.region || "City break"],
    themes: [city.region || "Travel city"],
    categories: city.region ? [city.region] : [],
    affHotelsUrl: "",
    affToursUrl: "",
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

  const cities = citiesResult.data as SupabasePublicCity[];
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
