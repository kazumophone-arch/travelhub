import Link from "next/link";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

type Spot = {
  id: string;
  city_id: string | null;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
};

type City = {
  id: string;
  slug: string;
  city: string;
  country: string;
};

export async function PublicSupabaseSpots() {
  const [spotsResult, citiesResult] = await Promise.all([
    supabase
      .from("spots")
      .select("id, city_id, name, slug, summary, image_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("cities")
      .select("id, slug, city, country")
      .eq("is_published", true),
  ]);

  if (spotsResult.error || !spotsResult.data || spotsResult.data.length === 0) {
    return null;
  }

  const spots = spotsResult.data as Spot[];
  const cities = (citiesResult.data ?? []) as City[];
  const citiesById = new Map(cities.map((city) => [city.id, city]));
  const spotsWithCities = spots
    .map((spot) => {
      const city = spot.city_id ? citiesById.get(spot.city_id) : undefined;

      return city
        ? {
            spot,
            city,
            citySlug: city.slug,
          }
        : null;
    })
    .filter(
      (item): item is { spot: Spot; city: City; citySlug: string } =>
        item !== null
    );

  if (spotsWithCities.length === 0) {
    return null;
  }

  return (
    <section style={sectionStyle}>
      <div style={labelStyle}>Recently added</div>
      <h2 style={titleStyle}>New published spots</h2>

      <div style={gridStyle}>
        {spotsWithCities.map(({ spot, city, citySlug }) => (
          <Link
            key={spot.id}
            href={`/c/${citySlug}/spot/${spot.slug}`}
            style={{
              ...cardStyle,
              backgroundImage: spot.image_url
                ? `linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76)), url("${spot.image_url}")`
                : "linear-gradient(135deg, #dfeeea, #f7efe2)",
            }}
          >
            <div style={badgeStyle}>{city?.city ?? citySlug}</div>

            <div style={panelStyle}>
              <h3 style={cardTitleStyle}>{spot.name}</h3>
              <p style={textStyle}>{spot.summary || "No summary yet."}</p>
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
