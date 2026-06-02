import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupabaseCityDetail } from "@/components/SupabaseCityDetail";
import { getPublishedSupabaseCity } from "@/data/supabase-public-cities";

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

  const title = `${city.city}, ${city.country} | TravelHub`;
  const description =
    city.summary ||
    city.description ||
    `Explore ${city.city}, featured spots, where to stay, and travel planning links.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://travelhub-murex.vercel.app/c/${city.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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
