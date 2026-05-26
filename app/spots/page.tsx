import type { Metadata } from "next";
import { PublicSupabaseSpots } from "@/components/PublicSupabaseSpots";
import { cities } from "@/data/cities";
import { SpotDirectory } from "@/components/SpotDirectory";
import { isPublishedCity, sortByRank } from "@/data/visibility";

export const metadata: Metadata = {
  title: "Spots | TravelHub",
  description:
    "Browse TravelHub featured spots by place, city, country, and travel mood.",
};

export default function SpotsPage() {
  const publishedCities = sortByRank(
    Object.values(cities).filter(isPublishedCity)
  );

  return <SpotDirectory cities={publishedCities} />;
}





