import Link from "next/link";
import { cities } from "@/data/cities";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import type { City } from "@/data/types";
import { TravelVisual } from "@/components/TravelVisual";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = cities[slug];

  if (!city) {
    return {
      title: "City not found | TravelHub",
      description: "This TravelHub city page could not be found.",
    };
  }

  const title = `${city.city}, ${city.country} | TravelHub`;
  const description =
    city.description ??
    `Explore featured spots in ${city.city} and find hotel, tour, and travel links for your trip.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://travelhub-murex.vercel.app/c/${city.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const src = typeof sp?.src === "string" ? sp.src : "hub";
  const v = typeof sp?.v === "string" ? sp.v : `hub_${slug}`;

  const city = cities[slug];
  if (!city) return notFound();

  const spotCards =
    city.spotDetails && city.spotDetails.length > 0
      ? city.spotDetails
      : city.stops.map((stop, index) => ({
          slug:
            stop
              .toLowerCase()
              .replaceAll(" ", "-")
              .replace(/[^a-z0-9-]/g, "") || `spot-${index + 1}`,
          name: stop,
          summary: "A featured place from this city.",
          highlights: ["Featured spot"],
          bestFor: [],
          imageUrl: undefined,
          imageAlt: undefined,
          imageCredit: undefined,
        }));

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cities", href: "/cities" },
            { label: `${city.city}, ${city.country}` },
          ]}
        />

        <section style={heroStyle}>
          <div style={eyebrowStyle}>Travel links for</div>

          <h1 style={titleStyle}>
            {city.city}, {city.country}
          </h1>

          <p style={subtitleStyle}>
            {getCityIntro(city)}
          </p>
        </section>

        <section style={overviewCardStyle}>
          <div style={overviewTextStyle}>
            <div style={smallLabelStyle}>Why visit</div>
            <h2 style={overviewTitleStyle}>A quick travel snapshot.</h2>
            <p style={overviewDescriptionStyle}>{getWhyVisitText(city)}</p>
          </div>

          <div style={snapshotGridStyle}>
            <div style={snapshotItemStyle}>
              <div style={snapshotLabelStyle}>Best months</div>
              <div style={snapshotValueStyle}>
                {formatList(city.months, "Seasonal timing coming soon")}
              </div>
            </div>

            <div style={snapshotItemStyle}>
              <div style={snapshotLabelStyle}>Good for</div>
              <div style={snapshotValueStyle}>
                {formatList(city.travelStyles, "First-time travelers")}
              </div>
            </div>

            <div style={snapshotItemStyle}>
              <div style={snapshotLabelStyle}>Travel mood</div>
              <div style={snapshotValueStyle}>
                {formatList(city.themes, "Scenic city discovery")}
              </div>
            </div>

            <div style={snapshotItemStyle}>
              <div style={snapshotLabelStyle}>Start with</div>
              <div style={snapshotValueStyle}>
                {city.stops.slice(0, 3).join(" · ")}
              </div>
            </div>
          </div>
        </section>

        <section style={spotSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Featured spots</div>
              <h2 style={sectionTitleStyle}>Start with these places</h2>
            </div>
            <span style={countStyle}>{spotCards.length} spots</span>
          </div>

          <div style={spotGridStyle}>
            {spotCards.map((spot, index) => {
              const canOpenSpot =
                city.spotDetails?.some((item) => item.slug === spot.slug) ??
                false;

              const cardKey = `${spot.slug}-${index}`;

              const cardContent = (
                <>
                  <TravelVisual
                    imageUrl={spot.imageUrl}
                    imageAlt={spot.imageAlt ?? spot.name}
                    imageCredit={spot.imageCredit}
                    fallback={visualForIndex(index)}
                    style={spotVisualStyle}
                  >
                    <div style={spotNumberBadgeStyle}>{index + 1}</div>
                  </TravelVisual>

                  <div style={spotBodyStyle}>
                    <div style={spotTopStyle}>
                      <div style={spotTextStyle}>
                        <h3 style={spotNameStyle}>{spot.name}</h3>
                        <p style={spotSummaryStyle}>{spot.summary}</p>
                      </div>

                      {canOpenSpot && <div style={spotArrowStyle}>→</div>}
                    </div>

                    <div style={highlightWrapStyle}>
                      {spot.highlights
                        .slice(0, 3)
                        .map((highlight, highlightIndex) => (
                          <span
                            key={`${highlight}-${highlightIndex}`}
                            style={highlightChipStyle}
                          >
                            {highlight}
                          </span>
                        ))}
                    </div>

                    {canOpenSpot ? (
                      <div style={viewSpotStyle}>View spot</div>
                    ) : (
                      <div style={disabledSpotStyle}>Spot page coming soon</div>
                    )}
                  </div>
                </>
              );

              if (!canOpenSpot) {
                return (
                  <article key={cardKey} style={spotCardStyle}>
                    {cardContent}
                  </article>
                );
              }

              return (
                <Link
                  key={cardKey}
                  href={`/c/${slug}/spot/${
                    spot.slug
                  }?src=${encodeURIComponent(src)}&v=${encodeURIComponent(v)}`}
                  style={spotCardLinkStyle}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>

        <section style={ctaCardStyle}>
          <div>
            <div style={smallLabelStyle}>Ready to plan?</div>
            <h2 style={ctaTitleStyle}>Find travel options for {city.city}.</h2>
            <p style={ctaTextStyle}>
              After choosing the places you want to visit, use these links to
              continue planning.
            </p>
          </div>

          <AffiliateButtonGroup city={city} src={src} v={v} />
        </section>

        <p style={noteStyle}>
          Some links may be affiliate links. We may earn a commission if you book
          through them, at no extra cost to you.
        </p>
      </section>
    </main>
  );
}

function getCityIntro(city: City) {
  return (
    city.description ??
    `Explore ${city.city} through featured spots, seasonal travel context, and quick links for hotels, tours, and trip planning.`
  );
}

function getWhyVisitText(city: City) {
  const themes = city.themes?.slice(0, 3).join(", ");
  const styles = city.travelStyles?.slice(0, 3).join(", ");
  const stops = city.stops.slice(0, 3).join(", ");

  if (themes && styles) {
    return `${city.city} works well for ${styles.toLowerCase()} trips, especially if you want ${themes.toLowerCase()} experiences. Start with ${stops}.`;
  }

  if (themes) {
    return `${city.city} is a strong pick for ${themes.toLowerCase()} travel. Start with ${stops}.`;
  }

  return `${city.city} is a useful destination to explore through a few clear starting points: ${stops}.`;
}

function formatList(items: string[] | undefined, fallback: string) {
  if (!items || items.length === 0) return fallback;
  return items.slice(0, 5).join(" · ");
}

function visualForIndex(index: number) {
  const visuals = [
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 44%, #3b2f2f 100%)",
    "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
  ];

  return visuals[index % visuals.length];
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
  padding: "22px 16px 48px",
};

const homeLinkStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 22,
  color: "inherit",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 800,
  opacity: 0.72,
};

const heroStyle: CSSProperties = {
  marginBottom: 24,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 0 14px",
  maxWidth: 760,
  fontSize: "clamp(42px, 11vw, 78px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};

const overviewCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 18,
  alignItems: "start",
  marginTop: 26,
  marginBottom: 30,
  padding: 22,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 74px rgba(0, 0, 0, 0.1)",
};

const overviewTextStyle: CSSProperties = {
  minWidth: 0,
};

const overviewTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 32px)",
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const overviewDescriptionStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.7,
  opacity: 0.7,
};

const snapshotGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))",
  gap: 10,
};

const snapshotItemStyle: CSSProperties = {
  padding: 14,
  borderRadius: 20,
  background: "rgba(0, 0, 0, 0.04)",
};

const snapshotLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  opacity: 0.56,
  marginBottom: 7,
};

const snapshotValueStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.45,
  fontWeight: 750,
};

const spotSectionStyle: CSSProperties = {
  marginTop: 28,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 16,
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 30px)",
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const countStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const spotGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 16,
};

const spotCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 30,
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 22px 64px rgba(0, 0, 0, 0.09)",
};

const spotCardLinkStyle: CSSProperties = {
  ...spotCardStyle,
  color: "inherit",
  textDecoration: "none",
};

const spotVisualStyle: CSSProperties = {
  height: "clamp(150px, 42vw, 190px)",
  position: "relative",
};

const spotNumberBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(14px)",
  fontSize: 13,
  fontWeight: 850,
  zIndex: 2,
};

const spotBodyStyle: CSSProperties = {
  padding: 18,
};

const spotTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
  marginBottom: 14,
};

const spotTextStyle: CSSProperties = {
  minWidth: 0,
};

const spotNameStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 6vw, 26px)",
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const spotSummaryStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: 14,
  lineHeight: 1.55,
  opacity: 0.66,
};

const spotArrowStyle: CSSProperties = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontWeight: 850,
  flexShrink: 0,
};

const highlightWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 16,
};

const highlightChipStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  fontWeight: 750,
};

const viewSpotStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.8,
};

const disabledSpotStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 750,
  opacity: 0.46,
};

const ctaCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 18,
  alignItems: "center",
  marginTop: 28,
  padding: 22,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 74px rgba(0, 0, 0, 0.1)",
};

const ctaTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 32px)",
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const ctaTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.68,
};

const noteStyle: CSSProperties = {
  margin: "28px auto 0",
  maxWidth: 560,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};
