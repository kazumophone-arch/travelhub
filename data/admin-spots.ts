import "server-only";
import fs from "fs";
import path from "path";
import type { City } from "@/data/types";

export type AdminSpot = {
  id: string;
  citySlug: string;
  cityName: string;
  country: string;
  name: string;
  slug: string;
  summary: string;
  categories: string[];
  imageSeed: string;
  canOpen: boolean;
};

const adminSpotsPath = path.join(process.cwd(), "data", "admin-spots.json");

export function getAdminSpots(): AdminSpot[] {
  try {
    if (!fs.existsSync(adminSpotsPath)) {
      return [];
    }

    const raw = fs.readFileSync(adminSpotsPath, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAdminSpotsForCity(citySlug: string): AdminSpot[] {
  return getAdminSpots().filter((spot) => spot.citySlug === citySlug);
}

function toSpotDetail(spot: AdminSpot) {
  return {
    name: spot.name,
    slug: spot.slug,
    summary: spot.summary,
    tags: spot.categories,
    highlights: spot.categories,
    categories: spot.categories,
    imageSeed: spot.imageSeed,
    canOpen: spot.canOpen,
  };
}

export function withAdminSpotsForCity(city: City): City {
  const adminSpots = getAdminSpotsForCity(city.slug);

  if (adminSpots.length === 0) {
    return city;
  }

  const existingSpotDetails = Array.isArray(city.spotDetails)
    ? city.spotDetails
    : [];

  const existingStops = Array.isArray(city.stops)
    ? city.stops
    : [];

  const adminSpotDetails = adminSpots.map(toSpotDetail);
  const adminStopNames = adminSpots.map((spot) => spot.name);

  return {
    ...city,
    spotDetails: [...existingSpotDetails, ...adminSpotDetails],
    stops: Array.from(new Set([...existingStops, ...adminStopNames])),
  } as City;
}

export function withAdminSpots(cities: City[]): City[] {
  return cities.map((city) => withAdminSpotsForCity(city));
}

export function getCityWithAdminSpots(
  citiesRecord: Record<string, City>,
  citySlug: string
): City | undefined {
  const city = citiesRecord[citySlug];

  if (!city) {
    return undefined;
  }

  return withAdminSpotsForCity(city);
}

