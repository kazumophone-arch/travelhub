import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { CityExplorer } from "@/components/CityExplorer";

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
  return <CityExplorer cities={Object.values(cities)} />;
}