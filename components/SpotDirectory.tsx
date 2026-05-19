"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";

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

export function SpotDirectory({ cities }: Props) {
  const [query, setQuery] = useState("");

  const allSpots = useMemo(() => collectSpots(cities), [cities]);

  const filteredSpots = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return allSpots;

    return allSpots.filter((spot) => {
      const searchableText = [
        spot.name,
        spot.summary,
        ...spot.highlights,
        ...spot.tags,
        spot.cityName,
        spot.country,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [allSpots, query]);

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

          <div style={eyebrowStyle}>Spot directory</div>

          <h1 style={titleStyle}>Explore by place.</h1>

          <p style={subtitleStyle}>
            Search featured travel spots directly, then open the related city or
            spot page for more context.
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

        <section style={contentStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={smallLabelStyle}>All spots</div>
              <h2 style={sectionTitleStyle}>Choose a place</h2>
            </div>

            <span style={mutedTextStyle}>
              {filteredSpots.length} / {allSpots.length} spots
            </span>
          </div>

          {filteredSpots.length === 0 ? (
            <div style={emptyStyle}>
              No spots found. Try a broader keyword like canal, castle, beach,
              old town, sunset, or the city name.
            </div>
          ) : (
            <div style={spotGridStyle}>
              {filteredSpots.map((spot, index) => {
                const href = spot.canOpen
                  ? `/c/${spot.citySlug}/spot/${spot.slug}?src=spots&v=spots_${spot.citySlug}_${spot.slug}`
                  : `/c/${spot.citySlug}?src=spots&v=spots_${spot.citySlug}`;

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
                        {(spot.tags.length > 0 ? spot.tags : spot.highlights)
                          .slice(0, 3)
                          .map((tag, tagIndex) => (
                            <span
                              key={`${tag}-${tagIndex}`}
                              style={chipStyle}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>

                      <div style={openTextStyle}>
                        {spot.canOpen ? "Open spot" : "Open city"}
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
  marginBottom: 34,
};

const homeLinkStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 22,
  color: "inherit",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 800,
  opacity: 0.72,
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

const contentStyle: CSSProperties = {
  marginTop: 10,
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


