import type { City, Spot } from "@/data/types";

export function isPublishedCity(city: City) {
  return city.isPublished !== false;
}

export function isPublishedSpot(spot: Spot) {
  return spot.isPublished !== false;
}

export function sortByRank<T extends { sortRank?: number; slug?: string }>(
  items: T[]
) {
  return [...items].sort((a, b) => {
    const rankA = a.sortRank ?? 999;
    const rankB = b.sortRank ?? 999;

    if (rankA !== rankB) return rankA - rankB;

    return (a.slug ?? "").localeCompare(b.slug ?? "");
  });
}