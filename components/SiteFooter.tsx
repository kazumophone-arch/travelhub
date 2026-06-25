import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./SiteFooter.module.css";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { href: "/discover", label: "Discover" },
      { href: "/cities", label: "Destinations" },
      { href: "/themes", label: "Themes" },
      { href: "/guides", label: "Guides" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer} style={footerStyle}>
      <div className={styles.inner} style={innerStyle}>
        <div className={styles.top} style={topStyle}>
          <div style={brandBlockStyle}>
            <Link href="/" style={brandStyle}>
              <span>TravelHub</span>
            </Link>

            <p style={textStyle}>
              A calm travel discovery site for finding destinations, seasonal
              ideas, city guides, spot guides, and practical planning notes.
            </p>
          </div>

          <nav className={styles.columns} style={columnsStyle} aria-label="Footer navigation">
            {footerColumns.map((column) => (
              <div key={column.title} style={columnStyle}>
                <div style={columnTitleStyle}>{column.title}</div>

                <div style={linkListStyle}>
                  {column.links.map((link) => (
                    <Link key={link.href} href={link.href} style={linkStyle}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom} style={bottomStyle}>
          <p style={noticeStyle}>
            Some links may be affiliate links. TravelHub may earn a commission
            if you book through them, at no additional cost to you.
          </p>

          <p style={copyrightStyle}>© 2026 TravelHub</p>
        </div>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  padding: "42px 24px 48px",
  background: "linear-gradient(180deg, rgba(243, 236, 223, 0) 0%, #F0F4FA 100%)",
  color: "#0D2B52",
};

const innerStyle: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "34px 0 0",
  borderTop: "1px solid rgba(103, 78, 49, 0.16)",
};

const topStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(260px, 0.42fr) minmax(0, 0.58fr)",
  gap: 48,
  alignItems: "start",
};

const brandBlockStyle: CSSProperties = {
  maxWidth: 420,
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  color: "inherit",
  textDecoration: "none",
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 28,
  fontWeight: 520,
  letterSpacing: "-0.045em",
};

const textStyle: CSSProperties = {
  margin: "18px 0 0",
  color: "#6B87A8",
  fontSize: 14,
  lineHeight: 1.8,
};

const columnsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 28,
};

const columnStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const columnTitleStyle: CSSProperties = {
  color: "#BF9B30",
  fontSize: 11,
  lineHeight: 1,
  fontWeight: 850,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const linkListStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const linkStyle: CSSProperties = {
  width: "fit-content",
  color: "#0D2B52",
  textDecoration: "none",
  fontSize: 13,
  lineHeight: 1.3,
  fontWeight: 650,
};

const bottomStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  marginTop: 34,
  paddingTop: 22,
  borderTop: "1px solid rgba(103, 78, 49, 0.12)",
};

const noticeStyle: CSSProperties = {
  margin: 0,
  maxWidth: 640,
  color: "#BF9B30",
  fontSize: 12,
  lineHeight: 1.7,
};

const copyrightStyle: CSSProperties = {
  margin: 0,
  color: "#BF9B30",
  fontSize: 12,
  whiteSpace: "nowrap",
};


