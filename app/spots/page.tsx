import Link from "next/link";
import type { Metadata } from "next";
import {
  SUPABASE_PUBLIC_SPOT_SELECT,
  type SupabasePublicSpot,
} from "@/data/supabase-public-spots";
import { createPublicMetadata } from "@/lib/site-metadata";
import { supabase } from "@/lib/supabase";
import { getText } from "@/lib/content-fallback";
import styles from "./PlacesPage.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPublicMetadata({
  title: "Places | TravelHub",
  description:
    "TravelHub places: editorial spot guides and specific places worth building a trip around.",
  path: "/spots",
});

type SupabaseCityRow = {
  id: string;
  slug: string;
  city: string;
  country: string;
  region?: string | null;
};

type RawSpot = SupabasePublicSpot & Record<string, unknown>;

const fallbackImages = [
  "/assets/home/kyoto-hero.jpg",
  "/assets/home/rome-preview.jpg",
  "/assets/home/marrakech.jpg",
  "/assets/home/lake-bled.jpg",
  "/assets/home/find-peace.jpg",
  "/assets/home/queenstown.jpg",
];

async function getSupabaseCitiesAndSpots() {
  const [citiesResult, spotsResult] = await Promise.all([
    supabase
      .from("cities")
      .select("id, slug, city, country, region")
      .eq("is_published", true)
      .order("sort_rank", { ascending: true })
      .order("created_at", { ascending: false }),

    supabase
      .from("spots")
      .select(SUPABASE_PUBLIC_SPOT_SELECT)
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
  ]);

  return {
    cities: (citiesResult.data ?? []) as SupabaseCityRow[],
    spots: (spotsResult.data ?? []) as RawSpot[],
  };
}

function getSpotName(spot: RawSpot) {
  return getText(spot, ["name", "spot", "title"]) || "Place";
}

function getSpotSlug(spot: RawSpot) {
  return getText(spot, ["slug"]);
}

function getSpotDescription(spot: RawSpot) {
  return (
    getText(spot, ["summary", "description", "intro", "excerpt"]) ||
    "A specific place worth building part of the trip around."
  );
}

function getCuratedImage(spot: RawSpot, city?: SupabaseCityRow) {
  const key = `${getSpotName(spot)} ${getSpotSlug(spot)} ${city?.city ?? ""} ${
    city?.country ?? ""
  }`.toLowerCase();

  if (key.includes("arashiyama")) return "/assets/home/kyoto-hero.jpg";
  if (key.includes("bamboo")) return "/assets/home/kyoto-hero.jpg";
  if (key.includes("fushimi")) return "/assets/home/kyoto-hero.jpg";
  if (key.includes("kiyomizu")) return "/assets/home/kyoto-hero.jpg";
  if (key.includes("kyoto")) return "/assets/home/kyoto-hero.jpg";
  if (key.includes("rome") || key.includes("italy")) return "/assets/home/rome-preview.jpg";
  if (key.includes("marrakech") || key.includes("morocco")) return "/assets/home/marrakech.jpg";
  if (key.includes("paris") || key.includes("france")) return "/assets/home/paris-preview.jpg";
  if (key.includes("tokyo") || key.includes("japan")) return "/assets/home/kyoto-hero.jpg";

  return "";
}

function getImage(spot: RawSpot, index: number, city?: SupabaseCityRow) {
  return (
    getCuratedImage(spot, city) ||
    getText(spot, ["image_url", "imageUrl", "image", "heroImage", "hero_image"]) ||
    fallbackImages[index % fallbackImages.length]
  );
}

function getCityForSpot(
  spot: RawSpot,
  cityById: Map<string, SupabaseCityRow>
) {
  const cityId = getText(spot, ["city_id", "cityId"]);
  return cityId ? cityById.get(cityId) : undefined;
}

function getSpotHref(spot: RawSpot, city?: SupabaseCityRow) {
  const spotSlug = getSpotSlug(spot);

  if (city?.slug && spotSlug) {
    return `/c/${city.slug}/spot/${spotSlug}`;
  }

  if (city?.slug) {
    return `/c/${city.slug}`;
  }

  return "/spots";
}

export default async function SpotsPage() {
  const { cities, spots } = await getSupabaseCitiesAndSpots();
  const cityById = new Map(cities.map((city) => [city.id, city]));

  const publishedSpots = spots.filter((spot) => getSpotName(spot));

  const featured =
    publishedSpots.find((spot) => {
      const key = `${getSpotName(spot)} ${getSpotSlug(spot)}`.toLowerCase();
      return key.includes("arashiyama") || key.includes("bamboo");
    }) ?? publishedSpots[0];

  const featuredCity = featured
    ? getCityForSpot(featured, cityById)
    : undefined;

  const gridSpots = publishedSpots.slice(0, 9);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>

        <div className={styles.heroHeader}>
          <div className={styles.eyebrow}>Places</div>
          <h1>Specific places worth building a trip around.</h1>
          <p>
            Start with one memorable place, then connect it to the right city,
            nearby highlights, and the kind of day it belongs in.
          </p>
        </div>

        {featured ? (
          <Link
            href={getSpotHref(featured, featuredCity)}
            className={styles.featured}
          >
            <div
              className={styles.featuredImage}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.03) 0%, rgba(31, 26, 23, 0.32) 100%), url("${getImage(featured, 0, featuredCity)}")`,
              }}
            />

            <article className={styles.featuredCopy}>
              <div className={styles.eyebrow}>Featured place</div>
              <h2>{getSpotName(featured)}</h2>
              <div className={styles.placeMeta}>
                {featuredCity
                  ? `${featuredCity.city}, ${featuredCity.country}`
                  : "TravelHub place guide"}
              </div>
              <div className={styles.starLine}>✦</div>
              <p>{getSpotDescription(featured)}</p>
              <strong>Open place guide →</strong>
            </article>
          </Link>
        ) : null}
      </section>

      <section className={styles.places}>
        <div className={styles.sectionHeader}>
          <h2>All Places</h2>
          <span>{publishedSpots.length} places</span>
        </div>

        <div className={styles.placeGrid}>
          {gridSpots.map((spot, index) => {
            const city = getCityForSpot(spot, cityById);

            return (
              <Link
                key={`${getSpotSlug(spot)}-${index}`}
                href={getSpotHref(spot, city)}
                className={styles.placeCard}
              >
                <div
                  className={styles.placeImage}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.34) 100%), url("${getImage(spot, index + 1, city)}")`,
                  }}
                />

                <div className={styles.placeBody}>
                  <div className={styles.country}>
                    {city ? `${city.city}, ${city.country}` : "TravelHub"}
                  </div>
                  <h3>{getSpotName(spot)}</h3>
                  <p>{getSpotDescription(spot)}</p>
                  <strong>Open place guide →</strong>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}


