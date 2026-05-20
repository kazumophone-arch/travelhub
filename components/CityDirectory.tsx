"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDisplayStops } from "@/lib/displayText";
import { citiesCopyVariants, pickDailyVariant } from "@/lib/copyVariants";

type Props = {
  cities: City[];
};

const regionCountryMap: Record<string, string[]> = {
  Europe: [
    "Italy",
    "France",
    "Spain",
    "Czech Republic",
    "Croatia",
    "Austria",
    "United Kingdom",
    "Netherlands",
    "Germany",
    "Portugal",
    "Greece",
    "Switzerland",
    "Belgium",
    "Norway",
    "Sweden",
    "Denmark",
    "Finland",
    "Iceland",
  ],
  Asia: [
    "Japan",
    "South Korea",
    "China",
    "Thailand",
    "Singapore",
    "Vietnam",
    "Indonesia",
    "Malaysia",
    "Taiwan",
    "Hong Kong",
  ],
  "North America": [
    "United States",
    "Canada",
    "Mexico",
  ],
  Oceania: [
    "Australia",
    "New Zealand",
  ],
  Africa: [
    "Morocco",
    "Egypt",
    "South Africa",
    "Kenya",
    "Tanzania",
  ],
  "Middle East": [
    "United Arab Emirates",
    "Turkey",
    "Qatar",
    "Jordan",
    "Israel",
  ],
};

const broadRegionOptions = [
  "All",
  "Europe",
  "Asia",
  "North America",
  "Oceania",
  "Africa",
  "Middle East",
];

function getRegionForCountry(country: string) {
  const entry = Object.entries(regionCountryMap).find(([, countries]) =>
    countries.includes(country)
  );

  return entry?.[0];
}
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

const shortcutFilters = [
  "All",
  "Europe",
  "Asia",
  "Scenic",
  "World Heritage",
  "Couples",
  "Family",
  "Solo",
];

const preferredStyleOrder = [
  "World Heritage",
  "Scenic",
  "Old Town",
  "Couples",
  "Family",
  "Solo",
  "Friends",
  "Food",
  "Nature",
  "Beach",
  "Weekend",
  "Luxury",
  "Budget",
  "Romantic",
  "History",
  "Culture",
  "Architecture",
];

function getCityCategories(city: City) {
  const categories = new Set<string>();

  const region = getRegionForCountry(city.country);

  if (region) categories.add(region);

  city.seasons?.forEach((season) => categories.add(season));
  city.months?.forEach((month) => categories.add(month));
  city.travelStyles?.forEach((style) => categories.add(style));
  city.themes?.forEach((theme) => categories.add(theme));
  city.categories?.forEach((category) => categories.add(category));

  const oldTownWords = ["Old Town", "Historic", "Center", "Castle", "Temple"];
  if (
    city.stops.some((spot) =>
      oldTownWords.some((word) =>
        spot.toLowerCase().includes(word.toLowerCase())
      )
    )
  ) {
    categories.add("Old Town");
  }

  const scenicWords = ["Sunset", "View", "Lagoon", "River", "Canal", "Beach"];
  if (
    city.stops.some((spot) =>
      scenicWords.some((word) =>
        spot.toLowerCase().includes(word.toLowerCase())
      )
    )
  ) {
    categories.add("Scenic");
  }

  return Array.from(categories);
}


function getCityReason(city: City) {
  const categories = getCityCategories(city);

  if (categories.includes("Romantic") || categories.includes("Couples")) {
    return "Good for romantic city walks and atmosphere.";
  }

  if (categories.includes("Family")) {
    return "Easy pick for family trips.";
  }

  if (categories.includes("Solo")) {
    return "Walkable pick for solo travel.";
  }

  if (categories.includes("World Heritage")) {
    return "Strong for historic and cultural routes.";
  }

  if (categories.includes("Scenic")) {
    return "Good for scenic views and atmosphere.";
  }

  if (categories.includes("Old Town")) {
    return "Good for old town wandering.";
  }

  const firstStop = getDisplayStops(city)[0];

  return firstStop ? `Start with ${firstStop}.` : "Open the city guide to see the main travel ideas.";
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

export function CityDirectory({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [pageCopy, setPageCopy] = useState(citiesCopyVariants[0]);
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeMonth, setActiveMonth] = useState("All");
  const [activeStyle, setActiveStyle] = useState("All");

  const regionOptions = useMemo(() => broadRegionOptions, []);

  const monthOptions = useMemo(() => {
    const months = new Set<string>();

    cities.forEach((city) => {
      city.months?.forEach((month) => months.add(month));
    });

    return ["All", ...monthNames.filter((month) => months.has(month))];
  }, [cities]);

  const styleOptions = useMemo(() => {
    const regionSet = new Set(regionOptions);
    const monthSet = new Set(monthNames);
    const set = new Set<string>();

    cities.forEach((city) => {
      getCityCategories(city).forEach((category) => {
        if (regionSet.has(category)) return;
        if (monthSet.has(category)) return;
        if (["Spring", "Summer", "Autumn", "Winter"].includes(category)) return;

        set.add(category);
      });
    });

    const ordered = preferredStyleOrder.filter((style) => set.has(style));
    const rest = Array.from(set)
      .filter((style) => !preferredStyleOrder.includes(style))
      .sort();

    return ["All", ...ordered, ...rest];
  }, [cities, regionOptions]);

  const activeFilters = [
    activeRegion !== "All" ? activeRegion : null,
    activeMonth !== "All" ? activeMonth : null,
    activeStyle !== "All" ? activeStyle : null,
  ].filter(Boolean);

  const filteredCities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cities.filter((city) => {
      const cityCategories = getCityCategories(city);

      const matchesRegion =
        activeRegion === "All" || cityCategories.includes(activeRegion);

      const matchesMonth =
        activeMonth === "All" || city.months?.includes(activeMonth);

      const matchesStyle =
        activeStyle === "All" || cityCategories.includes(activeStyle);

      const searchableText = [
        city.city,
        city.country,
        city.description ?? "",
        ...city.stops,
        ...cityCategories,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedQuery === "" || searchableText.includes(normalizedQuery);

      return matchesRegion && matchesMonth && matchesStyle && matchesSearch;
    });
  }, [cities, query, activeRegion, activeMonth, activeStyle]);

  function resetFilters() {
    setQuery("");
    setActiveRegion("All");
    setActiveMonth("All");
    setActiveStyle("All");
  }

  function applyShortcut(filter: string) {
    if (filter === "All") {
      resetFilters();
      return;
    }

    if (filter === "Europe" || filter === "Asia") {
      setActiveRegion(filter);
      setActiveMonth("All");
      setActiveStyle("All");
      return;
    }

    setActiveStyle(filter);
    setActiveRegion("All");
    setActiveMonth("All");
  }

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <section style={heroStyle}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Cities" },
            ]}
          />

          <div style={eyebrowStyle}>{pageCopy.eyebrow}</div>

          <h1 style={titleStyle}>Browse destinations.</h1>

          <p style={subtitleStyle}>
            Start broad with recommended filters, then refine by region, month,
            or travel style.
          </p>

          <div style={searchBoxStyle}>
            <span style={searchIconStyle}>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city, country, season, or spot..."
              style={searchInputStyle}
            />
          </div>
        </section>

        <section style={filterPanelStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Recommended filters</div>
              <h2 style={sectionTitleStyle}>Start with a simple direction</h2>
            </div>

            <button type="button" onClick={resetFilters} style={resetButtonStyle}>
              Clear all
            </button>
          </div>

          <div style={shortcutWrapStyle}>
            {shortcutFilters
              .filter((filter) => filter === "All" || styleOptions.includes(filter) || regionOptions.includes(filter))
              .map((filter) => {
                const isActive =
                  filter === "All"
                    ? activeFilters.length === 0 && query.trim() === ""
                    : activeRegion === filter || activeStyle === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => applyShortcut(filter)}
                    style={isActive ? activeShortcutButtonStyle : shortcutButtonStyle}
                  >
                    {filter}
                  </button>
                );
              })}
          </div>

          <div style={filterGridStyle}>
            <FilterGroup
              label="Region"
              value={activeRegion}
              options={regionOptions}
              onChange={setActiveRegion}
            />

            <FilterGroup
              label="Month"
              value={activeMonth}
              options={monthOptions}
              onChange={setActiveMonth}
            />

            <FilterGroup
              label="Style / Theme"
              value={activeStyle}
              options={styleOptions}
              onChange={setActiveStyle}
            />
          </div>

          <div style={activeSummaryStyle}>
            <span style={activeSummaryLabelStyle}>Active filters</span>

            {activeFilters.length === 0 && query.trim() === "" ? (
              <span style={activeSummaryTextStyle}>None</span>
            ) : (
              <span style={activeSummaryTextStyle}>
                {[query.trim() ? `Search: ${query.trim()}` : null, ...activeFilters]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
          </div>
        </section>

        <section style={contentStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Results</div>
              <h2 style={sectionTitleStyle}>Choose a city</h2>
            </div>

            <span style={mutedTextStyle}>
              {filteredCities.length} / {cities.length} cities
            </span>
          </div>

          {filteredCities.length === 0 ? (
            <div style={emptyStyle}>
              No cities found. Try another keyword or clear the filters.
            </div>
          ) : (
            <section style={destinationGridStyle}>
              {filteredCities.map((city, index) => (
                <Link
                  key={`${city.slug}-city-directory-${index}`}
                  href={`/c/${city.slug}?src=cities&v=cities_${city.slug}`}
                  style={destinationCardStyle}
                >
                  <div
                    style={{
                      ...destinationVisualStyle,
                      background: visualForCity(city.slug),
                    }}
                  >
                    <div style={countryBadgeStyle}>{city.country}</div>
                  </div>

                  <div style={destinationBodyStyle}>
                    <div style={destinationTopStyle}>
                      <div style={destinationTextStyle}>
                        <h3 style={destinationTitleStyle}>{city.city}</h3>
                        <p style={destinationCountryStyle}>{city.country}</p>
                      </div>

                      <div style={arrowStyle}>→</div>
                    </div>

                    <p style={destinationReasonStyle}>{getCityReason(city)}</p>

                    <div style={spotsStyle}>
                      {getDisplayStops(city).map((spot, spotIndex) => (
                        <span key={`${spot}-${spotIndex}`}>{spot}</span>
                      ))}
                    </div>

                    <div style={actionRowStyle}>
                      {(city.months ?? []).slice(0, 2).map((month) => (
                        <span key={month} style={secondaryMiniStyle}>
                          {month}
                        </span>
                      ))}

                      {(city.travelStyles ?? []).slice(0, 2).map((style) => (
                        <span key={style} style={primaryMiniStyle}>
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </section>
      </section>
    </main>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div style={filterGroupStyle}>
      <div style={filterGroupTopStyle}>
        <span style={filterGroupLabelStyle}>{label}</span>
        <span style={filterGroupValueStyle}>{value}</span>
      </div>

      <div style={filterWrapStyle}>
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              style={isActive ? activeFilterButtonStyle : filterButtonStyle}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
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

const shortcutWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
  marginBottom: 6,
};

const shortcutButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: "rgba(255, 255, 255, 0.78)",
  color: "#171717",
  borderRadius: 999,
  padding: "11px 14px",
  fontSize: 13,
  fontWeight: 800,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const activeShortcutButtonStyle: CSSProperties = {
  ...shortcutButtonStyle,
  background: "#171717",
  color: "#ffffff",
  border: "1px solid #171717",
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 12,
  marginTop: 8,
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
  height: "clamp(140px, 40vw, 160px)",
  position: "relative",
};

const countryBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.76)",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 750,
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

const primaryMiniStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  background: "#171717",
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 750,
};

const secondaryMiniStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  color: "#171717",
  fontSize: 12,
  fontWeight: 750,
};

const emptyStyle: CSSProperties = {
  padding: "28px",
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  textAlign: "center",
  opacity: 0.72,
};







