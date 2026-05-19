import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { CityDirectory } from "@/components/CityDirectory";
import { isPublishedCity, sortByRank } from "@/data/visibility";

export const metadata: Metadata = {
  title: "Cities | TravelHub",
  description:
    "Browse TravelHub cities by country, season, mood, travel style, and featured spots.",
};

export default function CitiesPage() {
  const publishedCities = sortByRank(
    Object.values(cities).filter(isPublishedCity)
  );

  return <CityDirectory cities={publishedCities} />;
}