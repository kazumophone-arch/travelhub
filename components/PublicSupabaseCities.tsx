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
            href={`/c/${city.slug}`}
            style={{
              ...cardStyle,
              backgroundImage: getImageBackground(
                city.image_url,
                "linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76))",
                "linear-gradient(135deg, #dfeeea, #f7efe2)"
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
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".12em",
};

const titleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "clamp(24px, 5vw, 32px)",
  letterSpacing: "-.045em",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  minHeight: 360,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  color: "#ffffff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.84)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  color: "rgba(255,255,255,.76)",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.06,
  letterSpacing: "-.04em",
};

const textStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255,255,255,.84)",
};
