import Link from "next/link";
import styles from "./SupabaseCityDetail.module.css";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpotsForCity } from "@/data/supabase-public-spots";
import { AIRALO_URL, getBookingSearchUrl, getViatorSearchUrl } from "@/lib/quick-affiliate-links";
import type { TrackingParams } from "@/lib/tracking-query";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

type Props = {
  city: SupabasePublicCity;
  tracking?: TrackingParams;
};

type Spot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
  image_position?: string | null;
};

const FALLBACK_TILE_GRADIENT =
  "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)";

export async function SupabaseCityDetail({ city, tracking }: Props) {
  const spots = (await getPublishedSupabaseSpotsForCity(city.slug)) as Spot[];
  const spotTrackingQuery = getTrackingQuery(tracking);
  const HIGHLIGHT_COUNT = 4;
  const highlightSpots = spots.length > HIGHLIGHT_COUNT ? spots.slice(0, HIGHLIGHT_COUNT) : [];
  const remainingSpots = highlightSpots.length > 0 ? spots.slice(HIGHLIGHT_COUNT) : spots;

  const cityThumbUrl = getOptionalHttpUrl(city.image_url);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Destinations", href: "/cities" },
            { label: city.city },
          ]}
        />

        <div className={styles.heroTop}>
          <div
            className={styles.heroThumb}
            style={
              cityThumbUrl
                ? {
                    backgroundImage: `url(${JSON.stringify(cityThumbUrl)})`,
                    backgroundPosition: getCssImagePosition(city.imagePosition ?? city.image_position),
                  }
                : { background: FALLBACK_TILE_GRADIENT }
            }
          />

          <div className={styles.heroHeading}>
            <div className={styles.heroBadge}>🎬 FEATURED IN OUR VIDEOS</div>
            <h1 className={styles.heroTitle}>{city.city}</h1>
            <p className={styles.heroCountry}>{city.country}</p>
          </div>
        </div>

        <div className={styles.heroCtaStack}>
          <a
            href={getViatorSearchUrl(city.city)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.heroCtaPrimary}
          >
            Book tours & experiences
          </a>

          <a
            href={getBookingSearchUrl(city.city)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.heroCtaSecondary}
          >
            Compare hotels
          </a>

          <a
            href={AIRALO_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.heroCtaSecondary}
          >
            Get an eSIM
          </a>
        </div>
      </section>

      <section className={styles.body}>
        {highlightSpots.length > 0 ? (
          <section id="highlights" className={styles.highlights}>
            <div className={styles.label}>Highlights</div>
            <h2 className={styles.highlightsTitle}>What stands out in {city.city}</h2>

            <div className={styles.highlightGrid}>
              {highlightSpots.map((spot) => (
                <div key={spot.id} className={styles.highlightItem}>
                  <Link
                    href={`/c/${city.slug}/spot/${spot.slug}${spotTrackingQuery}`}
                    className={styles.highlightItemLink}
                  >
                    <div
                      className={styles.highlightImage}
                      style={{
                        backgroundImage: getImageBackground(
                          spot.image_url,
                          "linear-gradient(180deg, rgba(31, 26, 23, 0) 0%, rgba(31, 26, 23, 0.12) 100%)",
                          FALLBACK_TILE_GRADIENT
                        ),
                        backgroundPosition: getCssImagePosition(spot.image_position),
                      }}
                    />
                    <h3 className={styles.highlightName}>{spot.name}</h3>
                    <p className={styles.highlightText}>{spot.summary || "No summary yet."}</p>
                  </Link>

                  <a
                    href={getViatorSearchUrl(`${spot.name} ${city.city}`)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={styles.highlightTourLink}
                  >
                    See tours for this spot →
                  </a>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className={styles.sectionIntro}>
          <div>
            <div className={styles.label}>Explore next</div>
            <h2 className={styles.sectionTitle}>Popular spots in {city.city}</h2>
          </div>

          <p className={styles.sectionLead}>
            Start with the places visitors usually want to understand first.
          </p>
        </div>

        {remainingSpots.length === 0 ? (
          <div className={styles.empty}>No published spots yet.</div>
        ) : (
          <div className={styles.spotGrid}>
            {remainingSpots.map((spot) => (
              <div key={spot.id} className={styles.spotItem}>
                <Link
                  href={`/c/${city.slug}/spot/${spot.slug}${spotTrackingQuery}`}
                  className={styles.spotTile}
                  style={{
                    backgroundImage: getImageBackground(
                      spot.image_url,
                      "linear-gradient(180deg, rgba(10, 18, 24, 0.02) 0%, rgba(10, 18, 24, 0.28) 44%, rgba(10, 18, 24, 0.82) 100%)",
                      "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)"
                    ),
                    backgroundPosition: getCssImagePosition(spot.image_position),
                  }}
                >
                  <div className={styles.spotCity}>{city.city}</div>

                  <div className={styles.spotPanel}>
                    <h3 className={styles.spotTitle}>{spot.name}</h3>
                    <p className={styles.spotText}>{spot.summary || "No summary yet."}</p>
                    <div className={styles.spotAction}>Open spot guide →</div>
                  </div>
                </Link>

                <a
                  href={getViatorSearchUrl(`${spot.name} ${city.city}`)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={styles.spotTourLink}
                >
                  See tours for this spot →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function getTrackingQuery(tracking: TrackingParams | undefined) {
  const query = new URLSearchParams();

  if (tracking?.src) {
    query.set("src", tracking.src);
  }

  if (tracking?.v) {
    query.set("v", tracking.v);
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}
