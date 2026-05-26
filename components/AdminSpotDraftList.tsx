"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";

type SpotDraft = {
  id: string;
  citySlug: string;
  name: string;
  slug: string;
  summary: string;
  imageUrl: string;
  isPublished: boolean;
  updatedAt?: string;
};

type Filter = "all" | "draft" | "published";

const STORAGE_KEY = "travelhub_spot_drafts_v1";

export function AdminSpotDraftList() {
  const [drafts, setDrafts] = useState<SpotDraft[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setDrafts(saved ? JSON.parse(saved) : []);
  }, []);

  const filteredDrafts = useMemo(() => {
    if (filter === "published") {
      return drafts.filter((draft) => draft.isPublished);
    }

    if (filter === "draft") {
      return drafts.filter((draft) => !draft.isPublished);
    }

    return drafts;
  }, [drafts, filter]);

  function deleteDraft(id: string) {
    const ok = window.confirm("Delete this draft?");
    if (!ok) return;

    const next = drafts.filter((draft) => draft.id !== id);
    setDrafts(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function setPublished(id: string, isPublished: boolean) {
    const next = drafts.map((draft) =>
      draft.id === id
        ? { ...draft, isPublished, updatedAt: new Date().toISOString() }
        : draft
    );

    setDrafts(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <section style={wrapStyle}>
      <div style={filterRowStyle}>
        {(["all", "draft", "published"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            style={filter === value ? activeFilterStyle : filterStyle}
          >
            {value}
          </button>
        ))}
      </div>

      {filteredDrafts.length === 0 ? (
        <div style={emptyStyle}>No spots found for this filter.</div>
      ) : (
        <div style={listStyle}>
          {filteredDrafts.map((draft) => (
            <div key={draft.id} style={itemStyle}>
              <div>
                <div style={metaStyle}>
                  {draft.citySlug} · {draft.isPublished ? "Published" : "Draft"}
                </div>

                <h2 style={titleStyle}>{draft.name}</h2>

                <p style={textStyle}>{draft.summary}</p>

                <code style={codeStyle}>
                  /c/{draft.citySlug}/spot/{draft.slug}
                </code>
              </div>

              <div style={buttonRowStyle}>
                <Link href={`/admin/spots/edit/${draft.id}`} style={buttonStyle}>
                  Edit
                </Link>

                <Link href={`/admin/spots/preview/${draft.id}`} style={buttonStyle}>
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => setPublished(draft.id, !draft.isPublished)}
                  style={draft.isPublished ? unpublishButtonStyle : publishButtonStyle}
                >
                  {draft.isPublished ? "Unpublish" : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteDraft(draft.id)}
                  style={deleteButtonStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const wrapStyle: CSSProperties = {
  marginTop: 22,
};

const filterRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 16,
};

const filterStyle: CSSProperties = {
  padding: "9px 12px",
  borderRadius: 999,
  border: "1px solid rgba(23,32,42,.08)",
  background: "#ffffff",
  color: "#607080",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
  textTransform: "capitalize",
};

const activeFilterStyle: CSSProperties = {
  ...filterStyle,
  background: "#f7efe2",
  border: "1px solid rgba(168,116,50,.18)",
  color: "#9a6a2f",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const itemStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 18,
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(23,32,42,.08)",
  boxShadow: "0 8px 24px rgba(30,64,88,.05)",
};

const metaStyle: CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: "#9a6a2f",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: ".1em",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 24,
  letterSpacing: "-.04em",
};

const textStyle: CSSProperties = {
  margin: "8px 0 10px",
  fontSize: 14,
  lineHeight: 1.6,
  color: "#607080",
};

const codeStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "#17202a",
  overflowWrap: "anywhere",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const buttonStyle: CSSProperties = {
  width: "fit-content",
  padding: "9px 12px",
  borderRadius: 999,
  background: "#138a72",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 850,
};

const deleteButtonStyle: CSSProperties = {
  width: "fit-content",
  padding: "9px 12px",
  borderRadius: 999,
  background: "#ffffff",
  color: "#9a3d2f",
  border: "1px solid rgba(154,61,47,.18)",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
};

const publishButtonStyle: CSSProperties = {
  width: "fit-content",
  padding: "9px 12px",
  borderRadius: 999,
  background: "#17202a",
  color: "#ffffff",
  border: "1px solid rgba(23,32,42,.12)",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
};

const unpublishButtonStyle: CSSProperties = {
  ...publishButtonStyle,
  background: "#ffffff",
  color: "#607080",
};

