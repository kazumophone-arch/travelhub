import Link from "next/link";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";

type Props = {
  city: City;
  src?: string;
  v?: string;
};

export function AffiliateButtonGroup({ city, src = "site", v = "default" }: Props) {
  const encodedCity = encodeURIComponent(city.slug);
  const encodedSrc = encodeURIComponent(src);
  const encodedV = encodeURIComponent(v);

  const hotelsHref = `/out/hotels?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}`;
  const toursHref = `/out/tours?c=${encodedCity}&src=${encodedSrc}&v=${encodedV}`;

  return (
    <div style={wrapStyle}>
      <Link href={hotelsHref} style={primaryCardStyle}>
        <div style={cardTopStyle}>
          <span style={labelStyle}>Hotels</span>
          <span style={arrowStyle}>→</span>
        </div>

        <div style={titleStyle}>Find stays in {city.city}</div>

        <p style={textStyle}>
          Compare hotel options after choosing the area that fits your route.
        </p>
      </Link>

      <Link href={toursHref} style={secondaryCardStyle}>
        <div style={cardTopStyle}>
          <span style={labelStyle}>Tours</span>
          <span style={arrowStyle}>→</span>
        </div>

        <div style={titleStyle}>View {city.city} tours</div>

        <p style={textStyle}>
          Use a guided route when you want the planning handled for you.
        </p>
      </Link>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const primaryCardStyle: CSSProperties = {
  display: "block",
  padding: 15,
  borderRadius: 22,
  background: "#171717",
  color: "#ffffff",
  textDecoration: "none",
  boxShadow: "0 18px 46px rgba(0, 0, 0, 0.16)",
};

const secondaryCardStyle: CSSProperties = {
  display: "block",
  padding: 15,
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.88)",
  color: "#171717",
  textDecoration: "none",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 14px 34px rgba(0, 0, 0, 0.08)",
};

const cardTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 10,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 850,
  opacity: 0.62,
};

const arrowStyle: CSSProperties = {
  width: 26,
  height: 26,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.18)",
  fontSize: 14,
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  fontSize: 18,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.68,
};
