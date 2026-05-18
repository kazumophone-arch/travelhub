import Link from "next/link";
import type { CSSProperties } from "react";

export function SiteFooter() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <div style={brandBlockStyle}>
          <Link href="/" style={brandStyle}>
            TravelHub
          </Link>

          <p style={descriptionStyle}>
            Discover travel cities, featured spots, hotel links, and tour links
            from short travel videos.
          </p>

          <p style={disclosureStyle}>
            Some links may be affiliate links. We may earn a commission if you
            book through them, at no extra cost to you.
          </p>
        </div>

        <nav style={linkGridStyle} aria-label="Footer navigation">
          <Link href="/about" style={footerLinkStyle}>
            About
          </Link>

          <Link href="/affiliate-disclosure" style={footerLinkStyle}>
            Affiliate Disclosure
          </Link>

          <Link href="/privacy" style={footerLinkStyle}>
            Privacy
          </Link>

          <Link href="/terms" style={footerLinkStyle}>
            Terms
          </Link>

          <Link href="/contact" style={footerLinkStyle}>
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  borderTop: "1px solid rgba(0, 0, 0, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(246,241,233,0.92) 100%)",
  color: "#171717",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
};

const innerStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "30px 16px 34px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: 22,
  alignItems: "start",
};

const brandBlockStyle: CSSProperties = {
  maxWidth: 560,
};

const brandStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 850,
  letterSpacing: "-0.035em",
};

const descriptionStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 13,
  lineHeight: 1.6,
  opacity: 0.66,
};

const disclosureStyle: CSSProperties = {
  margin: "12px 0 0",
  fontSize: 12,
  lineHeight: 1.6,
  opacity: 0.58,
};

const linkGridStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  justifyContent: "flex-start",
};

const footerLinkStyle: CSSProperties = {
  display: "inline-flex",
  padding: "9px 11px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.76)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  color: "inherit",
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 800,
};
