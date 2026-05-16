import { cities } from "@/data/cities";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

export default async function CityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const src = typeof sp?.src === "string" ? sp.src : "hub";
  const v = typeof sp?.v === "string" ? sp.v : `hub_${slug}`;

  const city = cities[slug];
  if (!city) return notFound();

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>
        {city.city}, {city.country}
      </h1>
      <div style={{ opacity: 0.8, marginBottom: 18 }}>World Heritage series</div>

      <section style={{ lineHeight: 1.9, marginBottom: 20 }}>
        <div><b>Day 1</b> — {city.stops[0]}</div>
        <div><b>Day 2</b> — {city.stops[1]}</div>
        <div><b>Day 3</b> — {city.stops[2]}</div>
      </section>

      <section style={{ display: "grid", gap: 10 }}>
        <a href={city.planUrl ?? "#"} style={btnStyle}>Build this itinerary</a>

        <a
          href={`/out/hotels?c=${encodeURIComponent(slug)}&src=${encodeURIComponent(src)}&v=${encodeURIComponent(v)}`}
          style={btnStyle}
        >
          Hotels
        </a>

        {city.affToursUrl && (
          <a
            href={`/out/tours?c=${encodeURIComponent(slug)}&src=${encodeURIComponent(src)}&v=${encodeURIComponent(v)}`}
            style={btnStyle}
          >
            Tours
          </a>
        )}
      </section>

      <hr style={{ margin: "24px 0" }} />

      <small style={{ opacity: 0.8, display: "block", lineHeight: 1.6 }}>
        Disclosure: Some links may be affiliate links.<br />
        Original 3D characters • AI-assisted visuals.
      </small>
    </main>
  );
}

const btnStyle: CSSProperties = {
  display: "block",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "inherit",
};