"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { HomeSearchResults } from "@/components/HomeSearchResults";
import { HomeSeasonalPicks } from "@/components/HomeSeasonalPicks";
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
  imageUrl?: string;
  imagePosition?: string;
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
          imageUrl: spot.imageUrl,
          imagePosition: spot.imagePosition,
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


export function HomeLanding({ cities }: Props) {
  const [query, setQuery] = useState("");
  const [homeCopy] = useState(() => pickDailyVariant(homeCopyVariants, "home"));

  useEffect(() => {
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

  const monthlyCities = cities.filter((city) => city.months?.includes(currentMonth));
  const thisMonthCities =
    monthlyCities.length > 0 ? monthlyCities.slice(0, 4) : cities.slice(0, 4);

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
