import "server-only";
import { supabase } from "@/lib/supabase";

export type SupabasePublicSpot = {
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

export async function getPublishedSupabaseSpot(
  citySlug: string,
  spotSlug: string
): Promise<SupabasePublicSpot | null> {
  const { data: city } = await supabase
    .from("cities")
    .select("id, slug")
    .eq("slug", citySlug)
    .eq("is_published", true)
    .maybeSingle();

  if (city?.id) {
    const { data, error } = await supabase
      .from("spots")
      .select("*")
      .eq("city_id", city.id)
      .eq("slug", spotSlug)
      .eq("is_published", true)
      .maybeSingle();

    if (!error && data) {
      return data as SupabasePublicSpot;
    }
  }

  const { data: slugMatchedSpot, error: slugError } = await supabase
    .from("spots")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("slug", spotSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (!slugError && slugMatchedSpot) {
    return slugMatchedSpot as SupabasePublicSpot;
  }

  const { data: looseSpot, error: looseError } = await supabase
    .from("spots")
    .select("*")
    .eq("slug", spotSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (looseError || !looseSpot) {
    return null;
  }

  if (city?.id && looseSpot.city_id === city.id) {
    return looseSpot as SupabasePublicSpot;
  }

  if (looseSpot.city_slug === citySlug) {
    return looseSpot as SupabasePublicSpot;
  }

  return null;
}

export async function getPublishedSupabaseSpotsForCity(
  citySlug: string
): Promise<SupabasePublicSpot[]> {
  const { data: city } = await supabase
    .from("cities")
    .select("id, slug")
    .eq("slug", citySlug)
    .eq("is_published", true)
    .maybeSingle();

  let idMatchedSpots: SupabasePublicSpot[] = [];

  if (city?.id) {
    const { data, error } = await supabase
      .from("spots")
      .select("*")
      .eq("city_id", city.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      idMatchedSpots = data as SupabasePublicSpot[];
    }
  }

  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return idMatchedSpots;
  }

  const seenIds = new Set(idMatchedSpots.map((spot) => spot.id));
  const seenSlugs = new Set(idMatchedSpots.map((spot) => spot.slug));
  const slugMatchedSpots = (data as SupabasePublicSpot[]).filter((spot) => {
    if (seenIds.has(spot.id) || seenSlugs.has(spot.slug)) {
      return false;
    }

    seenIds.add(spot.id);
    seenSlugs.add(spot.slug);
    return true;
  });

  return [...idMatchedSpots, ...slugMatchedSpots];
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
