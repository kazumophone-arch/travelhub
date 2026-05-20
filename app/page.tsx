import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { HomeLanding } from "@/components/HomeLanding";
import { isPublishedCity, sortByRank } from "@/data/visibility";

const title = "TravelHub | Find travel links by city";
const description =
  "Discover travel cities, featured spots, hotel links, and tour links from short travel videos.";

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

export default function Home() {
  const publishedCities = sortByRank(
    Object.values(cities).filter(isPublishedCity)
  );

  return <HomeLanding cities={publishedCities} />;
}

