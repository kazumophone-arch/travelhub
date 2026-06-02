import type { Metadata } from "next";
import type { City } from "@/data/types";
import { SpotDirectory } from "@/components/SpotDirectory";
import { sortByRank } from "@/data/visibility";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Spots | TravelHub",
  description:
    "Browse TravelHub featured spots by place, city, country, and travel mood.",
};

const SUPABASE_SPOTS_SELECT =
  "id, city_id, name, slug, summary, description, image_url, image_alt, image_credit, image_source_url, affiliate_hotel_url, affiliate_tour_url, is_published";

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
  affiliate_hotel_url?: string | null;
  affiliate_tour_url?: string | null;
  is_published: boolean;
  sort_rank: number;
};

type SupabaseSpotRow = {
  id: string;
  city_id: string | null;
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
    affiliateHotelUrl: row.affiliate_hotel_url ?? "",
    affiliateTourUrl: row.affiliate_tour_url ?? "",
    affHotelsUrl: row.affiliate_hotel_url ?? "",
    affToursUrl: row.affiliate_tour_url ?? "",
    rank: row.sort_rank ?? 999,
    sortRank: row.sort_rank ?? 999,
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
      .select(SUPABASE_SPOTS_SELECT)
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
  supabaseCities: SupabaseCityRow[],
  supabaseSpots: SupabaseSpotRow[]
) {
  const supabaseCityById = new Map(
    supabaseCities.map((city) => [city.id, city])
  );

  const spotsByCityId = new Map<string, SupabaseSpotRow[]>();

  for (const spot of supabaseSpots) {
    if (!spot.city_id || !supabaseCityById.has(spot.city_id)) continue;

    const current = spotsByCityId.get(spot.city_id) ?? [];
    current.push(spot);
    spotsByCityId.set(spot.city_id, current);
  }

  const supabaseDirectoryCities = supabaseCities
    .map((city) => {
      const citySpots = spotsByCityId.get(city.id) ?? [];

      return toDirectoryCity(city, citySpots);
    });

  return sortByRank(supabaseDirectoryCities);
}

export default async function SpotsPage() {
  const { supabaseCities, supabaseSpots } = await getSupabaseCitiesAndSpots();

  const mergedCities = mergeSupabaseSpotsIntoCities(
    supabaseCities,
    supabaseSpots
  );

  return <SpotDirectory cities={mergedCities as City[]} />;
}

