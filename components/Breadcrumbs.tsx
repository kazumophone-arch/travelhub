import Link from "next/link";
import type { CSSProperties } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Tone = "light" | "dark";

type Props = {
  items: BreadcrumbItem[];
  tone?: Tone;
};

export function Breadcrumbs({ items, tone = "dark" }: Props) {
  const isLight = tone === "light";

  return (
    <nav style={isLight ? wrapStyleLight : wrapStyle} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} style={itemWrapStyle}>
            {index > 0 && (
              <span style={isLight ? separatorStyleLight : separatorStyle}>/</span>
            )}

            {item.href && !isLast ? (
              <Link href={item.href} style={isLight ? linkStyleLight : linkStyle}>
                {item.label}
              </Link>
            ) : (
              <span style={isLight ? currentStyleLight : currentStyle}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

const wrapStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 6,
  marginBottom: 22,
  fontSize: 13,
  fontWeight: 800,
  color: "#0D2B52",
};

const itemWrapStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const separatorStyle: CSSProperties = {
  opacity: 0.3,
};

const linkStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  opacity: 0.58,
};

const currentStyle: CSSProperties = {
  opacity: 0.9,
};

const wrapStyleLight: CSSProperties = {
  ...wrapStyle,
  color: "#ffffff",
};

const separatorStyleLight: CSSProperties = {
  opacity: 0.4,
};

const linkStyleLight: CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  opacity: 0.7,
};

const currentStyleLight: CSSProperties = {
  opacity: 0.92,
};


