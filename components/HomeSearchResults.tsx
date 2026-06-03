import Link from "next/link";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage, getSpotImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";

type SpotSearchResult = {
  citySlug?: string;
  cityName?: string;
  country?: string;
  slug?: string;
  spotSlug?: string;
  name?: string;
  summary?: string;
  tags?: string[];
  canOpen?: boolean;
};

type Props = {
  cityResults: City[];
  spotResults: SpotSearchResult[];
  query: string;
};

function getCityCardStyle(city: City): CSSProperties {
  const image = getCityImage(city.slug);

  return {
    ...cardStyle,
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0), rgba(23,32,42,.08)), url("${image.imageUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function getSpotCardStyle(spot: SpotSearchResult): CSSProperties {
  const citySlug = spot.citySlug ?? "travelhub";
  const spotSlug = spot.slug ?? spot.spotSlug ?? spot.name ?? "spot";
  const image = getSpotImage(citySlug, spotSlug);

  return {
    ...cardStyle,
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0), rgba(23,32,42,.08)), url("${image.imageUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

function getSpotHref(spot: SpotSearchResult) {
  const citySlug = spot.citySlug ?? "";
  const spotSlug = spot.slug ?? spot.spotSlug ?? "";

  if (citySlug && spotSlug && spot.canOpen !== false) {
    return `/c/${citySlug}/spot/${spotSlug}?src=home-search&v=spot_${citySlug}_${spotSlug}`;
  }

  if (citySlug) {
    return `/c/${citySlug}?src=home-search&v=spot_city_${citySlug}`;
  }

  return "/spots";
}

export function HomeSearchResults({ cityResults, spotResults, query }: Props) {
  const hasCities = cityResults.length > 0;
  const hasSpots = spotResults.length > 0;

  if (!hasCities && !hasSpots) {
    return (
      <section style={wrapStyle}>
        <div style={emptyStyle}>
          No results found for <strong>{query}</strong>. Try a city, country,
          spot, season, or travel style.
        </div>
      </section>
    );
  }

  return (
    <section style={wrapStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>Search results</div>
          <h2 style={sectionTitleStyle}>Places matching “{query}”</h2>
        </div>
      </div>

      {hasCities && (
        <div style={resultBlockStyle}>
          <h3 style={miniTitleStyle}>Matching cities</h3>

          <div style={gridStyle}>
            {cityResults.slice(0, 6).map((city) => (
              <Link
                key={`${city.slug}-home-search-city-card`}
                href={`/c/${city.slug}?src=home-search&v=city_${city.slug}`}
                style={getCityCardStyle(city)}
              >
                <div style={badgeStyle}>{city.country}</div>

                <div style={textPanelStyle}>
                  <div style={metaStyle}>City guide</div>

                  <h3 style={cardTitleStyle}>{city.city}</h3>

                  <p style={cardTextStyle}>
                    {getDisplayStops(city).length > 0
                      ? getDisplayStops(city).join(" · ")
                      : `Open the ${city.city} guide`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasSpots && (
        <div style={resultBlockStyle}>
          <h3 style={miniTitleStyle}>Matching spots</h3>

          <div style={gridStyle}>
            {spotResults.slice(0, 6).map((spot, index) => {
              const cityLabel = [spot.cityName, spot.country]
                .filter(Boolean)
                .join(", ");

              return (
                <Link
                  key={`${spot.citySlug ?? "city"}-${spot.slug ?? spot.name ?? index}-home-search-spot-card`}
                  href={getSpotHref(spot)}
                  style={getSpotCardStyle(spot)}
                >
                  <div style={badgeStyle}>{cityLabel || "Spot"}</div>

                  <div style={textPanelStyle}>
                    <div style={metaStyle}>Spot guide</div>

                    <h3 style={cardTitleStyle}>{spot.name ?? "Travel spot"}</h3>

                    <p style={cardTextStyle}>
                      {spot.summary ?? "Open the guide to see why this place fits the trip."}
                    </p>

                    {spot.tags && spot.tags.length > 0 && (
                      <div style={chipRowStyle}>
                        {spot.tags.slice(0, 3).map((tag) => (
                          <span key={tag} style={chipStyle}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginTop: 34,
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

const resultBlockStyle: CSSProperties = {
  marginTop: 18,
};

const miniTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 17,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#17202a",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 410,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  textDecoration: "none",
  color: "#17202a",
  backgroundColor: "#edf8f2",
  border: "1px solid rgba(23, 32, 42, 0.1)",
  boxShadow: "0 12px 28px rgba(30, 64, 88, 0.12)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  maxWidth: "calc(100% - 28px)",
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const textPanelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  padding: 18,
  borderRadius: "0 0 26px 26px",
  background: "#ffffff",
  borderTop: "1px solid rgba(23, 32, 42, 0.08)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#607080",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.12,
  letterSpacing: 0,
  color: "#17202a",
  fontWeight: 850,
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "#4c5f6f",
};

const chipRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 7,
  marginTop: 14,
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

const emptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  color: "#607080",
  fontSize: 14,
};

