import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { TravelVisual } from "@/components/TravelVisual";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; spotSlug: string }>;
}): Promise<Metadata> {
  const { slug, spotSlug } = await params;
  const city = cities[slug];
  const spot = city?.spotDetails?.find(
    (item) => item.slug === spotSlug && item.isPublished !== false
  );

  if (!city || !spot) {
    return {
      title: "Spot not found | TravelHub",
      description: "This TravelHub spot page could not be found.",
    };
  }

  const title = `${spot.name}, ${city.city} | TravelHub`;
  const description =
    spot.summary ??
    `Explore ${spot.name} in ${city.city}, with travel tips and planning links.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://travelhub-murex.vercel.app/c/${city.slug}/spot/${spot.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SpotPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; spotSlug: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const { slug, spotSlug } = await params;
  const sp = await searchParams;

  const src = typeof sp?.src === "string" ? sp.src : "spot";
  const v = typeof sp?.v === "string" ? sp.v : `spot_${slug}_${spotSlug}`;

  const city = cities[slug];
  if (!city) return notFound();

  const spot = city.spotDetails?.find(
    (item) => item.slug === spotSlug && item.isPublished !== false
  );

  if (!spot) return notFound();

  const relatedSpots =
    city.spotDetails
      ?.filter((item) => item.slug !== spot.slug && item.isPublished !== false)
      .slice(0, 3) ?? [];

  const bestFor =
    spot.bestFor && spot.bestFor.length > 0
      ? spot.bestFor
      : city.travelStyles?.slice(0, 3) ?? ["First-time visitors"];

  const tags =
    spot.tags && spot.tags.length > 0
      ? spot.tags
      : spot.highlights.slice(0, 3);

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Cities", href: "/cities" },
            { label: city.city, href: `/c/${slug}?src=${src}&v=${v}` },
            { label: spot.name },
          ]}
        />

        <section style={heroStyle}>
          <div style={heroTextStyle}>
            <div style={eyebrowStyle}>Spot guide</div>

            <h1 style={titleStyle}>{spot.name}</h1>

            <p style={metaStyle}>
              {city.city}, {city.country}
            </p>

            <p style={subtitleStyle}>{spot.summary}</p>

            <div style={heroChipWrapStyle}>
              {bestFor.slice(0, 3).map((item) => (
                <span key={item} style={heroChipStyle}>
                  {item}
                </span>
              ))}

              {tags.slice(0, 3).map((tag) => (
                <span key={tag} style={heroChipStyle}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <TravelVisual
            imageUrl={spot.imageUrl}
            imageAlt={spot.imageAlt ?? spot.name}
            imageCredit={spot.imageCredit}
            fallback={visualForIndex(0)}
            style={heroVisualStyle}
          >
            <div style={visualBadgeStyle}>{city.city}</div>
          </TravelVisual>
        </section>

        <section style={decisionGridStyle}>
          <article style={decisionCardStyle}>
            <div style={smallLabelStyle}>Why visit</div>
            <h2 style={sectionTitleStyle}>Why this spot matters</h2>
            <p style={bodyTextStyle}>{getWhyVisitSpotText(spot.name, city.city)}</p>
          </article>

          <article style={decisionCardStyle}>
            <div style={smallLabelStyle}>Best for</div>
            <h2 style={sectionTitleStyle}>Who should add it</h2>
            <div style={tagWrapStyle}>
              {bestFor.slice(0, 4).map((item) => (
                <span key={item} style={tagStyle}>
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article style={decisionCardStyle}>
            <div style={smallLabelStyle}>Good to know</div>
            <h2 style={sectionTitleStyle}>Plan with less friction</h2>
            <p style={bodyTextStyle}>
              Use this spot as an anchor, then connect nearby sights instead of
              planning the route from scratch.
            </p>
          </article>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Highlights</div>
              <h2 style={largeSectionTitleStyle}>
                What to notice before you go.
              </h2>
            </div>
          </div>

          <div style={highlightGridStyle}>
            {spot.highlights.slice(0, 4).map((highlight, index) => (
              <article key={`${highlight}-${index}`} style={highlightCardStyle}>
                <div style={numberStyle}>{index + 1}</div>
                <h3 style={highlightTitleStyle}>{highlight}</h3>
                <p style={highlightTextStyle}>
                  This is one of the reasons this spot can work as a clear
                  travel anchor inside {city.city}.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={planningCardStyle}>
            <div>
              <div style={smallLabelStyle}>Planning to visit?</div>
              <h2 style={largeSectionTitleStyle}>
                Consider a tour if you want the route handled for you.
              </h2>

              <p style={sectionLeadStyle}>
                {getTourReasonText(spot.name, city.city)}
              </p>
            </div>

            <AffiliateButtonGroup city={city} src={src} v={`tour_${v}`} primary="tours" variant="spot-tour" />
          </div>
        </section>

        {relatedSpots.length > 0 && (
          <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={smallLabelStyle}>Nearby ideas</div>
                <h2 style={largeSectionTitleStyle}>
                  Add another place from {city.city}.
                </h2>
              </div>
            </div>

            <div style={relatedGridStyle}>
              {relatedSpots.map((related, index) => (
                <Link
                  key={related.slug}
                  href={`/c/${slug}/spot/${related.slug}?src=${encodeURIComponent(
                    src
                  )}&v=${encodeURIComponent(`related_${v}`)}`}
                  style={relatedCardStyle}
                >
                  <TravelVisual
                    imageUrl={related.imageUrl}
                    imageAlt={related.imageAlt ?? related.name}
                    imageCredit={related.imageCredit}
                    fallback={visualForIndex(index + 1)}
                    style={relatedVisualStyle}
                  />

                  <div style={relatedBodyStyle}>
                    <h3 style={relatedTitleStyle}>{related.name}</h3>
                    <p style={relatedTextStyle}>{related.summary}</p>
                    <div style={openTextStyle}>Open spot guide</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={sectionStyle}>
          <div style={hotelCtaStyle}>
            <div>
              <div style={smallLabelStyle}>Staying in {city.city}?</div>
              <h2 style={largeSectionTitleStyle}>
                Choose your base after you know the places you want to visit.
              </h2>

              <p style={sectionLeadStyle}>
                If {spot.name} is part of your route, compare stays in{" "}
                {city.city} after checking which area makes the rest of the trip
                easier.
              </p>
            </div>

            <AffiliateButtonGroup city={city} src={src} v={`hotel_${v}`} variant="spot-hotel" />
          </div>
        </section>
<p style={noteStyle}>
          Some links may be affiliate links. We may earn a commission if you book
          through them, at no extra cost to you.
        </p>
      </section>
    </main>
  );
}

function getWhyVisitSpotText(spotName: string, cityName: string) {
  return `${spotName} gives the ${cityName} trip a clear focal point. It helps turn a broad city idea into a more concrete route, which makes hotel areas and tours easier to compare.`;
}

function getTourReasonText(spotName: string, cityName: string) {
  return `If ${spotName} is one of your must-see places in ${cityName}, a guided walk or city tour can reduce route-planning effort and help connect nearby highlights more efficiently.`;
}

function visualForIndex(index: number) {
  const visuals = [
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 44%, #3b2f2f 100%)",
    "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
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
  maxWidth: 1040,
  margin: "0 auto",
  padding: "34px 16px 48px",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: 20,
  alignItems: "center",
  marginBottom: 28,
};

const heroTextStyle: CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 0 10px",
  maxWidth: 760,
  fontSize: "clamp(42px, 11vw, 76px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const metaStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 15,
  fontWeight: 800,
  opacity: 0.56,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 700,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};

const heroChipWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 18,
};

const heroChipStyle: CSSProperties = {
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  fontSize: 12,
  fontWeight: 800,
};

const heroVisualStyle: CSSProperties = {
  minHeight: "clamp(260px, 56vw, 430px)",
  borderRadius: 32,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 28px 80px rgba(0, 0, 0, 0.16)",
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 800,
  zIndex: 2,
};

const decisionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 14,
  marginBottom: 34,
};

const decisionCardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.06)",
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 7,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.08,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const bodyTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.68,
  opacity: 0.7,
};

const sectionStyle: CSSProperties = {
  marginTop: 38,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-end",
  marginBottom: 16,
  flexWrap: "wrap",
};

const largeSectionTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
  fontSize: "clamp(26px, 6vw, 36px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const sectionLeadStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 720,
  fontSize: 14,
  lineHeight: 1.7,
  opacity: 0.68,
};

const tagWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 12,
};

const tagStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.055)",
  fontSize: 12,
  fontWeight: 800,
};

const highlightGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 14,
};

const highlightCardStyle: CSSProperties = {
  padding: 18,
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.06)",
};

const numberStyle: CSSProperties = {
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  marginBottom: 14,
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
};

const highlightTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const highlightTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.58,
  opacity: 0.68,
};

const planningCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  padding: 22,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 74px rgba(0, 0, 0, 0.1)",
};

const relatedGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const relatedCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const relatedVisualStyle: CSSProperties = {
  height: 160,
  position: "relative",
};

const relatedBodyStyle: CSSProperties = {
  padding: 17,
};

const relatedTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const relatedTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.7,
};

const openTextStyle: CSSProperties = {
  marginTop: 14,
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.78,
};

const hotelCtaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  padding: 22,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 74px rgba(0, 0, 0, 0.1)",
};

const finalCtaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  marginTop: 34,
  padding: 22,
  borderRadius: 32,
  background: "rgba(23, 23, 23, 0.94)",
  color: "#ffffff",
  boxShadow: "0 26px 80px rgba(0, 0, 0, 0.18)",
};

const finalCtaTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: "clamp(28px, 7vw, 40px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const finalCtaTextStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 620,
  fontSize: 14,
  lineHeight: 1.65,
  opacity: 0.72,
};

const noteStyle: CSSProperties = {
  margin: "28px auto 0",
  maxWidth: 560,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};







