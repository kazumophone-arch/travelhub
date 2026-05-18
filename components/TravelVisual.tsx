import type { CSSProperties, ReactNode } from "react";

type Props = {
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  fallback: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function TravelVisual({
  imageUrl,
  imageAlt,
  imageCredit,
  fallback,
  style,
  children,
}: Props) {
  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        background: hasImage ? "#e8e1d6" : fallback,
      }}
    >
      {hasImage && (
        <img
          src={imageUrl}
          alt={imageAlt ?? ""}
          loading="lazy"
          style={imageStyle}
        />
      )}

      {hasImage && <div style={overlayStyle} />}

      {children}

      {hasImage && imageCredit && (
        <div style={creditStyle}>{imageCredit}</div>
      )}
    </div>
  );
}

const imageStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.18) 100%)",
  pointerEvents: "none",
};

const creditStyle: CSSProperties = {
  position: "absolute",
  right: 10,
  bottom: 10,
  maxWidth: "70%",
  padding: "5px 8px",
  borderRadius: 999,
  background: "rgba(0, 0, 0, 0.42)",
  color: "#ffffff",
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1.2,
  backdropFilter: "blur(10px)",
};