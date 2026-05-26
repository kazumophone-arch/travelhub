"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type SupabaseSpot = {
  id: string;
  city_slug: string;
  name: string;
  slug: string;
  summary: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
};

type Filter = "all" | "draft" | "published";

export function AdminSupabaseSpotList() {
  const [spots, setSpots] = useState<SupabaseSpot[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function loadSpots() {
      const response = await fetch("/api/admin/spots");
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error ?? "Failed to load spots.");
        return;
      }

      setSpots(data.spots ?? []);
      setStatus("");
    }

    loadSpots();
  }, []);

  const filteredSpots = useMemo(() => {
    if (filter === "published") {
      return spots.filter((spot) => spot.is_published);
    }

    if (filter === "draft") {
      return spots.filter((spot) => !spot.is_published);
    }

    return spots;
  }, [spots, filter]);


  async function deleteSpot(id: string) {
    const ok = window.confirm("Delete this spot from Supabase?");
    if (!ok) return;

    const response = await fetch(`/api/admin/spots?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Failed to delete spot.");
      return;
    }

    setSpots((current) => current.filter((spot) => spot.id !== id));
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

      {status && <div style={emptyStyle}>{status}</div>}

      {!status && filteredSpots.length === 0 && (
        <div style={emptyStyle}>No spots found.</div>
      )}

      <div style={listStyle}>
        {filteredSpots.map((spot) => (
          <div key={spot.id} style={itemStyle}>
            <div>
              <div style={metaStyle}>
                {spot.city_slug} · {spot.is_published ? "Published" : "Draft"}
              </div>

              <h2 style={titleStyle}>{spot.name}</h2>

              <p style={textStyle}>{spot.summary || "No summary yet."}</p>

              <code style={codeStyle}>
                /c/{spot.city_slug}/spot/{spot.slug}
              </code>
            </div>

            <div style={buttonRowStyle}>
              <Link href={`/admin/spots/edit/${spot.id}`} style={buttonStyle}>
                Edit
              </Link>

              <Link href={`/c/${spot.city_slug}/spot/${spot.slug}`} style={buttonStyle}>
                View
              </Link>

              <button
                type="button"
                onClick={() => deleteSpot(spot.id)}
                style={deleteButtonStyle}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
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

const emptyStyle: CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fffdf8",
  border: "1px solid rgba(168,116,50,.14)",
  color: "#607080",
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
