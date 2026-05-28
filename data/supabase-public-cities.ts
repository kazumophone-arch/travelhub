import "server-only";
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
