import Link from "next/link";
import type { CSSProperties } from "react";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import type { SupabasePublicCity } from "@/data/supabase-public-cities";
import {
  getPublishedSupabaseSpotsForCity,
  type SupabasePublicSpot,
} from "@/data/supabase-public-spots";
import type { TrackingParams } from "@/lib/tracking-query";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

type Props = {
  city: SupabasePublicCity;
  spot: SupabasePublicSpot;
  tracking?: TrackingParams;
};

export async function SupabaseSpotDetail({ city, spot, tracking }: Props) {
  const nearbySpots = (await getPublishedSupabaseSpotsForCity(city.slug))
    .filter((nearbySpot) => nearbySpot.slug !== spot.slug)
    .slice(0, 3);
  const hotelAffiliateUrl =
    spot.affiliateHotelUrl ?? spot.affiliate_hotel_url;
  const tourAffiliateUrl =
    spot.affiliateTourUrl ?? spot.affiliate_tour_url;
  const hasHotelAffiliate = Boolean(getOptionalHttpUrl(hotelAffiliateUrl));
  const hasTourAffiliate = Boolean(getOptionalHttpUrl(tourAffiliateUrl));
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

  return (
    <main style={pageStyle}>
      <section style={heroSectionStyle}>
        <div style={heroShellStyle}>
          <div
            style={{
              ...heroImageStyle,
              backgroundImage: getImageBackground(
                spot.image_url,
                "linear-gradient(180deg, rgba(31, 26, 23, 0.08) 0%, rgba(31, 26, 23, 0.26) 44%, rgba(31, 26, 23, 0.78) 100%)",
                "linear-gradient(135deg, #efe1d0 0%, #c7a987 48%, #2a211c 100%)"
              ),
              backgroundPosition: getCssImagePosition(
                spot.imagePosition ?? spot.image_position
              ),
            }}
          >
            <div style={heroContentStyle}>
              <div style={eyebrowStyle}>Place guide</div>
              <h1 style={titleStyle}>{spot.name}</h1>
              <p style={locationStyle}>
                {city.city}, {countryName}
              </p>
              <p style={leadStyle}>{heroDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={contentShellStyle}>
        {hasHotelAffiliate || hasTourAffiliate ? (
          <section style={planSectionStyle} aria-labelledby="plan-spot-title">
            <div style={planCopyStyle}>
              <div style={darkEyebrowStyle}>Plan around this spot</div>
              <h2 id="plan-spot-title" style={planTitleStyle}>
                Turn the place into a route.
              </h2>
              <p style={planTextStyle}>
                Compare only the direct options attached to this spot, then keep
                exploring the guide when you need more context.
              </p>
            </div>

            <div style={planCtaStyle}>
              <AffiliateButtonGroup
                city={city}
                src={trackingSrc}
                v={trackingV}
                spotSlug={spot.slug}
                primary={hasHotelAffiliate ? "hotels" : "tours"}
                tone="dark"
                variant={hasHotelAffiliate ? "spot-hotel" : "spot-tour"}
                showHotels={hasHotelAffiliate}
                showTours={hasTourAffiliate}
              />
            </div>
          </section>
        ) : null}

        <section style={whyGoSectionStyle} aria-labelledby="why-go-title">
          <div style={sectionLabelStyle}>Why go</div>
          <h2 id="why-go-title" style={sectionTitleStyle}>
            The reason to make time for it.
          </h2>
          <p style={bodyTextStyle}>{whyGoText}</p>
        </section>

        {nearbySpots.length > 0 ? (
          <section style={nearbySectionStyle} aria-labelledby="nearby-title">
            <div style={sectionHeaderStyle}>
              <div>
                <div style={sectionLabelStyle}>Nearby spots</div>
                <h2 id="nearby-title" style={sectionTitleStyle}>
                  Keep wandering through {city.city}.
                </h2>
              </div>
              <p style={sectionIntroStyle}>
                Other published places from the same city guide.
              </p>
            </div>

            <div style={nearbyGridStyle}>
              {nearbySpots.map((nearbySpot) => (
                <Link
                  key={nearbySpot.id}
                  href={`/c/${city.slug}/spot/${nearbySpot.slug}?src=spot-detail&v=nearby_${city.slug}_${nearbySpot.slug}`}
                  style={{
                    ...nearbyCardStyle,
                    backgroundImage: getImageBackground(
                      nearbySpot.image_url,
                      "linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.28) 48%, rgba(31, 26, 23, 0.82) 100%)",
                      "linear-gradient(135deg, #eadbc8 0%, #b8936e 52%, #2a211c 100%)"
                    ),
                    backgroundPosition: getCssImagePosition(
                      nearbySpot.imagePosition ?? nearbySpot.image_position
                    ),
                  }}
                >
                  <div style={nearbyCardBodyStyle}>
                    <div style={nearbyMetaStyle}>{city.city}</div>
                    <h3 style={nearbyTitleStyle}>{nearbySpot.name}</h3>
                    <p style={nearbyTextStyle}>
                      {getConciseText(
                        nearbySpot.summary || nearbySpot.description,
                        `Another place to understand in ${city.city}.`
                      )}
                    </p>
                    <div style={nearbyActionStyle}>Open place guide</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section style={backSectionStyle}>
          <div>
            <div style={sectionLabelStyle}>City guide</div>
            <h2 style={backTitleStyle}>Return to the full {city.city} guide.</h2>
          </div>

          <Link href={`/c/${city.slug}`} style={cityLinkStyle}>
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

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f7f2ea 0%, #fffdf8 46%, #f5efe6 100%)",
  color: "#1f1a17",
};

const heroSectionStyle: CSSProperties = {
  padding: "20px 14px 0",
};

const heroShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
};

const heroImageStyle: CSSProperties = {
  minHeight: "clamp(540px, 78vw, 760px)",
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
  borderRadius: 8,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#2a211c",
  border: "1px solid rgba(228, 216, 200, 0.82)",
  boxShadow: "0 24px 70px rgba(70, 53, 38, 0.20)",
};

const heroContentStyle: CSSProperties = {
  width: "100%",
  maxWidth: 820,
  padding: "clamp(26px, 7vw, 58px)",
  boxSizing: "border-box",
  color: "#fff8ef",
};

const eyebrowStyle: CSSProperties = {
  marginBottom: 14,
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "rgba(255, 248, 239, 0.74)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 820,
  fontSize: 40,
  lineHeight: 1.02,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#fff8ef",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  textShadow: "0 2px 24px rgba(0, 0, 0, 0.26)",
};

const locationStyle: CSSProperties = {
  margin: "16px 0 0",
  fontSize: 14,
  lineHeight: 1.4,
  color: "rgba(255, 248, 239, 0.82)",
  fontWeight: 800,
};

const leadStyle: CSSProperties = {
  margin: "18px 0 0",
  maxWidth: 680,
  fontSize: 16,
  lineHeight: 1.72,
  color: "rgba(255, 248, 239, 0.86)",
  textShadow: "0 1px 18px rgba(0, 0, 0, 0.22)",
};

const contentShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1060,
  margin: "0 auto",
  padding: "42px 16px 76px",
};

const planSectionStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 26,
  alignItems: "start",
  marginBottom: 48,
  padding: "clamp(22px, 5vw, 34px)",
  borderRadius: 8,
  background: "#2a211c",
  color: "#fff8ef",
  border: "1px solid rgba(42, 33, 28, 0.24)",
};

const planCopyStyle: CSSProperties = {
  maxWidth: 440,
};

const darkEyebrowStyle: CSSProperties = {
  marginBottom: 10,
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "rgba(255, 248, 239, 0.62)",
};

const planTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 7vw, 46px)",
  lineHeight: 1.04,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#fff8ef",
};

const planTextStyle: CSSProperties = {
  margin: "14px 0 0",
  fontSize: 14,
  lineHeight: 1.75,
  color: "rgba(255, 248, 239, 0.72)",
};

const planCtaStyle: CSSProperties = {
  minWidth: 0,
};

const whyGoSectionStyle: CSSProperties = {
  maxWidth: 760,
  marginBottom: 54,
};

const sectionLabelStyle: CSSProperties = {
  marginBottom: 10,
  fontSize: 12,
  color: "#9a6a43",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(32px, 7vw, 48px)",
  lineHeight: 1.06,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#1f1a17",
};

const bodyTextStyle: CSSProperties = {
  margin: "16px 0 0",
  maxWidth: 720,
  fontSize: 16,
  lineHeight: 1.85,
  color: "#6f6258",
};

const nearbySectionStyle: CSSProperties = {
  marginBottom: 56,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "end",
  gap: 18,
  marginBottom: 20,
  flexWrap: "wrap",
};

const sectionIntroStyle: CSSProperties = {
  maxWidth: 320,
  margin: 0,
  color: "#6f6258",
  fontSize: 14,
  lineHeight: 1.65,
};

const nearbyGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const nearbyCardStyle: CSSProperties = {
  minHeight: 390,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  overflow: "hidden",
  borderRadius: 8,
  color: "#fff8ef",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#2a211c",
  border: "1px solid #e4d8c8",
  boxShadow: "0 16px 38px rgba(70, 53, 38, 0.14)",
};

const nearbyCardBodyStyle: CSSProperties = {
  padding: 18,
};

const nearbyMetaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0,
  color: "rgba(255, 248, 239, 0.68)",
  fontWeight: 850,
};

const nearbyTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1.08,
  letterSpacing: 0,
  color: "#fff8ef",
  fontWeight: 850,
  overflowWrap: "break-word",
};

const nearbyTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.6,
  color: "rgba(255, 248, 239, 0.78)",
};

const nearbyActionStyle: CSSProperties = {
  marginTop: 16,
  fontSize: 13,
  fontWeight: 850,
  color: "#f3d7b5",
};

const backSectionStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 18,
  flexWrap: "wrap",
  paddingTop: 28,
  borderTop: "1px solid #e4d8c8",
};

const backTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(26px, 6vw, 38px)",
  lineHeight: 1.08,
  letterSpacing: 0,
  color: "#1f1a17",
};

const cityLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "13px 16px",
  borderRadius: 999,
  background: "#fffdf8",
  color: "#1f1a17",
  border: "1px solid #e4d8c8",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};
