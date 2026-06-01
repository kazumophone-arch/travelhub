import Link from "next/link";
import { AdminSupabaseSpotList } from "@/components/AdminSupabaseSpotList";
import type { CSSProperties } from "react";

export const metadata = {
  title: "Spots | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminSpotsPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin" style={backStyle}>← Back to admin</Link>

        <div style={eyebrowStyle}>Spots</div>

        <h1 style={titleStyle}>Manage spots</h1>

        <p style={textStyle}>
          Create, edit, publish, view, and delete travel spots stored in Supabase.
        </p>

        <div style={gridStyle}>
          <Link href="/admin/spots/new" style={cardStyle}>
            <span style={labelStyle}>Create</span>
            <strong style={cardTitleStyle}>New spot</strong>
            <p style={cardTextStyle}>Add a new spot with title, slug, image, and links.</p>
          </Link>

          <div style={cardStyle}>
            <span style={labelStyle}>Available now</span>
            <strong style={cardTitleStyle}>Spot list</strong>
            <p style={cardTextStyle}>Review, filter, edit, view, and delete existing spots.</p>
          </div>
        </div>

        <AdminSupabaseSpotList />
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
  maxWidth: 960,
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

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  padding: 18,
  borderRadius: 24,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  boxShadow: "0 8px 24px rgba(96, 76, 48, 0.07)",
  color: "inherit",
  textDecoration: "none",
};

const labelStyle: CSSProperties = {
  width: "fit-content",
  padding: "6px 9px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  fontSize: 11,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  fontSize: 22,
  letterSpacing: "-0.04em",
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};


