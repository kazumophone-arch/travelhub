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
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#1769e0",
  fontWeight: 850,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 760,
  fontSize: 42,
  lineHeight: 1.08,
  letterSpacing: 0,
  fontWeight: 850,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 680,
  fontSize: 16,
  lineHeight: 1.72,
  color: "#4c5f6f",
};


