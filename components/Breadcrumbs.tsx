import Link from "next/link";
import type { CSSProperties } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: Props) {
  return (
    <nav style={wrapStyle} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} style={itemWrapStyle}>
            {index > 0 && <span style={separatorStyle}>/</span>}

            {item.href && !isLast ? (
              <Link href={item.href} style={linkStyle}>
                {item.label}
              </Link>
            ) : (
              <span style={currentStyle}>{item.label}</span>
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
  color: "#171717",
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
