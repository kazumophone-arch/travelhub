import type { CSSProperties } from "react";
import type { TravelImageAsset } from "@/data/travel-images";

type Props = {
  image: TravelImageAsset;
  label: string;
};

function getSafeImageUrl(image: TravelImageAsset, label: string) {
  if (image.imageUrl && image.imageUrl.trim().length > 0) {
    return image.imageUrl;
  }

  const seed = encodeURIComponent(`travelhub-detail-hero-${label}`);

  return `https://picsum.photos/seed/${seed}/1400/900`;
}

export function DetailHeroImage({ image, label }: Props) {
  const imageUrl = getSafeImageUrl(image, label);

  return (
    <div
      style={{
        ...wrapStyle,
        backgroundImage: `linear-gradient(180deg, rgba(10, 18, 24, 0.05) 0%, rgba(10, 18, 24, 0.20) 44%, rgba(10, 18, 24, 0.62) 100%), url("${imageUrl}")`,
      }}
      aria-label={image.alt}
    >
      <div style={badgeStyle}>{label}</div>

      <div style={captionPanelStyle}>
        <div style={smallTextStyle}>Travel image</div>
        <div style={captionTextStyle}>{image.alt}</div>
      </div>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  position: "relative",
  minHeight: "clamp(260px, 52vw, 430px)",
  margin: "0 0 34px",
  borderRadius: 28,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#17202a",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 16px 42px rgba(30, 64, 88, 0.16)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 2,
  padding: "8px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const captionPanelStyle: CSSProperties = {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 16,
  zIndex: 2,
  padding: 16,
  borderRadius: 22,
  background: "rgba(12, 22, 30, 0.52)",
  border: "1px solid rgba(255, 255, 255, 0.24)",
  boxShadow: "0 10px 26px rgba(0, 0, 0, 0.14)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const smallTextStyle: CSSProperties = {
  marginBottom: 6,
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.72)",
  fontWeight: 850,
};

const captionTextStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.5,
  color: "#ffffff",
  fontWeight: 750,
};
