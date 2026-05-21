import Link from "next/link";
import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getCityImage } from "@/data/travel-images";
import { getDisplayStops } from "@/lib/displayText";

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

  return {
    ...cardStyle,
    backgroundImage: `url("${image.imageUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
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

const viewAllStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 12px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  border: "1px solid rgba(168, 116, 50, 0.14)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 370,
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

const monthBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
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
