import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupabaseSpotDetail } from "@/components/SupabaseSpotDetail";
import { getPublishedSupabaseCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpot } from "@/data/supabase-public-spots";
import { createPublicMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; spotSlug: string }>;
}): Promise<Metadata> {
  const { slug, spotSlug } = await params;
  const city = await getPublishedSupabaseCity(slug);
  const spot = city ? await getPublishedSupabaseSpot(slug, spotSlug) : null;

  if (!city || !spot) {
    return {
      title: "Spot not found | TravelHub",
      description: "This TravelHub spot page could not be found.",
    };
  }

  const title = `${spot.name} in ${city.city}, ${city.country} | TravelHub`;
  const description =
    spot.description ||
    spot.summary ||
    `Explore ${spot.name} in ${city.city}, ${city.country} with hotel and tour links.`;

  return createPublicMetadata({
    title,
    description,
    path: `/c/${city.slug}/spot/${spot.slug}`,
    imageUrl: spot.image_url,
    imageAlt: spot.image_alt || spot.name,
  });
}

export default async function SpotPage({
  params,
}: {
  params: Promise<{ slug: string; spotSlug: string }>;
}) {
  const { slug, spotSlug } = await params;
  const city = await getPublishedSupabaseCity(slug);
  const spot = city ? await getPublishedSupabaseSpot(slug, spotSlug) : null;

  if (!city || !spot) return notFound();

  return <SupabaseSpotDetail city={city} spot={spot} />;
}
