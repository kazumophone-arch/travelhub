import Link from "next/link";
import { cities } from "@/data/cities";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

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

  const hotelsHref = `/out/hotels?c=${encodeURIComponent(slug)}&src=${encodeURIComponent(
    src
  )}&v=${encodeURIComponent(v)}`;

  const toursHref = `/out/tours?c=${encodeURIComponent(slug)}&src=${encodeURIComponent(
    src
  )}&v=${encodeURIComponent(v)}`;

  const spotCards =
    city.spotDetails && city.spotDetails.length > 0
      ? city.spotDetails
      : city.stops.map((stop) => ({
          slug: stop.toLowerCase().replaceAll(" ", "-"),
          name: stop,
          summary: "A featured place from this city.",
          highlights: [],
          bestFor: [],
        }));

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={eyebrowStyle}>Travel links for</div>

        <h1 style={titleStyle}>
          {city.city}, {city.country}
        </h1>

        <p style={subtitleStyle}>
          Explore featured spots, then jump straight to hotel and tour options.
        </p>

        <section style={spotsStyle}>
          {spotCards.map((spot, index) => {
            const canOpenSpot =
              city.spotDetails?.some((item) => item.slug === spot.slug) ?? false;

            if (!canOpenSpot) {
              return (
                <div key={spot.slug} style={spotItemStyle}>
                  <span style={spotNumberStyle}>{index + 1}</span>

                  <div>
                    <div style={spotNameStyle}>{spot.name}</div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={spot.slug}
                href={`/c/${slug}/spot/${spot.slug}?src=${encodeURIComponent(
                  src
                )}&v=${encodeURIComponent(v)}`}
                style={spotLinkStyle}
              >
                <span style={spotNumberStyle}>{index + 1}</span>

                <div style={spotTextStyle}>
                  <div style={spotNameStyle}>{spot.name}</div>
                  <div style={spotSummaryStyle}>{spot.summary}</div>
                </div>

                <span style={spotArrowStyle}>→</span>
              </Link>
            );
          })}
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

        <p style={noteStyle}>
          Some links may be affiliate links. Original 3D characters • AI-assisted visuals.
        </p>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 620,
  borderRadius: 32,
  padding: "28px",
  background: "rgba(255, 255, 255, 0.86)",
  boxShadow: "0 28px 90px rgba(0, 0, 0, 0.12)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
};

const homeLinkStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 18,
  color: "inherit",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 800,
  opacity: 0.68,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.6,
  marginBottom: 10,
};

const titleStyle: CSSProperties = {
  fontSize: "clamp(38px, 11vw, 58px)",
  lineHeight: 1.04,
  margin: "0 0 12px",
  letterSpacing: "-0.045em",
};

const subtitleStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: 1.6,
  opacity: 0.72,
  margin: "0 0 24px",
};

const spotsStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  marginBottom: 24,
};

const spotItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px",
  borderRadius: 20,
  background: "rgba(0, 0, 0, 0.04)",
  fontSize: 15,
};

const spotLinkStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px",
  borderRadius: 20,
  background: "rgba(0, 0, 0, 0.04)",
  fontSize: 15,
  color: "inherit",
  textDecoration: "none",
};

const spotNumberStyle: CSSProperties = {
  width: 26,
  height: 26,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 800,
  flexShrink: 0,
};

const spotTextStyle: CSSProperties = {
  minWidth: 0,
};

const spotNameStyle: CSSProperties = {
  fontWeight: 800,
  letterSpacing: "-0.02em",
};

const spotSummaryStyle: CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  lineHeight: 1.45,
  opacity: 0.62,
};

const spotArrowStyle: CSSProperties = {
  marginLeft: "auto",
  fontWeight: 800,
  opacity: 0.6,
  flexShrink: 0,
};

const buttonGroupStyle: CSSProperties = {
  display: "grid",
  gap: 12,
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

const noteStyle: CSSProperties = {
  margin: "22px 0 0",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.55,
};