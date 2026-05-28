"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  id: string;
};

type CityApiRow = {
  id?: string;
  city?: string;
  slug?: string;
  country?: string;
  region?: string;
  summary?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  image_credit?: string;
  image_source_url?: string;
  is_published?: boolean;
  sort_rank?: number;
};

type CityForm = {
  id: string;
  city: string;
  slug: string;
  country: string;
  region: string;
  summary: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit: string;
  imageSourceUrl: string;
  isPublished: boolean;
  sortRank: number;
};

const emptyForm: CityForm = {
  id: "",
  city: "",
  slug: "",
  country: "",
  region: "",
  summary: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  imageCredit: "",
  imageSourceUrl: "",
  isPublished: false,
  sortRank: 999,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminEditCityForm({ id }: Props) {
  const [form, setForm] = useState<CityForm>(emptyForm);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    async function loadCity() {
      const response = await fetch(`/api/admin/cities?id=${id}`);
      const data = await response.json();

      if (!response.ok) {
        setStatus(data.error ?? "Failed to load city.");
        return;
      }

      const cityData = data.city as Record<string, any>;

      setForm({
        id: String(cityData.id ?? ""),
        city: String(cityData.city ?? ""),
        slug: String(cityData.slug ?? ""),
        country: String(cityData.country ?? ""),
        region: String(cityData.region ?? ""),
        summary: String(cityData.summary ?? ""),
        description: String(cityData.description ?? ""),
        imageUrl: String(cityData.image_url ?? ""),
        imageAlt: String(cityData.image_alt ?? ""),
        imageCredit: String(cityData.image_credit ?? ""),
        imageSourceUrl: String(cityData.image_source_url ?? ""),
        isPublished: Boolean(cityData.is_published),
        sortRank: Number(cityData.sort_rank ?? 999),
      });

      setStatus("");
    }

    loadCity();
  }, [id]);

  function update<K extends keyof CityForm>(key: K, value: CityForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "city" && !current.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  }

  async function saveCity() {
    setStatus("Saving...");

    const response = await fetch("/api/admin/cities", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error ?? "Failed to save city.");
      return;
    }

    setStatus("Saved.");
  }

  if (status === "Loading...") {
    return <div style={emptyStyle}>Loading...</div>;
  }

  return (
    <div style={wrapStyle}>
      <section style={formStyle}>
        <label style={labelStyle}>
          City
          <input value={form.city} onChange={(event) => update("city", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Slug
          <input value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Country
          <input value={form.country} onChange={(event) => update("country", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Region
          <input value={form.region} onChange={(event) => update("region", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Summary
          <textarea value={form.summary} onChange={(event) => update("summary", event.target.value)} rows={4} style={textareaStyle} />
        </label>

        <label style={labelStyle}>
          Description
          <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={5} style={textareaStyle} />
        </label>

        <label style={labelStyle}>
          Image URL
          <input value={form.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Image alt
          <input value={form.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Image credit
          <input value={form.imageCredit} onChange={(event) => update("imageCredit", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Image source URL
          <input value={form.imageSourceUrl} onChange={(event) => update("imageSourceUrl", event.target.value)} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Sort rank
          <input type="number" value={form.sortRank} onChange={(event) => update("sortRank", Number(event.target.value))} style={inputStyle} />
        </label>

        <label style={checkStyle}>
          <input type="checkbox" checked={form.isPublished} onChange={(event) => update("isPublished", event.target.checked)} />
          Published
        </label>

        <div style={buttonRowStyle}>
          <button type="button" onClick={saveCity} style={buttonStyle}>
            Save changes
          </button>

          <Link href="/admin/cities" style={secondaryButtonStyle}>
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
            backgroundImage: form.imageUrl
              ? `linear-gradient(180deg, rgba(10,18,24,.05), rgba(10,18,24,.76)), url("${form.imageUrl}")`
              : "linear-gradient(135deg, #dfeeea, #f7efe2)",
          }}
        >
          <div style={badgeStyle}>{form.country || "Country"}</div>

          <div style={panelStyle}>
            <div style={metaStyle}>{form.isPublished ? "Published" : "Draft"}</div>
            <h2 style={cardTitleStyle}>{form.city || "City"}</h2>
            <p style={cardTextStyle}>{form.summary || "No summary yet."}</p>
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
  color: "#607080",
};


