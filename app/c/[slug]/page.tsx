import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupabaseCityDetail } from "@/components/SupabaseCityDetail";
import { getPublishedSupabaseCity } from "@/data/supabase-public-cities";
import { createPublicMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = await getPublishedSupabaseCity(slug);

  if (!city) {
    return {
      title: "City not found | TravelHub",
      description: "This TravelHub city page could not be found.",
    };
  }

  const title = `${city.city}, ${city.country} Travel Links | TravelHub`;
  const description =
    city.description ||
    city.summary ||
    `Explore travel links, spots, hotels, and tours for ${city.city}, ${city.country}.`;

  return createPublicMetadata({
    title,
    description,
    path: `/c/${city.slug}`,
    imageUrl: city.image_url,
    imageAlt: city.image_alt || `${city.city}, ${city.country}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = await getPublishedSupabaseCity(slug);

  if (!city) return notFound();

  return <SupabaseCityDetail city={city} />;
}
