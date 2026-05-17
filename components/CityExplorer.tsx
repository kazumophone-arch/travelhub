"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";

type Props = {
  cities: City[];
};

const europeCountries = new Set([
  "Italy",
  "France",
  "Spain",
  "Czech Republic",
  "Croatia",
  "Austria",
  "United Kingdom",
  "Netherlands",
]);

const asiaCountries = new Set([
  "Japan",
  "South Korea",
  "China",
  "Thailand",
  "Singapore",
]);

function getCityCategories(city: City) {
  const categories = new Set<string>();

  categories.add("World Heritage");

  if (europeCountries.has(city.country)) {
    categories.add("Europe");
  }

  if (asiaCountries.has(city.country)) {
    categories.add("Asia");
  }

  categories.add(city.country);

  if (city.categories) {
    city.categories.forEach((category) => categories.add(category));
  }

  return Array.from(categories);
}

export function CityExplorer({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    cities.forEach((city) => {
      getCityCategories(city).forEach((category) => set.add(category));
    });

    const preferredOrder = [
      "World Heritage",
      "Europe",
      "Asia",
      "Italy",
      "France",
      "Spain",
      "Japan",
      "United Kingdom",
      "Netherlands",
    ];

    const ordered = preferredOrder.filter((category) => set.has(category));
    const rest = Array.from(set)
      .filter((category) => !preferredOrder.includes(category))
      .sort();

    return ["All", ...ordered, ...rest];
  }, [cities]);

  const filteredCities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cities.filter((city) => {
      const cityCategories = getCityCategories(city);

      const matchesCategory =
        activeCategory === "All" || cityCategories.includes(activeCategory);

      const searchableText = [
        city.city,
        city.country,
        ...city.stops,
        ...cityCategories,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedQuery === "" || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [cities, query, activeCategory]);

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={brandStyle}>TravelHub</div>

        <div style={labelStyle}>Short-video travel links</div>

        <h1 style={titleStyle}>Find your next trip, faster.</h1>

        <p style={subtitleStyle}>
          Search quick hotel and tour links for cities featured in our travel shorts.
        </p>

        <div style={searchWrapStyle}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city, country, or spot..."
            style={searchInputStyle}
          />
        </div>
      </section>

      <section style={contentStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <div style={smallLabelStyle}>Featured cities</div>
            <h2 style={sectionTitleStyle}>Choose a destination</h2>
          </div>
          <div style={countStyle}>
            {filteredCities.length} / {cities.length} cities
          </div>
        </div>

        <section style={categoryWrapStyle}>
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                style={isActive ? activeCategoryStyle : categoryButtonStyle}
              >
                {category}
              </button>
            );
          })}
        </section>

        {filteredCities.length === 0 ? (
          <div style={emptyStyle}>
            No cities found. Try another keyword or category.
          </div>
        ) : (
          <section style={gridStyle}>
            {filteredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/c/${city.slug}?src=home&v=home_${city.slug}`}
                style={cardStyle}
              >
                <div style={cardTopStyle}>
                  <div>
                    <h3 style={cityTitleStyle}>{city.city}</h3>
                    <p style={countryStyle}>{city.country}</p>
                  </div>

                  <div style={arrowStyle}>→</div>
                </div>

                <div style={spotsStyle}>
                  <span>{city.stops[0]}</span>
                  <span>{city.stops[1]}</span>
                  <span>{city.stops[2]}</span>
                </div>

                <div style={cardFooterStyle}>
                  <span>Hotels</span>
                  <span>Tours</span>
                </div>
              </Link>
            ))}
          </section>
        )}

        <p style={disclosureStyle}>
          Some links may be affiliate links. Original 3D characters •
          AI-assisted visuals.
        </p>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  color: "#171717",
  background:
    "radial-gradient(circle at top left, rgba(255, 214, 165, 0.42), transparent 32%), radial-gradient(circle at top right, rgba(166, 197, 255, 0.35), transparent 30%), linear-gradient(180deg, #faf7f0 0%, #ffffff 46%, #eef4f8 100%)",
};

const heroStyle: CSSProperties = {
  maxWidth: 820,
  margin: "0 auto",
  padding: "56px 20px 28px",
  textAlign: "center",
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.74)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 22,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 auto 16px",
  maxWidth: 680,
  fontSize: "clamp(42px, 8vw, 76px)",
  lineHeight: 0.95,
  letterSpacing: "-0.07em",
  fontWeight: 800,
};

const subtitleStyle: CSSProperties = {
  maxWidth: 540,
  margin: "0 auto 26px",
  fontSize: 17,
  lineHeight: 1.65,
  opacity: 0.72,
};

const searchWrapStyle: CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "16px 18px",
  borderRadius: 18,
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: "rgba(255, 255, 255, 0.88)",
  boxShadow: "0 18px 44px rgba(0, 0, 0, 0.08)",
  fontSize: 16,
  outline: "none",
};

const contentStyle: CSSProperties = {
  maxWidth: 920,
  margin: "0 auto",
  padding: "16px 20px 46px",
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "end",
  marginBottom: 14,
};

const smallLabelStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 26,
  letterSpacing: "-0.04em",
};

const countStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.62,
  whiteSpace: "nowrap",
};

const categoryWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
  marginBottom: 4,
};

const categoryButtonStyle: CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.1)",
  background: "rgba(255, 255, 255, 0.78)",
  color: "#171717",
  borderRadius: 999,
  padding: "9px 12px",
  fontSize: 13,
  fontWeight: 650,
  whiteSpace: "nowrap",
  cursor: "pointer",
};

const activeCategoryStyle: CSSProperties = {
  ...categoryButtonStyle,
  background: "#171717",
  color: "#ffffff",
  border: "1px solid #171717",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const cardStyle: CSSProperties = {
  display: "block",
  padding: 18,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
};

const cardTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  marginBottom: 16,
};

const cityTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.05,
  letterSpacing: "-0.05em",
};

const countryStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 14,
  opacity: 0.62,
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
  opacity: 0.76,
  marginBottom: 16,
};

const cardFooterStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  fontSize: 12,
  fontWeight: 700,
  opacity: 0.7,
};

const emptyStyle: CSSProperties = {
  padding: "28px",
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  textAlign: "center",
  opacity: 0.72,
};

const disclosureStyle: CSSProperties = {
  margin: "30px auto 0",
  maxWidth: 520,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};