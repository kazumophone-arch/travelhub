import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata = {
  title: "Admin | TravelHub",
  robots: {
    index: false,
    follow: false,
  },
};

const adminItems = [
  {
    title: "Cities",
    label: "Content",
    description: "Check city pages, seasonal picks, country grouping, and city-level copy.",
    href: "/cities",
  },
  {
    title: "Spots",
    label: "Content",
    description: "Review spot cards, featured places, nearby ideas, and spot detail pages.",
    href: "/spots",
  },
  {
    title: "Images",
    label: "Media",
    description: "Track placeholder images, future licensed images, credits, and source URLs.",
    href: "/admin/images",
  },
  {
    title: "Affiliate links",
    label: "Revenue",
    description: "Review tours, hotels, booking links, and CTA placement before publishing.",
    href: "/admin/affiliate",
  },
  {
    title: "SEO & routes",
    label: "Publishing",
    description: "Check metadata, sitemap, removed routes, noindex pages, and launch readiness.",
    href: "/admin/seo",
  },
  {
    title: "Launch checklist",
    label: "Operations",
    description: "Use this before public release to check mobile layout, images, links, and build.",
    href: "/admin/checklist",
  },
];

export default function AdminPage() {
  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <div style={eyebrowStyle}>TravelHub admin</div>

        <div style={heroStyle}>
          <div>
            <h1 style={titleStyle}>Management menu</h1>
            <p style={leadStyle}>
              Use this area to manage content, images, affiliate links, SEO, and publishing checks.
              This page is noindex and should stay out of the public navigation for now.
            </p>
          </div>

          <Link href="/" style={homeLinkStyle}>
            Back to site
          </Link>
        </div>

        <section style={gridStyle}>
          {adminItems.map((item) => (
            <Link key={item.title} href={item.href} style={cardStyle}>
              <div style={labelStyle}>{item.label}</div>
              <h2 style={cardTitleStyle}>{item.title}</h2>
              <p style={cardTextStyle}>{item.description}</p>
              <div style={openStyle}>Open →</div>
            </Link>
          ))}
        </section>

        <section style={noteStyle}>
          <h2 style={noteTitleStyle}>Current admin approach</h2>
          <p style={noteTextStyle}>
            This is a menu-only admin area. It does not edit data yet. Once the content structure is stable,
            this can become a real CMS-style dashboard for cities, spots, images, and affiliate links.
          </p>
        </section>
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
  maxWidth: 1120,
  margin: "0 auto",
  padding: "44px 16px 64px",
};

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  border: "1px solid rgba(168, 116, 50, 0.16)",
  color: "#9a6a2f",
  fontSize: 12,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const heroStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 18,
  flexWrap: "wrap",
  marginBottom: 28,
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "clamp(38px, 8vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const leadStyle: CSSProperties = {
  margin: 0,
  maxWidth: 720,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

const homeLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "10px 14px",
  borderRadius: 999,
  background: "#eef8f5",
  border: "1px solid rgba(19, 138, 114, 0.14)",
  color: "#138a72",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const cardStyle: CSSProperties = {
  display: "block",
  minHeight: 190,
  padding: 18,
  borderRadius: 24,
  background: "#fffdf8",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  boxShadow: "0 8px 24px rgba(96, 76, 48, 0.07)",
  color: "inherit",
  textDecoration: "none",
};

const labelStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "6px 9px",
  borderRadius: 999,
  background: "#f7efe2",
  border: "1px solid rgba(168, 116, 50, 0.14)",
  color: "#9a6a2f",
  fontSize: 11,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
  fontWeight: 850,
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.08,
  letterSpacing: "-0.04em",
  fontWeight: 850,
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};

const openStyle: CSSProperties = {
  marginTop: 18,
  fontSize: 13,
  color: "#138a72",
  fontWeight: 850,
};

const noteStyle: CSSProperties = {
  marginTop: 22,
  padding: 20,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 7px 20px rgba(30, 64, 88, 0.05)",
};

const noteTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  letterSpacing: "-0.04em",
};

const noteTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.7,
  color: "#607080",
};
