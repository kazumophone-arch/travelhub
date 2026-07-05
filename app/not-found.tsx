import Link from "next/link";
import type { CSSProperties } from "react";

export default function NotFound() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={cardStyle}>
          <div style={eyebrowStyle}>404</div>

          <h1 style={titleStyle}>This destination was not found.</h1>

          <p style={descriptionStyle}>
            The city or spot you are looking for may have moved, been removed,
            or is not published yet.
          </p>

          <div style={buttonGroupStyle}>
            <Link href="/" style={primaryButtonStyle}>
              Back to Taleglen
            </Link>

            <Link href="/about" style={secondaryButtonStyle}>
              About this site
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 760,
  margin: "0 auto",
  padding: "28px 16px",
};

const cardStyle: CSSProperties = {
  borderRadius: 36,
  padding: "clamp(26px, 6vw, 44px)",
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 28px 90px rgba(0, 0, 0, 0.12)",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  opacity: 0.52,
  marginBottom: 14,
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 16px",
  maxWidth: 620,
  fontSize: "clamp(40px, 11vw, 72px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 540,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.7,
  opacity: 0.7,
};

const buttonGroupStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 26,
};

const primaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  padding: "14px 18px",
  borderRadius: 999,
  background: "#171717",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
  boxShadow: "0 16px 38px rgba(0, 0, 0, 0.16)",
};

const secondaryButtonStyle: CSSProperties = {
  display: "inline-flex",
  padding: "14px 18px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.82)",
  color: "#171717",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 800,
  border: "1px solid rgba(0, 0, 0, 0.1)",
};


