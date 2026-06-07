"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City, Spot } from "@/data/types";
import { getCityImage, getSpotImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";
import { HomeSearchResults } from "@/components/HomeSearchResults";
import { HomeSeasonalPicks } from "@/components/HomeSeasonalPicks";

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
  imageUrl?: string;
  imagePosition?: string;
  canOpen: boolean;
};

type FeaturedSpotItem = SpotSearchResult;

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

function getShortText(value: string | undefined, fallback: string, maxLength = 140) {
  const text = value?.trim() || fallback;

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getCityImageUrl(city: City) {
  const image = getCityImage(city.slug);

  return getOptionalHttpUrl(city.imageUrl) || image.imageUrl;
}

function getCityCardStyle(city: City): CSSProperties {
  return {
    ...editorCardStyle,
    backgroundImage: getImageBackground(
      getCityImageUrl(city),
      "linear-gradient(180deg, rgba(31,26,23,0.08) 0%, rgba(31,26,23,0.7) 100%)",
      "linear-gradient(135deg, #d9c7ad 0%, #f5efe6 54%, #b58a63 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(city.imagePosition),
  };
}

function getHeroStyle(city: City | null): CSSProperties {
  const imageUrl = city ? getCityImageUrl(city) : "";

  return {
    ...heroStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(90deg, rgba(31,26,23,0.82) 0%, rgba(31,26,23,0.52) 54%, rgba(31,26,23,0.16) 100%), linear-gradient(180deg, rgba(31,26,23,0.1) 0%, rgba(31,26,23,0.68) 100%)",
      "linear-gradient(135deg, #2a211c 0%, #7e5d43 50%, #f5efe6 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: city
      ? getCssImagePosition(city.imagePosition)
      : "center",
  };
}

function getFeaturedSpotImageUrl(spot: FeaturedSpotItem) {
  const image = getSpotImage(spot.citySlug, spot.slug);

  return getOptionalHttpUrl(spot.imageUrl) || image.imageUrl;
}

function getFeaturedSpotCardStyle(spot: FeaturedSpotItem): CSSProperties {
  return {
    ...featureCardStyle,
    backgroundImage: getImageBackground(
      getFeaturedSpotImageUrl(spot),
      "linear-gradient(180deg, rgba(31,26,23,0.04) 0%, rgba(31,26,23,0.72) 100%)",
      "linear-gradient(135deg, #cab394 0%, #fffdf8 52%, #9a6a43 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(spot.imagePosition),
  };
}

function getCityIntro(city: City) {
  const stops = getDisplayStops(city, 2);
  const fallback =
    stops.length > 0
      ? `Start with ${stops.join(" and ")}.`
      : `Open the ${city.city} guide for a slower look at the city.`;

  return getShortText(city.description, fallback, 132);
}

function getSpotSummary(spot: Spot, city: City) {
  return getShortText(
    spot.summary,
    `A memorable stop inside the ${city.city} guide.`,
    124
  );
}

function getFeaturedSpots(cities: City[]) {
  const spots: FeaturedSpotItem[] = [];

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
          summary: getSpotSummary(spot, city),
          imageUrl: spot.imageUrl,
          imagePosition: spot.imagePosition,
          canOpen: true,
        });
      });

      return;
    }

    getDisplayStops(city, 2).forEach((stop) => {
      spots.push({
        citySlug: city.slug,
        cityName: city.city,
        country: city.country,
        slug: slugify(stop),
        name: stop,
        summary: `A place to begin a slower wander through ${city.city}.`,
        canOpen: false,
      });
    });
  });

  return spots.slice(0, 6);
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
          imageUrl: spot.imageUrl,
          imagePosition: spot.imagePosition,
          canOpen: true,
        });
      });

      return;
    }

    city.stops.forEach((stop) => {
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
  const heroCity = cities[0] ?? null;
  const editorCities = cities.slice(0, 4);
  const featuredSpots = useMemo(() => getFeaturedSpots(cities), [cities]);

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
      <section style={heroShellStyle}>
        <section style={getHeroStyle(heroCity)}>
          <div style={heroContentStyle}>
            <div style={heroEyebrowStyle}>Destination discovery</div>

            <h1 style={heroTitleStyle}>
              Find your next city to stay, wander, and remember.
            </h1>

            <p style={heroSubtitleStyle}>
              Photo-led city guides and memorable places for travelers arriving
              from short-form inspiration and looking for the next real trip.
            </p>

            <div style={heroActionsStyle}>
              <Link href="/cities" style={primaryHeroButtonStyle}>
                Explore cities
              </Link>

              <Link href="/spots" style={secondaryHeroButtonStyle}>
                Browse featured spots
              </Link>
            </div>

            {heroCity && (
              <div style={heroPlaceStyle}>
                <span style={heroPlaceLabelStyle}>Featured guide</span>
                <span>
                  {heroCity.city}, {heroCity.country}
                </span>
              </div>
            )}
          </div>
        </section>
      </section>

      <section style={shellStyle}>
        <section style={searchArchiveStyle}>
          <div style={searchCopyStyle}>
            <div style={smallLabelStyle}>Travel archive</div>
            <h2 style={searchTitleStyle}>Search softly, after the spark.</h2>
          </div>

          <div id="home-search" style={searchBoxStyle}>
            <span style={searchIconStyle}>Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="City, country, season, or spot"
              style={searchInputStyle}
            />
          </div>
        </section>

        {isSearching && (
          <HomeSearchResults
            cityResults={citySearchResults}
            spotResults={searchResults}
            query={query.trim()}
          />
        )}

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionHeaderTextStyle}>
              <div style={smallLabelStyle}>Editor's Picks</div>
              <h2 style={sectionTitleStyle}>City guides with a point of view</h2>
            </div>

            <Link href="/cities" style={textLinkStyle}>
              Explore cities
            </Link>
          </div>

          {editorCities.length === 0 ? (
            <div style={emptyStyle}>No city guides are available yet.</div>
          ) : (
            <div style={editorGridStyle}>
              {editorCities.map((city) => (
                <Link
                  key={`${city.slug}-home-editor-card`}
                  href={`/c/${city.slug}`}
                  style={getCityCardStyle(city)}
                >
                  <div style={imageCardTextStyle}>
                    <div style={imageMetaStyle}>{city.country}</div>
                    <h3 style={imageCardTitleStyle}>{city.city}</h3>
                    <p style={imageCardCopyStyle}>{getCityIntro(city)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionHeaderTextStyle}>
              <div style={smallLabelStyle}>Recently Featured</div>
              <h2 style={sectionTitleStyle}>Places pulled from the feed</h2>
            </div>

            <Link href="/spots" style={textLinkStyle}>
              Browse spots
            </Link>
          </div>

          {featuredSpots.length === 0 ? (
            <div style={emptyStyle}>No featured spots are available yet.</div>
          ) : (
            <div style={featureGridStyle}>
              {featuredSpots.map((spot, index) => (
                <Link
                  key={`${spot.citySlug}-${spot.slug}-${index}-home-feature-card`}
                  href={
                    spot.canOpen
                      ? `/c/${spot.citySlug}/spot/${spot.slug}`
                      : `/c/${spot.citySlug}`
                  }
                  style={getFeaturedSpotCardStyle(spot)}
                >
                  <div style={imageCardTextStyle}>
                    <div style={imageMetaStyle}>
                      {spot.cityName}, {spot.country}
                    </div>
                    <h3 style={featureCardTitleStyle}>{spot.name}</h3>
                    <p style={imageCardCopyStyle}>{spot.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <HomeSeasonalPicks cities={thisMonthCities} currentMonth={currentMonth} />

        <section style={footerCtaStyle}>
          <div>
            <div style={smallLabelStyle}>Where to next</div>
            <h2 style={footerTitleStyle}>Start with the destination, not the booking form.</h2>
          </div>

          <Link href="/cities" style={footerButtonStyle}>
            Explore destinations
          </Link>
        </section>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  background: "#F7F2EA",
  color: "#1F1A17",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const heroShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1240,
  margin: "0 auto",
  padding: "20px 12px 0",
  boxSizing: "border-box",
};

const heroStyle: CSSProperties = {
  minHeight: 620,
  borderRadius: 8,
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-end",
  padding: "34px 22px",
  boxShadow: "0 24px 70px rgba(42, 33, 28, 0.18)",
};

const heroContentStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  maxWidth: 820,
  color: "#FFF8EF",
};

const heroEyebrowStyle: CSSProperties = {
  marginBottom: 14,
  color: "#E9D2B8",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "min(820px, 100%)",
  fontSize: "clamp(38px, 10.5vw, 52px)",
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
  overflowWrap: "break-word",
};

const heroSubtitleStyle: CSSProperties = {
  margin: "18px 0 0",
  maxWidth: 620,
  color: "rgba(255, 248, 239, 0.86)",
  fontSize: 17,
  lineHeight: 1.72,
};

const heroActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 24,
};

const primaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 8,
  background: "#FFF8EF",
  color: "#2A211C",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const secondaryHeroButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 8,
  background: "rgba(255, 248, 239, 0.08)",
  border: "1px solid rgba(255, 248, 239, 0.44)",
  color: "#FFF8EF",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 820,
};

const heroPlaceStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 26,
  color: "rgba(255, 248, 239, 0.86)",
  fontSize: 13,
  lineHeight: 1.5,
};

const heroPlaceLabelStyle: CSSProperties = {
  color: "#E9D2B8",
  fontWeight: 850,
  textTransform: "uppercase",
  fontSize: 11,
  letterSpacing: 0,
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  padding: "26px 16px 64px",
  boxSizing: "border-box",
};

const searchArchiveStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 18,
  alignItems: "center",
  padding: "22px 0 28px",
  borderBottom: "1px solid #E4D8C8",
};

const searchCopyStyle: CSSProperties = {
  minWidth: 0,
};

const smallLabelStyle: CSSProperties = {
  marginBottom: 8,
  color: "#9A6A43",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const searchTitleStyle: CSSProperties = {
  margin: 0,
  color: "#1F1A17",
  fontSize: 24,
  lineHeight: 1.18,
  letterSpacing: 0,
  fontWeight: 850,
};

const searchBoxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  maxWidth: 520,
  justifySelf: "end",
  padding: "8px 10px 8px 14px",
  borderRadius: 8,
  background: "#FFFDF8",
  border: "1px solid #E4D8C8",
  boxShadow: "0 10px 30px rgba(42, 33, 28, 0.06)",
};

const searchIconStyle: CSSProperties = {
  flexShrink: 0,
  color: "#9A6A43",
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
};

const searchInputStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "13px 4px",
  border: 0,
  outline: "none",
  background: "transparent",
  color: "#1F1A17",
  fontSize: 15,
};

const sectionStyle: CSSProperties = {
  marginTop: 48,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-end",
  marginBottom: 18,
  flexWrap: "wrap",
};

const sectionHeaderTextStyle: CSSProperties = {
  flex: "1 0 100%",
  minWidth: 0,
  maxWidth: "100%",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  width: "100%",
  maxWidth: "clamp(300px, 66vw, 720px)",
  color: "#1F1A17",
  fontSize: "clamp(24px, 6vw, 34px)",
  lineHeight: 1.18,
  letterSpacing: 0,
  fontWeight: 850,
  overflowWrap: "break-word",
};

const textLinkStyle: CSSProperties = {
  flexShrink: 0,
  color: "#9A6A43",
  fontSize: 14,
  fontWeight: 850,
  textDecoration: "none",
};

const editorGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const editorCardStyle: CSSProperties = {
  position: "relative",
  minHeight: 460,
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
  borderRadius: 8,
  color: "#FFF8EF",
  textDecoration: "none",
  backgroundColor: "#D8C7B3",
  boxShadow: "0 18px 40px rgba(42, 33, 28, 0.12)",
};

const imageCardTextStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: 18,
};

const imageMetaStyle: CSSProperties = {
  marginBottom: 8,
  color: "rgba(255, 248, 239, 0.78)",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const imageCardTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "100%",
  color: "#FFF8EF",
  fontSize: "clamp(26px, 7vw, 30px)",
  lineHeight: 1.12,
  letterSpacing: 0,
  fontWeight: 850,
  overflowWrap: "break-word",
};

const imageCardCopyStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: "clamp(240px, 72vw, 420px)",
  color: "rgba(255, 248, 239, 0.82)",
  fontSize: 14,
  lineHeight: 1.58,
  overflowWrap: "break-word",
};

const featureGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: 16,
};

const featureCardStyle: CSSProperties = {
  position: "relative",
  minHeight: 380,
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
  borderRadius: 8,
  color: "#FFF8EF",
  textDecoration: "none",
  backgroundColor: "#D8C7B3",
  boxShadow: "0 14px 34px rgba(42, 33, 28, 0.1)",
};

const featureCardTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: "100%",
  color: "#FFF8EF",
  fontSize: "clamp(22px, 6vw, 25px)",
  lineHeight: 1.16,
  letterSpacing: 0,
  fontWeight: 850,
  overflowWrap: "break-word",
};

const footerCtaStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 18,
  flexWrap: "wrap",
  marginTop: 54,
  padding: "28px 0 4px",
  borderTop: "1px solid #E4D8C8",
};

const footerTitleStyle: CSSProperties = {
  margin: 0,
  width: "100%",
  maxWidth: "clamp(300px, 66vw, 620px)",
  color: "#1F1A17",
  fontSize: "clamp(25px, 7vw, 30px)",
  lineHeight: 1.16,
  letterSpacing: 0,
  fontWeight: 850,
  overflowWrap: "break-word",
};

const footerButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 8,
  background: "#2A211C",
  color: "#FFF8EF",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const emptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 8,
  background: "#FFFDF8",
  border: "1px solid #E4D8C8",
  color: "#6F6258",
  fontSize: 14,
};
