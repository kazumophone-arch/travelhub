import type { CSSProperties } from "react";
import Link from "next/link";
import { themes, type Theme } from "@/data/themes";
import { createPublicMetadata } from "@/lib/site-metadata";
import { getImageBackground } from "@/lib/url-fields";

export const metadata = createPublicMetadata({
  title: "Browse Themes | TravelHub",
  description:
    "Choose your next trip by season or travel style with TravelHub theme guides.",
  path: "/themes",
});

const seasonThemes = themes.filter((theme) => theme.group === "season");
const styleThemes = themes.filter((theme) => theme.group === "style");

function getThemeBackground(theme: Theme) {
  return getImageBackground(
    `https://picsum.photos/seed/${encodeURIComponent(theme.imageSeed)}/1200/800`,
    "linear-gradient(180deg, rgba(25, 20, 17, 0.08) 0%, rgba(25, 20, 17, 0.58) 38%, rgba(25, 20, 17, 0.88) 100%)",
    "linear-gradient(180deg, #f9f5ef 0%, #f2ede6 42%, #e9e2d8 100%)"
  );
}

function getStyleBackground(theme: Theme) {
  return getImageBackground(
    `https://picsum.photos/seed/${encodeURIComponent(theme.imageSeed)}/900/700`,
    "linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.06) 100%)",
    "linear-gradient(180deg, #fbf7f0 0%, #f8f3ea 48%, #f2e8de 100%)"
  );
}

export default function ThemesPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={heroStyle}>
          <div style={heroCopyStyle}>
            <div style={eyebrowStyle}>Browse by theme</div>
            <h1 style={heroTitleStyle}>Choose the feeling of your next trip.</h1>
            <p style={heroTextStyle}>
              Discover destinations through season, travel mood, and destination style
              to find the right trip without overwhelming options.
            </p>
          </div>
        </div>

        <section style={sectionStyle}>
          <div style={sectionHeadingStyle}>
            <div>
              <div style={sectionEyebrowStyle}>Seasonal edits</div>
              <h2 style={sectionTitleStyle}>Travel with the best season in mind.</h2>
            </div>
          </div>

          <div style={seasonGridStyle}>
            {seasonThemes.map((theme) => (
              <Link
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                style={{
                  ...seasonCardStyle,
                  backgroundImage: getThemeBackground(theme),
                }}
              >
                <div>
                  <div style={themeEyebrowStyle}>{theme.eyebrow}</div>
                  <h3 style={themeTitleStyle}>{theme.title}</h3>
                  <p style={themeDescriptionStyle}>{theme.description}</p>
                </div>
                <span style={themeActionStyle}>Open theme →</span>
              </Link>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <div style={sectionHeadingStyle}>
            <div>
              <div style={sectionEyebrowStyle}>Travel mood</div>
              <h2 style={sectionTitleStyle}>Choose a travel style that fits the trip.</h2>
            </div>
          </div>

          <div style={styleGridStyle}>
            {styleThemes.map((theme) => (
              <Link
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                style={{
                  ...styleCardStyle,
                  backgroundImage: getStyleBackground(theme),
                }}
              >
                <div>
                  <div style={themeEyebrowStyle}>{theme.eyebrow}</div>
                  <h3 style={styleTitleStyle}>{theme.title}</h3>
                  <p style={styleDescriptionStyle}>{theme.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={footerStyle}>
          <div>
            <div style={footerEyebrowStyle}>Start with destinations</div>
            <h2 style={footerTitleStyle}>Browse destination guides next.</h2>
          </div>
          <Link href="/cities" style={footerLinkStyle}>
            Browse destinations
          </Link>
        </section>
      </section>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #fbf6ef 0%, #f5efe6 42%, #ede5dc 100%)",
  color: "#22201d",
};

const shellStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "32px 16px 64px",
};

const heroStyle: CSSProperties = {
  padding: "54px 0 26px",
  maxWidth: 860,
};

const heroCopyStyle: CSSProperties = {
  display: "grid",
  gap: 18,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.13em",
  color: "#8c6e45",
  fontWeight: 850,
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(36px, 6vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-0.06em",
  maxWidth: 700,
  fontWeight: 850,
};

const heroTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: 640,
  fontSize: 18,
  lineHeight: 1.78,
  color: "#4f453d",
};

const sectionStyle: CSSProperties = {
  marginTop: 42,
};

const sectionHeadingStyle: CSSProperties = {
  marginBottom: 24,
};

const sectionEyebrowStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "#8c6e45",
  marginBottom: 10,
  fontWeight: 850,
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 4vw, 38px)",
  lineHeight: 1.1,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const seasonGridStyle: CSSProperties = {
  display: "grid",
  gap: 20,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
};

const seasonCardStyle: CSSProperties = {
  minHeight: 320,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "28px 28px 24px",
  borderRadius: 28,
  color: "#fff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 22px 68px rgba(22, 18, 14, 0.18)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
};

const themeEyebrowStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  opacity: 0.92,
  marginBottom: 10,
  fontWeight: 850,
};

const themeTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 26,
  lineHeight: 1.08,
  fontWeight: 850,
};

const themeDescriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 440,
  fontSize: 15,
  lineHeight: 1.72,
  color: "rgba(255, 255, 255, 0.92)",
};

const themeActionStyle: CSSProperties = {
  marginTop: 20,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "#fff",
  fontSize: 13,
  fontWeight: 850,
};

const styleGridStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
};

const styleCardStyle: CSSProperties = {
  minHeight: 240,
  padding: "24px",
  borderRadius: 24,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "grid",
  gap: 10,
  color: "#1f1a17",
  textDecoration: "none",
  border: "1px solid rgba(31, 26, 23, 0.08)",
  boxShadow: "0 16px 42px rgba(38, 30, 23, 0.08)",
};

const styleTitleStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 22,
  lineHeight: 1.12,
  fontWeight: 850,
};

const styleDescriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#3b332e",
};

const footerStyle: CSSProperties = {
  marginTop: 42,
  padding: "32px 30px",
  borderRadius: 24,
  background: "#fff8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 18,
  border: "1px solid rgba(148, 118, 83, 0.14)",
};

const footerEyebrowStyle: CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "#8c6e45",
  fontWeight: 850,
  marginBottom: 8,
};

const footerTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 4vw, 32px)",
  lineHeight: 1.1,
  fontWeight: 850,
  color: "#231f1b",
};

const footerLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 220,
  padding: "14px 18px",
  borderRadius: 999,
  background: "#2b221c",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 850,
  fontSize: 14,
};
