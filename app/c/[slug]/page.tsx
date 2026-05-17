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

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={eyebrowStyle}>Travel links for</div>

        <h1 style={titleStyle}>
          {city.city}, {city.country}
        </h1>

        <p style={subtitleStyle}>
          Quick hotel and tour links for the places featured in our short videos.
        </p>

        <section style={spotsStyle}>
          <div style={spotItemStyle}>
            <span style={spotNumberStyle}>1</span>
            <span>{city.stops[0]}</span>
          </div>
          <div style={spotItemStyle}>
            <span style={spotNumberStyle}>2</span>
            <span>{city.stops[1]}</span>
          </div>
          <div style={spotItemStyle}>
            <span style={spotNumberStyle}>3</span>
            <span>{city.stops[2]}</span>
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
    "linear-gradient(180deg, #f7f3ec 0%, #ffffff 46%, #eef3f7 100%)",
  color: "#171717",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 520,
  borderRadius: 28,
  padding: "28px",
  background: "rgba(255, 255, 255, 0.86)",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.12)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 13,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.6,
  marginBottom: 10,
};

const titleStyle: CSSProperties = {
  fontSize: 42,
  lineHeight: 1.05,
  margin: "0 0 12px",
  letterSpacing: "-0.04em",
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
  gap: 10,
  padding: "12px 14px",
  borderRadius: 16,
  background: "rgba(0, 0, 0, 0.04)",
  fontSize: 15,
};

const spotNumberStyle: CSSProperties = {
  width: 24,
  height: 24,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
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
  fontWeight: 700,
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
  fontWeight: 650,
  fontSize: 15,
  border: "1px solid rgba(0, 0, 0, 0.12)",
};

const noteStyle: CSSProperties = {
  margin: "22px 0 0",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.55,
};