import Link from "next/link";
import type { CSSProperties } from "react";

type CityLike = {
  slug: string;
  city: string;
};

type FeaturedSpot = {
  name: string;
  slug?: string;
  summary?: string;
  description?: string;
  categories?: string[];
  tags?: string[];
};

type Props = {
  city: CityLike;
  spots: FeaturedSpot[];
};

function getImageUrl(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1000/700`;
}

function getSpotText(spot: FeaturedSpot) {
  return (
    spot.summary ??
    spot.description ??
    "Open this spot from the city guide."
  );
}

function getSpotTags(spot: FeaturedSpot) {
  return (spot.categories ?? spot.tags ?? []).slice(0, 3);
}

export function FeaturedSpotImageGrid({ city, spots }: Props) {
  if (spots.length === 0) return null;

  return (
    <div style={gridStyle}>
      {spots.map((spot, index) => {
        const href = spot.slug
          ? `/c/${city.slug}/spot/${spot.slug}?src=city&v=featured_${city.slug}_${spot.slug}`
          : undefined;

        const content = (
          <>
            <div style={badgeStyle}>Featured spot · {city.city}</div>

            <div style={panelStyle}>
              <div style={metaStyle}>Travel idea</div>
              <h3 style={titleStyle}>{spot.name}</h3>
              <p style={textStyle}>{getSpotText(spot)}</p>

              {getSpotTags(spot).length > 0 && (
                <div style={chipRowStyle}>
                  {getSpotTags(spot).map((tag) => (
                    <span key={tag} style={chipStyle}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        );

        const cardStyleWithImage: CSSProperties = {
          ...cardStyle,
          backgroundImage: `linear-gradient(180deg, rgba(10, 18, 24, 0.04) 0%, rgba(10, 18, 24, 0.28) 45%, rgba(10, 18, 24, 0.76) 100%), url("${getImageUrl(
            `featured-${city.slug}-${spot.slug ?? spot.name}-${index}`
          )}")`,
        };

        if (href) {
          return (
            <Link
              key={`${city.slug}-featured-${spot.slug ?? spot.name}-${index}`}
              href={href}
              style={cardStyleWithImage}
            >
              {content}
            </Link>
          );
        }

        return (
          <article
            key={`${city.slug}-featured-${spot.name}-${index}`}
            style={cardStyleWithImage}
          >
            {content}
          </article>
        );
      })}
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 380,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  color: "#ffffff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
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

const panelStyle: CSSProperties = {
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
  color: "rgba(255, 255, 255, 0.76)",
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(22px, 5.6vw, 27px)",
  lineHeight: 1.06,
  letterSpacing: "-0.04em",
  color: "#ffffff",
  fontWeight: 850,
  textShadow: "0 1px 10px rgba(0, 0, 0, 0.26)",
};

const textStyle: CSSProperties = {
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
