import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
import { getPublishedCountriesWithCities } from "@/data/supabase-public-countries";
import { sortByRank } from "@/data/visibility";
import { createPublicMetadata } from "@/lib/site-metadata";

const title = "Taleglen | Cinematic City Guides and Travel Spots";
const description =
  "Explore photo-led city guides and memorable travel spots for your next stay, wander, and return-worthy trip.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPublicMetadata({
  title,
  description,
  path: "/",
});

export default async function Home() {
  const [supabaseCities, countries] = await Promise.all([
    getPublishedSupabaseDirectoryCities(),
    getPublishedCountriesWithCities(),
  ]);
  const publishedCities = sortByRank(supabaseCities);
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  // Serializable volume subset for the client component: published
  // countries that have at least one published city, in library order.
  const volumes = countries.map((country) => ({
    id: country.id,
    slug: country.slug,
    name: country.name,
    image_url: country.image_url,
  }));

  return (
    <HomeLanding
      cities={publishedCities}
      volumes={volumes}
      currentMonth={currentMonth}
    />
  );
}

