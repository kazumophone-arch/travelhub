import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupabaseSpotDetail } from "@/components/SupabaseSpotDetail";
import { getPublishedSupabaseCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpot } from "@/data/supabase-public-spots";
import { createPublicMetadata } from "@/lib/site-metadata";
import {
  getSpotBreadcrumbJsonLd,
  getSpotTouristAttractionJsonLd,
} from "@/lib/structured-data";
import { getTrackingParams, type TrackingSearchParams } from "@/lib/tracking-query";

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
      title: "Spot not found | Taleglen",
      description: "This Taleglen spot page could not be found.",
    };
  }

  const title = `${spot.name} in ${city.city}, ${city.country} | Taleglen`;
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
  searchParams,
}: {
  params: Promise<{ slug: string; spotSlug: string }>;
  searchParams: Promise<TrackingSearchParams>;
}) {
  const { slug, spotSlug } = await params;
  const tracking = getTrackingParams(await searchParams);
  const city = await getPublishedSupabaseCity(slug);
  const spot = city ? await getPublishedSupabaseSpot(slug, spotSlug) : null;

  if (!city || !spot) return notFound();

  const jsonLd = getSpotTouristAttractionJsonLd(city, spot);
  const breadcrumbJsonLd = getSpotBreadcrumbJsonLd(city, spot);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SupabaseSpotDetail city={city} spot={spot} tracking={tracking} />
    </>
  );
}
