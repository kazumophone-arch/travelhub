import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { cities } from "@/data/cities";
import { DiscoverHeroCopy } from "@/components/DiscoverHeroCopy";
import { TravelDiscoveryTools } from "@/components/TravelDiscoveryTools";
import { TravelTimingDiscovery } from "@/components/TravelTimingDiscovery";
import { isPublishedCity, sortByRank } from "@/data/visibility";

export const metadata: Metadata = {
  title: "Discover | TravelHub",
  description:
    "Find a TravelHub destination by feeling, season, travel style, and timing.",
};

export default function DiscoverPage() {
  const publishedCities = sortByRank(
    Object.values(cities).filter(isPublishedCity)
  );

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
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "34px 16px 48px",
};

const heroStyle: CSSProperties = {
  marginBottom: 28,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: "clamp(42px, 11vw, 78px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};



