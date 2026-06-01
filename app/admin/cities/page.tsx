import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminSupabaseCityList } from "@/components/AdminSupabaseCityList";

export const metadata = {
  title: "Cities | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCitiesPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin" style={backStyle}>← Back to admin</Link>

        <div style={eyebrowStyle}>Cities</div>

        <h1 style={titleStyle}>Manage cities</h1>

        <p style={textStyle}>
          Create, edit, view, and delete city records stored in Supabase.
        </p>

        <div style={actionRowStyle}>
          <Link href="/admin/cities/new" style={primaryLinkStyle}>
            New city
          </Link>
        </div>

        <AdminSupabaseCityList />
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
  margin: "0 0 20px",
  maxWidth: 640,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const primaryLinkStyle: CSSProperties = {
  display: "inline-flex",
  padding: "10px 14px",
  borderRadius: 999,
  background: "#138a72",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};
