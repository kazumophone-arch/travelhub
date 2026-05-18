import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { cities } from "@/data/cities";
import { TravelVisual } from "@/components/TravelVisual";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; spotSlug: string }>;
}): Promise<Metadata> {
  const { slug, spotSlug } = await params;
  const city = cities[slug];

  if (!city) {
    return {
      title: "Spot not found | TravelHub",
      description: "This TravelHub spot page could not be found.",
    };
  }

  const spot = city.spotDetails?.find((item) => item.slug === spotSlug);

  if (!spot) {
    return {
      title: `${city.city}, ${city.country} | TravelHub`,
      description: `Explore featured spots in ${city.city} and find hotel and tour links.`,
    };
  }

  const title = `${spot.name} in ${city.city} | TravelHub`;
  const description = spot.summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
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

  const spot = city.spotDetails?.find((item) => item.slug === spotSlug);
  if (!spot) return notFound();

  const hotelsHref = `/out/hotels?c=${encodeURIComponent(slug)}&src=${encodeURIComponent(
    src
  )}&v=${encodeURIComponent(v)}`;

  const toursHref = `/out/tours?c=${encodeURIComponent(slug)}&src=${encodeURIComponent(
    src
  )}&v=${encodeURIComponent(v)}`;

  const relatedSpots =
    city.spotDetails?.filter((item) => item.slug !== spot.slug) ?? [];

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href={`/c/${slug}?src=${src}&v=${v}`} style={backLinkStyle}>
          ← Back to {city.city}
        </Link>

        <section style={heroCardStyle}>
          <TravelVisual
            imageUrl={spot.imageUrl ?? city.imageUrl}
            imageAlt={spot.imageAlt ?? city.imageAlt ?? spot.name}
            imageCredit={spot.imageCredit ?? city.imageCredit}
            fallback="linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)"
            style={visualStyle}
          >
            <div style={visualBadgeStyle}>{city.city}</div>
          </TravelVisual>

          <div style={contentStyle}>
            <div style={eyebrowStyle}>
              {city.city}, {city.country}
            </div>

            <h1 style={titleStyle}>{spot.name}</h1>

            <p style={summaryStyle}>{spot.summary}</p>

            <section style={metaGridStyle}>
              <div style={metaCardStyle}>
                <div style={metaLabelStyle}>Best time</div>
                <div style={metaValueStyle}>{spot.bestTime ?? "Anytime"}</div>
              </div>

              <div style={metaCardStyle}>
                <div style={metaLabelStyle}>Best for</div>
                <div style={metaValueStyle}>{spot.bestFor.join(" · ")}</div>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Highlights</h2>

              <div style={chipWrapStyle}>
                {spot.highlights.map((highlight, index) => (
                  <span key={`${highlight}-${index}`} style={chipStyle}>
                    {highlight}
                  </span>
                ))}
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Tags</h2>

              <div style={chipWrapStyle}>
                {(spot.tags ?? []).map((tag, index) => (
                  <span key={`${tag}-${index}`} style={softChipStyle}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section style={buttonGroupStyle}>
              <a href={hotelsHref} style={primaryButtonStyle}>
                Find hotels in {city.city}
              </a>

              {city.affToursUrl && (
                <a href={toursHref} style={secondaryButtonStyle}>
                  Book tours & activities
                </a>
              )}
            </section>
          </div>
        </section>

        {relatedSpots.length > 0 && (
          <section style={relatedStyle}>
            <div style={relatedHeaderStyle}>
              <div>
                <div style={smallLabelStyle}>More in {city.city}</div>
                <h2 style={relatedTitleStyle}>Related spots</h2>
              </div>
            </div>

            <div style={relatedGridStyle}>
              {relatedSpots.map((item) => (
                <Link
                  key={item.slug}
                  href={`/c/${slug}/spot/${item.slug}?src=${src}&v=${v}`}
                  style={relatedCardStyle}
                >
                  <div style={relatedCardTitleStyle}>{item.name}</div>

                  <div style={relatedCardTextStyle}>
                    {item.bestFor.join(" · ")}
                  </div>

                  <div style={relatedArrowStyle}>→</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p style={disclosureStyle}>
          Some links may be affiliate links. Original 3D characters •
          AI-assisted visuals.
        </p>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "22px 16px 48px",
};

const backLinkStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 18,
  color: "inherit",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 700,
  opacity: 0.72,
};

const heroCardStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: 18,
  borderRadius: 34,
  padding: 12,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 28px 90px rgba(0, 0, 0, 0.12)",
};

const visualStyle: CSSProperties = {
  minHeight: "clamp(260px, 70vw, 520px)",
  borderRadius: 26,
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 2,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(14px)",
  fontSize: 12,
  fontWeight: 800,
};

const contentStyle: CSSProperties = {
  padding: "18px 14px 18px",
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.56,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: "clamp(38px, 11vw, 70px)",
  lineHeight: 1.02,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const summaryStyle: CSSProperties = {
  margin: "0 0 22px",
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.74,
};

const metaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
  gap: 10,
  marginBottom: 22,
};

const metaCardStyle: CSSProperties = {
  padding: 14,
  borderRadius: 18,
  background: "rgba(0, 0, 0, 0.04)",
};

const metaLabelStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.55,
  marginBottom: 6,
  fontWeight: 700,
};

const metaValueStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 750,
  lineHeight: 1.35,
};

const sectionStyle: CSSProperties = {
  marginBottom: 20,
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 15,
  letterSpacing: "-0.02em",
};

const chipWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chipStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "#171717",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 750,
};

const softChipStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  color: "#171717",
  fontSize: 12,
  fontWeight: 750,
};

const buttonGroupStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 8,
};

const primaryButtonStyle: CSSProperties = {
  display: "block",
  padding: "16px 18px",
  borderRadius: 18,
  background: "#171717",
  color: "#ffffff",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 16,
  boxShadow: "0 16px 38px rgba(0, 0, 0, 0.16)",
};

const secondaryButtonStyle: CSSProperties = {
  display: "block",
  padding: "15px 18px",
  borderRadius: 18,
  background: "#ffffff",
  color: "#171717",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: 750,
  fontSize: 15,
  border: "1px solid rgba(0, 0, 0, 0.12)",
};

const relatedStyle: CSSProperties = {
  marginTop: 34,
};

const relatedHeaderStyle: CSSProperties = {
  marginBottom: 14,
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const relatedTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 30px)",
  letterSpacing: "-0.04em",
};

const relatedGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 12,
};

const relatedCardStyle: CSSProperties = {
  display: "block",
  position: "relative",
  padding: 18,
  minHeight: 120,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
};

const relatedCardTitleStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 850,
  letterSpacing: "-0.04em",
  marginBottom: 8,
};

const relatedCardTextStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.65,
  fontWeight: 650,
};

const relatedArrowStyle: CSSProperties = {
  position: "absolute",
  right: 16,
  bottom: 16,
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontWeight: 800,
};

const disclosureStyle: CSSProperties = {
  margin: "34px auto 0",
  maxWidth: 560,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};
