import Link from "next/link";
import type { ReactNode } from "react";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import styles from "./SupabaseSpotDetail.module.css";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import type { TrackingParams } from "@/lib/tracking-query";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

export type SpotDetailSpot = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  image_url: string;
  image_position?: string | null;
  imagePosition?: string;
  affiliate_hotel_url?: string | null;
  affiliate_tour_url?: string | null;
  affiliateHotelUrl?: string;
  affiliateTourUrl?: string;
};

export type SpotDetailSlots = {
  title?: ReactNode;
  lead?: ReactNode;
  why?: ReactNode;
  heroOverlay?: ReactNode;
};

type Props = {
  city: SupabasePublicCity;
  spot: SpotDetailSpot;
  nearbySpots: SpotDetailSpot[];
  tracking?: TrackingParams;
  slots?: SpotDetailSlots;
};

export function SpotDetailView({ city, spot, nearbySpots, tracking, slots }: Props) {
  const spotHotelAffiliateUrl = spot.affiliateHotelUrl ?? spot.affiliate_hotel_url;
  const spotTourAffiliateUrl = spot.affiliateTourUrl ?? spot.affiliate_tour_url;
  const cityHotelAffiliateUrl = city.affiliate_hotel_url;
  const cityTourAffiliateUrl = city.affiliate_tour_url;

  // Prefer the spot-level affiliate URL, falling back to the city-level one —
  // this mirrors the resolution order applied server-side in app/out/[type]/route.ts.
  const hasHotelAffiliate = Boolean(
    getOptionalHttpUrl(spotHotelAffiliateUrl) || getOptionalHttpUrl(cityHotelAffiliateUrl)
  );
  const hasTourAffiliate = Boolean(
    getOptionalHttpUrl(spotTourAffiliateUrl) || getOptionalHttpUrl(cityTourAffiliateUrl)
  );

  const trackingSrc = tracking?.src ?? "spot-detail";
  const trackingV = tracking?.v ?? `spot_${city.slug}_${spot.slug}`;
  const countryName = city.countryName ?? city.country;

  const heroDescription = getConciseText(
    spot.summary || spot.description,
    `A focused place guide for ${spot.name} in ${city.city}.`
  );

  const whyGoText = getConciseText(
    spot.description || spot.summary,
    `Use ${spot.name} as a thoughtful stop while exploring ${city.city}.`
  );

  const collageItems = [spot, ...nearbySpots].slice(0, 4);
  const collageSideItems = collageItems.slice(1);

  return (
    <main className={styles.page}>
      <section className={styles.heroGrid}>
        <aside className={styles.heroCopy}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/cities" },
              { label: city.city, href: `/c/${city.slug}` },
              { label: spot.name },
            ]}
          />
          <div className={styles.eyebrow}>Place guide</div>
          <h1 className={styles.title}>{slots?.title ?? spot.name}</h1>
          <p className={styles.location}>
            {city.city}, {countryName}
          </p>
          <div className={styles.rule} />
          <p className={styles.lead}>{slots?.lead ?? heroDescription}</p>

          <Link href={`/c/${city.slug}`} className={styles.backInline}>
            Back to {city.city} guide →
          </Link>
        </aside>

        <div className={styles.collage} aria-label={`${spot.name} images`}>
          <div
            className={styles.collageMain}
            style={{
              position: "relative",
              backgroundImage: getImageBackground(
                collageItems[0].image_url,
                "linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.20) 54%, rgba(31, 26, 23, 0.44) 100%)",
                "linear-gradient(135deg, #efe1d0 0%, #c7a987 48%, #0D2B52 100%)"
              ),
              backgroundPosition: getCssImagePosition(
                collageItems[0].imagePosition ?? collageItems[0].image_position
              ),
            }}
          >
            {slots?.heroOverlay}
          </div>

          <div className={styles.collageSide}>
            {collageSideItems.map((item, index) => (
              <div
                key={`${item.slug}-${index}`}
                className={styles.collageSmall}
                style={{
                  backgroundImage: getImageBackground(
                    item.image_url,
                    "linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.22) 100%)",
                    "linear-gradient(135deg, #eadbc8 0%, #b8936e 52%, #0D2B52 100%)"
                  ),
                  backgroundPosition: getCssImagePosition(
                    item.imagePosition ?? item.image_position
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.guideShell}>
        <section className={styles.notesGrid} aria-label="Place notes">
          <article className={styles.note}>
            <h2>Why go</h2>
            <p>{whyGoText}</p>
          </article>

          <article className={styles.note}>
            <h2>How to use it</h2>
            <p>
              Treat this as one focused stop, then connect it with nearby places
              from the same city guide.
            </p>
          </article>

          <article className={styles.note}>
            <h2>Best for</h2>
            <p>
              First-time visitors, slow walkers, visual routes, and travelers
              building a simple day around one strong place.
            </p>
          </article>

          <article className={styles.note}>
            <h2>Before you go</h2>
            <p>
              Check current access, opening conditions, and transport details
              before fixing the final route.
            </p>
          </article>
        </section>

        {hasHotelAffiliate || hasTourAffiliate ? (
          <section className={styles.planSection} aria-labelledby="plan-spot-title">
            <div className={styles.planCopy}>
              <div className={styles.sectionLabel}>Plan around this spot</div>
              <h2 id="plan-spot-title">Turn the place into a route.</h2>
              <p>
                Compare only the direct options attached to this spot, then keep
                exploring the guide when you need more context.
              </p>
            </div>

            <div className={styles.planCta}>
              <AffiliateButtonGroup
                city={city}
                src={trackingSrc}
                v={trackingV}
                spotSlug={spot.slug}
                primary={hasHotelAffiliate ? "hotels" : "tours"}
                variant={hasHotelAffiliate ? "spot-hotel" : "spot-tour"}
                showHotels={hasHotelAffiliate}
                showTours={hasTourAffiliate}
                layout="cards"
                thumbnailUrl={getOptionalHttpUrl(spot.image_url) || getOptionalHttpUrl(city.image_url)}
              />
            </div>
          </section>
        ) : null}

        {city.best_months && city.best_months.length > 0 ? (
          <section className={styles.seasonSection} aria-labelledby="season-title">
            <div className={styles.sectionLabel}>When to visit {city.city}</div>
            <h2 id="season-title">{city.best_months.join(" · ")}</h2>
            {city.season_note ? <p>{city.season_note}</p> : null}
          </section>
        ) : null}

        <section className={styles.whySection}>
          <div className={styles.sectionLabel}>Why go</div>
          <h2>The reason to make time for it.</h2>
          <p>{slots?.why ?? whyGoText}</p>
        </section>

        {nearbySpots.length > 0 ? (
          <section className={styles.nearbySection} aria-labelledby="nearby-title">
            <div className={styles.nearbyHeader}>
              <div>
                <div className={styles.sectionLabel}>Nearby highlights</div>
                <h2 id="nearby-title">Keep wandering through {city.city}.</h2>
              </div>

              <Link href={`/c/${city.slug}`} className={styles.viewAll}>
                View all in {city.city} →
              </Link>
            </div>

            <div className={styles.nearbyGrid}>
              {nearbySpots.map((nearbySpot) => (
                <Link
                  key={nearbySpot.id}
                  href={`/c/${city.slug}/spot/${nearbySpot.slug}?src=spot-detail&v=nearby_${city.slug}_${nearbySpot.slug}`}
                  className={styles.nearbyCard}
                >
                  <div
                    className={styles.nearbyImage}
                    style={{
                      backgroundImage: getImageBackground(
                        nearbySpot.image_url,
                        "linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.30) 52%, rgba(31, 26, 23, 0.78) 100%)",
                        "linear-gradient(135deg, #eadbc8 0%, #b8936e 52%, #0D2B52 100%)"
                      ),
                      backgroundPosition: getCssImagePosition(
                        nearbySpot.imagePosition ?? nearbySpot.image_position
                      ),
                    }}
                  />
                  <div className={styles.nearbyBody}>
                    <h3>{nearbySpot.name}</h3>
                    <p>
                      {getConciseText(
                        nearbySpot.summary || nearbySpot.description,
                        `Another place to understand in ${city.city}.`
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className={styles.backSection}>
          <div>
            <div className={styles.sectionLabel}>City guide</div>
            <h2>Return to the full {city.city} guide.</h2>
          </div>

          <Link href={`/c/${city.slug}`} className={styles.cityLink}>
            Back to city guide
          </Link>
        </section>
      </section>
    </main>
  );
}

function getConciseText(value: string | null | undefined, fallback: string) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim() || fallback;

  if (text.length <= 360) {
    return text;
  }

  const clipped = text.slice(0, 360);
  const sentenceEnd = Math.max(
    clipped.lastIndexOf("."),
    clipped.lastIndexOf("!"),
    clipped.lastIndexOf("?")
  );

  if (sentenceEnd > 160) {
    return clipped.slice(0, sentenceEnd + 1);
  }

  return `${clipped.trim()}...`;
}
