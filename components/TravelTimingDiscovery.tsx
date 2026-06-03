"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";

type Props = {
  cities: City[];
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getCurrentMonth() {
  return months[new Date().getMonth()];
}

function getMonthReason(city: City, month: string) {
  const stops = getDisplayStops(city, 2);

  if (city.travelStyles && city.travelStyles.length > 0) {
    return `Good timing for ${city.travelStyles
      .slice(0, 2)
      .join(" and ")
      .toLowerCase()} trips.`;
  }

  if (stops.length > 0) {
    return `Start with ${stops.join(" and ")}.`;
  }

  return `Open the ${city.city} guide to see why it fits ${month}.`;
}

function getPhotoCardStyle(city: City): CSSProperties {
  const image = getCityImage(city.slug);

  return {
    ...cityCardStyle,
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0), rgba(23,32,42,.08)), url("${image.imageUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function TravelTimingDiscovery({ cities }: Props) {
  const [activeMonth, setActiveMonth] = useState(getCurrentMonth());

  const matchingCities = useMemo(() => {
    const monthly = cities.filter((city) => city.months?.includes(activeMonth));

    if (monthly.length > 0) {
      return monthly.slice(0, 9);
    }

    return cities.slice(0, 9);
  }, [cities, activeMonth]);

  return (
    <section id="travel-timing" style={sectionStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>By season</div>
          <h2 style={sectionTitleStyle}>Find places by travel timing</h2>
          <p style={sectionLeadStyle}>
            Choose a month first, then browse destinations that fit the season.
          </p>
        </div>
      </div>

      <div style={monthGridStyle}>
        {months.map((month) => {
          const isActive = month === activeMonth;

          return (
            <button
              key={month}
              type="button"
              onClick={() => setActiveMonth(month)}
              style={isActive ? activeMonthButtonStyle : monthButtonStyle}
            >
              {month}
            </button>
          );
        })}
      </div>

      <div style={resultTopStyle}>
        <div>
          <div style={smallLabelStyle}>Seasonal picks</div>
          <h3 style={miniTitleStyle}>Best places in {activeMonth}</h3>
        </div>

        <span style={countStyle}>{matchingCities.length} ideas</span>
      </div>

      <div style={cityGridStyle}>
        {matchingCities.map((city) => {
          const stops = getDisplayStops(city, 3);

          return (
            <Link
              key={`${city.slug}-${activeMonth}-season-card`}
              href={`/c/${city.slug}?src=discover&v=season_${activeMonth}_${city.slug}`}
              style={getPhotoCardStyle(city)}
            >
              <div style={badgeStyle}>{activeMonth}</div>

              <div style={textPanelStyle}>
                <div style={metaStyle}>{city.country}</div>

                <h3 style={cardTitleStyle}>{city.city}</h3>

                <p style={cardTextStyle}>{getMonthReason(city, activeMonth)}</p>

                {stops.length > 0 && (
                  <div style={chipRowStyle}>
                    {stops.map((stop, index) => (
                      <span key={`${city.slug}-${stop}-${index}`} style={chipStyle}>
                        {stop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: 34,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-end",
  marginBottom: 16,
  flexWrap: "wrap",
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#138a72",
  fontWeight: 850,
  marginBottom: 7,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 32,
  lineHeight: 1.06,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#17202a",
};

const sectionLeadStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 680,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#607080",
};

const monthGridStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 9,
  marginBottom: 24,
};

const monthButtonStyle: CSSProperties = {
  border: "1px solid rgba(23, 32, 42, 0.08)",
  borderRadius: 999,
  padding: "9px 12px",
  background: "#ffffff",
  color: "#607080",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};

const activeMonthButtonStyle: CSSProperties = {
  ...monthButtonStyle,
  background: "#e8f1ff",
  border: "1px solid rgba(23, 105, 224, 0.14)",
  color: "#1769e0",
  boxShadow: "0 8px 22px rgba(30, 64, 88, 0.08)",
};

const resultTopStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 15,
  flexWrap: "wrap",
};

const miniTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 26,
  lineHeight: 1.08,
  letterSpacing: 0,
  color: "#17202a",
};

const countStyle: CSSProperties = {
  padding: "8px 11px",
  borderRadius: 999,
  background: "#eaf8f1",
  border: "1px solid rgba(12, 122, 88, 0.14)",
  color: "#0c7a58",
  fontSize: 12,
  fontWeight: 850,
};

const cityGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cityCardStyle: CSSProperties = {
  position: "relative",
  minHeight: 410,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  textDecoration: "none",
  color: "#17202a",
  backgroundColor: "#edf8f2",
  border: "1px solid rgba(23, 32, 42, 0.1)",
  boxShadow: "0 12px 28px rgba(30, 64, 88, 0.12)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const textPanelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  padding: 18,
  borderRadius: "0 0 26px 26px",
  background: "#ffffff",
  borderTop: "1px solid rgba(23, 32, 42, 0.08)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#607080",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.12,
  letterSpacing: 0,
  color: "#17202a",
  fontWeight: 850,
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "#4c5f6f",
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 7,
  marginTop: 14,
};

const chipStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "#eaf8f1",
  color: "#0c7a58",
  border: "1px solid rgba(12, 122, 88, 0.14)",
  fontSize: 12,
  fontWeight: 800,
};
