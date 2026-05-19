import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { SeasonalDirectory } from "@/components/SeasonalDirectory";
import { isPublishedCity, sortByRank } from "@/data/visibility";

export const metadata: Metadata = {
  title: "Seasonal Travel | TravelHub",
  description:
    "Browse TravelHub destinations by month and seasonal travel timing.",
};

export default function SeasonalPage() {
  const publishedCities = sortByRank(
    Object.values(cities).filter(isPublishedCity)
  );

  return <SeasonalDirectory cities={publishedCities} />;
}
