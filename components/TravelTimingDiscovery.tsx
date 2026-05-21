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
    backgroundImage: `linear-gradient(180deg, rgba(10, 18, 24, 0.04) 0%, rgba(10, 18, 24, 0.28) 45%, rgba(10, 18, 24, 0.76) 100%), url("${image.imageUrl}")`,
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
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#9a6a2f",
  fontWeight: 850,
  marginBottom: 7,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(26px, 5.8vw, 36px)",
  lineHeight: 1.06,
  letterSpacing: "-0.05em",
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
  background: "#f7efe2",
  border: "1px solid rgba(168, 116, 50, 0.18)",
  color: "#9a6a2f",
  boxShadow: "0 8px 22px rgba(96, 76, 48, 0.08)",
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
  fontSize: "clamp(22px, 5vw, 28px)",
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  color: "#17202a",
};

const countStyle: CSSProperties = {
  padding: "8px 11px",
  borderRadius: 999,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  color: "#9a6a2f",
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
  minHeight: 370,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  textDecoration: "none",
  color: "#ffffff",
  backgroundColor: "#17202a",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 14px 36px rgba(30, 64, 88, 0.16)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const textPanelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12, 22, 30, 0.54)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.76)",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(23px, 5.8vw, 28px)",
  lineHeight: 1.04,
  letterSpacing: "-0.045em",
  color: "#ffffff",
  fontWeight: 850,
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255, 255, 255, 0.84)",
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
  background: "rgba(255, 255, 255, 0.16)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  fontSize: 12,
  fontWeight: 800,
};
