import type { Metadata } from "next";
import type { City } from "@/data/types";
import { CityDirectory } from "@/components/CityDirectory";
import { sortByRank } from "@/data/visibility";
import { createPublicMetadata } from "@/lib/site-metadata";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPublicMetadata({
  title: "Browse Travel Cities | TravelHub",
  description:
    "Browse TravelHub city guides with featured spots, hotel links, tour links, and travel ideas.",
  path: "/cities",
});

type SupabaseCityRow = {
  id: string;
  country_id?: string | null;
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

function toDirectoryCity(row: SupabaseCityRow): City {
  return {
    id: row.id,
    slug: row.slug,
    city: row.city,
    countryId: row.country_id ?? null,
    country: row.country,
    countryName: row.country,
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
