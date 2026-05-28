import "server-only";
import { supabase } from "@/lib/supabase";

export type SupabasePublicSpot = {
  id: string;
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

export async function getPublishedSupabaseSpot(
  citySlug: string,
  spotSlug: string
): Promise<SupabasePublicSpot | null> {
  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("slug", spotSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as SupabasePublicSpot;
}

export async function getPublishedSupabaseSpotsForCity(
  citySlug: string
): Promise<SupabasePublicSpot[]> {
  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as SupabasePublicSpot[];
}

export function toCitySpotFromSupabase(spot: SupabasePublicSpot) {
  return {
    name: spot.name,
    slug: spot.slug,
    summary: spot.summary,
    description: spot.description,
    imageUrl: spot.image_url,
    imageAlt: spot.image_alt || spot.name,
    imageCredit: spot.image_credit,
    imageSourceUrl: spot.image_source_url,
    tags: [],
    highlights: [],
    bestFor: [],
    isPublished: spot.is_published,
    affiliateHotelUrl: spot.affiliate_hotel_url,
    affiliateTourUrl: spot.affiliate_tour_url,
  };
}

