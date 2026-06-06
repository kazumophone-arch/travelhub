"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { spotsCopyVariants, pickDailyVariant } from "@/lib/copyVariants";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

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
  imageUrl?: string;
  imagePosition?: string;
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
          imageUrl: spot.imageUrl,
          imagePosition: spot.imagePosition,
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
        imageUrl: undefined,
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



function getSpotPhotoCardStyle(spot: SpotItem): CSSProperties {
  const seed = encodeURIComponent(`travelhub-spot-${spot.citySlug}-${spot.slug}`);
  const fallbackImageUrl = `https://picsum.photos/seed/${seed}/1000/700`;
  const imageUrl = getOptionalHttpUrl(spot.imageUrl) || fallbackImageUrl;

  return {
    ...spotCardStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(23, 32, 42, 0.08) 100%)",
      "linear-gradient(135deg, #e8f4ff, #edf8f2)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(spot.imagePosition),
  };
}
export function SpotDirectory({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [pageCopy] = useState(() => pickDailyVariant(spotsCopyVariants, "spots"));
  const [activeSpotType, setActiveSpotType] = useState("All");
  const [activeCitySlug, setActiveCitySlug] = useState("all");

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
                    style={getSpotPhotoCardStyle(spot)}
                  >
                    <div style={spotVisualStyle}>
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
  background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 48%, #f6faf8 100%)",
  color: "#17202a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "28px 16px 56px",
};

const heroStyle: CSSProperties = {
  marginBottom: 28,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#1769e0",
  fontWeight: 850,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: 42,
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: "0 0 24px",
  maxWidth: 640,
  fontSize: 16,
  lineHeight: 1.72,
  color: "#4c5f6f",
};

const searchBoxStyle: CSSProperties = {
  maxWidth: 590,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 8px 7px 16px",
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.1)",
  boxShadow: "0 10px 24px rgba(30, 64, 88, 0.08)",
};

const searchIconStyle: CSSProperties = {
  fontSize: 22,
  color: "#1769e0",
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
  color: "#17202a",
};

const filterPanelStyle: CSSProperties = {
  marginBottom: 34,
  padding: 16,
  borderRadius: 26,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.1)",
  boxShadow: "0 8px 20px rgba(30, 64, 88, 0.06)",
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
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  letterSpacing: 0,
  fontWeight: 850,
};

const resetButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: 999,
  padding: "9px 12px",
  background: "#ffffff",
  color: "#17202a",
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
  padding: 13,
  borderRadius: 20,
  background: "#f7fbfc",
  border: "1px solid rgba(23, 32, 42, 0.06)",
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
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "rgba(255, 255, 255, 0.76)",
  color: "#17202a",
  borderRadius: 999,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 750,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const activeFilterButtonStyle: CSSProperties = {
  ...filterButtonStyle,
  background: "#eef8f5",
  color: "#138a72",
  border: "1px solid rgba(19, 138, 114, 0.18)",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 16,
  border: "1px solid rgba(23, 32, 42, 0.08)",
  background: "#ffffff",
  color: "#17202a",
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
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minHeight: 430,
  borderRadius: 24,
  color: "#17202a",
  textDecoration: "none",
  overflow: "hidden",
  border: "1px solid rgba(23, 32, 42, 0.1)",
  boxShadow: "0 12px 28px rgba(30, 64, 88, 0.12)",
  backgroundColor: "#edf8f2",
};

const spotVisualStyle: CSSProperties = {
  minHeight: 200,
  position: "relative",
  flex: 1,
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  fontSize: 12,
  color: "#17202a",
  fontWeight: 850,
};

const spotBodyStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  padding: 18,
  borderRadius: "0 0 24px 24px",
  background: "#ffffff",
  borderTop: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 -8px 20px rgba(23, 32, 42, 0.05)",
};

const spotMetaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#607080",
  fontWeight: 850,
};

const spotTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.12,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#17202a",
};

const spotTextStyle: CSSProperties = {
  margin: "10px 0 14px",
  fontSize: 13,
  lineHeight: 1.55,
  color: "#4c5f6f",
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 7,
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

const openTextStyle: CSSProperties = {
  marginTop: 15,
  fontSize: 13,
  fontWeight: 850,
  color: "#1769e0",
};

const emptyStyle: CSSProperties = {
  padding: "28px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  textAlign: "center",
  opacity: 0.72,
};




















