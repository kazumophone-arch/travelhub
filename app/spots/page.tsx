import type { Metadata } from "next";
import type { City } from "@/data/types";
import { cities } from "@/data/cities";
import { SpotDirectory } from "@/components/SpotDirectory";
import { isPublishedCity, sortByRank } from "@/data/visibility";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spots | TravelHub",
  description:
    "Browse TravelHub featured spots by place, city, country, and travel mood.",
};

type SupabaseCityRow = {
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
  sort_rank: number;
};

type SupabaseSpotRow = {
  id: string;
  city_id: string | null;
  city_slug: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  image_url: string;
  image_alt: string;
  image_credit: string;
  image_source_url: string;
  affiliate_hotel_url: string;
  affiliate_tour_url: string;
  is_published: boolean;
};

function toDirectorySpot(row: SupabaseSpotRow) {
  return {
    name: row.name,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    imageUrl: row.image_url,
    imageAlt: row.image_alt || row.name,
    imageCredit: row.image_credit,
    imageSourceUrl: row.image_source_url,
    tags: [],
    highlights: [],
    bestFor: [],
    isPublished: row.is_published,
    affiliateHotelUrl: row.affiliate_hotel_url,
    affiliateTourUrl: row.affiliate_tour_url,
  };
}

function toDirectoryCity(row: SupabaseCityRow, spots: SupabaseSpotRow[]): City {
  return {
    id: row.id,
    slug: row.slug,
    city: row.city,
    country: row.country,
    region: row.region,
    summary: row.summary,
    description: row.description,
    imageUrl: row.image_url,
    imageAlt: row.image_alt || row.city,
    imageCredit: row.image_credit,
    imageSourceUrl: row.image_source_url,
    rank: row.sort_rank ?? 999,
    isPublished: row.is_published,
    seasons: ["All year"],
    travelStyles: [row.region || "City break"],
    themes: [row.region || "Travel city"],
    bestFor: ["First-time visitors"],
    stops: spots.map((spot) => spot.name),
    spotDetails: spots.map(toDirectorySpot),
  } as unknown as City;
}

async function getSupabaseCitiesAndSpots() {
  const [citiesResult, spotsResult] = await Promise.all([
    supabase
      .from("cities")
      .select("*")
      .eq("is_published", true)
      .order("sort_rank", { ascending: true })
      .order("created_at", { ascending: false }),

    supabase
      .from("spots")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  const supabaseCities = (citiesResult.data ?? []) as SupabaseCityRow[];
  const supabaseSpots = (spotsResult.data ?? []) as SupabaseSpotRow[];

  return {
    supabaseCities,
    supabaseSpots,
  };
}

function mergeSupabaseSpotsIntoCities(
  staticCities: City[],
  supabaseCities: SupabaseCityRow[],
  supabaseSpots: SupabaseSpotRow[]
) {
  const staticCityMap = new Map(staticCities.map((city) => [city.slug, city]));

  const supabaseCityById = new Map(
    supabaseCities.map((city) => [city.id, city])
  );

  const supabaseCityBySlug = new Map(
    supabaseCities.map((city) => [city.slug, city])
  );

  const spotsByCitySlug = new Map<string, SupabaseSpotRow[]>();

  for (const spot of supabaseSpots) {
    const cityFromId = spot.city_id ? supabaseCityById.get(spot.city_id) : null;
    const citySlug = cityFromId?.slug || spot.city_slug;

    if (!citySlug) continue;

    const current = spotsByCitySlug.get(citySlug) ?? [];
    current.push(spot);
    spotsByCitySlug.set(citySlug, current);
  }

  const mergedStaticCities = staticCities.map((city) => {
    const addedSpots = spotsByCitySlug.get(city.slug) ?? [];

    if (addedSpots.length === 0) {
      return city;
    }

    const existingSpotDetails = city.spotDetails ?? [];
    const existingSlugs = new Set(
      existingSpotDetails.map((spot) => spot.slug)
    );

    const newSpotDetails = addedSpots
      .filter((spot) => !existingSlugs.has(spot.slug))
      .map(toDirectorySpot);

    return {
      ...city,
      spotDetails: [...existingSpotDetails, ...newSpotDetails],
      stops: Array.from(
        new Set([...(city.stops ?? []), ...newSpotDetails.map((spot) => spot.name)])
      ),
    };
  });

  const staticSlugs = new Set(staticCities.map((city) => city.slug));

  const supabaseOnlyCities = supabaseCities
    .filter((city) => !staticSlugs.has(city.slug))
    .map((city) => {
      const citySpots =
        spotsByCitySlug.get(city.slug) ??
        supabaseSpots.filter((spot) => spot.city_slug === city.slug);

      return toDirectoryCity(city, citySpots);
    });

  return sortByRank([...mergedStaticCities, ...supabaseOnlyCities]);
}

export default async function SpotsPage() {
  const staticCities = sortByRank(
    Object.values(cities).filter(isPublishedCity)
  );

  const { supabaseCities, supabaseSpots } = await getSupabaseCitiesAndSpots();

  const mergedCities = mergeSupabaseSpotsIntoCities(
    staticCities,
    supabaseCities,
    supabaseSpots
  );

  return <SpotDirectory cities={mergedCities as City[]} />;
}

