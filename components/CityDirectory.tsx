"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage } from "@/data/travel-images";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDisplayStops } from "@/lib/displayText";
import { citiesCopyVariants } from "@/lib/copyVariants";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

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



function getCityPhotoCardStyle(city: City): CSSProperties {
  const image = getCityImage(city.slug);
  const imageUrl = getOptionalHttpUrl(city.imageUrl) || image.imageUrl;

  return {
    ...destinationCardStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(180deg, rgba(31, 26, 23, 0.02) 0%, rgba(31, 26, 23, 0.16) 52%, rgba(31, 26, 23, 0.50) 100%)",
      "linear-gradient(135deg, #eadbc8 0%, #b8936e 52%, #0D2B52 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(city.imagePosition),
  };
}
export function CityDirectory({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [pageCopy] = useState(citiesCopyVariants[0]);
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
                  style={getCityPhotoCardStyle(city)}
                >
                  <div style={destinationVisualStyle}>
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

                    <div style={viewTextStyle}>Open destination guide</div>
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
  background: "linear-gradient(180deg, #F0F4FA 0%, #FFFFFF 46%, #f5efe6 100%)",
  color: "#0D2B52",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "34px 16px 70px",
};

const heroStyle: CSSProperties = {
  marginBottom: 34,
  paddingTop: 8,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#BF9B30",
  fontWeight: 850,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: 52,
  lineHeight: 1.02,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#0D2B52",
};

const subtitleStyle: CSSProperties = {
  margin: "0 0 24px",
  maxWidth: 640,
  fontSize: 16,
  lineHeight: 1.72,
  color: "#6B87A8",
};

const searchBoxStyle: CSSProperties = {
  maxWidth: 590,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 8px 7px 16px",
  borderRadius: 999,
  background: "#FFFFFF",
  border: "1px solid #D8E2F0",
  boxShadow: "0 12px 28px rgba(70, 53, 38, 0.08)",
};

const searchIconStyle: CSSProperties = {
  fontSize: 22,
  color: "#BF9B30",
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
  color: "#0D2B52",
};

const filterPanelStyle: CSSProperties = {
  marginBottom: 34,
  padding: 16,
  borderRadius: 8,
  background: "#FFFFFF",
  border: "1px solid #D8E2F0",
  boxShadow: "0 14px 34px rgba(70, 53, 38, 0.06)",
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
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 30,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#0D2B52",
};

const resetButtonStyle: CSSProperties = {
  border: "1px solid #D8E2F0",
  borderRadius: 999,
  padding: "9px 12px",
  background: "#FFFFFF",
  color: "#0D2B52",
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
  border: "1px solid #D8E2F0",
  background: "#FFFFFF",
  color: "#0D2B52",
  borderRadius: 999,
  padding: "11px 14px",
  fontSize: 13,
  fontWeight: 800,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const activeShortcutButtonStyle: CSSProperties = {
  ...shortcutButtonStyle,
  background: "#0D2B52",
  color: "#FFFFFF",
  border: "1px solid #0D2B52",
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 12,
  marginTop: 8,
};

const filterGroupStyle: CSSProperties = {
  minWidth: 0,
  padding: 13,
  borderRadius: 8,
  background: "#F0F4FA",
  border: "1px solid #D8E2F0",
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
  border: "1px solid #D8E2F0",
  background: "rgba(255, 253, 248, 0.72)",
  color: "#0D2B52",
  borderRadius: 999,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 750,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const activeFilterButtonStyle: CSSProperties = {
  ...filterButtonStyle,
  background: "#0D2B52",
  color: "#FFFFFF",
  border: "1px solid #0D2B52",
};

const activeSummaryStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: 14,
  paddingTop: 14,
  borderTop: "1px solid #D8E2F0",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 18,
};

const destinationCardStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minHeight: 540,
  borderRadius: 8,
  color: "#0D2B52",
  textDecoration: "none",
  overflow: "hidden",
  border: "1px solid #D8E2F0",
  boxShadow: "0 18px 42px rgba(70, 53, 38, 0.14)",
  backgroundColor: "#0D2B52",
};

const destinationVisualStyle: CSSProperties = {
  minHeight: 270,
  position: "relative",
  flex: 1,
};

const countryBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 253, 248, 0.88)",
  border: "1px solid rgba(255, 253, 248, 0.34)",
  fontSize: 12,
  color: "#0D2B52",
  fontWeight: 850,
};

const destinationBodyStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  padding: 20,
  borderRadius: 0,
  background: "#FFFFFF",
  borderTop: "1px solid #D8E2F0",
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
  fontSize: 28,
  lineHeight: 1.08,
  letterSpacing: 0,
  overflowWrap: "break-word",
  color: "#0D2B52",
};

const destinationCountryStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 13,
  color: "#6B87A8",
  fontWeight: 750,
};

const destinationReasonStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 13,
  lineHeight: 1.5,
  color: "#6B87A8",
  fontWeight: 650,
};

const arrowStyle: CSSProperties = {
  width: 32,
  height: 32,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#0D2B52",
  color: "#FFFFFF",
  fontWeight: 850,
  flexShrink: 0,
};

const spotsStyle: CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 13,
  lineHeight: 1.4,
  color: "#6B87A8",
  marginBottom: 15,
};

const viewTextStyle: CSSProperties = {
  marginTop: 16,
  color: "#BF9B30",
  fontSize: 13,
  fontWeight: 850,
};

const emptyStyle: CSSProperties = {
  padding: "28px",
  borderRadius: 8,
  background: "#FFFFFF",
  border: "1px solid #D8E2F0",
  textAlign: "center",
  opacity: 0.72,
};





















