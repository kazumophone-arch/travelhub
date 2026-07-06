import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CountryVolumeView } from "@/components/CountryVolumeView";
import { getCountryVolume } from "@/data/supabase-public-countries";
import { createPublicMetadata } from "@/lib/site-metadata";
import {
  getCountryBreadcrumbJsonLd,
  getCountryJsonLd,
} from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const volume = await getCountryVolume(slug);

  if (!volume || volume.cities.length === 0) {
    return {
      title: "Country not found | Taleglen",
      description: "This Taleglen country page could not be found.",
    };
  }

  const { country, cities } = volume;
  const cityNames = cities.map((city) => city.city);
  const title = `${country.name} Travel Guide | Taleglen`;
  const description = `${country.name} on Taleglen: ${cities.length} city guide${
    cities.length === 1 ? "" : "s"
  } — ${cityNames.join(", ")}. Best months, seasonality, and places worth planning around.`;

  return createPublicMetadata({
    title,
    description,
    path: `/countries/${country.slug}`,
    imageUrl: country.image_url,
    imageAlt: country.name,
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const volume = await getCountryVolume(slug);

  // A volume with no published chapters is not a public page.
  if (!volume || volume.cities.length === 0) {
    return notFound();
  }

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const jsonLd = getCountryJsonLd(
    volume.country,
    volume.cities.map((city) => city.city)
  );
  const breadcrumbJsonLd = getCountryBreadcrumbJsonLd(volume.country);

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
      <CountryVolumeView volume={volume} currentMonth={currentMonth} />
    </>
  );
}
