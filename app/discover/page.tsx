import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { DiscoverHeroCopy } from "@/components/DiscoverHeroCopy";
import { TravelDiscoveryTools } from "@/components/TravelDiscoveryTools";
import { TravelTimingDiscovery } from "@/components/TravelTimingDiscovery";
import { getPublishedSupabaseDirectoryCities } from "@/data/supabase-public-cities";
import { sortByRank } from "@/data/visibility";
import { createPublicMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPublicMetadata({
  title: "Discover Travel Ideas | TravelHub",
  description:
    "Find TravelHub city ideas by feeling, season, travel style, and trip timing.",
  path: "/discover",
});

export default async function DiscoverPage() {
  const supabaseCities = await getPublishedSupabaseDirectoryCities();
  const publishedCities = sortByRank(supabaseCities);

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <DiscoverHeroCopy />
        <TravelDiscoveryTools cities={publishedCities} />

        <TravelTimingDiscovery cities={publishedCities} />
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  background: "linear-gradient(180deg, #f7f2ea 0%, #fffdf8 46%, #f5efe6 100%)",
  color: "#1f1a17",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "34px 16px 70px",
};





