import Link from "next/link";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";
import {
  getCssImagePosition,
  getImageBackground,
  getOptionalHttpUrl,
} from "@/lib/url-fields";

type Props = {
  cities: City[];
  currentMonth: string;
};

function getReason(city: City) {
  const stops = getDisplayStops(city, 2);

  if (city.travelStyles && city.travelStyles.length > 0) {
    return `Good for ${city.travelStyles.slice(0, 2).join(" and ").toLowerCase()} trips.`;
  }

  if (stops.length > 0) {
    return `Start with ${stops.join(" and ")}.`;
  }

  return "Open the city guide to see why it fits this season.";
}

function getCardStyle(city: City): CSSProperties {
  const image = getCityImage(city.slug);
  const imageUrl = getOptionalHttpUrl(city.imageUrl) || image.imageUrl;

  return {
    ...cardStyle,
    backgroundImage: getImageBackground(
      imageUrl,
      "linear-gradient(180deg, rgba(255,255,255,0), rgba(23,32,42,.08))",
      "linear-gradient(135deg, #e8f4ff, #edf8f2)"
    ),
    backgroundSize: "cover",
    backgroundPosition: getCssImagePosition(city.imagePosition),
  };
}

export function HomeSeasonalPicks({ cities, currentMonth }: Props) {
  return (
    <section id="seasonal-preview" style={wrapStyle}>
      <div style={sectionHeaderStyle}>
        <div>
          <div style={smallLabelStyle}>Seasonal picks</div>
          <h2 style={sectionTitleStyle}>Best places in {currentMonth}</h2>
        </div>

        <Link href="/discover#travel-timing" style={viewAllStyle}>
          Explore by season
        </Link>
      </div>

      {cities.length === 0 ? (
        <div style={emptyStyle}>
          No seasonal picks are available for {currentMonth} yet.
        </div>
      ) : (
        <div style={gridStyle}>
          {cities.slice(0, 6).map((city) => {
            const stops = getDisplayStops(city, 3);

            return (
              <Link
                key={`${city.slug}-home-seasonal-card`}
                href={`/c/${city.slug}?src=home&v=seasonal_${currentMonth}_${city.slug}`}
                style={getCardStyle(city)}
              >
                <div style={monthBadgeStyle}>{currentMonth}</div>

                <div style={textPanelStyle}>
                  <div style={metaStyle}>{city.country}</div>

                  <h3 style={cardTitleStyle}>{city.city}</h3>

                  <p style={cardTextStyle}>{getReason(city)}</p>

                  {stops.length > 0 && (
                    <div style={chipRowStyle}>
                      {stops.map((stop, index) => (
                        <span key={`${city.slug}-${stop}-${index}`} style={chipStyle}>
                          {stop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
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

const viewAllStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 12px",
  borderRadius: 999,
  background: "#e8f1ff",
  color: "#1769e0",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  border: "1px solid rgba(23, 105, 224, 0.12)",
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

const monthBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
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
