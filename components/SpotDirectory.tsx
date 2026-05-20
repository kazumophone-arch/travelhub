"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { spotsCopyVariants, pickDailyVariant } from "@/lib/copyVariants";

type Props = {
  cities: City[];
};

type SpotItem = {
  citySlug: string;
  cityName: string;
  country: string;
  slug: string;
  name: string;
  summary: string;
  highlights: string[];
  tags: string[];
  canOpen: boolean;
};

const spotTypeFilters = [
  "All",
  "Scenic",
  "Old Town",
  "Culture",
  "Water",
  "Nature",
  "Viewpoint",
];

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replaceAll("&", "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "spot"
  );
}

function visualForIndex(index: number) {
  const visuals = [
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 44%, #3b2f2f 100%)",
    "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
  ];

  return visuals[index % visuals.length];
}

function collectSpots(cities: City[]) {
  const spots: SpotItem[] = [];

  cities.forEach((city) => {
    if (city.spotDetails && city.spotDetails.length > 0) {
      city.spotDetails.forEach((spot) => {
        if (spot.isPublished === false) return;

        spots.push({
          citySlug: city.slug,
          cityName: city.city,
          country: city.country,
          slug: spot.slug,
          name: spot.name,
          summary: spot.summary,
          highlights: spot.highlights,
          tags: spot.tags ?? [],
          canOpen: true,
        });
      });

      return;
    }

    city.stops.forEach((stop, index) => {
      spots.push({
        citySlug: city.slug,
        cityName: city.city,
        country: city.country,
        slug: slugify(stop),
        name: stop,
        summary: `A featured place from ${city.city}.`,
        highlights: [index === 0 ? "Featured spot" : "Travel spot"],
        tags: [index === 0 ? "Featured" : "Travel spot"],
        canOpen: false,
      });
    });
  });

  return spots;
}

function getSpotCategories(spot: SpotItem) {
  const categories = new Set<string>();
  const text = [
    spot.name,
    spot.summary,
    ...spot.highlights,
    ...spot.tags,
    spot.cityName,
    spot.country,
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
      "panorama",
      "lookout",
      "overlook",
      "skyline",
    ])
  ) {
    categories.add("Scenic");
    categories.add("Viewpoint");
  }

  if (
    includesAny([
      "old town",
      "historic",
      "center",
      "castle",
      "square",
      "bridge",
      "gate",
    ])
  ) {
    categories.add("Old Town");
    categories.add("Culture");
  }

  if (
    includesAny([
      "temple",
      "shrine",
      "church",
      "cathedral",
      "museum",
      "palace",
      "ruins",
      "heritage",
      "monument",
    ])
  ) {
    categories.add("Culture");
  }

  if (
    includesAny([
      "canal",
      "river",
      "beach",
      "lagoon",
      "lake",
      "harbor",
      "water",
      "fountain",
    ])
  ) {
    categories.add("Water");
    categories.add("Scenic");
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
    categories.add("Scenic");
  }

  if (categories.size === 0) {
    categories.add("Culture");
  }

  return Array.from(categories);
}

export function SpotDirectory({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [pageCopy, setPageCopy] = useState(spotsCopyVariants[0]);
  const [activeSpotType, setActiveSpotType] = useState("All");
  const [activeCitySlug, setActiveCitySlug] = useState("all");

  useEffect(() => {
    setPageCopy(pickDailyVariant(spotsCopyVariants, "spots"));
  }, []);

  const allSpots = useMemo(() => collectSpots(cities), [cities]);

  const cityOptions = useMemo(() => {
    return [
      { slug: "all", label: "All cities" },
      ...cities.map((city) => ({
        slug: city.slug,
        label: `${city.city}, ${city.country}`,
      })),
    ];
  }, [cities]);

  const filteredSpots = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allSpots.filter((spot) => {
      const spotCategories = getSpotCategories(spot);

      const matchesCity =
        activeCitySlug === "all" || spot.citySlug === activeCitySlug;

      const matchesType =
        activeSpotType === "All" || spotCategories.includes(activeSpotType);

      const searchableText = [
        spot.name,
        spot.summary,
        ...spot.highlights,
        ...spot.tags,
        ...spotCategories,
        spot.cityName,
        spot.country,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedQuery === "" || searchableText.includes(normalizedQuery);

      return matchesCity && matchesType && matchesSearch;
    });
  }, [allSpots, query, activeCitySlug, activeSpotType]);

  function resetFilters() {
    setQuery("");
    setActiveSpotType("All");
    setActiveCitySlug("all");
  }

  const activeCityLabel =
    cityOptions.find((city) => city.slug === activeCitySlug)?.label ?? "All cities";

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <section style={heroStyle}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Spots" },
            ]}
          />

          <div style={eyebrowStyle}>{pageCopy.eyebrow}</div>

          <h1 style={titleStyle}>Explore by place.</h1>

          <p style={subtitleStyle}>
            Start from a specific place, visual mood, or city. Use broad spot
            types first, then narrow by city if needed.
          </p>

          <div style={searchBoxStyle}>
            <span style={searchIconStyle}>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Trevi, Canal, Castle, Beach, Sunset..."
              style={searchInputStyle}
            />
          </div>
        </section>

        <section style={filterPanelStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Spot filters</div>
              <h2 style={sectionTitleStyle}>Start broad, then narrow</h2>
            </div>

            <button type="button" onClick={resetFilters} style={resetButtonStyle}>
              Clear all
            </button>
          </div>

          <div style={filterGridStyle}>
            <div style={filterGroupStyle}>
              <div style={filterGroupTopStyle}>
                <span style={filterGroupLabelStyle}>Spot type</span>
                <span style={filterGroupValueStyle}>{activeSpotType}</span>
              </div>

              <div style={filterWrapStyle}>
                {spotTypeFilters.map((filter) => {
                  const isActive = filter === activeSpotType;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveSpotType(filter)}
                      style={
                        isActive ? activeFilterButtonStyle : filterButtonStyle
                      }
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={filterGroupStyle}>
              <div style={filterGroupTopStyle}>
                <span style={filterGroupLabelStyle}>City</span>
                <span style={filterGroupValueStyle}>{activeCityLabel}</span>
              </div>

              <select
                value={activeCitySlug}
                onChange={(event) => setActiveCitySlug(event.target.value)}
                style={selectStyle}
              >
                {cityOptions.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={activeSummaryStyle}>
            <span style={activeSummaryLabelStyle}>Active filters</span>

            <span style={activeSummaryTextStyle}>
              {[
                query.trim() ? `Search: ${query.trim()}` : null,
                activeSpotType !== "All" ? activeSpotType : null,
                activeCitySlug !== "all" ? activeCityLabel : null,
              ]
                .filter(Boolean)
                .join(" · ") || "None"}
            </span>
          </div>
        </section>

        <section style={contentStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Results</div>
              <h2 style={sectionTitleStyle}>Choose a place</h2>
            </div>

            <span style={mutedTextStyle}>
              {filteredSpots.length} / {allSpots.length} spots
            </span>
          </div>

          {filteredSpots.length === 0 ? (
            <div style={emptyStyle}>
              No spots found. Try a broader keyword, another spot type, or clear
              the filters.
            </div>
          ) : (
            <div style={spotGridStyle}>
              {filteredSpots.map((spot, index) => {
                const href = spot.canOpen
                  ? `/c/${spot.citySlug}/spot/${spot.slug}?src=spots&v=spots_${spot.citySlug}_${spot.slug}`
                  : `/c/${spot.citySlug}?src=spots&v=spots_${spot.citySlug}`;

                const categories = getSpotCategories(spot);

                return (
                  <Link
                    key={`${spot.citySlug}-${spot.slug}-${index}`}
                    href={href}
                    style={spotCardStyle}
                  >
                    <div
                      style={{
                        ...spotVisualStyle,
                        background: visualForIndex(index),
                      }}
                    >
                      <div style={visualBadgeStyle}>{spot.cityName}</div>
                    </div>

                    <div style={spotBodyStyle}>
                      <div style={spotMetaStyle}>
                        {spot.cityName}, {spot.country}
                      </div>

                      <h3 style={spotTitleStyle}>{spot.name}</h3>

                      <p style={spotTextStyle}>{spot.summary}</p>

                      <div style={chipRowStyle}>
                        {categories.slice(0, 3).map((tag) => (
                          <span key={tag} style={chipStyle}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div style={openTextStyle}>
                        {spot.canOpen ? "Open spot guide" : "Open city guide"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
  marginBottom: 28,
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
  margin: "0 0 24px",
  maxWidth: 640,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};

const searchBoxStyle: CSSProperties = {
  maxWidth: 590,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 8px 7px 16px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.88)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 22px 60px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(18px)",
};

const searchIconStyle: CSSProperties = {
  fontSize: 22,
  opacity: 0.5,
  flexShrink: 0,
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "15px 8px",
  border: 0,
  outline: "none",
  background: "transparent",
  fontSize: 16,
  color: "#171717",
};

const filterPanelStyle: CSSProperties = {
  marginBottom: 34,
  padding: 18,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.07)",
  backdropFilter: "blur(18px)",
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

const resetButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: 999,
  padding: "9px 12px",
  background: "rgba(255, 255, 255, 0.78)",
  color: "#171717",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 12,
};

const filterGroupStyle: CSSProperties = {
  minWidth: 0,
  padding: 14,
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.58)",
  border: "1px solid rgba(0, 0, 0, 0.06)",
};

const filterGroupTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
  marginBottom: 10,
};

const filterGroupLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontWeight: 850,
  opacity: 0.5,
};

const filterGroupValueStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 850,
  opacity: 0.62,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const filterWrapStyle: CSSProperties = {
  display: "flex",
  gap: 7,
  overflowX: "auto",
  paddingBottom: 2,
};

const filterButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.76)",
  color: "#171717",
  borderRadius: 999,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 750,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const activeFilterButtonStyle: CSSProperties = {
  ...filterButtonStyle,
  background: "rgba(248, 225, 184, 0.95)",
  border: "1px solid rgba(0, 0, 0, 0.1)",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 16,
  border: "1px solid rgba(0, 0, 0, 0.08)",
  background: "rgba(255, 255, 255, 0.78)",
  color: "#171717",
  fontSize: 14,
  fontWeight: 750,
  outline: "none",
};

const activeSummaryStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: 14,
  paddingTop: 14,
  borderTop: "1px solid rgba(0, 0, 0, 0.07)",
};

const activeSummaryLabelStyle: CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 850,
  opacity: 0.46,
};

const activeSummaryTextStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 750,
  opacity: 0.7,
};

const contentStyle: CSSProperties = {
  marginTop: 10,
};

const mutedTextStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const spotGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const spotCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const spotVisualStyle: CSSProperties = {
  height: "clamp(145px, 40vw, 170px)",
  position: "relative",
};

const visualBadgeStyle: CSSProperties = {
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

const spotBodyStyle: CSSProperties = {
  padding: 17,
};

const spotMetaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 13,
  opacity: 0.62,
  fontWeight: 650,
};

const spotTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const spotTextStyle: CSSProperties = {
  margin: "10px 0 14px",
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.7,
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 7,
};

const chipStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  fontWeight: 750,
};

const openTextStyle: CSSProperties = {
  marginTop: 15,
  fontSize: 13,
  fontWeight: 850,
  opacity: 0.78,
};

const emptyStyle: CSSProperties = {
  padding: "28px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  textAlign: "center",
  opacity: 0.72,
};

