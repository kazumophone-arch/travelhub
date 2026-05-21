import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { TravelVisual } from "@/components/TravelVisual";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateButtonGroup } from "@/components/AffiliateButtonGroup";
import { getSpotImage } from "@/data/travel-images";
import { DetailHeroImage } from "@/components/DetailHeroImage";
import { getMapMagazineSpotVisual } from "@/lib/mapMagazineVisuals";

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


function getNearbyIdeaPhotoCardStyle(
  citySlug: string,
  spotKey: string,
  baseStyle: CSSProperties
): CSSProperties {
  const seed = encodeURIComponent(`travelhub-nearby-idea-${citySlug}-${spotKey}`);
  const imageUrl = `https://picsum.photos/seed/${seed}/1000/700`;

  return {
    ...baseStyle,
    background: `linear-gradient(180deg, rgba(10, 18, 24, 0.05) 0%, rgba(10, 18, 24, 0.24) 42%, rgba(10, 18, 24, 0.76) 100%), url("${imageUrl}") center / cover no-repeat`,
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
            fallback={getMapMagazineSpotVisual(0)}
            style={heroVisualStyle}
          >
            <div style={visualBadgeStyle}>{city.city}</div>
          </TravelVisual>
        </section>
        <DetailHeroImage
          image={getSpotImage(city.slug, spot.slug)}
          label={spot.name + " · " + city.city}
        />

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
                  style={getNearbyIdeaPhotoCardStyle(city.slug, related.slug ?? related.name ?? String(index), relatedCardStyle)}
                >
                  <TravelVisual
                    imageUrl={related.imageUrl}
                    imageAlt={related.imageAlt ?? related.name}
                    imageCredit={related.imageCredit}
                    fallback={getMapMagazineSpotVisual(index + 1)}
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
    "linear-gradient(180deg, #f6fbff 0%, #ffffff 42%, #f4faf8 100%)",
  color: "#17202a",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1040,
  margin: "0 auto",
  padding: "34px 16px 52px",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: 22,
  alignItems: "center",
  marginBottom: 30,
};

const heroTextStyle: CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#138a72",
  fontWeight: 850,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 0 10px",
  maxWidth: 760,
  fontSize: "clamp(40px, 9vw, 68px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
  color: "#17202a",
};

const metaStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 15,
  fontWeight: 800,
  color: "#138a72",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 700,
  fontSize: "clamp(15px, 3.8vw, 17px)",
  lineHeight: 1.78,
  color: "#607080",
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
  background: "#eef8f5",
  border: "1px solid rgba(19, 138, 114, 0.14)",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
};

const heroVisualStyle: CSSProperties = {
  minHeight: "clamp(240px, 54vw, 390px)",
  borderRadius: 26,
  overflow: "hidden",
  position: "relative",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 10px 28px rgba(30, 64, 88, 0.09)",
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.88)",
  border: "1px solid rgba(23, 32, 42, 0.07)",
  backdropFilter: "blur(10px)",
  color: "#138a72",
  fontSize: 12,
  fontWeight: 850,
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
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
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
  color: "#607080",
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
  color: "#607080",
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
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
};

const numberStyle: CSSProperties = {
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  marginBottom: 14,
  borderRadius: "50%",
  background: "#eef8f5",
  color: "#138a72",
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
  color: "#607080",
};

const planningCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  padding: 20,
  borderRadius: 24,
  background: "#f7fbfc",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
};

const relatedGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const relatedCardStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minHeight: 360,
  borderRadius: 24,
  backgroundColor: "#17202a",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 12px 34px rgba(30, 64, 88, 0.16)",
  color: "#ffffff",
  textDecoration: "none",
  overflow: "hidden",
};

const relatedVisualStyle: CSSProperties = {
  display: "none",
};

const relatedBodyStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: "auto 12px 12px",
  padding: 16,
  borderRadius: 20,
  background: "rgba(12, 22, 30, 0.54)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const relatedTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
  color: "#ffffff",
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const relatedTextStyle: CSSProperties = {
  margin: "9px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(255, 255, 255, 0.84)",
};

const openTextStyle: CSSProperties = {
  marginTop: 14,
  fontSize: 13,
  fontWeight: 850,
  color: "#607080",
};

const hotelCtaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 300px), 0.7fr)",
  gap: 16,
  alignItems: "center",
  padding: 20,
  borderRadius: 24,
  background: "#f7fbfc",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
};

const relatedMetaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.78)",
  fontWeight: 850,
};



