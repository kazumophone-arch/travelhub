import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = {
  title: "Affiliate | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSubPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin" style={backStyle}>← Back to admin</Link>
        <h1 style={titleStyle}>Affiliate</h1>
        <p style={textStyle}>
          This admin page is a placeholder. Add real management fields here after the data structure is stable.
        </p>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8faf7",
  color: "#17202a",
};

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 900,
  margin: "0 auto",
  padding: "44px 16px 64px",
};

const backStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 24,
  color: "#138a72",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "clamp(36px, 8vw, 58px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};
