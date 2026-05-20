"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";

type Props = {
  cities: City[];
};

const feelingFilters = [
  "All",
  "Scenic",
  "Old Town",
  "Culture",
  "Food",
  "Nature",
  "Couples",
  "Family",
  "Solo",
];

function getCityCategories(city: City) {
  const categories = new Set<string>();

  city.travelStyles?.forEach((style) => categories.add(style));
  city.themes?.forEach((theme) => categories.add(theme));
  city.categories?.forEach((category) => categories.add(category));

  const text = [
    city.city,
    city.country,
    city.description ?? "",
    ...city.stops,
    ...(city.travelStyles ?? []),
    ...(city.themes ?? []),
    ...(city.categories ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const includesAny = (words: string[]) =>
    words.some((word) => text.includes(word.toLowerCase()));

  if (
    includesAny([
      "view",
      "sunset",
      "scenic",
      "canal",
      "river",
      "lagoon",
      "beach",
      "panorama",
    ])
  ) {
    categories.add("Scenic");
  }

  if (
    includesAny([
      "old town",
      "historic",
      "center",
      "castle",
      "bridge",
      "square",
      "temple",
    ])
  ) {
    categories.add("Old Town");
    categories.add("Culture");
  }

  if (
    includesAny([
      "museum",
      "palace",
      "cathedral",
      "church",
      "heritage",
      "ruins",
      "monument",
      "architecture",
    ])
  ) {
    categories.add("Culture");
  }

  if (
    includesAny([
      "food",
      "restaurant",
      "market",
      "cafe",
      "wine",
      "gourmet",
    ])
  ) {
    categories.add("Food");
  }

  if (
    includesAny([
      "garden",
      "park",
      "forest",
      "bamboo",
      "mountain",
      "nature",
      "trail",
    ])
  ) {
    categories.add("Nature");
  }

  return Array.from(categories);
}

function getCityReason(city: City, activeFeeling: string) {
  if (activeFeeling !== "All") {
    return `A good match for ${activeFeeling.toLowerCase()}-focused travel.`;
  }

  const categories = getCityCategories(city);

  if (categories.includes("Scenic")) return "Good for scenic atmosphere and visual travel.";
  if (categories.includes("Old Town")) return "Good for old streets and walkable routes.";
  if (categories.includes("Culture")) return "Good for history, architecture, and landmarks.";
  if (categories.includes("Nature")) return "Good for slower travel and outdoor scenery.";

  return `Start with ${city.stops.slice(0, 2).join(" and ")}.`;
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

export function TravelDiscoveryTools({ cities }: Props) {
  const [activeFeeling, setActiveFeeling] = useState("All");

  const filteredCities = useMemo(() => {
    if (activeFeeling === "All") return cities.slice(0, 8);

    return cities
      .filter((city) => getCityCategories(city).includes(activeFeeling))
      .slice(0, 8);
  }, [cities, activeFeeling]);

  return (
    <section style={wrapStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>By feeling</div>
          <h2 style={sectionTitleStyle}>Choose the kind of trip you want.</h2>
        </div>

        <span style={mutedTextStyle}>{activeFeeling}</span>
      </div>

      <p style={leadStyle}>
        Use this when you know the mood of the trip, but not the destination
        yet.
      </p>

      <div style={filterWrapStyle}>
        {feelingFilters.map((filter) => {
          const isActive = filter === activeFeeling;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFeeling(filter)}
              style={isActive ? activeFilterButtonStyle : filterButtonStyle}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {filteredCities.length === 0 ? (
        <div style={emptyStyle}>
          No destinations found for this feeling yet. Try All or another mood.
        </div>
      ) : (
        <div style={gridStyle}>
          {filteredCities.map((city, index) => (
            <Link
              key={`${city.slug}-discover-${activeFeeling}-${index}`}
              href={`/c/${city.slug}?src=discover&v=feeling_${activeFeeling}_${city.slug}`}
              style={cardStyle}
            >
              <div
                style={{
                  ...visualStyle,
                  background: visualForCity(city.slug),
                }}
              >
                <div style={badgeStyle}>{city.country}</div>
              </div>

              <div style={bodyStyle}>
                <h3 style={cardTitleStyle}>{city.city}</h3>
                <p style={countryStyle}>{city.country}</p>

                <p style={reasonStyle}>{getCityReason(city, activeFeeling)}</p>

                <div style={chipWrapStyle}>
                  {getCityCategories(city)
                    .filter((category) => feelingFilters.includes(category))
                    .slice(0, 3)
                    .map((category) => (
                      <span key={category} style={chipStyle}>
                        {category}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginTop: 10,
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
  maxWidth: 720,
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

const filterWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
  marginBottom: 16,
};

const filterButtonStyle: CSSProperties = {
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

const activeFilterButtonStyle: CSSProperties = {
  ...filterButtonStyle,
  background: "#171717",
  color: "#ffffff",
  border: "1px solid #171717",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const visualStyle: CSSProperties = {
  height: "clamp(130px, 38vw, 160px)",
  position: "relative",
};

const badgeStyle: CSSProperties = {
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

const bodyStyle: CSSProperties = {
  padding: 18,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 6vw, 25px)",
  lineHeight: 1.05,
  letterSpacing: "-0.035em",
  fontWeight: 850,
};

const countryStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const reasonStyle: CSSProperties = {
  margin: "12px 0 14px",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.7,
  fontWeight: 650,
};

const chipWrapStyle: CSSProperties = {
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
};

const chipStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  fontWeight: 750,
};

const emptyStyle: CSSProperties = {
  padding: "24px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  textAlign: "center",
  opacity: 0.72,
};
