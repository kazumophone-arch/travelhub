import Link from "next/link";
import { cities } from "@/data/cities";

export default function Home() {
  const cityList = Object.values(cities);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        background:
          "linear-gradient(180deg, #f7f3ec 0%, #ffffff 48%, #eef3f7 100%)",
        color: "#171717",
      }}
    >
      <section style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 12,
            }}
          >
            Travel affiliate city hub
          </div>

          <h1
            style={{
              fontSize: 44,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              margin: "0 0 16px",
            }}
          >
            Find travel links by city.
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              opacity: 0.72,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Quick hotel and tour links for places featured in our short videos.
          </p>
        </div>

        <section
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {cityList.map((city) => (
            <Link
              key={city.slug}
              href={`/c/${city.slug}?src=home&v=home_${city.slug}`}
              style={{
                display: "block",
                padding: "18px 18px",
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.88)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.06)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 750 }}>
                    {city.city}, {city.country}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      opacity: 0.65,
                    }}
                  >
                    {city.stops[0]} • {city.stops[1]} • {city.stops[2]}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: 0.75,
                    whiteSpace: "nowrap",
                  }}
                >
                  View →
                </div>
              </div>
            </Link>
          ))}
        </section>

        <p
          style={{
            marginTop: 30,
            fontSize: 12,
            lineHeight: 1.6,
            opacity: 0.55,
            textAlign: "center",
          }}
        >
          Some links may be affiliate links. Original 3D characters •
          AI-assisted visuals.
        </p>
      </section>
    </main>
  );
}