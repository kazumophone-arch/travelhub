import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./SupabaseCityDetail.module.css";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import { getPublishedSupabaseSpotsForCity } from "@/data/supabase-public-spots";
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

type EditorialTier = {
  title: string;
  text: string;
};

const stayTiers: EditorialTier[] = [
  {
    title: "Signature stays",
    text: "For special trips, polished hotels, and memorable first nights.",
  },
  {
    title: "Smart stays",
    text: "Well-located hotels with a balance of comfort and price.",
  },
  {
    title: "Essential stays",
    text: "Simple stays for travelers who want to spend more on the city.",
  },
];

const experienceTiers: EditorialTier[] = [
  {
    title: "Private experiences",
    text: "A slower, more personal way to see the city.",
  },
  {
    title: "Popular tours",
    text: "Classic experiences for a first visit.",
  },
  {
    title: "Easy activities",
    text: "Short, flexible activities that fit into a simple day.",
  },
];

export async function SupabaseCityDetail({ city, tracking }: Props) {
  const spots = (await getPublishedSupabaseSpotsForCity(city.slug)) as Spot[];
  const hasHotelAffiliate = Boolean(getOptionalHttpUrl(city.affiliate_hotel_url));
  const hasTourAffiliate = Boolean(getOptionalHttpUrl(city.affiliate_tour_url));
  const trackingSrc = tracking?.src ?? "city-detail";
  const trackingV = tracking?.v ?? `city_${city.slug}`;
  const spotTrackingQuery = getTrackingQuery(tracking);
  const hotelAffiliateHref = getAffiliateHref("hotels", city.slug, trackingSrc, trackingV);
  const tourAffiliateHref = getAffiliateHref("tours", city.slug, trackingSrc, trackingV);

  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        style={{
          backgroundImage: getImageBackground(
            city.image_url,
            "linear-gradient(90deg, rgba(9, 16, 20, 0.82) 0%, rgba(9, 16, 20, 0.62) 45%, rgba(9, 16, 20, 0.18) 100%), linear-gradient(180deg, rgba(9, 16, 20, 0.08) 0%, rgba(9, 16, 20, 0.72) 100%)",
            "linear-gradient(135deg, #26352f 0%, #b68b5e 52%, #f3e3cb 100%)"
          ),
          backgroundPosition: getCssImagePosition(city.imagePosition ?? city.image_position),
        }}
      >
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Breadcrumbs
              tone="light"
              items={[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/cities" },
                { label: city.city },
              ]}
            />
            <div className={styles.eyebrow}>TravelHub city guide</div>
            <div className={styles.countryPill}>{city.country}</div>
            <h1 className={styles.heroTitle}>{city.city}</h1>
            <p className={styles.heroLead}>
              {city.summary || city.description || "A TravelHub city guide."}
            </p>
          </div>

          {hasHotelAffiliate || hasTourAffiliate ? (
            <div className={styles.heroCta}>
              <div className={styles.ctaKicker}>Plan this trip</div>
              <AffiliateButtonGroup
                city={city}
                src={trackingSrc}
                v={trackingV}
                primary={hasHotelAffiliate ? "hotels" : "tours"}
                tone="dark"
                variant="city"
                showHotels={hasHotelAffiliate}
                showTours={hasTourAffiliate}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.body}>
        <EditorialTierSection
          label="Where to Stay"
          title={`Choose the right base in ${city.city}`}
          copy="Use the guide first, then compare stays once the city starts to take shape."
          tiers={stayTiers}
          cta={
            hasHotelAffiliate
              ? {
                  href: hotelAffiliateHref,
                  label: `Find hotels in ${city.city}`,
                }
              : null
          }
        />

        <EditorialTierSection
          label="Experiences"
          title={`Ways to experience ${city.city}`}
          copy="For travelers who want the route, timing, or context handled with a little more ease."
          tiers={experienceTiers}
          cta={
            hasTourAffiliate
              ? {
                  href: tourAffiliateHref,
                  label: `Explore tours in ${city.city}`,
                }
              : null
          }
        />

        <div className={styles.sectionIntro}>
          <div>
            <div className={styles.label}>Explore next</div>
            <h2 className={styles.sectionTitle}>Popular spots in {city.city}</h2>
          </div>

          <p className={styles.sectionLead}>
            Start with the places visitors usually want to understand first.
          </p>
        </div>

        {spots.length === 0 ? (
          <div className={styles.empty}>No published spots yet.</div>
        ) : (
          <div className={styles.spotGrid}>
            {spots.map((spot) => (
              <Link
                key={spot.id}
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
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function EditorialTierSection({
  label,
  title,
  copy,
  tiers,
  cta,
}: {
  label: string;
  title: string;
  copy: string;
  tiers: EditorialTier[];
  cta: { href: string; label: string } | null;
}) {
  return (
    <section className={styles.tierSection}>
      <div className={styles.sectionIntro}>
        <div>
          <div className={styles.label}>{label}</div>
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>

        <p className={styles.sectionLead}>{copy}</p>
      </div>

      <div className={styles.tierList}>
        {tiers.map((tier) => (
          <article key={tier.title} className={styles.tierItem}>
            <div className={styles.tierKicker}>Guide note</div>
            <h3 className={styles.tierTitle}>{tier.title}</h3>
            <p className={styles.tierText}>{tier.text}</p>
          </article>
        ))}
      </div>

      {cta ? (
        <div className={styles.sectionCtaRow}>
          <a href={cta.href} className={styles.sectionCta}>
            {cta.label}
          </a>
        </div>
      ) : null}
    </section>
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

function getAffiliateHref(
  type: "hotels" | "tours",
  citySlug: string,
  src: string,
  v: string
) {
  const query = new URLSearchParams({
    c: citySlug,
    src,
    v,
  });

  return `/out/${type}?${query.toString()}`;
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f7f2ea 0%, #fffaf2 45%, #f5efe4 100%)",
  color: "#1f211d",
};

const heroStyle: CSSProperties = {
  minHeight: 640,
  display: "flex",
  alignItems: "flex-end",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "250px 16px 34px",
  color: "#ffffff",
};

const heroInnerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: 22,
  alignItems: "end",
};

const heroCopyStyle: CSSProperties = {
  minWidth: 0,
  maxWidth: 760,
  padding: "0 0 10px",
};

const eyebrowStyle: CSSProperties = {
  marginBottom: 14,
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "rgba(255, 255, 255, 0.72)",
};

const countryPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  marginBottom: 16,
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.16)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 52,
  lineHeight: 1.02,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#ffffff",
  overflowWrap: "break-word",
  textShadow: "0 2px 22px rgba(0, 0, 0, 0.24)",
};

const leadStyle: CSSProperties = {
  margin: "18px 0 0",
  maxWidth: 680,
  fontSize: 16,
  lineHeight: 1.78,
  color: "rgba(255, 255, 255, 0.86)",
  textShadow: "0 1px 18px rgba(0, 0, 0, 0.22)",
};

const heroCtaStyle: CSSProperties = {
  minWidth: 0,
  padding: 14,
  borderRadius: 12,
  background: "rgba(12, 21, 27, 0.52)",
  border: "1px solid rgba(255, 255, 255, 0.20)",
  boxShadow: "0 24px 58px rgba(0, 0, 0, 0.24)",
  color: "#ffffff",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const ctaKickerStyle: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "rgba(255, 255, 255, 0.76)",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1120,
  margin: "0 auto",
  padding: "54px 16px 78px",
  boxSizing: "border-box",
};

const editorialSectionStyle: CSSProperties = {
  marginBottom: 54,
  paddingBottom: 8,
};

const editorialHeaderStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "end",
  marginBottom: 18,
  flexWrap: "wrap",
};

const editorialHeadingStyle: CSSProperties = {
  flex: "1 1 320px",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
};

const editorialLeadStyle: CSSProperties = {
  flex: "1 1 260px",
  minWidth: 0,
  width: "100%",
  maxWidth: "clamp(260px, 70vw, 390px)",
  margin: 0,
  color: "#6f665b",
  fontSize: 14,
  lineHeight: 1.7,
  overflowWrap: "break-word",
};

const tierGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 14,
};

const tierCardStyle: CSSProperties = {
  minWidth: 0,
  boxSizing: "border-box",
  minHeight: 190,
  padding: 20,
  borderRadius: 8,
  background: "#fffdf8",
  border: "1px solid #e4d8c8",
  boxShadow: "0 12px 30px rgba(45, 36, 28, 0.07)",
};

const tierNumberStyle: CSSProperties = {
  marginBottom: 36,
  color: "#9a6a43",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const tierTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "clamp(240px, 70vw, 390px)",
  color: "#1f211d",
  fontSize: "clamp(20px, 5.5vw, 23px)",
  lineHeight: 1.18,
  letterSpacing: 0,
  overflowWrap: "break-word",
};

const tierTextStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: "clamp(240px, 70vw, 390px)",
  color: "#6f665b",
  fontSize: 14,
  lineHeight: 1.7,
  overflowWrap: "break-word",
};

const sectionCtaRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  marginTop: 16,
};

const sectionCtaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 8,
  background: "#2a211c",
  color: "#fff8ef",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const sectionIntroStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "end",
  marginBottom: 22,
  flexWrap: "wrap",
};

const labelStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: "#8f5d2b",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  width: "100%",
  maxWidth: "clamp(280px, 70vw, 760px)",
  fontSize: "clamp(24px, 6.4vw, 34px)",
  lineHeight: 1.18,
  letterSpacing: 0,
  color: "#1f211d",
  overflowWrap: "break-word",
};

const sectionLeadStyle: CSSProperties = {
  maxWidth: 360,
  margin: 0,
  color: "#6f665b",
  fontSize: 14,
  lineHeight: 1.65,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
  gap: 18,
};

const cardStyle: CSSProperties = {
  minHeight: 430,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 8,
  overflow: "hidden",
  color: "#ffffff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#26352f",
  border: "1px solid rgba(48, 38, 28, 0.12)",
  boxShadow: "0 18px 40px rgba(45, 36, 28, 0.14)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  maxWidth: "calc(100% - 28px)",
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(255, 255, 255, 0.34)",
  color: "#1f211d",
  fontSize: 12,
  fontWeight: 850,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const panelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 12,
  padding: 18,
  borderRadius: 8,
  background: "rgba(12, 21, 27, 0.62)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.18)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.12,
  letterSpacing: 0,
  color: "#ffffff",
  overflowWrap: "break-word",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255, 255, 255, 0.78)",
};

const cardActionStyle: CSSProperties = {
  marginTop: 14,
  fontSize: 13,
  fontWeight: 850,
  color: "#f8ddba",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 8,
  background: "#fffaf2",
  border: "1px solid rgba(143, 93, 43, 0.16)",
  color: "#6f665b",
};





