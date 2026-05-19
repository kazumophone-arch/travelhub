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

function getMonthReason(city: City, month: string) {
  if (city.months?.includes(month)) {
    return `${month} is listed as a strong timing window for ${city.city}.`;
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

  return `Start with ${city.stops.slice(0, 3).join(" · ")}.`;
}

export function SeasonalDirectory({ cities }: Props) {
  const [activeMonth, setActiveMonth] = useState(getCurrentMonth());

  const matchingCities = useMemo(() => {
    const exact = cities.filter((city) => city.months?.includes(activeMonth));

    if (exact.length > 0) return exact;

    return cities.slice(0, 8);
  }, [cities, activeMonth]);

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <section style={heroStyle}>
          <Link href="/" style={homeLinkStyle}>
            ← Home
          </Link>

          <div style={eyebrowStyle}>Seasonal travel</div>

          <h1 style={titleStyle}>Browse by month.</h1>

          <p style={subtitleStyle}>
            Choose a month and find destinations that fit seasonal travel,
            weather, atmosphere, and trip timing.
          </p>
        </section>

        <section style={monthSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Months</div>
              <h2 style={sectionTitleStyle}>Choose travel timing</h2>
            </div>

            <span style={mutedTextStyle}>{activeMonth}</span>
          </div>

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
        </section>

        <section style={contentStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Seasonal picks</div>
              <h2 style={sectionTitleStyle}>Best places in {activeMonth}</h2>
            </div>

            <span style={mutedTextStyle}>
              {matchingCities.length} destinations
            </span>
          </div>

          <div style={destinationGridStyle}>
            {matchingCities.map((city, index) => (
              <Link
                key={`${city.slug}-${activeMonth}-${index}`}
                href={`/c/${city.slug}?src=seasonal&v=seasonal_${activeMonth}_${city.slug}`}
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
                  <div style={destinationTopStyle}>
                    <div style={destinationTextStyle}>
                      <h3 style={destinationTitleStyle}>{city.city}</h3>
                      <p style={destinationCountryStyle}>{city.country}</p>
                    </div>

                    <div style={arrowStyle}>→</div>
                  </div>

                  <p style={destinationReasonStyle}>
                    {getMonthReason(city, activeMonth)}
                  </p>

                  <div style={spotsStyle}>
                    <span>{city.stops[0]}</span>
                    <span>{city.stops[1]}</span>
                    <span>{city.stops[2]}</span>
                  </div>

                  <div style={actionRowStyle}>
                    {(city.months ?? []).slice(0, 3).map((month) => (
                      <span key={month} style={secondaryMiniStyle}>
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
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
  maxWidth: 1120,
  margin: "0 auto",
  padding: "34px 16px 48px",
};

const heroStyle: CSSProperties = {
  marginBottom: 34,
};

const homeLinkStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 22,
  color: "inherit",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 800,
  opacity: 0.72,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: "clamp(42px, 11vw, 78px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 640,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};

const monthSectionStyle: CSSProperties = {
  marginBottom: 34,
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
  opacity: 0.5,
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 6vw, 30px)",
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const mutedTextStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const monthGridStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
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

const contentStyle: CSSProperties = {
  marginTop: 10,
};

const destinationGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
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
  height: "clamp(140px, 40vw, 170px)",
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

const destinationTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  marginBottom: 14,
};

const destinationTextStyle: CSSProperties = {
  minWidth: 0,
};

const destinationTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 6vw, 25px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  overflowWrap: "break-word",
};

const destinationCountryStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const destinationReasonStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 13,
  lineHeight: 1.45,
  opacity: 0.7,
  fontWeight: 650,
};

const arrowStyle: CSSProperties = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontWeight: 800,
  flexShrink: 0,
};

const spotsStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 14,
  lineHeight: 1.35,
  opacity: 0.74,
  marginBottom: 16,
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const secondaryMiniStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  color: "#171717",
  fontSize: 12,
  fontWeight: 750,
};
