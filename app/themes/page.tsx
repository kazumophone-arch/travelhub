import Link from "next/link";
import type { CSSProperties } from "react";
import { createPublicMetadata } from "@/lib/site-metadata";
import { themes, type Theme } from "@/data/themes";
import styles from "./ThemesPage.module.css";

export const metadata = createPublicMetadata({
  title: "Browse Themes | TravelHub",
  description:
    "Choose your next trip by season, feeling, and travel style with TravelHub theme guides.",
  path: "/themes",
});

const seasonThemes = themes.filter((theme) => theme.group === "season");
const styleThemes = themes.filter((theme) => theme.group === "style");

const seasonImages: Record<string, string> = {
  spring: "/assets/home/kyoto-hero.jpg",
  summer: "/assets/home/algarve.jpg",
  autumn: "/assets/home/lake-bled.jpg",
  winter: "/assets/home/queenstown.jpg",
};

const moodImages: Record<string, string> = {
  nature: "/assets/home/queenstown.jpg",
  food: "/assets/home/taste-culture.jpg",
  luxury: "/assets/home/rome-preview.jpg",
  couples: "/assets/home/live-the-moment.jpg",
  "first-trip": "/assets/home/seek-wonder.jpg",
  "quiet-escapes": "/assets/home/find-peace.jpg",
};

export default function ThemesPage() {
  return (
    <main className={styles.page} style={pageStyle}>
      <section style={heroStyle}>
        <div style={decorLeftStyle} aria-hidden="true" />
        <div style={decorRightStyle} aria-hidden="true" />

        <div style={eyebrowStyle}>Browse by theme</div>
        <h1 style={heroTitleStyle}>Choose the feeling of your next trip.</h1>
        <p style={heroTextStyle}>
          Travel is more than a place — it is a feeling. Explore by season or
          style to find inspiration that matches your mood.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="seasonal-edits">
        <div style={sectionEyebrowStyle}>Seasonal edits</div>
        <h2 id="seasonal-edits" style={sectionTitleStyle}>
          Travel with the best season in mind.
        </h2>

        <div className={styles.seasonRail} style={seasonRailStyle}>
          {seasonThemes.map((theme, index) => (
            <Link
              key={theme.slug}
              href={`/themes/${theme.slug}`}
              className={index === 2 ? styles.seasonFeatured : undefined}
              style={{
                ...seasonCardStyle,
                ...(index === 2 ? featuredSeasonCardStyle : null),
                backgroundImage: getImageBackground(
                  seasonImages[theme.slug],
                  "linear-gradient(180deg, rgba(18, 14, 10, 0.05) 0%, rgba(18, 14, 10, 0.38) 48%, rgba(18, 14, 10, 0.82) 100%)"
                ),
              }}
            >
              <div>
                <div style={seasonEyebrowStyle}>{theme.eyebrow}</div>
                <h3 style={seasonTitleStyle}>{theme.title}</h3>
                <p style={seasonTextStyle}>{getSeasonLine(theme.slug)}</p>
              </div>

              {index === 2 ? (
                <span style={seasonActionStyle}>
                  Explore {theme.title} →
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section style={moodSectionStyle} aria-labelledby="travel-moods">
        <div style={centerEyebrowStyle}>Travel styles & moods</div>

        <div id="travel-moods" className={styles.moodGrid} style={moodGridStyle}>
          {styleThemes.map((theme) => (
            <Link
              key={theme.slug}
              href={`/themes/${theme.slug}`}
              className={styles.moodCard}
              style={{
                ...moodCardStyle,
                backgroundImage: getImageBackground(
                  moodImages[theme.slug],
                  "linear-gradient(180deg, rgba(20, 16, 12, 0.18) 0%, rgba(20, 16, 12, 0.46) 58%, rgba(20, 16, 12, 0.78) 100%)"
                ),
              }}
            >
              <h3 style={moodTitleStyle}>{theme.title}</h3>
              <p style={moodTextStyle}>{getMoodLine(theme)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.cta} style={ctaStyle}>
        <div style={ctaMapStyle} aria-hidden="true" />
        <div>
          <h2 style={ctaTitleStyle}>Ready to find your perfect destination?</h2>
          <p style={ctaTextStyle}>
            Explore destination guides with curated cities, places, and trip
            inspiration.
          </p>
        </div>

        <Link href="/cities" className={styles.ctaLink} style={ctaLinkStyle}>
          Explore destinations →
        </Link>
      </section>
    </main>
  );
}

function getImageBackground(imageUrl: string | undefined, overlay: string) {
  if (!imageUrl) {
    return "linear-gradient(180deg, #e8ded1 0%, #b9aa99 100%)";
  }

  return `${overlay}, url("${imageUrl}")`;
}

function getSeasonLine(slug: string) {
  if (slug === "spring") {
    return "New beginnings and blossoming landscapes.";
  }

  if (slug === "summer") {
    return "Sun-drenched days and endless adventures.";
  }

  if (slug === "autumn") {
    return "Golden landscapes and crisp, cozy days.";
  }

  if (slug === "winter") {
    return "Snowy escapes and magical moments.";
  }

  return "Seasonal places worth planning around.";
}

function getMoodLine(theme: Theme) {
  if (theme.slug === "nature") {
    return "Breathtaking landscapes and wild places.";
  }

  if (theme.slug === "food") {
    return "Local flavors and culinary journeys.";
  }

  if (theme.slug === "luxury") {
    return "Timeless comfort, design, and style.";
  }

  if (theme.slug === "couples") {
    return "Romantic places made for two.";
  }

  if (theme.slug === "first-trip") {
    return "Easy first destinations with less friction.";
  }

  if (theme.slug === "quiet-escapes") {
    return "Peaceful places to slow down and reset.";
  }

  return theme.description;
}

const pageStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  overflowX: "hidden",
  minHeight: "100vh",
  padding: "54px clamp(18px, 3.2vw, 64px) 42px",
  background:
    "radial-gradient(circle at 14% 14%, rgba(187, 132, 68, 0.08), transparent 24%), radial-gradient(circle at 88% 18%, rgba(187, 132, 68, 0.08), transparent 24%), linear-gradient(180deg, #fbf7ef 0%, #f7f0e7 48%, #f0e7dc 100%)",
  color: "#201d19",
  boxSizing: "border-box",
};

const heroStyle: CSSProperties = {
  position: "relative",
  maxWidth: 980,
  margin: "0 auto",
  padding: "18px 0 44px",
  textAlign: "center",
};

const decorLeftStyle: CSSProperties = {
  position: "absolute",
  left: -260,
  top: 30,
  width: 260,
  height: 260,
  opacity: 0.28,
  background:
    "radial-gradient(circle at 50% 50%, rgba(154, 104, 52, 0.18), transparent 62%)",
  borderRadius: "50%",
};

const decorRightStyle: CSSProperties = {
  position: "absolute",
  right: -260,
  top: 20,
  width: 280,
  height: 280,
  opacity: 0.24,
  background:
    "radial-gradient(circle at 50% 50%, rgba(154, 104, 52, 0.18), transparent 62%)",
  borderRadius: "50%",
};

const eyebrowStyle: CSSProperties = {
  marginBottom: 18,
  color: "#a5713b",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
};

const heroTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "clamp(46px, 5.8vw, 86px)",
  lineHeight: 0.98,
  fontWeight: 500,
  letterSpacing: "-0.055em",
};

const heroTextStyle: CSSProperties = {
  maxWidth: 700,
  margin: "24px auto 0",
  color: "#756b61",
  fontSize: "clamp(16px, 1.5vw, 21px)",
  lineHeight: 1.7,
};

const sectionStyle: CSSProperties = {
  maxWidth: 1500,
  margin: "0 auto",
};

const sectionEyebrowStyle: CSSProperties = {
  marginBottom: 12,
  color: "#a5713b",
  textAlign: "center",
  fontSize: 13,
  fontWeight: 850,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
};

const centerEyebrowStyle: CSSProperties = {
  ...sectionEyebrowStyle,
  marginBottom: 22,
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 26px",
  textAlign: "center",
  fontSize: "clamp(26px, 3vw, 40px)",
  lineHeight: 1.1,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const seasonRailStyle: CSSProperties = {
  display: "grid",
  alignItems: "stretch",
  gap: 8,
};

const seasonCardStyle: CSSProperties = {
  minHeight: 360,
  padding: "clamp(24px, 3vw, 38px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  color: "#fff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 28px 70px rgba(32, 25, 18, 0.13)",
  boxSizing: "border-box",
};

const featuredSeasonCardStyle: CSSProperties = {
  transform: "scale(1.055)",
  zIndex: 2,
  border: "8px solid rgba(255, 255, 255, 0.86)",
  boxShadow: "0 34px 90px rgba(32, 25, 18, 0.28)",
};

const seasonEyebrowStyle: CSSProperties = {
  marginBottom: 14,
  color: "rgba(255, 255, 255, 0.78)",
  fontSize: 12,
  fontWeight: 850,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

const seasonTitleStyle: CSSProperties = {
  margin: "0 0 16px",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "clamp(34px, 3.4vw, 58px)",
  lineHeight: 0.95,
  fontWeight: 500,
  letterSpacing: "-0.055em",
};

const seasonTextStyle: CSSProperties = {
  maxWidth: 320,
  margin: 0,
  fontSize: "clamp(15px, 1.3vw, 19px)",
  lineHeight: 1.55,
  color: "rgba(255, 255, 255, 0.9)",
};

const seasonActionStyle: CSSProperties = {
  marginTop: 26,
  color: "#d9a463",
  fontSize: 14,
  fontWeight: 850,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const moodSectionStyle: CSSProperties = {
  maxWidth: 1500,
  margin: "70px auto 0",
};

const moodGridStyle: CSSProperties = {
  display: "grid",
  gap: 8,
};

const moodCardStyle: CSSProperties = {
  minHeight: 230,
  padding: "28px 22px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: "#fff",
  textDecoration: "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 20px 54px rgba(32, 25, 18, 0.12)",
  boxSizing: "border-box",
};

const moodTitleStyle: CSSProperties = {
  margin: "0 0 10px",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "clamp(24px, 2.2vw, 36px)",
  lineHeight: 1,
  fontWeight: 500,
};

const moodTextStyle: CSSProperties = {
  maxWidth: 230,
  margin: 0,
  color: "rgba(255, 255, 255, 0.88)",
  fontSize: 15,
  lineHeight: 1.55,
};

const ctaStyle: CSSProperties = {
  position: "relative",
  maxWidth: 1500,
  margin: "42px auto 0",
  padding: "32px clamp(24px, 4vw, 58px)",
  minHeight: 112,
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 28,
  overflow: "hidden",
  borderRadius: 4,
  background:
    "linear-gradient(90deg, rgba(255, 250, 243, 0.94) 0%, rgba(247, 238, 226, 0.9) 100%)",
  boxShadow: "inset 0 0 0 1px rgba(155, 115, 72, 0.1)",
  boxSizing: "border-box",
};

const ctaMapStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.22,
  background:
    "radial-gradient(circle at 12% 50%, rgba(144, 96, 45, 0.25), transparent 18%), linear-gradient(135deg, transparent 0 42%, rgba(144, 96, 45, 0.16) 43%, transparent 44% 100%)",
  pointerEvents: "none",
};

const ctaTitleStyle: CSSProperties = {
  position: "relative",
  margin: 0,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "clamp(28px, 3vw, 44px)",
  lineHeight: 1.05,
  fontWeight: 500,
  textAlign: "center",
};

const ctaTextStyle: CSSProperties = {
  position: "relative",
  margin: "10px 0 0",
  color: "#776c61",
  textAlign: "center",
  fontSize: 16,
  lineHeight: 1.6,
};

const ctaLinkStyle: CSSProperties = {
  position: "relative",
  color: "#9b6730",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 850,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  borderBottom: "2px solid rgba(155, 103, 48, 0.45)",
  paddingBottom: 8,
  whiteSpace: "nowrap",
};

const mobileStyles = `
@media (max-width: 980px) {
  .themeSeasonRail {
    grid-template-columns: 1fr 1fr;
  }
}
`;



