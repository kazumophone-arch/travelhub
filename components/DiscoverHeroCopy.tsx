"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { discoverCopyVariants, pickDailyVariant } from "@/lib/copyVariants";

export function DiscoverHeroCopy() {
  const [copy] = useState(() => pickDailyVariant(discoverCopyVariants, "discover"));

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
  marginBottom: 42,
  padding: "20px 0 10px",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 0,
  textTransform: "uppercase",
  color: "#9a6a43",
  fontWeight: 850,
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 18px",
  maxWidth: 820,
  fontSize: 52,
  lineHeight: 1.02,
  letterSpacing: 0,
  fontWeight: 850,
  color: "#1f1a17",
  overflowWrap: "break-word",
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 700,
  fontSize: 16,
  lineHeight: 1.78,
  color: "#6f6258",
};


