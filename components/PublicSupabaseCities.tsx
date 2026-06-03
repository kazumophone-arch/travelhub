import Link from "next/link";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";
import { getImageBackground } from "@/lib/url-fields";

type City = {
  id: string;
  slug: string;
  city: string;
  country: string;
  region: string;
  summary: string;
  image_url: string;
};

export async function PublicSupabaseCities() {
  const { data, error } = await supabase
    .from("cities")
    .select("id, slug, city, country, region, summary, image_url")
    .eq("is_published", true)
    .order("sort_rank", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  const cities = data as City[];

  return (
    <section style={sectionStyle}>
      <div style={labelStyle}>Added from admin</div>
      <h2 style={titleStyle}>New published cities</h2>

      <div style={gridStyle}>
        {cities.map((city) => (
          <Link
            key={city.id}
            href={`/c/${city.slug}?src=cities&v=published_${city.slug}`}
            style={{
              ...cardStyle,
              backgroundImage: getImageBackground(
                city.image_url,
                "linear-gradient(180deg, rgba(255,255,255,0), rgba(23,32,42,.08))",
                "linear-gradient(135deg, #e8f4ff, #edf8f2)"
              ),
            }}
          >
            <div style={badgeStyle}>{city.country}</div>

            <div style={panelStyle}>
              <div style={metaStyle}>{city.region || "Travel city"}</div>
              <h3 style={cardTitleStyle}>{city.city}</h3>
              <p style={textStyle}>{city.summary || "No summary yet."}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: 34,
};

const labelStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: "#138a72",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const titleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: 28,
  letterSpacing: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  minHeight: 410,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  color: "#17202a",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#edf8f2",
  border: "1px solid rgba(23,32,42,.1)",
  boxShadow: "0 12px 28px rgba(30,64,88,.12)",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 0,
  padding: 18,
  borderRadius: "0 0 26px 26px",
  background: "#ffffff",
  borderTop: "1px solid rgba(23,32,42,.08)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  color: "#607080",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.12,
  letterSpacing: 0,
};

const textStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "#4c5f6f",
};
