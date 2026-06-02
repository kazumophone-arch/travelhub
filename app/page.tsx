import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
import { sortByRank } from "@/data/visibility";
import { createPublicMetadata } from "@/lib/site-metadata";

const title = "TravelHub | Travel Links, City Guides, Hotels, and Tours";
const description =
  "Find city guides, travel spots, hotel links, and tour links from one simple travel hub.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPublicMetadata({
  title,
  description,
  path: "/",
});

export default async function Home() {
  const supabaseCities = await getPublishedSupabaseDirectoryCities();
  const publishedCities = sortByRank(supabaseCities);

  return <HomeLanding cities={publishedCities} />;
}

