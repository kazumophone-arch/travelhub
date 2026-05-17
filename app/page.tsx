import Link from "next/link";
import { cities } from "@/data/cities";

export default function Home() {
  const cityList = Object.values(cities);

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <div style={brandStyle}>TravelHub</div>

        <div style={labelStyle}>Short-video travel links</div>

        <h1 style={titleStyle}>Find your next trip, faster.</h1>

        <p style={subtitleStyle}>
          Quick hotel and tour links for cities featured in our travel shorts.
        </p>

        <Link href="/c/rome-it?src=home&v=home_featured" style={heroButtonStyle}>
          Explore featured city
        </Link>
      </section>

      <section style={contentStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <div style={smallLabelStyle}>Featured cities</div>
            <h2 style={sectionTitleStyle}>Choose a destination</h2>
          </div>
          <div style={countStyle}>{cityList.length} cities</div>
        </div>

        <section style={gridStyle}>
          {cityList.map((city) => (
            <Link
              key={city.slug}
              href={`/c/${city.slug}?src=home&v=home_${city.slug}`}
              style={cardStyle}
            >
              <div style={cardTopStyle}>
                <div>
                  <h3 style={cityTitleStyle}>{city.city}</h3>
                  <p style={countryStyle}>{city.country}</p>
                </div>

                <div style={arrowStyle}>→</div>
              </div>

              <div style={spotsStyle}>
                <span>{city.stops[0]}</span>
                <span>{city.stops[1]}</span>
                <span>{city.stops[2]}</span>
              </div>

              <div style={cardFooterStyle}>
                <span>Hotels</span>
                <span>Tours</span>
              </div>
            </Link>
          ))}
        </section>

        <p style={disclosureStyle}>
          Some links may be affiliate links. Original 3D characters • AI-assisted visuals.
        </p>
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  color: "#171717",
  background:
    "radial-gradient(circle at top left, rgba(255, 214, 165, 0.42), transparent 32%), radial-gradient(circle at top right, rgba(166, 197, 255, 0.35), transparent 30%), linear-gradient(180deg, #faf7f0 0%, #ffffff 46%, #eef4f8 100%)",
};

const heroStyle: React.CSSProperties = {
  maxWidth: 820,
  margin: "0 auto",
  padding: "56px 20px 32px",
  textAlign: "center",
};

const brandStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.74)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 22,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 12,
};

const titleStyle: React.CSSProperties = {
  margin: "0 auto 16px",
  maxWidth: 680,
  fontSize: "clamp(42px, 8vw, 76px)",
  lineHeight: 0.95,
  letterSpacing: "-0.07em",
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  maxWidth: 520,
  margin: "0 auto 28px",
  fontSize: 17,
  lineHeight: 1.65,
  opacity: 0.72,
};

const heroButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "15px 20px",
  borderRadius: 18,
  background: "#171717",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 750,
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
};

const contentStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: "0 auto",
  padding: "16px 20px 46px",
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "end",
  marginBottom: 16,
};

const smallLabelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.5,
  marginBottom: 6,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 26,
  letterSpacing: "-0.04em",
};

const countStyle: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.62,
  whiteSpace: "nowrap",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: 18,
  borderRadius: 24,
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
};

const cardTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  marginBottom: 16,
};

const cityTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.05,
  letterSpacing: "-0.05em",
};

const countryStyle: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 14,
  opacity: 0.62,
};

const arrowStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#171717",
  color: "#ffffff",
  fontWeight: 800,
  flexShrink: 0,
};

const spotsStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 14,
  opacity: 0.76,
  marginBottom: 16,
};

const cardFooterStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  fontSize: 12,
  fontWeight: 700,
  opacity: 0.7,
};

const disclosureStyle: React.CSSProperties = {
  margin: "30px auto 0",
  maxWidth: 520,
  textAlign: "center",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};
