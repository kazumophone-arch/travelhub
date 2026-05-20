import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function InfoPageShell({ eyebrow, title, description, children }: Props) {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <Link href="/" style={homeLinkStyle}>
          ← Home
        </Link>

        <section style={cardStyle}>
          <div style={eyebrowStyle}>{eyebrow}</div>
          <h1 style={titleStyle}>{title}</h1>
          <p style={descriptionStyle}>{description}</p>

          <div style={contentStyle}>{children}</div>
        </section>
      </section>
    </main>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <div style={sectionBodyStyle}>{children}</div>
    </section>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 221, 180, 0.72), transparent 30%), radial-gradient(circle at 88% 4%, rgba(175, 205, 255, 0.58), transparent 28%), linear-gradient(180deg, #fbf7f0 0%, #ffffff 44%, #eef4f8 100%)",
  color: "#171717",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const shellStyle: CSSProperties = {
  maxWidth: 860,
  margin: "0 auto",
  padding: "24px 16px 56px",
};

const homeLinkStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 18,
  color: "inherit",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 800,
  opacity: 0.72,
};

const cardStyle: CSSProperties = {
  borderRadius: 34,
  padding: "clamp(22px, 5vw, 36px)",
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 28px 90px rgba(0, 0, 0, 0.12)",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.56,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  margin: "0 0 14px",
  fontSize: "clamp(38px, 10vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const descriptionStyle: CSSProperties = {
  margin: 0,
  maxWidth: 660,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};

const contentStyle: CSSProperties = {
  display: "grid",
  gap: 22,
  marginTop: 30,
};

const sectionStyle: CSSProperties = {
  padding: 18,
  borderRadius: 24,
  background: "rgba(0, 0, 0, 0.04)",
};

const sectionTitleStyle: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 20,
  letterSpacing: "-0.035em",
};

const sectionBodyStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.75,
  opacity: 0.74,
};


