import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
import { sortByRank } from "@/data/visibility";

const title = "TravelHub | Find travel links by city";
const description =
  "Discover travel cities, featured spots, hotel links, and tour links from short travel videos.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://travelhub-murex.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function Home() {
  const supabaseCities = await getPublishedSupabaseDirectoryCities();
  const publishedCities = sortByRank(supabaseCities);

  return <HomeLanding cities={publishedCities} />;
}

