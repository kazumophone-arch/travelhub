import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupabaseSpotDetail } from "@/components/SupabaseSpotDetail";
import { getPublishedSupabaseCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpot } from "@/data/supabase-public-spots";

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

  const title = `${spot.name}, ${city.city} | TravelHub`;
  const description =
    spot.summary ||
    spot.description ||
    `Explore ${spot.name} in ${city.city}, with travel tips and planning links.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://travelhub-murex.vercel.app/c/${city.slug}/spot/${spot.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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
