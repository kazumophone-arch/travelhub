"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { homeCopyVariants, pickDailyVariant } from "@/lib/copyVariants";

type Props = {
  cities: City[];
};

type SpotSearchResult = {
  citySlug: string;
  cityName: string;
  country: string;
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  canOpen: boolean;
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

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replaceAll("&", "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "spot"
  );
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

function visualForIndex(index: number) {
  const visuals = [
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 44%, #3b2f2f 100%)",
    "linear-gradient(135deg, #9cc9d7 0%, #e7c389 46%, #8b5f4d 100%)",
    "linear-gradient(135deg, #c7d4df 0%, #d3b58d 44%, #4b4b58 100%)",
    "linear-gradient(135deg, #f0b45f 0%, #d95850 45%, #2e6f89 100%)",
  ];

  return visuals[index % visuals.length];
}

function getSpotSearchResults(cities: City[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  const results: SpotSearchResult[] = [];

  cities.forEach((city) => {
    if (city.spotDetails && city.spotDetails.length > 0) {
      city.spotDetails.forEach((spot) => {
        if (spot.isPublished === false) return;

        const searchableText = [
          spot.name,
          spot.summary,
          ...spot.highlights,
          ...spot.bestFor,
          ...(spot.tags ?? []),
          city.city,
          city.country,
          ...(city.months ?? []),
          ...(city.travelStyles ?? []),
          ...(city.themes ?? []),
          ...(city.categories ?? []),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedQuery)) return;

        results.push({
          citySlug: city.slug,
          cityName: city.city,
          country: city.country,
          slug: spot.slug,
          name: spot.name,
          summary: spot.summary,
          tags: spot.tags ?? spot.highlights,
          canOpen: true,
        });
      });

      return;
    }

    city.stops.forEach((stop, index) => {
      const searchableText = [stop, city.city, city.country]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(normalizedQuery)) return;

      results.push({
        citySlug: city.slug,
        cityName: city.city,
        country: city.country,
        slug: slugify(stop),
        name: stop,
        summary: `A featured place from ${city.city}.`,
        tags: [index === 0 ? "Featured" : "Travel spot"],
        canOpen: false,
      });
    });
  });

  return results.slice(0, 8);
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
function getCitySearchResults(cities: City[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  return cities
    .filter((city) => {
      const searchableText = [
        city.city,
        city.country,
        city.description ?? "",
        ...city.stops,
        ...(city.months ?? []),
        ...(city.travelStyles ?? []),
        ...(city.themes ?? []),
        ...(city.categories ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    })
    .slice(0, 4);
}
export function HomeLanding({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [homeCopy, setHomeCopy] = useState(homeCopyVariants[0]);

  useEffect(() => {
    setHomeCopy(pickDailyVariant(homeCopyVariants, "home"));

    const shouldRestore =
      sessionStorage.getItem("travelhubRestoreHomeScroll") === "1";

    if (!shouldRestore) return;

    const savedY = Number(sessionStorage.getItem("travelhubHomeScrollY") ?? "0");

    requestAnimationFrame(() => {
      window.scrollTo({
        top: savedY,
        behavior: "auto",
      });
    });

    sessionStorage.removeItem("travelhubRestoreHomeScroll");
  }, []);

  const currentMonth = getCurrentMonth();
  const isSearching = query.trim().length > 0;

  const thisMonthCities = useMemo(() => {
    const monthly = cities.filter((city) => city.months?.includes(currentMonth));

    if (monthly.length > 0) return monthly.slice(0, 4);

    return cities.slice(0, 4);
  }, [cities, currentMonth]);

  const citySearchResults = useMemo(() => {
    return getCitySearchResults(cities, query);
  }, [cities, query]);

  const searchResults = useMemo(() => {
    return getSpotSearchResults(cities, query);
  }, [cities, query]);

  function rememberHomeScroll() {
    sessionStorage.setItem("travelhubHomeScrollY", String(window.scrollY));
  }

  return (
    <main
      style={pageStyle}
      onClickCapture={(event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        const anchor = target.closest("a");
        const href = anchor?.getAttribute("href");

        if (href?.startsWith("/c/")) {
          rememberHomeScroll();
        }
      }}
    >
      <section style={shellStyle}>
        <section style={heroStyle}>
          <div style={heroTextStyle}>
            <div style={eyebrowStyle}>Travel discovery hub</div>

            <h1 style={heroTitleStyle}>{homeCopy.heroTitle}</h1>

            <p style={heroSubtitleStyle}>{homeCopy.heroSubtitle}</p>

            <div id="home-search" style={searchBoxStyle}>
              <span style={searchIconStyle}>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city, country, season, or spot..."
                style={searchInputStyle}
              />
            </div>

            <div style={heroActionsStyle}>
              <Link href="/discover" style={primaryHeroButtonStyle}>
                Discover by feeling
              </Link>

              <Link href="/cities" style={secondaryHeroButtonStyle}>
                Browse cities
              </Link>
            </div>
          </div>

          <div style={heroPreviewStyle}>
            <div style={heroImageStyle}>
              <div style={floatingCardStyle}>
                <div style={floatingSmallTextStyle}>TravelHub</div>
                <div style={floatingTitleStyle}>{homeCopy.previewTitle}</div>
                <div style={floatingSubStyle}>{homeCopy.previewSub}</div>
              </div>
            </div>
          </div>
        </section>

        {isSearching && (
          <section style={feedSectionStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={smallLabelStyle}>Search results</div>
                <h2 style={sectionTitleStyle}>Matching spots</h2>
              </div>

              <span style={mutedTextStyle}>
                {citySearchResults.length} cities · {searchResults.length} spots
              </span>
            </div>

            {citySearchResults.length > 0 && (
              <div style={cityResultWrapStyle}>
                <h3 style={miniSectionTitleStyle}>Matching cities</h3>

                <div style={cityResultGridStyle}>
                  {citySearchResults.map((city, index) => (
                    <Link
                      key={`${city.slug}-home-city-search-${index}`}
                      href={`/c/${city.slug}?src=home&v=search_city_${city.slug}`}
                      style={cityResultCardStyle}
                    >
                      <div
                        style={{
                          ...cityResultVisualStyle,
                          background: visualForCity(city.slug),
                        }}
                      >
                        <div style={visualBadgeStyle}>{city.country}</div>
                      </div>

                      <div style={cityResultBodyStyle}>
                        <h3 style={cityResultTitleStyle}>{city.city}</h3>
                        <p style={cityResultMetaStyle}>{city.country}</p>
                        <p style={cityResultTextStyle}>
                          {getDisplayStops(city).join(" · ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <h3 style={miniSectionTitleStyle}>Matching spots</h3>

            {searchResults.length === 0 ? (
              <div style={emptyStyle}>
                No matching spots found. Try a city, mood, season, or broader
                keyword.
              </div>
            ) : (
              <div style={resultGridStyle}>
                {searchResults.map((spot, index) => {
                  const href = spot.canOpen
                    ? `/c/${spot.citySlug}/spot/${spot.slug}?src=home&v=search_${spot.citySlug}_${spot.slug}`
                    : `/c/${spot.citySlug}?src=home&v=search_${spot.citySlug}`;

                  return (
                    <Link
                      key={`${spot.citySlug}-${spot.slug}-${index}`}
                      href={href}
                      style={resultCardStyle}
                    >
                      <div
                        style={{
                          ...resultVisualStyle,
                          background: visualForIndex(index),
                        }}
                      >
                        <div style={visualBadgeStyle}>{spot.cityName}</div>
                      </div>

                      <div style={resultBodyStyle}>
                        <div style={resultMetaStyle}>
                          {spot.cityName}, {spot.country}
                        </div>

                        <h3 style={resultTitleStyle}>{spot.name}</h3>

                        <p style={resultTextStyle}>{spot.summary}</p>

                        <div style={chipRowStyle}>
                          {spot.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={`${tag}-${tagIndex}`}
                              style={smallChipStyle}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <section style={quickSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>Start here</div>
              <h2 style={sectionTitleStyle}>Choose how to explore</h2>
            </div>
          </div>

          <div style={quickGridStyle}>
            <Link href="/discover" style={quickCardStyle}>
              <div style={quickLabelStyle}>Discover</div>
              <h3 style={quickTitleStyle}>{homeCopy.discoverTitle}</h3>
              <p style={quickTextStyle}>{homeCopy.discoverText}</p>
            </Link>

            <Link href="/cities" style={quickCardStyle}>
              <div style={quickLabelStyle}>Cities</div>
              <h3 style={quickTitleStyle}>{homeCopy.citiesTitle}</h3>
              <p style={quickTextStyle}>{homeCopy.citiesText}</p>
            </Link>

            <Link href="/spots" style={quickCardStyle}>
              <div style={quickLabelStyle}>Spots</div>
              <h3 style={quickTitleStyle}>{homeCopy.spotsTitle}</h3>
              <p style={quickTextStyle}>{homeCopy.spotsText}</p>
            </Link>
          </div>
        </section>

        <section id="seasonal-preview" style={feedSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>This month</div>
              <h2 style={sectionTitleStyle}>Best places in {currentMonth}</h2>
            </div>

            <Link href="/discover#travel-timing" style={viewAllStyle}>
              Explore by season
            </Link>
          </div>

          <div style={horizontalRailStyle}>
            {thisMonthCities.map((city, index) => (
              <Link
                key={`${city.slug}-home-month-${index}`}
                href={`/c/${city.slug}?src=home&v=home_month_${city.slug}`}
                style={largeRailCardStyle}
              >
                <div
                  style={{
                    ...largeRailVisualStyle,
                    background: visualForCity(city.slug),
                  }}
                >
                  <div style={visualBadgeStyle}>{currentMonth}</div>
                </div>

                <div style={railCardBodyStyle}>
                  <h3 style={railCardTitleStyle}>{city.city}</h3>
                  <p style={railCardCountryStyle}>{city.country}</p>
                  <p style={railCardReasonStyle}>
                    {city.stops.slice(0, 3).join(" · ")}
                  </p>
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
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
  gap: 24,
  alignItems: "center",
  marginBottom: 38,
};

const heroTextStyle: CSSProperties = {
  padding: "20px 0",
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 14,
};

const heroTitleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: "clamp(36px, 10vw, 74px)",
  lineHeight: 1.02,
  letterSpacing: "-0.04em",
  fontWeight: 850,
  overflowWrap: "break-word",
};

const heroSubtitleStyle: CSSProperties = {
  margin: "0 0 24px",
  maxWidth: 580,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.65,
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

const heroActionsStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 14,
};

const primaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  textDecoration: "none",
  border: 0,
  padding: "13px 16px",
  borderRadius: 999,
  background: "#171717",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 850,
  boxShadow: "0 14px 34px rgba(0, 0, 0, 0.16)",
};

const secondaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  textDecoration: "none",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  padding: "13px 16px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.78)",
  color: "#171717",
  fontSize: 14,
  fontWeight: 800,
};

const heroPreviewStyle: CSSProperties = {
  position: "relative",
  minWidth: 0,
};

const heroImageStyle: CSSProperties = {
  minHeight: "clamp(250px, 68vw, 420px)",
  borderRadius: 32,
  background:
    "linear-gradient(135deg, #d9a76f 0%, #b86b4b 42%, #3b2f2f 100%)",
  boxShadow: "0 30px 80px rgba(0, 0, 0, 0.2)",
  position: "relative",
  overflow: "hidden",
};

const floatingCardStyle: CSSProperties = {
  position: "absolute",
  left: 18,
  right: 18,
  bottom: 18,
  padding: 16,
  borderRadius: 22,
  background: "rgba(255, 255, 255, 0.82)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.16)",
};

const floatingSmallTextStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  opacity: 0.55,
  marginBottom: 8,
};

const floatingTitleStyle: CSSProperties = {
  fontSize: "clamp(22px, 7vw, 28px)",
  fontWeight: 850,
  letterSpacing: "-0.035em",
};

const floatingSubStyle: CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.65,
  fontWeight: 650,
};

const feedSectionStyle: CSSProperties = {
  marginBottom: 40,
};

const quickSectionStyle: CSSProperties = {
  marginBottom: 40,
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

const resultGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 14,
};

const resultCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const resultVisualStyle: CSSProperties = {
  height: 150,
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

const resultBodyStyle: CSSProperties = {
  padding: 17,
};

const resultMetaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 13,
  opacity: 0.62,
  fontWeight: 650,
};

const resultTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const resultTextStyle: CSSProperties = {
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

const smallChipStyle: CSSProperties = {
  padding: "7px 9px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  fontWeight: 750,
};

const quickGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 14,
};

const quickCardStyle: CSSProperties = {
  display: "block",
  padding: 20,
  minHeight: 168,
  borderRadius: 28,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 58px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
};

const quickLabelStyle: CSSProperties = {
  marginBottom: 12,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  opacity: 0.52,
  fontWeight: 800,
};

const quickTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const quickTextStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 14,
  lineHeight: 1.55,
  opacity: 0.68,
};

const viewAllStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  padding: "9px 12px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  fontSize: 12,
  fontWeight: 800,
};

const horizontalRailStyle: CSSProperties = {
  display: "flex",
  gap: 14,
  overflowX: "auto",
  padding: "2px 2px 16px",
  scrollSnapType: "x mandatory",
};

const largeRailCardStyle: CSSProperties = {
  display: "block",
  minWidth: "min(78vw, 340px)",
  maxWidth: 360,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 24px 70px rgba(0, 0, 0, 0.1)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
  scrollSnapAlign: "start",
};

const largeRailVisualStyle: CSSProperties = {
  height: 210,
  position: "relative",
};

const railCardBodyStyle: CSSProperties = {
  padding: 18,
};

const railCardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 25,
  lineHeight: 1.05,
  letterSpacing: "-0.045em",
  fontWeight: 850,
};

const railCardCountryStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const railCardReasonStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 14,
  lineHeight: 1.45,
  opacity: 0.72,
};

const emptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.78)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  fontSize: 14,
  lineHeight: 1.6,
  opacity: 0.72,
};

const cityResultWrapStyle: CSSProperties = {
  marginBottom: 22,
};

const miniSectionTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 17,
  letterSpacing: "-0.025em",
  fontWeight: 850,
};

const cityResultGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 14,
};

const cityResultCardStyle: CSSProperties = {
  display: "block",
  borderRadius: 26,
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.07)",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
};

const cityResultVisualStyle: CSSProperties = {
  height: 120,
  position: "relative",
};

const cityResultBodyStyle: CSSProperties = {
  padding: 16,
};

const cityResultTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const cityResultMetaStyle: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 13,
  opacity: 0.62,
  fontWeight: 650,
};

const cityResultTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.45,
  opacity: 0.7,
};



