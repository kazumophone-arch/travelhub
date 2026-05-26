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
