import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./SupabaseCityDetail.module.css";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CityClimate } from "@/components/CityClimate";
import { TierCtaLink } from "@/components/TierCtaLink";
import { normalizeClimate } from "@/lib/climate";
import { journalArticles } from "@/data/journal";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { AIRALO_URL } from "@/lib/quick-affiliate-links";
import type { TrackingParams } from "@/lib/tracking-query";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

export type CityDetailSpot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
  image_position?: string | null;
};

export type CityDetailNearbyCity = {
  id: string;
  slug: string;
  city: string;
  country: string;
  summary?: string | null;
  image_url?: string | null;
  image_position?: string | null;
};

export type CityDetailSlots = {
  title?: ReactNode;
  country?: ReactNode;
  heroOverlay?: ReactNode;
  ctaEditor?: ReactNode;
  galleryEditor?: ReactNode;
  climateEditor?: ReactNode;
};

type Props = {
  city: SupabasePublicCity;
  spots: CityDetailSpot[];
  tracking?: TrackingParams;
  slots?: CityDetailSlots;
  nearbyCities?: CityDetailNearbyCity[];
};

const FALLBACK_TILE_GRADIENT =
  "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)";

export function CityDetailView({ city, spots, tracking, slots, nearbyCities }: Props) {
  const spotTrackingQuery = getTrackingQuery(tracking);
  const HIGHLIGHT_COUNT = 4;
  const highlightSpots = spots.length > HIGHLIGHT_COUNT ? spots.slice(0, HIGHLIGHT_COUNT) : [];
  const remainingSpots = highlightSpots.length > 0 ? spots.slice(HIGHLIGHT_COUNT) : spots;

  const cityThumbUrl = getOptionalHttpUrl(city.image_url);
  const heroImageCredit = (city.image_credit ?? "").trim();
  const heroImageSourceUrl = getOptionalHttpUrl(city.image_source_url);
  const relatedJournal = journalArticles
    .filter((article) => article.relatedCitySlug === city.slug)
    .slice(0, 3);
  const otherCities = nearbyCities ?? [];

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

        <div
          className={styles.heroBanner}
          style={
            cityThumbUrl
              ? {
                  backgroundImage: `url(${JSON.stringify(cityThumbUrl)})`,
                  backgroundPosition: getCssImagePosition(city.imagePosition ?? city.image_position),
                }
              : { background: FALLBACK_TILE_GRADIENT }
          }
        >
          <div className={styles.heroBannerOverlay} />

          {slots?.heroOverlay}

          <div className={styles.heroHeading}>
            <h1 className={styles.heroTitle}>{slots?.title ?? city.city}</h1>
            <p className={styles.heroCountry}>{slots?.country ?? city.country}</p>
          </div>
        </div>

        {heroImageCredit ? (
          <p className={styles.photoCredit}>
            Photo: {heroImageCredit}
            {heroImageSourceUrl ? (
              <>
                {" · "}
                <a
                  href={heroImageSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.photoCreditLink}
                >
                  Source
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        <div className={styles.heroCtaStack}>
          <div className={styles.heroAffiliateGroup}>
            <AffiliateButtonGroup
              city={city}
              src="city-detail"
              v={`city_detail_${city.slug}`}
              variant="city"
              tone="dark"
              showHotels
              showTours
              compact
              hideDisclosure
            />

            <TierCtaLink
              href={AIRALO_URL}
              affiliateType="esim"
              citySlug={city.slug}
              source="city-detail"
              className={styles.heroCtaEsim}
            >
              Get an eSIM
            </TierCtaLink>
          </div>

          <p className={styles.heroCtaDisclosure}>
            External affiliate links. TravelHub may earn a commission at no extra cost to you.
          </p>

          {slots?.ctaEditor}
        </div>
      </section>

      <section className={styles.body}>
        <CityClimate
          cityName={city.city}
          climate={normalizeClimate(city.climate)}
          editor={slots?.climateEditor}
        />

        {(city.gallery && city.gallery.length > 0) || slots?.galleryEditor ? (
          <section className={styles.gallerySection} aria-label={`${city.city} photos`}>
            <div className={styles.label}>More photos</div>
            <h2 className={styles.sectionTitle}>{city.city} in pictures</h2>

            {slots?.galleryEditor}

            {city.gallery && city.gallery.length > 0 ? (
              <div className={styles.galleryGrid}>
                {city.gallery.map((image, index) => (
                  <div
                    key={`${image.url}-${index}`}
                    className={styles.galleryTile}
                    style={{
                      backgroundImage: `url(${JSON.stringify(image.url)})`,
                      backgroundPosition: getCssImagePosition(image.position),
                    }}
                  />
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

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
                    href={`/out/tours?c=${encodeURIComponent(city.slug)}&s=${encodeURIComponent(spot.slug)}&src=city-detail&v=highlight_tours_${spot.slug}`}
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
                  href={`/out/tours?c=${encodeURIComponent(city.slug)}&s=${encodeURIComponent(spot.slug)}&src=city-detail&v=spot_tile_tours_${spot.slug}`}
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

        {relatedJournal.length > 0 ? (
          <section
            className={styles.relatedJournalSection}
            aria-labelledby="related-journal-title"
          >
            <div className={styles.label}>From the journal</div>
            <h2 id="related-journal-title" className={styles.sectionTitle}>
              Notes that mention {city.city}
            </h2>

            <div className={styles.relatedJournalGrid}>
              {relatedJournal.map((article) => (
                <Link
                  key={article.slug}
                  href={`/journal/${article.slug}`}
                  className={styles.relatedJournalCard}
                >
                  <div
                    className={styles.relatedJournalImage}
                    style={{ backgroundImage: `url(${JSON.stringify(article.image)})` }}
                  />
                  <div className={styles.relatedJournalBody}>
                    <div className={styles.relatedJournalCategory}>{article.category}</div>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {otherCities.length > 0 ? (
          <section
            className={styles.nearbyCitiesSection}
            aria-labelledby="nearby-cities-title"
          >
            <div className={styles.label}>Keep traveling</div>
            <h2 id="nearby-cities-title" className={styles.sectionTitle}>
              More places in {city.country}
            </h2>

            <div className={styles.nearbyCitiesGrid}>
              {otherCities.map((nearbyCity) => (
                <Link
                  key={nearbyCity.id}
                  href={`/c/${nearbyCity.slug}`}
                  className={styles.nearbyCityCard}
                >
                  <div
                    className={styles.nearbyCityImage}
                    style={{
                      backgroundImage: getImageBackground(
                        nearbyCity.image_url ?? "",
                        "linear-gradient(180deg, rgba(13, 43, 82, 0) 0%, rgba(13, 43, 82, 0.22) 100%)",
                        FALLBACK_TILE_GRADIENT
                      ),
                      backgroundPosition: getCssImagePosition(nearbyCity.image_position),
                    }}
                  />
                  <div className={styles.nearbyCityBody}>
                    <h3>{nearbyCity.city}</h3>
                    {(nearbyCity.summary ?? "").trim() ? (
                      <p>{(nearbyCity.summary ?? "").trim()}</p>
                    ) : null}
                    <span className={styles.nearbyCityAction}>
                      Open the {nearbyCity.city} guide →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
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
