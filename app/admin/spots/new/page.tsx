import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNewSpotForm } from "@/components/AdminNewSpotForm";
import { cities } from "@/data/cities";
import type { City } from "@/data/types";

export const metadata = {
  title: "New spot | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewSpotPage() {
  const cityList = Object.values(cities) as City[];

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin/spots" style={backStyle}>← Back to spots</Link>
        <div style={eyebrowStyle}>Create</div>
        <h1 style={titleStyle}>New spot</h1>
        <p style={textStyle}>
          Create a spot draft using the final database-style fields.
        </p>
        <AdminNewSpotForm cities={cityList} />
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
  maxWidth: 1180,
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

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  fontSize: 12,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "clamp(38px, 8vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const textStyle: CSSProperties = {
  margin: "0 0 28px",
  maxWidth: 640,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

