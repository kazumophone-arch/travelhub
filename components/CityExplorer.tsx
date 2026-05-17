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

  if (europeCountries.has(city.country)) categories.add("Europe");
  if (asiaCountries.has(city.country)) categories.add("Asia");

  categories.add(city.country);

  city.seasons?.forEach((season) => categories.add(season));
  city.months?.forEach((month) => categories.add(month));
  city.travelStyles?.forEach((style) => categories.add(style));
  city.themes?.forEach((theme) => categories.add(theme));
  city.categories?.forEach((category) => categories.add(category));

  const oldTownWords = ["Old Town", "Historic", "Center", "Castle", "Temple"];
  if (
    city.stops.some((spot) =>
      oldTownWords.some((word) => spot.includes(word))
    )
  ) {
    categories.add("Old Town");
  }

  const scenicWords = ["Sunset", "View", "Lagoon", "River", "Canal", "Beach"];
  if (
    city.stops.some((spot) =>
      scenicWords.some((word) => spot.includes(word))
    )
  ) {
    categories.add("Scenic");
  }

  return Array.from(categories);
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

export function CityExplorer({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredCities = cities.slice(0, 3);

  const categories = useMemo(() => {
    const set = new Set<string>();

    cities.forEach((city) => {
      getCityCategories(city).forEach((category) => set.add(category));
    });

const preferredOrder = [
  "World Heritage",
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
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
  "Couples",
  "Family",
  "Solo",
  "Friends",
  "Weekend",
  "Luxury",
  "Budget",
  "Europe",
  "Asia",
  "Old Town",
  "Scenic",
  "Beach",
  "Nature",
  "Food",
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
      <section style={shellStyle}>
        <header style={navStyle}>
          <Link href="/" style={logoStyle}>
            TravelHub
          </Link>

          <div style={navPillStyle}>Short-video travel links</div>
        </header>

        <section style={heroStyle}>
          <div style={heroTextStyle}>
            <div style={eyebrowStyle}>City-based travel links</div>

            <h1 style={heroTitleStyle}>
              Find beautiful cities. Book the stay faster.
            </h1>

            <p style={heroSubtitleStyle}>
              Search destinations featured in our travel shorts and jump straight
              to hotel and tour options.
            </p>

            <div style={searchBoxStyle}>
              <span style={searchIconStyle}>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city, country, or spot..."
                style={searchInputStyle}
              />
            </div>
          </div>

          <div style={heroPreviewStyle}>
            <div style={heroImageStyle}>
              <div style={floatingCardStyle}>
                <div style={floatingSmallTextStyle}>Featured</div>
                <div style={floatingTitleStyle}>Rome, Italy</div>
                <div style={floatingSubStyle}>Hotels · Tours · Old Town</div>
              </div>
            </div>
          </div>
        </section>

        <section style={featuredStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>This week</div>
              <h2 style={sectionTitleStyle}>Featured cities</h2>
            </div>
            <span style={mutedTextStyle}>From latest shorts</span>
          </div>

          <div style={featuredGridStyle}>
            {featuredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/c/${city.slug}?src=home&v=featured_${city.slug}`}
                style={featuredCardStyle}
              >
                <div
                  style={{
                    ...featuredVisualStyle,
                    background: visualForCity(city.slug),
                  }}
                >
                  <div style={visualBadgeStyle}>Featured</div>
                </div>

                <div style={featuredContentStyle}>
                  <h3 style={featuredTitleStyle}>{city.city}</h3>
                  <p style={featuredCountryStyle}>{city.country}</p>
                  <div style={miniMetaStyle}>Hotels · Tours</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={contentStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>All destinations</div>
              <h2 style={sectionTitleStyle}>Choose a city</h2>
            </div>
            <span style={mutedTextStyle}>
              {filteredCities.length} / {cities.length} cities
            </span>
          </div>

          <div style={categoryWrapStyle}>
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
          </div>

          {filteredCities.length === 0 ? (
            <div style={emptyStyle}>
              No cities found. Try another keyword or category.
            </div>
          ) : (
            <section style={destinationGridStyle}>
              {filteredCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/c/${city.slug}?src=home&v=home_${city.slug}`}
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
                      <div>
                        <h3 style={destinationTitleStyle}>{city.city}</h3>
                        <p style={destinationCountryStyle}>{city.country}</p>
                      </div>

                      <div style={arrowStyle}>→</div>
                    </div>

                    <div style={spotsStyle}>
                      <span>{city.stops[0]}</span>
                      <span>{city.stops[1]}</span>
                      <span>{city.stops[2]}</span>
                    </div>

                    <div style={actionRowStyle}>
                      <span style={primaryMiniStyle}>Hotels</span>
                      <span style={secondaryMiniStyle}>Tours</span>
                    </div>
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
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "22px 20px 54px",
};

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 30,
};

const logoStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: "-0.04em",
};

const navPillStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  fontSize: 12,
  fontWeight: 650,
  opacity: 0.78,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
  gap: 24,
  alignItems: "center",
  marginBottom: 38,
};

const heroTextStyle: CSSProperties = {
  padding: "28px 0",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 14,
};

const heroTitleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 680,
  fontSize: "clamp(46px, 8vw, 86px)",
  lineHeight: 0.92,
  letterSpacing: "-0.075em",
  fontWeight: 850,
};

const heroSubtitleStyle: CSSProperties = {
  margin: "0 0 26px",
  maxWidth: 520,
  fontSize: 17,
  lineHeight: 1.65,
  opacity: 0.72,
};

const searchBoxStyle: CSSProperties = {
  maxWidth: 560,
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
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  padding: "15px 8px",
  border: 0,
  outline: "none",
  background: "transparent",
  fontSize: 16,
  color: "#171717",
};

const heroPreviewStyle: CSSProperties = {
  position: "relative",
};

const heroImageStyle: CSSProperties = {
  minHeight: 420,
  borderRadius: 36,
  background:
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)",
  boxShadow: "0 36px 90px rgba(0, 0, 0, 0.22)",
  position: "relative",
  overflow: "hidden",
};

const floatingCardStyle: CSSProperties = {
  position: "absolute",
  left: 22,
  right: 22,
  bottom: 22,
  padding: 18,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.16)",
};

const floatingSmallTextStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  opacity: 0.55,
  marginBottom: 8,
};

const floatingTitleStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: "-0.05em",
};

const floatingSubStyle: CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.65,
  fontWeight: 650,
};

const featuredStyle: CSSProperties = {
  marginBottom: 38,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "end",
  marginBottom: 16,
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
  fontSize: 28,
  letterSpacing: "-0.055em",
  fontWeight: 800,
};

const mutedTextStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.6,
  whiteSpace: "nowrap",
};

const featuredGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 14,
};

const featuredCardStyle: CSSProperties = {
  display: "block",
  padding: 10,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.1)",
  color: "inherit",
  textDecoration: "none",
};

const featuredVisualStyle: CSSProperties = {
  height: 170,
  borderRadius: 24,
  position: "relative",
  overflow: "hidden",
};

const visualBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  backdropFilter: "blur(12px)",
  fontSize: 12,
  fontWeight: 750,
};

const featuredContentStyle: CSSProperties = {
  padding: "14px 8px 8px",
};

const featuredTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1,
  letterSpacing: "-0.055em",
};

const featuredCountryStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const miniMetaStyle: CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  fontWeight: 750,
  opacity: 0.68,
};

const contentStyle: CSSProperties = {
  marginTop: 10,
};

const categoryWrapStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  overflowX: "auto",
  paddingBottom: 14,
  marginBottom: 8,
};

const categoryButtonStyle: CSSProperties = {
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

const activeCategoryStyle: CSSProperties = {
  ...categoryButtonStyle,
  background: "#171717",
  color: "#ffffff",
  border: "1px solid #171717",
};

const destinationGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 16,
};

const destinationCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const destinationVisualStyle: CSSProperties = {
  height: 160,
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
  marginBottom: 16,
};

const destinationTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1,
  letterSpacing: "-0.055em",
};

const destinationCountryStyle: CSSProperties = {
  margin: "7px 0 0",
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

const disclosureStyle: CSSProperties = {
  margin: "34px auto 0",
  maxWidth: 560,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};