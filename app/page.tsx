import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
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
  const supabaseCities = await getPublishedSupabaseDirectoryCities();
  const publishedCities = sortByRank(supabaseCities);
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

  return <HomeLanding cities={publishedCities} currentMonth={currentMonth} />;
}

