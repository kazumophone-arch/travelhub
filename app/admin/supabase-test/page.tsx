import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Supabase test | TravelHub Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SupabaseTestPage() {
  const { data, error } = await supabase
    .from("spots")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={eyebrowStyle}>Supabase test</div>
        <h1 style={titleStyle}>Spots table connection</h1>

        {error ? (
          <pre style={errorStyle}>{error.message}</pre>
        ) : (
          <>
            <p style={textStyle}>
              Connected. Found {data?.length ?? 0} spots.
            </p>

            <pre style={preStyle}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </>
        )}
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
  fontSize: "clamp(36px, 8vw, 58px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
};

const textStyle: CSSProperties = {
  margin: "0 0 18px",
  color: "#607080",
  fontSize: 15,
  lineHeight: 1.7,
};

const preStyle: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  overflowX: "auto",
  fontSize: 12,
  lineHeight: 1.5,
};

const errorStyle: CSSProperties = {
  ...preStyle,
  color: "#9a3d2f",
};
