"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";

type Props = {
  cities: City[];
};

const monthNames = [
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
  return monthNames[new Date().getMonth()];
}

function visualForCity(slug: string) {
  const visuals: Record<string, string> = {
    "rome-it":
      "linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)",
    "venice-it":
      "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "florence-it":
      "linear-gradient(135deg, #d7a65f 0%, #b65f4a 48%, #2e2a32 100%)",
    "prague-cz":
      "linear-gradient(135deg, #d7b06f 0%, #6f8da8 46%, #2e3543 100%)",
    "dubrovnik-hr":
      "linear-gradient(135deg, #d58b5a 0%, #2f8da8 48%, #183747 100%)",
    "vienna-at":
      "linear-gradient(135deg, #e1c8a4 0%, #b98e65 48%, #42352f 100%)",
    "edinburgh-uk":
      "linear-gradient(135deg, #8e99a8 0%, #5c6675 46%, #252a33 100%)",
    "paris-fr":
      "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "barcelona-es":
      "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
    "kyoto-jp":
      "linear-gradient(135deg, #c6a96b 0%, #8da36f 48%, #2f3a2f 100%)",
    "amsterdam-nl":
      "linear-gradient(135deg, #8eb6c7 0%, #d9a35f 45%, #38465a 100%)",
  };

  return (
    visuals[slug] ??
    "linear-gradient(135deg, #e5c7a5 0%, #9fb8c9 48%, #30394a 100%)"
  );
}


function getDisplayStops(city: City) {
  return city.stops
    .filter((spot) => {
      const normalized = spot.trim().toLowerCase();

      return (
        normalized !== "" &&
        normalized !== "none" &&
        normalized !== "n/a" &&
        normalized !== "null" &&
        normalized !== "-"
      );
    })
    .slice(0, 3);
}
function getMonthReason(city: City, month: string) {
  if (city.months?.includes(month)) {
    return `${month} is a strong timing window for ${city.city}.`;
  }

  if (city.seasons?.includes("Spring")) {
    return "Works well for spring-style city walks and scenic travel.";
  }

  if (city.seasons?.includes("Summer")) {
    return "Works well for bright outdoor travel and longer daylight.";
  }

  if (city.seasons?.includes("Autumn")) {
    return "Works well for mild weather, old streets, and atmospheric views.";
  }

  if (city.seasons?.includes("Winter")) {
    return "Works well for colder-season atmosphere and slower city travel.";
  }

  const displayStops = getDisplayStops(city);

  return displayStops.length > 0
    ? `Start with ${displayStops.join(" · ")}.`
    : `Open the ${city.city} guide to see the main travel ideas.`;
}

export function TravelTimingDiscovery({ cities }: Props) {
  const [activeMonth, setActiveMonth] = useState(getCurrentMonth());

  const matchingCities = useMemo(() => {
    const exact = cities.filter((city) => city.months?.includes(activeMonth));

    if (exact.length > 0) return exact;

    return cities.slice(0, 8);
  }, [cities, activeMonth]);

  return (
    <section id="travel-timing" style={wrapStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>By season</div>
          <h2 style={sectionTitleStyle}>Browse by travel timing</h2>
        </div>

        <span style={mutedTextStyle}>{activeMonth}</span>
      </div>

      <p style={leadStyle}>
        Use this when you know roughly when you want to travel, but not the city
        yet.
      </p>

      <div style={monthGridStyle}>
        {monthNames.map((month) => {
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

      <div style={destinationGridStyle}>
        {matchingCities.map((city, index) => (
          <Link
            key={`${city.slug}-${activeMonth}-${index}`}
            href={`/c/${city.slug}?src=discover&v=seasonal_${activeMonth}_${city.slug}`}
            style={destinationCardStyle}
          >
            <div
              style={{
                ...destinationVisualStyle,
                background: visualForCity(city.slug),
              }}
            >
              <div style={monthBadgeStyle}>{activeMonth}</div>
            </div>

            <div style={destinationBodyStyle}>
              <h3 style={destinationTitleStyle}>{city.city}</h3>
              <p style={destinationCountryStyle}>{city.country}</p>
              <p style={destinationReasonStyle}>
                {getMonthReason(city, activeMonth)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginTop: 42,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-end",
  marginBottom: 10,
  flexWrap: "wrap",
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
  fontSize: "clamp(26px, 6vw, 36px)",
  lineHeight: 1.04,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const mutedTextStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const leadStyle: CSSProperties = {
  margin: "0 0 16px",
  maxWidth: 680,
  fontSize: 14,
  lineHeight: 1.7,
  opacity: 0.68,
};

const monthGridStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
  marginBottom: 16,
};

const monthButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: "rgba(255, 255, 255, 0.74)",
  color: "#171717",
  borderRadius: 999,
  padding: "10px 13px",
  fontSize: 13,
  fontWeight: 700,
  whiteSpace: "nowrap",
  cursor: "pointer",
  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.04)",
};

const activeMonthButtonStyle: CSSProperties = {
  ...monthButtonStyle,
  background: "#171717",
  color: "#ffffff",
  border: "1px solid #171717",
};

const destinationGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: 16,
};

const destinationCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const destinationVisualStyle: CSSProperties = {
  height: "clamp(130px, 38vw, 160px)",
  position: "relative",
};

const monthBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 800,
};

const destinationBodyStyle: CSSProperties = {
  padding: 18,
};

const destinationTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 6vw, 25px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  fontWeight: 850,
};

const destinationCountryStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const destinationReasonStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.7,
  fontWeight: 650,
};




