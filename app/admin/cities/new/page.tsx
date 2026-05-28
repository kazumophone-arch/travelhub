import Link from "next/link";
import type { CSSProperties } from "react";
import { AdminNewCityForm } from "@/components/AdminNewCityForm";

export const metadata = {
  title: "New city | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewCityPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/admin/cities" style={backStyle}>← Back to cities</Link>

        <div style={eyebrowStyle}>Create</div>

        <h1 style={titleStyle}>New city</h1>

        <p style={textStyle}>
          Create a city in Supabase. City pages will be connected after the city admin flow is stable.
        </p>

        <AdminNewCityForm />
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
