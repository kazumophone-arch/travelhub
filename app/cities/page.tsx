import type { Metadata } from "next";
import type { City } from "@/data/types";
import { CityDirectory } from "@/components/CityDirectory";
import { sortByRank } from "@/data/visibility";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cities | TravelHub",
  description:
    "Browse TravelHub cities by country, season, mood, travel style, and featured spots.",
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

function toDirectoryCity(row: SupabaseCityRow): City {
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
    sortRank: row.sort_rank ?? 999,
    isPublished: row.is_published,
    seasons: ["All year"],
    travelStyles: [row.region || "City break"],
    themes: [row.region || "Travel city"],
    bestFor: ["First-time visitors"],
    stops: [],
    spotDetails: [],
  } as unknown as City;
}

async function getSupabasePublishedCities() {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("is_published", true)
    .order("sort_rank", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as SupabaseCityRow[]).map(toDirectoryCity);
}

export default async function CitiesPage() {
  const supabaseCities = await getSupabasePublishedCities();
  const mergedCities = sortByRank(supabaseCities);

  return <CityDirectory cities={mergedCities} />;
}
