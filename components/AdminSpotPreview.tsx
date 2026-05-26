"use client";

import { useEffect, useState, type CSSProperties } from "react";

type SpotDraft = {
  id: string;
  citySlug: string;
  name: string;
  slug: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  affiliateHotelUrl: string;
  affiliateTourUrl: string;
  isPublished: boolean;
};

type Props = {
  id: string;
};

const STORAGE_KEY = "travelhub_spot_drafts_v1";

export function AdminSpotPreview({ id }: Props) {
  const [draft, setDraft] = useState<SpotDraft | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const drafts = saved ? JSON.parse(saved) : [];
    setDraft(drafts.find((item: SpotDraft) => item.id === id) ?? null);
  }, [id]);

  if (!draft) {
    return <div style={emptyStyle}>Preview not found.</div>;
  }

  return (
    <article>
      <div style={eyebrowStyle}>{draft.citySlug}</div>
      <h1 style={titleStyle}>{draft.name}</h1>
      <p style={leadStyle}>{draft.summary}</p>

      <div
        style={{
          ...heroStyle,
          backgroundImage: draft.imageUrl
            ? `linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.72)), url("${draft.imageUrl}")`
            : "linear-gradient(135deg, #dfeeea, #f7efe2)",
        }}
      >
        <div style={panelStyle}>
          <div style={metaStyle}>{draft.isPublished ? "Published" : "Draft"}</div>
          <h2 style={cardTitleStyle}>{draft.name}</h2>
          <p style={cardTextStyle}>{draft.summary}</p>
        </div>
      </div>
    </article>
  );
}

const eyebrowStyle: CSSProperties = {
  display: "inline-flex",
  marginBottom: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "#f7efe2",
  color: "#9a6a2f",
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".12em",
};

const titleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "clamp(38px, 8vw, 64px)",
  lineHeight: 1.02,
  letterSpacing: "-.055em",
};

const leadStyle: CSSProperties = {
  margin: "0 0 28px",
  maxWidth: 680,
  fontSize: 15,
  lineHeight: 1.75,
  color: "#607080",
};

const heroStyle: CSSProperties = {
  minHeight: "clamp(320px, 58vw, 520px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 28,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const panelStyle: CSSProperties = {
  margin: 16,
  padding: 18,
  borderRadius: 22,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  color: "rgba(255,255,255,.76)",
  fontSize: 12,
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: 30,
  letterSpacing: "-.045em",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(255,255,255,.84)",
  fontSize: 14,
  lineHeight: 1.6,
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  color: "#607080",
};
