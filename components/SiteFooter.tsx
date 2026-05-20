import Link from "next/link";
import type { CSSProperties } from "react";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <div style={brandBlockStyle}>
          <Link href="/" style={brandStyle}>
            TravelHub
          </Link>

          <p style={textStyle}>
            A lightweight travel discovery hub for cities, featured spots,
            seasonal ideas, and travel planning links.
          </p>
        </div>

        <nav style={linkWrapStyle} aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p style={noticeStyle}>
          Some links may be affiliate links. We may earn a commission if you book
          through them, at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  padding: "34px 16px 42px",
  background: "transparent",
  color: "#17202a",
};

const innerStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: 22,
  borderRadius: 30,
  background: "rgba(255, 255, 255, 0.86)",
  border: "1px solid rgba(23, 32, 42, 0.08)",
  boxShadow: "0 12px 34px rgba(30, 64, 88, 0.08)",
  backdropFilter: "blur(18px)",
};

const brandBlockStyle: CSSProperties = {
  marginBottom: 18,
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  color: "inherit",
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 850,
  letterSpacing: "-0.035em",
  marginBottom: 8,
};

const textStyle: CSSProperties = {
  margin: 0,
  maxWidth: 560,
  fontSize: 13,
  lineHeight: 1.65,
  opacity: 0.62,
};

const linkWrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 18,
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  padding: "8px 10px",
  borderRadius: 999,
  background: "#eef8f5",
  color: "inherit",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 800,
};

const noticeStyle: CSSProperties = {
  margin: 0,
  maxWidth: 620,
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.52,
};



