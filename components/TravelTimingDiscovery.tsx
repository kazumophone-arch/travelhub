"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

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
  const imageUrl = getOptionalHttpUrl(city.imageUrl) || image.imageUrl;

  return {
    ...cityCardStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(180deg, rgba(31, 26, 23, 0.04) 0%, rgba(31, 26, 23, 0.20) 48%, rgba(31, 26, 23, 0.78) 100%)",
      "linear-gradient(135deg, #eadbc8 0%, #b8936e 52%, #0D2B52 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(city.imagePosition),
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

                <div style={openTextStyle}>Open destination guide</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: 46,
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
  color: "#BF9B30",
  fontWeight: 850,
  marginBottom: 7,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 34,
  lineHeight: 1.06,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#0D2B52",
};

const sectionLeadStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 680,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#6B87A8",
};

const monthGridStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 9,
  marginBottom: 24,
};

const monthButtonStyle: CSSProperties = {
  border: "1px solid #D8E2F0",
  borderRadius: 999,
  padding: "9px 12px",
  background: "#FFFFFF",
  color: "#6B87A8",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};

const activeMonthButtonStyle: CSSProperties = {
  ...monthButtonStyle,
  background: "#0D2B52",
  border: "1px solid #0D2B52",
  color: "#FFFFFF",
  boxShadow: "0 10px 24px rgba(70, 53, 38, 0.14)",
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
  color: "#0D2B52",
};

const countStyle: CSSProperties = {
  padding: "8px 11px",
  borderRadius: 999,
  background: "#F0F4FA",
  border: "1px solid #D8E2F0",
  color: "#BF9B30",
  fontSize: 12,
  fontWeight: 850,
};

const cityGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
  gap: 18,
};

const cityCardStyle: CSSProperties = {
  position: "relative",
  minHeight: 470,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 8,
  overflow: "hidden",
  textDecoration: "none",
  color: "#FFFFFF",
  backgroundColor: "#0D2B52",
  border: "1px solid #D8E2F0",
  boxShadow: "0 18px 42px rgba(70, 53, 38, 0.14)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 253, 248, 0.88)",
  border: "1px solid rgba(255, 253, 248, 0.34)",
  color: "#0D2B52",
  fontSize: 12,
  fontWeight: 850,
};

const textPanelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  padding: 20,
  borderRadius: 0,
  background: "rgba(42, 33, 28, 0.78)",
  borderTop: "1px solid rgba(255, 248, 239, 0.18)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "rgba(255, 248, 239, 0.70)",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 27,
  lineHeight: 1.08,
  letterSpacing: 0,
  color: "#FFFFFF",
  fontWeight: 850,
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255, 248, 239, 0.78)",
};

const openTextStyle: CSSProperties = {
  marginTop: 15,
  fontSize: 13,
  fontWeight: 850,
  color: "#F0F4FA",
};
