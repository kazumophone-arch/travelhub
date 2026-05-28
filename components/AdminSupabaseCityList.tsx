"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";

type CityRow = {
  id: string;
  slug: string;
  city: string;
  country: string;
  region: string;
  summary: string;
  image_url: string;
  is_published: boolean;
  sort_rank: number;
};

type Filter = "all" | "draft" | "published";

export function AdminSupabaseCityList() {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function loadCities() {
      const response = await fetch("/api/admin/cities");
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error ?? "Failed to load cities.");
        return;
      }

      setCities(data.cities ?? []);
      setStatus("");
    }

    loadCities();
  }, []);

  const filteredCities = useMemo(() => {
    if (filter === "published") return cities.filter((city) => city.is_published);
    if (filter === "draft") return cities.filter((city) => !city.is_published);
    return cities;
  }, [cities, filter]);


  async function deleteCity(id: string) {
    const ok = window.confirm("Delete this city from Supabase?");
    if (!ok) return;

    const response = await fetch(`/api/admin/cities?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Failed to delete city.");
      return;
    }

    setCities((current) => current.filter((city) => city.id !== id));
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

      {!status && filteredCities.length === 0 && (
        <div style={emptyStyle}>No cities found.</div>
      )}

      <div style={listStyle}>
        {filteredCities.map((city) => (
          <div key={city.id} style={itemStyle}>
            <div>
              <div style={metaStyle}>
                {city.country} · {city.is_published ? "Published" : "Draft"}
              </div>

              <h2 style={titleStyle}>{city.city}</h2>

              <p style={textStyle}>{city.summary || "No summary yet."}</p>

              <code style={codeStyle}>/c/{city.slug}</code>
            </div>

            <div style={buttonRowStyle}>
              <Link href={`/admin/cities/edit/${city.id}`} style={buttonStyle}>
                Edit
              </Link>

              <Link href={`/c/${city.slug}`} style={buttonStyle}>
                View
              </Link>

              <button
                type="button"
                onClick={() => deleteCity(city.id)}
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
