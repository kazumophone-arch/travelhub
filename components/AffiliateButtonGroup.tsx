import type { CSSProperties } from "react";
import type { City } from "@/data/types";
import { getAffiliateLinks } from "@/data/affiliate-links";

type Props = {
  city: City;
  src: string;
  v: string;
  spotSlug?: string;
};

export function AffiliateButtonGroup({ city, src, v, spotSlug }: Props) {
  const links = getAffiliateLinks(city);

  if (links.length === 0) return null;

  return (
    <section style={buttonGroupStyle}>
      {links.map((link, index) => {
        const href = `/out/${link.type}?c=${encodeURIComponent(
          city.slug
        )}&src=${encodeURIComponent(src)}&v=${encodeURIComponent(v)}${
          spotSlug ? `&s=${encodeURIComponent(spotSlug)}` : ""
        }`;

        return (
          <a
            key={link.type}
            href={href}
            style={index === 0 ? primaryButtonStyle : secondaryButtonStyle}
          >
            {link.label}
          </a>
        );
      })}
    </section>
  );
}

const buttonGroupStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const primaryButtonStyle: CSSProperties = {
  display: "block",
  padding: "16px 18px",
  borderRadius: 18,
  background: "#171717",
  color: "#ffffff",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: 850,
  fontSize: 16,
  boxShadow: "0 16px 38px rgba(0, 0, 0, 0.16)",
};

const secondaryButtonStyle: CSSProperties = {
  display: "block",
  padding: "15px 18px",
  borderRadius: 18,
  background: "#ffffff",
  color: "#171717",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: 750,
  fontSize: 15,
  border: "1px solid rgba(0, 0, 0, 0.12)",
};
