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
      "linear-gradient(180deg, rgba(31,26,23,0.04) 0%, rgba(31,26,23,0.72) 100%)",
      "linear-gradient(135deg, #d9c7ad 0%, #FFFFFF 54%, #BF9B30 100%)"
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
          <div style={smallLabelStyle}>Seasonal Inspiration</div>
          <h2 style={sectionTitleStyle}>Where {currentMonth} changes the mood</h2>
          <p style={sectionCopyStyle}>
            A quiet seasonal edit from the city guides already in TravelHub.
          </p>
        </div>

        <Link href="/discover#travel-timing" style={viewAllStyle}>
          Explore by season
        </Link>
      </div>

      {cities.length === 0 ? (
        <div style={emptyStyle}>
          No seasonal inspiration is available for {currentMonth} yet.
        </div>
      ) : (
        <div style={gridStyle}>
          {cities.slice(0, 6).map((city) => (
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginTop: 52,
};

const sectionHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-end",
  marginBottom: 18,
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
  fontSize: 34,
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
};

const sectionCopyStyle: CSSProperties = {
  margin: "10px 0 0",
  maxWidth: 560,
  color: "#6B87A8",
  fontSize: 15,
  lineHeight: 1.65,
};

const viewAllStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 40,
  padding: "0 14px",
  borderRadius: 8,
  background: "#FFFFFF",
  color: "#BF9B30",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
  border: "1px solid #D8E2F0",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 390,
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
  borderRadius: 8,
  color: "#FFFFFF",
  textDecoration: "none",
  backgroundColor: "#D8E2F0",
  boxShadow: "0 14px 34px rgba(42, 33, 28, 0.1)",
};

const monthBadgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  zIndex: 3,
  padding: "7px 10px",
  borderRadius: 8,
  background: "rgba(255, 248, 239, 0.9)",
  border: "1px solid rgba(255, 248, 239, 0.52)",
  color: "#0D2B52",
  fontSize: 12,
  fontWeight: 850,
};

const textPanelStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
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
  fontSize: 28,
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
