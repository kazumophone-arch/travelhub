"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { City } from "@/data/types";

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
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  id: string;
  cities: City[];
};

const STORAGE_KEY = "travelhub_spot_drafts_v1";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminEditSpotForm({ id, cities }: Props) {
  const cityOptions = useMemo(
    () =>
      cities
        .map((city) => ({
          slug: city.slug,
          label: `${city.city}, ${city.country}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [cities]
  );
  const [drafts, setDrafts] = useState<SpotDraft[]>([]);
  const [draft, setDraft] = useState<SpotDraft | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    setDrafts(parsed);
    setDraft(parsed.find((item: SpotDraft) => item.id === id) ?? null);
  }, [id]);

  function update<K extends keyof SpotDraft>(key: K, value: SpotDraft[K]) {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: value,
        ...(key === "name" && !current.slug
          ? { slug: slugify(String(value)) }
          : {}),
      };
    });
  }

  function save() {
    if (!draft) return;

    const nextDraft = {
      ...draft,
      slug: slugify(draft.slug),
      updatedAt: new Date().toISOString(),
    };

    const next = drafts.map((item) =>
      item.id === nextDraft.id ? nextDraft : item
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDrafts(next);
    setDraft(nextDraft);
    setStatus("Saved.");
  }

  if (!draft) {
    return (
      <div style={emptyStyle}>
        Draft not found.
        <br />
        <Link href="/admin/spots" style={linkStyle}>Back to spots</Link>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        <label style={labelStyle}>
          City
          <select
            value={draft.citySlug}
            onChange={(event) => update("citySlug", event.target.value)}
            style={inputStyle}
          >
            {cityOptions.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.label}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Spot name
          <input
            value={draft.name}
            onChange={(event) => update("name", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Slug
          <input
            value={draft.slug}
            onChange={(event) => update("slug", slugify(event.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Summary
          <textarea
            value={draft.summary}
            onChange={(event) => update("summary", event.target.value)}
            rows={4}
            style={textareaStyle}
          />
        </label>

        <label style={labelStyle}>
          Image URL
          <input
            value={draft.imageUrl}
            onChange={(event) => update("imageUrl", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image alt
          <input
            value={draft.imageAlt}
            onChange={(event) => update("imageAlt", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image credit
          <input
            value={draft.imageCredit}
            onChange={(event) => update("imageCredit", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Image source URL
          <input
            value={draft.imageSourceUrl}
            onChange={(event) => update("imageSourceUrl", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Hotel affiliate URL
          <input
            value={draft.affiliateHotelUrl}
            onChange={(event) => update("affiliateHotelUrl", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Tour affiliate URL
          <input
            value={draft.affiliateTourUrl}
            onChange={(event) => update("affiliateTourUrl", event.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={draft.isPublished}
            onChange={(event) => update("isPublished", event.target.checked)}
          />
          Published
        </label>

        <div style={buttonRowStyle}>
          <button type="button" onClick={save} style={buttonStyle}>
            Save changes
          </button>

          <Link href="/admin/spots" style={secondaryButtonStyle}>
            Back
          </Link>
        </div>

        {status && <p style={statusStyle}>{status}</p>}
      </section>

      <section style={previewStyle}>
        <div style={previewLabelStyle}>Preview</div>

        <div
          style={{
            ...cardStyle,
            backgroundImage: draft.imageUrl
              ? `linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76)), url("${draft.imageUrl}")`
              : "linear-gradient(135deg, #dfeeea, #f7efe2)",
          }}
        >
          <div style={badgeStyle}>{draft.citySlug}</div>

          <div style={panelStyle}>
            <div style={metaStyle}>{draft.isPublished ? "Published" : "Draft"}</div>
            <h2 style={cardTitleStyle}>{draft.name}</h2>
            <p style={cardTextStyle}>{draft.summary}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(min(100%, 360px), 0.75fr)",
  gap: 18,
  alignItems: "start",
};

const formStyle: CSSProperties = {
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 7,
  marginBottom: 14,
  fontSize: 12,
  color: "#607080",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 13px",
  borderRadius: 16,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#f8faf7",
  color: "#17202a",
  fontSize: 14,
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.55,
};

const checkStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  alignItems: "center",
  marginBottom: 16,
  color: "#607080",
  fontSize: 13,
  fontWeight: 750,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: 9,
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: 0,
  background: "#138a72",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "#ffffff",
  color: "#607080",
  border: "1px solid rgba(23,32,42,.08)",
  textDecoration: "none",
};

const statusStyle: CSSProperties = {
  marginTop: 12,
  color: "#138a72",
  fontSize: 13,
  fontWeight: 850,
};

const previewStyle: CSSProperties = {
  display: "grid",
  gap: 10,
};

const previewLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".12em",
};

const cardStyle: CSSProperties = {
  minHeight: 430,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: 26,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#ffffff",
};

const badgeStyle: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  padding: "7px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.84)",
  color: "#17202a",
  fontSize: 12,
  fontWeight: 850,
};

const panelStyle: CSSProperties = {
  margin: 12,
  padding: 16,
  borderRadius: 20,
  background: "rgba(12,22,30,.54)",
  border: "1px solid rgba(255,255,255,.24)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
};

const metaStyle: CSSProperties = {
  marginBottom: 7,
  fontSize: 12,
  color: "rgba(255,255,255,.76)",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.04,
  letterSpacing: "-.045em",
};

const cardTextStyle: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 13,
  lineHeight: 1.55,
  color: "rgba(255,255,255,.84)",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};

const linkStyle: CSSProperties = {
  color: "#138a72",
  fontWeight: 850,
};

