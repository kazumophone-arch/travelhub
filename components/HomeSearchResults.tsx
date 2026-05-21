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
    backgroundImage: `url("${image.imageUrl}")`,
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
    backgroundImage: `url("${image.imageUrl}")`,
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
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#9a6a2f",
  fontWeight: 850,
  marginBottom: 7,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 5.6vw, 32px)",
  lineHeight: 1.08,
  letterSpacing: "-0.045em",
  fontWeight: 850,
  color: "#17202a",
};

const resultBlockStyle: CSSProperties = {
  marginTop: 18,
};

const miniTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 17,
  letterSpacing: "-0.025em",
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
  minHeight: 350,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  textDecoration: "none",
  color: "#ffffff",
  backgroundColor: "#17202a",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 14px 36px rgba(30, 64, 88, 0.16)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  maxWidth: "calc(100% - 28px)",
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
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
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12, 22, 30, 0.54)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.78)",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(23px, 5.8vw, 28px)",
  lineHeight: 1.04,
  letterSpacing: "-0.045em",
  color: "#ffffff",
  fontWeight: 850,
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255, 255, 255, 0.84)",
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
  background: "rgba(255, 255, 255, 0.16)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.22)",
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

