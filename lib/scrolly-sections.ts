import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import type { CityDetailSpot } from "@/components/CityDetailView";
import { getOptionalHttpUrl } from "@/lib/url-fields";
import { normalizeClimate, hasClimateData } from "@/lib/climate";
import { journalArticles, type JournalArticle } from "@/data/journal";

export type ScrollyHeroSection = {
  kind: "hero";
  key: string;
  imageUrl: string;
  imagePosition?: string | null;
};

export type ScrollySpotSection = {
  kind: "spot";
  key: string;
  imageUrl: string;
  imagePosition?: string | null;
  spot: CityDetailSpot;
};

export type ScrollyClimateSection = {
  kind: "climate";
  key: string;
  imageUrl: string;
  imagePosition?: string | null;
  cityName: string;
  climate: ReturnType<typeof normalizeClimate>;
};

export type ScrollyArticleSection = {
  kind: "article";
  key: string;
  imageUrl: string;
  imagePosition?: string | null;
  articles: JournalArticle[];
};

export type ScrollySection =
  | ScrollyHeroSection
  | ScrollySpotSection
  | ScrollyClimateSection
  | ScrollyArticleSection;

/**
 * Returns real (non-sample) journal articles related to a given city slug,
 * in their existing data/journal.ts order. Pure function, no fabrication —
 * only articles that already exist with a matching relatedCitySlug qualify.
 */
export function getRelatedArticlesForCity(citySlug: string): JournalArticle[] {
  return journalArticles.filter((article) => article.relatedCitySlug === citySlug);
}

/**
 * Builds the ordered list of scroll-storytelling sections for a city.
 * Only sections backed by real data are included here (hero, spots, climate,
 * related articles) — no placeholder or gradient substitutes are ever
 * generated in this module. Sample-data sections (best time to visit,
 * recommended stay length, where to stay, tours) are intentionally NOT
 * built here; they live in lib/scrolly-sample-data.ts and are rendered
 * separately by ScrollyCityStory so they can never be confused with real
 * per-city data assembled by this function.
 */
export function buildScrollySections(
  city: SupabasePublicCity,
  spots: CityDetailSpot[]
): ScrollySection[] {
  const sections: ScrollySection[] = [];

  const heroImageUrl = getOptionalHttpUrl(city.image_url);
  if (heroImageUrl) {
    sections.push({
      kind: "hero",
      key: `hero-${city.slug}`,
      imageUrl: heroImageUrl,
      imagePosition: city.imagePosition ?? city.image_position,
    });
  }

  const climate = normalizeClimate(city.climate);
  if (heroImageUrl && hasClimateData(climate)) {
    sections.push({
      kind: "climate",
      key: `climate-${city.slug}`,
      imageUrl: heroImageUrl,
      imagePosition: city.imagePosition ?? city.image_position,
      cityName: city.city,
      climate,
    });
  }

  for (const spot of spots) {
    const spotImageUrl = getOptionalHttpUrl(spot.image_url);
    if (!spotImageUrl) continue;

    sections.push({
      kind: "spot",
      key: `spot-${spot.id}`,
      imageUrl: spotImageUrl,
      imagePosition: spot.image_position,
      spot,
    });
  }

  const relatedArticles = getRelatedArticlesForCity(city.slug);
  if (relatedArticles.length > 0) {
    // Article images are bundled local assets (e.g. "/assets/home/..."),
    // not external URLs, so they don't go through getOptionalHttpUrl.
    const articlesImageUrl = relatedArticles[0]?.image || heroImageUrl;
    if (articlesImageUrl) {
      sections.push({
        kind: "article",
        key: `articles-${city.slug}`,
        imageUrl: articlesImageUrl,
        imagePosition: city.imagePosition ?? city.image_position,
        articles: relatedArticles,
      });
    }
  }

  return sections;
}
