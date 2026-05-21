import Link from "next/link";
import type { CSSProperties } from "react";

type Props = {
  title: string;
  meta: string;
  text: string;
  seed: string;
  href?: string;
};

function getImageUrl(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1000/700`;
}

export function DetailPlaceImageCard({ title, meta, text, seed, href }: Props) {
  const content = (
    <>
      <div style={badgeStyle}>{meta}</div>

      <div style={panelStyle}>
        <div style={metaStyle}>Travel idea</div>
        <h3 style={titleStyle}>{title}</h3>
        <p style={textStyle}>{text}</p>
      </div>
    </>
  );

  const style = {
    ...cardStyle,
    backgroundImage: `linear-gradient(180deg, rgba(10, 18, 24, 0.04) 0%, rgba(10, 18, 24, 0.28) 45%, rgba(10, 18, 24, 0.76) 100%), url("${getImageUrl(seed)}")`,
  };

  if (href) {
    return (
      <Link href={href} style={style}>
        {content}
      </Link>
    );
  }

  return <article style={style}>{content}</article>;
}

const cardStyle: CSSProperties = {
  position: "relative",
  minHeight: 370,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 24,
  overflow: "hidden",
  color: "#ffffff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#17202a",
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 12px 34px rgba(30, 64, 88, 0.16)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  zIndex: 3,
  maxWidth: "calc(100% - 24px)",
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
  fontSize: "clamp(22px, 5.6vw, 26px)",
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
