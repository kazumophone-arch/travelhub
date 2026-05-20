"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { discoverCopyVariants, pickDailyVariant } from "@/lib/copyVariants";

export function DiscoverHeroCopy() {
  const [copy, setCopy] = useState(discoverCopyVariants[0]);

  useEffect(() => {
    setCopy(pickDailyVariant(discoverCopyVariants, "discover"));
  }, []);

  return (
    <section style={heroStyle}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Discover" },
        ]}
      />

      <div style={eyebrowStyle}>{copy.eyebrow}</div>

      <h1 style={titleStyle}>{copy.title}</h1>

      <p style={subtitleStyle}>{copy.subtitle}</p>
    </section>
  );
}

const heroStyle: CSSProperties = {
  marginBottom: 28,
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  opacity: 0.58,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: "clamp(42px, 11vw, 78px)",
  lineHeight: 1.02,
  letterSpacing: "-0.055em",
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: "clamp(15px, 4vw, 17px)",
  lineHeight: 1.72,
  opacity: 0.72,
};


