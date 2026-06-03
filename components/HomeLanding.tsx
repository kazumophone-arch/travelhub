"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { HomeSearchResults } from "@/components/HomeSearchResults";
import { HomeSeasonalPicks } from "@/components/HomeSeasonalPicks";
import { getCityImage } from "@/data/travel-images";
import { getMapMagazineVisual } from "@/lib/mapMagazineVisuals";
import { getDisplayStops } from "@/lib/displayText";
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
function visualForIndex(index: number) {
  const visuals = [
    "#f4faf8",
    "#f4faf8",
    "#f4faf8",
    "#f4faf8",
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



function getHomePhotoCardStyle(city: City, baseStyle: CSSProperties): CSSProperties {
  const image = getCityImage(city.slug);

  return {
    ...baseStyle,
    backgroundImage: `url("${image.imageUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
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
        </section>
        {isSearching && (
          <HomeSearchResults
            cityResults={citySearchResults}
            spotResults={searchResults}
            query={query.trim()}
          />
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
        <HomeSeasonalPicks cities={thisMonthCities} currentMonth={currentMonth} />
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 46%, #f6faf8 100%)",
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
  display: "block",
  maxWidth: 820,
  marginBottom: 34,
  padding: "18px 0 4px",
};

const heroTextStyle: CSSProperties = {
  padding: "20px 0",
  minWidth: 0,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#1769e0",
  fontWeight: 850,
  marginBottom: 14,
};

const heroTitleStyle: CSSProperties = {
  margin: "0 0 14px",
  maxWidth: 700,
  fontSize: 44,
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
};

const heroSubtitleStyle: CSSProperties = {
  margin: "0 0 22px",
  maxWidth: 620,
  fontSize: 16,
  lineHeight: 1.72,
  color: "#4c5f6f",
};

const searchBoxStyle: CSSProperties = {
  maxWidth: 570,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 8px 7px 16px",
  borderRadius: 22,
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
  background: "#1769e0",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 850,
  boxShadow: "0 12px 28px rgba(23, 105, 224, 0.24)",
};

const secondaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  textDecoration: "none",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  padding: "13px 16px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#17202a",
  fontSize: 14,
  fontWeight: 800,
};

const feedSectionStyle: CSSProperties = {
  marginTop: 34,
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
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#138a72",
  fontWeight: 850,
  marginBottom: 7,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 30,
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#17202a",
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
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 8px 22px rgba(30, 64, 88, 0.07)",
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
  background: "#ffffff",
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
  letterSpacing: 0,
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
  background: "#eef8f5",
  fontSize: 12,
  fontWeight: 750,
};

const quickGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: 14,
};

const quickCardStyle: CSSProperties = {
  display: "block",
  minHeight: 142,
  padding: 18,
  borderRadius: 22,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.1)",
  boxShadow: "0 10px 24px rgba(30, 64, 88, 0.08)",
  color: "inherit",
  textDecoration: "none",
};

const quickLabelStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  marginBottom: 13,
  padding: "6px 9px",
  borderRadius: 999,
  background: "#e8f1ff",
  border: "1px solid rgba(23, 105, 224, 0.12)",
  color: "#1769e0",
  fontSize: 11,
  letterSpacing: 0,
  textTransform: "uppercase",
  fontWeight: 850,
};

const quickTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.1,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#17202a",
};

const quickTextStyle: CSSProperties = {
  margin: "9px 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};

const viewAllStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 12px",
  borderRadius: 999,
  background: "#eef8f5",
  color: "#138a72",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  border: "1px solid rgba(19, 138, 114, 0.14)",
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
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
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
  letterSpacing: 0,
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
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
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
  letterSpacing: 0,
  fontWeight: 850,
};

const cityResultGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 14,
};

const cityResultCardStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minHeight: 340,
  borderRadius: 24,
  color: "#ffffff",
  textDecoration: "none",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 12px 34px rgba(30, 64, 88, 0.16)",
  backgroundColor: "#17202a",
};

const cityResultVisualStyle: CSSProperties = {
  minHeight: 145,
  flex: 1,
  position: "relative",
};

const cityResultBodyStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: "0 12px 12px",
  padding: 16,
  borderRadius: 20,
  background: "rgba(12, 22, 30, 0.54)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const cityResultTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 23,
  lineHeight: 1.06,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#ffffff",
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const cityResultMetaStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 13,
  color: "rgba(255, 255, 255, 0.84)",
  fontWeight: 750,
};

const cityResultTextStyle: CSSProperties = {
  margin: "9px 0 0",
  fontSize: 13,
  lineHeight: 1.48,
  color: "rgba(255, 255, 255, 0.84)",
};

const destinationCardStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minHeight: 360,
  borderRadius: 24,
  color: "#ffffff",
  textDecoration: "none",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 12px 34px rgba(30, 64, 88, 0.16)",
  backgroundColor: "#17202a",
};

const destinationVisualStyle: CSSProperties = {
  minHeight: 160,
  flex: 1,
  position: "relative",
};

const destinationBodyStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: "0 12px 12px",
  padding: 16,
  borderRadius: 20,
  background: "rgba(12, 22, 30, 0.54)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const destinationTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 5.8vw, 26px)",
  lineHeight: 1.06,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#ffffff",
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const destinationCountryStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 13,
  color: "rgba(255, 255, 255, 0.84)",
  fontWeight: 750,
};

const destinationReasonStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.5,
  color: "rgba(255, 255, 255, 0.84)",
};

const monthBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const countryBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};






