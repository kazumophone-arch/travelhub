import Link from "next/link";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage, getSpotImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

type SpotSearchResult = {
  citySlug?: string;
  cityName?: string;
  country?: string;
  slug?: string;
  spotSlug?: string;
  name?: string;
  summary?: string;
  imageUrl?: string;
  imagePosition?: string;
  canOpen?: boolean;
};

type Props = {
  cityResults: City[];
  spotResults: SpotSearchResult[];
  query: string;
};

function getCityCardStyle(city: City): CSSProperties {
  const image = getCityImage(city.slug);
  const imageUrl = getOptionalHttpUrl(city.imageUrl) || image.imageUrl;

  return {
    ...cardStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(180deg, rgba(31,26,23,0.04) 0%, rgba(31,26,23,0.72) 100%)",
      "linear-gradient(135deg, #d9c7ad 0%, #FFFFFF 56%, #BF9B30 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(city.imagePosition),
  };
}

function getSpotCardStyle(spot: SpotSearchResult): CSSProperties {
  const citySlug = spot.citySlug ?? "travelhub";
  const spotSlug = spot.slug ?? spot.spotSlug ?? spot.name ?? "spot";
  const image = getSpotImage(citySlug, spotSlug);
  const imageUrl = getOptionalHttpUrl(spot.imageUrl) || image.imageUrl;

  return {
    ...cardStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(180deg, rgba(31,26,23,0.04) 0%, rgba(31,26,23,0.74) 100%)",
      "linear-gradient(135deg, #cab394 0%, #FFFFFF 56%, #BF9B30 100%)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(spot.imagePosition),
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
          <h2 style={sectionTitleStyle}>Places matching "{query}"</h2>
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
                <div style={textPanelStyle}>
                  <div style={metaStyle}>{city.country}</div>

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
                  <div style={textPanelStyle}>
                    <div style={metaStyle}>{cityLabel || "Spot guide"}</div>

                    <h3 style={cardTitleStyle}>{spot.name ?? "Travel spot"}</h3>

                    <p style={cardTextStyle}>
                      {spot.summary ?? "Open the guide to see why this place fits the trip."}
                    </p>
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
  marginBottom: 8,
  color: "#BF9B30",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  color: "#0D2B52",
  fontSize: 30,
  lineHeight: 1.1,
  letterSpacing: 0,
  fontWeight: 850,
};

const resultBlockStyle: CSSProperties = {
  marginTop: 20,
};

const miniTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  color: "#6B87A8",
  fontSize: 13,
  letterSpacing: 0,
  textTransform: "uppercase",
  fontWeight: 850,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 360,
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
  borderRadius: 8,
  color: "#FFFFFF",
  textDecoration: "none",
  backgroundColor: "#D8E2F0",
  boxShadow: "0 14px 34px rgba(42, 33, 28, 0.1)",
};

const textPanelStyle: CSSProperties = {
  width: "100%",
  padding: 18,
};

const metaStyle: CSSProperties = {
  marginBottom: 8,
  color: "rgba(255, 248, 239, 0.78)",
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  color: "#FFFFFF",
  fontSize: 26,
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(255, 248, 239, 0.82)",
  fontSize: 14,
  lineHeight: 1.58,
};

const emptyStyle: CSSProperties = {
  padding: 20,
  borderRadius: 8,
  background: "#FFFFFF",
  border: "1px solid #D8E2F0",
  color: "#6B87A8",
  fontSize: 14,
};
